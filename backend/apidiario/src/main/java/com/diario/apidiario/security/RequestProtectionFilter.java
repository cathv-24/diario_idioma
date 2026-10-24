package com.diario.apidiario.security;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.core.annotation.Order;
import org.springframework.web.filter.OncePerRequestFilter;
@Component @Order(-110)
public class RequestProtectionFilter extends OncePerRequestFilter {
 private record Window(long start, int count) {}
 private final ConcurrentHashMap<String,Window> windows = new ConcurrentHashMap<>();
 @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws ServletException,IOException {
  String path=request.getRequestURI();
  if(path.startsWith("/api/")) {response.setHeader("Cache-Control","no-store, private");response.setHeader("Pragma","no-cache");}
  if(request.getMethod().equals("POST") && (path.equals("/api/auth/login") || path.equals("/api/auth/register"))) {
   long now=System.currentTimeMillis();String key=request.getRemoteAddr();
   if(windows.size()>10000) windows.entrySet().removeIf(e -> now-e.getValue().start()>600000);
   if(windows.size()>10000 && !windows.containsKey(key)) {response.setStatus(429);return;}
   Window w=windows.compute(key,(k,old)-> old==null || now-old.start()>600000 ? new Window(now,1):new Window(old.start(),old.count()+1));
   if(w.count()>30) {response.setStatus(429);response.setHeader("Retry-After","600");response.setContentType("application/json");response.getWriter().write("{\"mensaje\":\"Demasiados intentos. Espera unos minutos.\"}");return;}
  }
  chain.doFilter(request,response);
 }
}
