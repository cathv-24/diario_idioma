package com.diario.apidiario;

import com.diario.apidiario.automations.EntradaGuardadaEvent;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import java.net.InetSocketAddress;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE,
        properties = {"diario.demo.enabled=false", "logging.file.name=target/test-automation.log"})
@ActiveProfiles("h2")
class AutomationIntegracionTest {
    private static final BlockingQueue<String> received = new LinkedBlockingQueue<>();
    private static final BlockingQueue<String> headers = new LinkedBlockingQueue<>();
    private static final AtomicInteger failuresRemaining = new AtomicInteger();
    private static final HttpServer server;
    static {
        try {
            server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            server.createContext("/events", exchange -> {
                headers.add(exchange.getRequestHeaders().getFirst("X-Diario-Token"));
                received.add(new String(exchange.getRequestBody().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8));
                int status = failuresRemaining.getAndUpdate(n -> Math.max(0, n - 1)) > 0 ? 503 : 200;
                exchange.sendResponseHeaders(status, -1);
                exchange.close();
            });
            server.start();
        } catch (Exception exception) { throw new ExceptionInInitializerError(exception); }
    }

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("diario.automation.enabled", () -> "true");
        registry.add("diario.automation.webhook-url", () -> "http://127.0.0.1:" + server.getAddress().getPort() + "/events");
        registry.add("diario.automation.token", () -> "local-test-only-token");
    }
    @Autowired ApplicationEventPublisher publisher;
    @Autowired PlatformTransactionManager transactions;

    @BeforeEach void reset() { received.clear(); headers.clear(); failuresRemaining.set(0); }
    @AfterAll static void stop() { server.stop(0); }

    @Test
    void enviaSoloTrasCommitYReintentaMismoUuidSinContenidoPersonal() throws Exception {
        failuresRemaining.set(1);
        var event = event();
        new TransactionTemplate(transactions).executeWithoutResult(status -> {
            publisher.publishEvent(event);
            assertTrue(received.isEmpty(), "No debe enviarse antes del commit");
        });
        String first = received.poll(5, TimeUnit.SECONDS);
        String retry = received.poll(5, TimeUnit.SECONDS);
        assertEquals(event.toJson(), first);
        assertEquals(first, retry, "Reintentos deben conservar eventId para deduplicar");
        assertEquals("local-test-only-token", headers.poll());
        assertFalse(first.contains("texto"));
        assertFalse(first.contains("email"));
        assertFalse(first.contains("usuario"));
        assertTrue(first.contains("\"correctionCount\":2"));
    }

    @Test
    void rollbackYPublicacionFueraDeTransaccionNoEnvian() throws Exception {
        new TransactionTemplate(transactions).executeWithoutResult(status -> {
            publisher.publishEvent(event());
            status.setRollbackOnly();
        });
        publisher.publishEvent(event());
        assertNull(received.poll(500, TimeUnit.MILLISECONDS));
    }

    @Test
    void falloExternoNoRompeCommitYLimitaReintentos() throws Exception {
        failuresRemaining.set(99);
        assertDoesNotThrow(() -> new TransactionTemplate(transactions)
                .executeWithoutResult(status -> publisher.publishEvent(event())));
        for (int attempt = 0; attempt < 3; attempt++) assertNotNull(received.poll(5, TimeUnit.SECONDS));
        assertNull(received.poll(700, TimeUnit.MILLISECONDS));
    }

    private EntradaGuardadaEvent event() {
        return new EntradaGuardadaEvent(UUID.randomUUID(), Instant.now(), 42,
                LocalDate.of(2026, 10, 23), "A2", 90, 2, 12);
    }
}
