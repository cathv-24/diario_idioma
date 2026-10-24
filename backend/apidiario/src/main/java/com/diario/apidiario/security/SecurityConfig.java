package com.diario.apidiario.security;

import com.diario.apidiario.repositories.UsuarioRepositorio;

import org.springframework.context.annotation.*;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.core.userdetails.*;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

import org.springframework.http.HttpMethod;

@Configuration

public class SecurityConfig {

 @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }

 @Bean UserDetailsService userDetailsService(UsuarioRepositorio users) {

  return email -> {

   var user = users.findByEmail(email.strip().toLowerCase(java.util.Locale.ROOT))

     .filter(u -> u.getPasswordHash() != null)

     .orElseThrow(() -> new UsernameNotFoundException("Credenciales no validas"));

   return User.withUsername(user.getIdUsuario().toString()).password(user.getPasswordHash()).roles("USER").build();

  };

 }

 @Bean @org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication
 SecurityFilterChain security(HttpSecurity http) throws Exception {

  http.cors(org.springframework.security.config.Customizer.withDefaults())

   .csrf(c -> c.csrfTokenRepository(new HttpSessionCsrfTokenRepository()))

   .authorizeHttpRequests(a -> a

     .requestMatchers("/api/auth/csrf", "/api/auth/register", "/api/auth/login", "/api/health").permitAll()

     .requestMatchers(HttpMethod.POST, "/api/usuario").denyAll()

     .requestMatchers("/api/usuarios").denyAll()

     .requestMatchers("/api/**").authenticated()

     .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").authenticated()

     .anyRequest().permitAll())

   .formLogin(f -> f.loginProcessingUrl("/api/auth/login")

     .successHandler((req,res,auth) -> {res.setStatus(204);})

     .failureHandler((req,res,ex) -> {res.setStatus(401);res.setContentType("application/json");res.getWriter().write("{\"mensaje\":\"Correo o contraseña incorrectos\"}");}))

   .logout(l -> l.logoutUrl("/api/auth/logout").invalidateHttpSession(true).deleteCookies("JSESSIONID")

     .logoutSuccessHandler((req,res,auth) -> res.setStatus(204)))

   .exceptionHandling(e -> e.authenticationEntryPoint((req,res,ex) -> {res.setStatus(401);res.setContentType("application/json");res.getWriter().write("{\"mensaje\":\"Inicia sesión para abrir tu diario\"}");})

     .accessDeniedHandler((req,res,ex) -> {res.setStatus(403);res.setContentType("application/json");res.getWriter().write("{\"mensaje\":\"Solicitud no autorizada; vuelve a iniciar sesión\"}");}))

   .headers(h -> h.contentSecurityPolicy(c -> c.policyDirectives("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; media-src 'self' https://d8j0ntlcm91z4.cloudfront.net; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'")));

  return http.build();

 }

}

