package com.diario.apidiario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import java.net.*;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.regex.Pattern;
import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT,properties={"diario.demo.enabled=false","diario.automation.enabled=false","logging.file.name=target/test-api.log"})
@ActiveProfiles("h2")
class ApiIntegracionTest {
 @Value("${local.server.port}") int port;
 private static final String PASSWORD="Test-only-long-password-42";
 class Session {
  final HttpClient client=HttpClient.newBuilder().cookieHandler(new CookieManager(null,CookiePolicy.ACCEPT_ALL)).build();
  HttpResponse<String> send(String method,String path,String body) throws Exception {
   var builder=HttpRequest.newBuilder(URI.create("http://127.0.0.1:"+port+path));
   if(!method.equals("GET")) {
    var csrf=send("GET","/api/auth/csrf",null);
    var token=Pattern.compile("\"token\":\"([^\"]+)\"").matcher(csrf.body());assertTrue(token.find());
    builder.header("X-CSRF-TOKEN",token.group(1));
   }
   builder.header("Content-Type",path.equals("/api/auth/login")?"application/x-www-form-urlencoded":"application/json");
   return client.send(builder.method(method,body==null?HttpRequest.BodyPublishers.noBody():HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());
  }
  long register(String email) throws Exception {
   var result=send("POST","/api/auth/register",registration(email,PASSWORD));
   assertEquals(201,result.statusCode(),result.body());assertFalse(result.body().contains("password"));return id(result.body(),"idUsuario");
  }
  void login(String email) throws Exception {assertEquals(204,send("POST","/api/auth/login","username="+URLEncoder.encode(email,StandardCharsets.UTF_8)+"&password="+PASSWORD).statusCode());}
 }
 String registration(String email,String password){return "{\"nombre\":\"Prueba\",\"email\":\""+email+"\",\"nivel\":\"A2\",\"password\":\""+password+"\"}";}
 long id(String json,String field) {var matcher=Pattern.compile("\""+field+"\"\\s*:\\s*(\\d+)").matcher(json);assertTrue(matcher.find(),json);return Long.parseLong(matcher.group(1));}
 String email(){return UUID.randomUUID()+"@example.com";}
 String entry(long user,String text) {return "{\"idUsuario\":"+user+",\"texto\":\""+text+"\"}";}
 @Test void sincronizaHistorialEntreDispositivosYCierraSesion() throws Exception {
  var first=new Session();String email=email();long user=first.register(email);first.login(email);
  assertEquals(200,first.send("GET","/api/auth/me",null).statusCode());
  var created=first.send("POST","/api/entrada",entry(user,"Yesterday i goed to the park"));assertEquals(201,created.statusCode(),created.body());
  assertTrue(created.body().contains("Yesterday I went to the park\""),created.body());long entry=id(created.body(),"idEntrada");
  var second=new Session();second.login(email);var history=second.send("GET","/api/entradas/"+user,null);assertEquals(200,history.statusCode());assertTrue(history.body().contains("Yesterday i goed"));
  assertEquals(200,second.send("PUT","/api/entrada/"+entry,entry(user,"Today I feel happy")).statusCode());
  assertTrue(first.send("GET","/api/entrada/"+entry,null).body().contains("Today I feel happy"));
  assertEquals(204,first.send("POST","/api/auth/logout",null).statusCode());assertEquals(401,first.send("GET","/api/auth/me",null).statusCode());
  assertEquals(200,second.send("GET","/api/auth/me",null).statusCode());assertEquals(204,second.send("DELETE","/api/entrada/"+entry,null).statusCode());
 }
 @Test void bloqueaRecursosAjenosYEnumeracion() throws Exception {
  var alice=new Session();String mail=email();long user=alice.register(mail);alice.login(mail);
  long entry=id(alice.send("POST","/api/entrada",entry(user,"A quiet day")).body(),"idEntrada");
  var bob=new Session();String other=email();long otherId=bob.register(other);bob.login(other);
  for(String path:new String[]{"/api/entrada/"+entry,"/api/entradas/"+user,"/api/entradas/"+user+"/resumen","/api/usuario/"+user}) assertEquals(404,bob.send("GET",path,null).statusCode(),path);
  assertEquals(404,bob.send("PUT","/api/entrada/"+entry,entry(otherId,"Changed")).statusCode());
  assertEquals(404,bob.send("DELETE","/api/entrada/"+entry,null).statusCode());
  assertEquals(404,bob.send("POST","/api/entrada",entry(user,"Forged")).statusCode());
  assertEquals(403,bob.send("GET","/api/usuarios",null).statusCode());
  assertEquals(403,bob.send("POST","/api/usuario","{}").statusCode());
  assertEquals(404,bob.send("PUT","/api/usuario","{\"idUsuario\":"+user+",\"nombre\":\"Changed\",\"email\":\""+mail+"\",\"nivel\":\"C2\"}").statusCode());
  assertEquals(404,bob.send("DELETE","/api/usuario/"+user,null).statusCode());
  assertEquals(200,alice.send("GET","/api/entrada/"+entry,null).statusCode());
 }
 @Test void rechazaAnonimosCsrfAusenteYClavesIncorrectas() throws Exception {
  var session=new Session();var anonymous=session.send("GET","/api/entradas/1",null);assertEquals(401,anonymous.statusCode());assertTrue(anonymous.body().contains("sesión"),anonymous.body());
  var request=HttpRequest.newBuilder(URI.create("http://127.0.0.1:"+port+"/api/auth/register")).header("Content-Type","application/json").POST(HttpRequest.BodyPublishers.ofString("{}")).build();
  assertEquals(403,session.client.send(request,HttpResponse.BodyHandlers.ofString()).statusCode());
  assertEquals(401,session.send("POST","/api/auth/login","username=missing%40example.com&password=wrong").statusCode());
  assertTrue(session.send("GET","/api/auth/csrf",null).headers().firstValue("Cache-Control").orElse("").contains("no-store"));
 }
 @Test void validaRegistroDuplicadosYNuncaExponeHash() throws Exception {
  var session=new Session();assertEquals(400,session.send("POST","/api/auth/register","{}").statusCode());
  String email=email();session.register(email);
  assertEquals(409,session.send("POST","/api/auth/register",registration(email.toUpperCase(),PASSWORD)).statusCode());
  assertEquals(400,session.send("POST","/api/auth/register",registration("short@example.com","short")).statusCode());
  session.login(email);var profile=session.send("GET","/api/auth/me",null);assertFalse(profile.body().contains("password"));assertFalse(profile.body().contains("$2"));
  long user=id(profile.body(),"idUsuario");
  assertEquals(200,session.send("PUT","/api/usuario","{\"idUsuario\":"+user+",\"nombre\":\"Prueba\",\"email\":\""+email+"\",\"nivel\":\"C1\"}").statusCode());
  assertEquals(400,session.send("POST","/api/entrada",entry(user,"   ")).statusCode());
  assertEquals(200,session.send("GET","/api/health",null).statusCode());
 }
}
