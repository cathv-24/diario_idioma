package com.diario.apidiario;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.UUID;
import java.util.regex.Pattern;
import static org.junit.jupiter.api.Assertions.*;

/** Prueba la API real con Tomcat, servicios y JPA; no simula los repositorios. */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {"diario.demo.enabled=false", "logging.file.name=target/test-api.log"})
@ActiveProfiles("h2")
class ApiIntegracionTest {
    @Value("${local.server.port}")
    private int puerto;
    private final HttpClient http = HttpClient.newHttpClient();

    @Test
    void flujoCompletoConHistorialNivelEdicionReporteYBorrado() throws Exception {
        String email = UUID.randomUUID() + "@example.com";
        var usuario = enviar("POST", "/api/usuario", perfil(null, email, "A2"));
        assertEquals(201, usuario.statusCode(), usuario.body());
        long idUsuario = id(usuario.body(), "idUsuario");
        var creacion = enviar("POST", "/api/entrada", entrada(idUsuario, "Yesterday i goed to the park. I was very happy."));
        assertEquals(201, creacion.statusCode(), creacion.body());
        assertTrue(creacion.body().contains("Yesterday I went to the park."));
        assertTrue(creacion.body().contains("delighted"));
        long idEntrada = id(creacion.body(), "idEntrada");
        assertEquals("/api/entrada/" + idEntrada, creacion.headers().firstValue("location").orElseThrow());

        assertEquals(200, enviar("PUT", "/api/usuario", perfil(idUsuario, email, "B1")).statusCode());
        var historial = enviar("GET", "/api/entradas/" + idUsuario, null);
        assertEquals(200, historial.statusCode());
        assertTrue(historial.body().contains("\"nivel\":\"A2\""), historial.body());
        var resumen = enviar("GET", "/api/entradas/" + idUsuario + "/resumen", null);
        assertEquals(200, resumen.statusCode(), resumen.body());
        assertTrue(resumen.body().contains("\"totalEntradas\":1"));
        assertTrue(resumen.body().contains("GRAMATICA"));

        assertEquals(409, enviar("DELETE", "/api/usuario/" + idUsuario, null).statusCode());
        var edicion = enviar("PUT", "/api/entrada/" + idEntrada, entrada(idUsuario, "Today I feel good."));
        assertEquals(200, edicion.statusCode(), edicion.body());
        assertTrue(edicion.body().contains("\"correcciones\":[]"), edicion.body());
        assertTrue(edicion.body().contains("\"nivel\":\"B1\""));
        var actualizado = enviar("GET", "/api/entradas/" + idUsuario + "/resumen", null);
        assertTrue(actualizado.body().contains("\"erroresPorCategoria\":[]"), actualizado.body());
        assertEquals(204, enviar("DELETE", "/api/entrada/" + idEntrada, null).statusCode());
        assertEquals(404, enviar("GET", "/api/entrada/" + idEntrada, null).statusCode());
        assertEquals(204, enviar("DELETE", "/api/usuario/" + idUsuario, null).statusCode());
    }

    @Test
    void validaCamposEmailDuplicadoJsonYRecursosInexistentes() throws Exception {
        assertEquals(400, enviar("POST", "/api/usuario", "{}").statusCode());
        assertEquals(400, enviar("POST", "/api/usuario", perfil(null, "no-es-email", "A2")).statusCode());
        assertEquals(400, enviar("POST", "/api/usuario", perfil(null, "a@example.com", "Z9")).statusCode());
        String email = UUID.randomUUID() + "@example.com";
        var usuario = enviar("POST", "/api/usuario", perfil(null, email, "A2"));
        assertEquals(201, usuario.statusCode());
        long idUsuario = id(usuario.body(), "idUsuario");
        assertEquals(409, enviar("POST", "/api/usuario", perfil(null, email.toUpperCase(), "A2")).statusCode());
        assertEquals(400, enviar("POST", "/api/entrada", entrada(idUsuario, "   ")).statusCode());
        assertEquals(400, enviar("POST", "/api/entrada", "{\"idUsuario\":1,\"fecha\":\"2999-01-01\",\"texto\":\"Hello.\"}").statusCode());
        assertEquals(404, enviar("GET", "/api/entradas/99999999", null).statusCode());
        assertEquals(404, enviar("DELETE", "/api/entrada/99999999", null).statusCode());
        assertEquals(400, enviar("PUT", "/api/usuario", perfil(null, email, "A2")).statusCode());
        assertEquals(400, enviar("POST", "/api/usuario", perfil(idUsuario, "another@example.com", "A2")).statusCode());
        assertEquals(400, enviar("GET", "/api/entrada/no-es-numero", null).statusCode());
    }

    @Test
    void publicaOpenApiSwaggerYPermiteCorsDelFrontend() throws Exception {
        var esquema = enviar("GET", "/v3/api-docs", null);
        assertEquals(200, esquema.statusCode(), esquema.body());
        assertTrue(esquema.body().contains("/api/entrada"));
        assertTrue(esquema.body().contains("sugerenciasVocabulario"));
        assertEquals(200, enviar("GET", "/swagger-ui/index.html", null).statusCode());
        var request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + puerto + "/api/entrada"))
                .header("Origin", "http://localhost:4200")
                .header("Access-Control-Request-Method", "POST")
                .method("OPTIONS", HttpRequest.BodyPublishers.noBody()).build();
        var respuesta = http.send(request, HttpResponse.BodyHandlers.ofString());
        assertEquals(200, respuesta.statusCode());
        assertEquals("http://localhost:4200", respuesta.headers().firstValue("Access-Control-Allow-Origin").orElseThrow());
    }

    private HttpResponse<String> enviar(String metodo, String ruta, String json) throws Exception {
        var request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + puerto + ruta))
                .timeout(Duration.ofSeconds(20))
                .header("Content-Type", "application/json")
                .method(metodo, json == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(json))
                .build();
        return http.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private long id(String json, String campo) {
        var matcher = Pattern.compile("\"" + campo + "\"\\s*:\\s*(\\d+)").matcher(json);
        assertTrue(matcher.find(), json);
        return Long.parseLong(matcher.group(1));
    }

    private String perfil(Long id, String email, String nivel) {
        return "{\"idUsuario\":" + id + ",\"nombre\":\"Cathe\",\"email\":\"" + email + "\",\"nivel\":\"" + nivel + "\"}";
    }

    private String entrada(long usuario, String texto) {
        return "{\"idUsuario\":" + usuario + ",\"texto\":\"" + texto + "\"}";
    }
}
