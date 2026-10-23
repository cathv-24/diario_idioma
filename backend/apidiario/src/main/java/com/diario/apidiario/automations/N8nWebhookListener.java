package com.diario.apidiario.automations;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.task.TaskRejectedException;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import jakarta.annotation.PreDestroy;
import java.net.URI;
import java.net.http.*;
import java.time.Duration;

@Component
@Slf4j
@ConditionalOnProperty(name = "diario.automation.enabled", havingValue = "true")
public class N8nWebhookListener {
    private final URI webhook;
    private final String token;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();
    private final ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

    public N8nWebhookListener(@Value("${diario.automation.webhook-url:}") String url,
            @Value("${diario.automation.token:}") String token) {
        this.webhook = URI.create(url);
        boolean https = "https".equalsIgnoreCase(webhook.getScheme());
        boolean local = "http".equalsIgnoreCase(webhook.getScheme()) &&
                ("localhost".equalsIgnoreCase(webhook.getHost()) || "127.0.0.1".equals(webhook.getHost()));
        if ((!https && !local) || webhook.getHost() == null || webhook.getUserInfo() != null || token.isBlank()) {
            throw new IllegalArgumentException("n8n requiere URL HTTPS (HTTP solo localhost) y token configurado");
        }
        this.token = token;
        executor.setCorePoolSize(1);
        executor.setMaxPoolSize(2);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("diario-n8n-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(15);
        executor.initialize();
    }

    @TransactionalEventListener
    public void afterCommit(EntradaGuardadaEvent event) {
        try {
            executor.execute(() -> deliver(event));
        } catch (TaskRejectedException exception) {
            log.warn("Cola n8n llena: evento {} no enviado; entrada guardada", event.eventId());
        }
    }

    private void deliver(EntradaGuardadaEvent event) {
        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                var request = HttpRequest.newBuilder(webhook).timeout(Duration.ofSeconds(4))
                        .header("Content-Type", "application/json").header("X-Diario-Token", token)
                        .POST(HttpRequest.BodyPublishers.ofString(event.toJson())).build();
                int status = http.send(request, HttpResponse.BodyHandlers.discarding()).statusCode();
                if (status >= 200 && status < 300) return;
                if (status >= 400 && status < 500 && status != 429) break;
            } catch (InterruptedException exception) {
                Thread.currentThread().interrupt();
                return;
            } catch (Exception exception) {
                // No registrar URL, token, payload ni mensaje de excepcion potencialmente sensible.
                log.debug("Intento {} de n8n sin confirmar para {}", attempt, event.eventId());
            }
            if (attempt < 3) {
                try { Thread.sleep(250L * attempt); }
                catch (InterruptedException exception) { Thread.currentThread().interrupt(); return; }
            }
        }
        log.warn("n8n no confirmo evento {} tras entrega limitada; entrada guardada", event.eventId());
    }

    @PreDestroy
    public void close() { executor.shutdown(); }
}
