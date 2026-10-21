# Primera lectura del código, línea por línea

Lee un archivo por vez. Las líneas en blanco separan ideas y no ejecutan instrucciones. Los números de esta guía se refieren a los archivos Java de esta entrega. Los imports permiten escribir el nombre corto de una clase: no ejecutan una función ni crean un objeto.

## 1. ApidiarioApplication.java: iniciar el backend

```java
package com.diario.apidiario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApidiarioApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApidiarioApplication.class, args);
    }
}
```

| Línea | Qué significa y para qué sirve |
|---|---|
| 1 | `package` declara a qué paquete pertenece el archivo. `com.diario.apidiario` es la raíz de nuestro backend. El punto separa niveles del nombre. El punto y coma termina la declaración. |
| 3 | Importa SpringApplication, la clase que pone en marcha Spring. |
| 4 | Importa la anotación SpringBootApplication. Una anotación empieza con @ y aporta información para herramientas o frameworks. |
| 6 | Activa configuración automática y descubrimiento de componentes. Spring buscará nuestros controllers, services y configuraciones bajo el paquete raíz. |
| 7 | `public` permite usar la clase desde otros paquetes; `class` declara una clase; `ApidiarioApplication` es su nombre; `{` abre su contenido. |
| 8 | Declara `main`, el punto de entrada. `static` permite ejecutarlo sin crear antes una instancia de esta clase. `void` indica que no devuelve un valor. `String[] args` recibe un arreglo de argumentos del programa. Los paréntesis contienen parámetros; la llave abre el cuerpo del método. |
| 9 | Llama al método run de SpringApplication. `ApidiarioApplication.class` identifica la clase principal; `args` pasa los argumentos recibidos. Spring crea su contexto y arranca el servidor HTTP integrado. |
| 10 | La llave cierra el método main. |
| 11 | La llave cierra la clase. |

Al arrancar no se crea automáticamente una entrada del diario. Se prepara la aplicación para recibir peticiones; la carga inicial crea únicamente el perfil de demostración si está habilitada.

## 2. entities/Usuario.java: describir un perfil persistente

| Línea | Explicación |
|---|---|
| 1 | Sitúa Usuario en el paquete entities. |
| 3 | Importa el enum NivelIngles para que nivel solo pueda tener uno de los valores definidos. |
| 4 | Importa los tipos de jakarta.persistence. El asterisco permite usar tipos de ese paquete sin escribir un import por cada uno. |
| 5 | Importa Getter de Lombok. |
| 6 | Importa NoArgsConstructor de Lombok. |
| 7 | Importa Setter de Lombok. |
| 8 | Importa LocalDate, un tipo de fecha sin hora. |
| 10 | @Entity registra la clase como entidad de persistencia para JPA. |
| 11 | @Table vincula la entidad con la tabla usuarios. No crea un endpoint llamado usuarios. |
| 12 | @Getter genera métodos de lectura, por ejemplo getNombre(). |
| 13 | @Setter genera métodos para asignar valores, por ejemplo setNombre("Cathe"). |
| 14 | @NoArgsConstructor genera un constructor sin parámetros, que JPA necesita para crear instancias. |
| 15 | Declara la clase Usuario y abre su cuerpo. |
| 16 | @Id marca la propiedad que identifica de forma única un registro. |
| 17 | @GeneratedValue con IDENTITY indica que la base de datos genera el identificador al insertar. |
| 18 | Declara idUsuario de tipo Long. private evita acceder directamente al campo desde otras clases. Long representa un entero y permite null antes del guardado. |
| 20 | Configura nombre como columna no nula y con longitud máxima 80. Esta restricción de base de datos no reemplaza la validación del DTO. |
| 21 | Declara nombre como texto, String. |
| 23 | Configura email no nulo, único y de hasta 100 caracteres. unique impide duplicados exactos en esa columna. El servicio normaliza mayúsculas antes de guardar. |
| 24 | Declara el campo email. |
| 26 | @Enumerated con STRING guarda el nombre del enum, por ejemplo A2, en vez de su posición numérica. |
| 27 | Configura nivel como columna obligatoria de longitud 2. |
| 28 | Declara nivel con tipo NivelIngles. Es un conjunto cerrado de valores, no texto libre. |
| 30 | La fecha de registro no puede ser null en la base. |
| 31 | Declara fechaRegistro como LocalDate. El servicio la establece al crear el perfil. |
| 32 | Cierra la clase. |

