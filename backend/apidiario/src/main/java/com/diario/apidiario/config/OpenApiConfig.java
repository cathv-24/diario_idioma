package com.diario.apidiario.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI diarioOpenAPI() {
        return new OpenAPI().info(new Info().title("Diario de idiomas")
                .version("1.0")
                .description("Backend local de aprendizaje. Corrector limitado por reglas; sin login todavia. "
                        + "A1/A2: explicaciones en espanol; B1-C2: ingles. Las sugerencias son opcionales."));
    }
}
