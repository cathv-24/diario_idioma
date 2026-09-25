package com.diario.apidiario.servicios.correccion;

import com.diario.apidiario.enums.CategoriaError;
import com.diario.apidiario.enums.NivelIngles;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Implementacion del motor de correccion basada en un LLM (Claude API).
 *
 * Se activa con {@code diario.corrector=llm} y requiere una API key en
 * {@code diario.llm.api-key}. Este es el "hueco para el LLM" del enfoque hibrido:
 * hoy el proyecto corre con reglas y, cuando quieras, cambias una propiedad y
 * esta clase se encarga de pedirle las correcciones a Claude.
 *
 * Diseno defensivo: si falta la API key o la llamada falla, cae de vuelta al
 * corrector por reglas para que la app nunca se rompa.
 */
@Service
@Slf4j
@ConditionalOnProperty(name = "diario.corrector", havingValue = "llm")
public class CorrectorLLM implements ServicioCorreccion {

    private static final String ENDPOINT = "https://api.anthropic.com/v1/messages";
    private static final String ANTHROPIC_VERSION = "2023-06-01";

    @Value("${diario.llm.api-key:}")
    private String apiKey;

    @Value("${diario.llm.model:claude-sonnet-5}")
    private String modelo;

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();
    private final ObjectMapper mapper = new ObjectMapper();

    /** Respaldo por reglas si el LLM no esta disponible. */
    private final ServicioCorreccion respaldo = new CorrectorBasadoEnReglas();

    @Override
    public ResultadoCorreccion corregir(String texto, NivelIngles nivel) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("diario.corrector=llm pero no hay API key (diario.llm.api-key). Uso el corrector por reglas.");
            return respaldo.corregir(texto, nivel);
        }
        try {
            return llamarClaude(texto, nivel);
        } catch (Exception e) {
            log.error("Fallo la llamada al LLM, uso el corrector por reglas como respaldo", e);
            return respaldo.corregir(texto, nivel);
        }
    }

    private ResultadoCorreccion llamarClaude(String texto, NivelIngles nivel) throws Exception {
        String idioma = (nivel != null && nivel.explicarEnEspanol()) ? "espanol" : "ingles";
        String prompt = """
                Eres un profesor de ingles. Corrige el siguiente texto escrito por un estudiante
                de nivel %s (MCER). Devuelve UNICAMENTE un JSON valido, sin texto adicional ni
                markdown, con esta forma exacta:
                {
                  "textoCorregido": "<el texto ya corregido>",
                  "correcciones": [
                    {
                      "categoria": "ORTOGRAFIA|GRAMATICA|PUNTUACION|VOCABULARIO|ARTICULOS|MAYUSCULAS",
                      "fragmentoOriginal": "<lo que escribio>",
                      "fragmentoCorregido": "<lo corregido>",
                      "explicacion": "<explicacion en %s adaptada al nivel>"
                    }
                  ]
                }

                Texto del estudiante:
                \"\"\"
                %s
                \"\"\"
                """.formatted(nivel, idioma, texto);

        // Cuerpo de la peticion a la Messages API de Anthropic
        ObjectNode body = mapper.createObjectNode();
        body.put("model", modelo);
        body.put("max_tokens", 1500);
        ArrayNode mensajes = body.putArray("messages");
        ObjectNode mensaje = mensajes.addObject();
        mensaje.put("role", "user");
        mensaje.put("content", prompt);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ENDPOINT))
                .timeout(Duration.ofSeconds(60))
                .header("content-type", "application/json")
                .header("x-api-key", apiKey)
                .header("anthropic-version", ANTHROPIC_VERSION)
                .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
                .build();

        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() / 100 != 2) {
            throw new RuntimeException("Claude API respondio " + response.statusCode() + ": " + response.body());
        }

        // La respuesta trae content[0].text con el JSON que pedimos
        JsonNode raiz = mapper.readTree(response.body());
        String textoModelo = raiz.path("content").path(0).path("text").asText("");
        return parsearRespuesta(textoModelo, texto);
    }

    /** Convierte el JSON devuelto por el modelo en un ResultadoCorreccion. */
    private ResultadoCorreccion parsearRespuesta(String textoModelo, String textoOriginal) throws Exception {
        String limpio = textoModelo.trim();
        // Por si el modelo envolvio el JSON en ```json ... ```
        if (limpio.startsWith("```")) {
            limpio = limpio.replaceAll("^```[a-zA-Z]*", "").replaceAll("```$", "").trim();
        }
        JsonNode json = mapper.readTree(limpio);

        ResultadoCorreccion resultado = new ResultadoCorreccion(
                json.path("textoCorregido").asText(textoOriginal));

        for (JsonNode c : json.path("correcciones")) {
            CategoriaError categoria = parsearCategoria(c.path("categoria").asText(""));
            resultado.getCorrecciones().add(new CorreccionDetectada(
                    categoria,
                    c.path("fragmentoOriginal").asText(""),
                    c.path("fragmentoCorregido").asText(""),
                    c.path("explicacion").asText("")));
        }
        return resultado;
    }

    private CategoriaError parsearCategoria(String valor) {
        try {
            return CategoriaError.valueOf(valor.trim().toUpperCase());
        } catch (Exception e) {
            return CategoriaError.GRAMATICA;
        }
    }
}