Ejemplo conceptual: Usuario es la definición; un objeto Usuario con nombre Cathe y nivel A2 es una instancia; una fila de usuarios es su representación persistida. El getter no consulta PostgreSQL por sí mismo: normalmente devuelve el valor que el objeto ya tiene.

## 3. services/EntradaDiarioService.java: declarar qué podemos hacer

| Línea | Explicación |
|---|---|
| 1 | Sitúa el contrato en services, como en el ZIP de proveedores. |
| 3 | Importa los DTO del proyecto. |
| 4 | Importa List para representar una colección ordenada de objetos. |
| 6 | Declara una interfaz pública. Define operaciones; no escribe aquí cómo consultar o guardar. |
| 7 | crear recibe un EntradaRequestDTO llamado request y devuelve un EntradaCorregidaDTO. El punto y coma termina una firma sin cuerpo. |
| 8 | buscar recibe un Long llamado id y devuelve los datos de una entrada. |
| 9 | listarPorUsuario recibe el ID de un usuario y devuelve una lista de EntradaCorregidaDTO. Los signos < > indican el tipo de elemento de la lista. |
| 10 | actualizar recibe el ID de la entrada y los nuevos datos. Devuelve la entrada ya corregida. |
| 11 | eliminar recibe un ID y no devuelve un valor, por eso utiliza void. |
| 12 | resumen recibe un usuario y devuelve un resumen agregado del historial. |
| 13 | Cierra la interfaz. |

El nombre de un método Java no lo convierte en endpoint. Estos métodos se vuelven accesibles por HTTP cuando un controlador los conecta con una ruta y un verbo.

## 4. controllers/EntradaDiarioController.java: conectar HTTP con el servicio

