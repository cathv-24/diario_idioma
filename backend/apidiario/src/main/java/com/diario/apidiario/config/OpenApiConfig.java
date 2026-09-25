package com.diario.apidiario.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI apiDiarioOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("API Diario de Idiomas")
                .description("Escribe tu dia en ingles y recibe correcciones adaptadas a tu nivel.")
                .version("v1"));
    }
}