| Línea | Explicación |
|---|---|
| 1 | Declara el paquete de los controladores. |
| 3 | Importa los DTO usados como entrada y salida. |
| 4 | Importa la interfaz del servicio; el controlador depende de ese contrato. |
| 5 | Importa Operation para describir cada acción en Swagger. |
| 6 | Importa Tag para agrupar endpoints en Swagger. |
| 7 | Importa Valid para activar validaciones de los DTO. |
| 8 | Importa Autowired, la anotación para inyectar dependencias. |
| 9 | Importa ResponseEntity para controlar estado, cabeceras y cuerpo HTTP. |
| 10 | Importa anotaciones de Spring MVC, como PostMapping y RequestBody. |
| 11 | Importa URI, usada para señalar la dirección del recurso creado. |
| 12 | Importa List para devolver el historial como colección. |
| 14 | @RestController registra una clase que recibe peticiones y responde con datos, habitualmente JSON. |
| 15 | @RequestMapping("/api") establece el prefijo común de las rutas de esta clase. |
| 16 | @Tag agrupa esta clase bajo Entradas en Swagger. No crea una ruta. |
| 17 | Declara la clase EntradaDiarioController. |
| 18 | @Autowired pide a Spring que coloque aquí el servicio que administra. |
| 19 | Declara la dependencia entradaService usando la interfaz EntradaDiarioService. Spring conecta su implementación. |
| 21 | @PostMapping("/entrada") atiende POST /api/entrada. Se combina con el prefijo de la línea 15. |
| 22 | @Operation añade una descripción para Swagger. No implementa la operación. |
| 23 | Declara crear. Recibe un EntradaRequestDTO construido desde el JSON por @RequestBody. @Valid comprueba sus restricciones antes de entrar al método. El retorno es una respuesta HTTP cuyo cuerpo tiene tipo EntradaCorregidaDTO. |
| 24 | Llama a crear del servicio y guarda el resultado en una variable local llamada creada. No ejecuta regex en el controlador. |
| 25 | Construye una respuesta 201 Created. URI.create compone la dirección de consulta con el ID real; created agrega Location; body agrega el objeto de respuesta. El signo + concatena texto con el ID. |
| 26 | Cierra crear. |
| 28 | Conecta GET /api/entradas/{idUsuario} con el método siguiente. El segmento entre llaves cambia según el usuario. |
| 29 | Describe el historial en Swagger. |
| 30 | Declara historial. @PathVariable copia el segmento idUsuario de la URL al parámetro Long. El retorno es una lista de DTO. |
| 31 | Devuelve el resultado de listarPorUsuario del servicio. Spring serializa la lista a JSON con 200. |
| 32 | Cierra historial. |
| 34 | Conecta GET /api/entrada/{id} con la consulta individual. |
| 35 | Describe la consulta individual en Swagger. |
| 36 | Declara buscar y recibe el ID desde la URL. Aquí id es el ID de entrada, no el de usuario. |
| 37 | Devuelve la entrada consultada por el servicio; si no existe, la excepción se maneja en GlobalExceptionHandler. |
| 38 | Cierra buscar. |
| 40 | Conecta PUT /api/entrada/{id} con la edición. |
| 41 | Describe que la edición vuelve a corregir. |
| 42 | Recibe dos fuentes de datos: id desde la URL y request desde el cuerpo JSON validado. |
| 43 | Entrega ambos al servicio y devuelve la entrada actualizada. |
| 44 | Cierra actualizar. |
| 46 | Conecta DELETE /api/entrada/{id} con el borrado. |
| 47 | Describe el borrado en Swagger. |
| 48 | Declara eliminar y una respuesta sin datos de cuerpo, ResponseEntity<Void>. Void aquí es un tipo para el parámetro genérico, no el void de la firma de un método. |
| 49 | Pide al servicio eliminar la entrada. Si falla, no se ejecuta la siguiente línea. |
| 50 | Construye 204 No Content, una respuesta de éxito sin cuerpo. |
| 51 | Cierra eliminar. |
| 53 | Conecta GET /api/entradas/{idUsuario}/resumen con el reporte. |
| 54 | Describe lo que cuenta el reporte. |
| 55 | Declara resumen y recibe el identificador del usuario desde la URL. |
| 56 | Devuelve el resumen preparado por el servicio con datos del repositorio. |
| 57 | Cierra resumen. |
| 58 | Cierra la clase. |

## 5. Leer una llamada sin memorizarla

En `EntradaCorregidaDTO creada = entradaService.crear(request);`:

- `EntradaCorregidaDTO`: tipo de dato que esperamos recibir.
- `creada`: nombre local que elegimos para guardar ese resultado.
- `=`: asigna el valor de la derecha a la variable de la izquierda.
- `entradaService`: objeto que sabe coordinar el proceso de negocio.
- `.`: permite acceder a un miembro de ese objeto.
- `crear`: nombre del método llamado.
- `(request)`: entrega el argumento con los datos de la petición.
- `;`: termina la instrucción.

Primero se evalúa la llamada de la derecha. Si termina correctamente, su resultado se asigna a creada. Si lanza una excepción, no se asigna un resultado ni se devuelve 201: interviene el manejador de errores.

Después de estos cuatro archivos, sigue las funciones de EntradaDiarioServiceImpl en GUIA_PASO_A_PASO.md y observa los resultados con los ejemplos de ENDPOINTS.md. Las implementaciones completas están disponibles para recorrerlas en sesiones pequeñas, sin saltar conceptos que todavía no entiendas.
