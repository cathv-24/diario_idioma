# Aprender el backend con tu diario

Esta guía conecta la teoría del PDF con el código generado. Sigue las secciones por orden. El objetivo no es memorizar anotaciones, sino poder explicar quién hace cada operación y por qué.

## 1. Identificar las partes

El frontend muestra, el backend procesa y PostgreSQL conserva información. Una petición transporta datos entre frontend y backend mediante HTTP. El backend de esta carpeta es una sola aplicación organizada en capas; sus servicios Java no son microservicios.

Referencia del PDF unido: páginas 1–23 (aplicaciones y arquitectura), 24–57 (Java OO), 58–184 (Spring y persistencia), 185–257 (REST, consultas y logs), 258–282 (DTO y JWT) y 357–373 (seguridad). Las páginas son posiciones del PDF, no una asignación exacta a semanas.

En el ejemplo de proveedores, `ProveedorController` llama a `ProveedorService` y Spring usa `ProveedorServiceImpl`. Aquí usamos el mismo reparto de responsabilidades.

## 2. Crear el proyecto: pom.xml

`pom.xml` es el archivo que Maven lee para construir el proyecto. No es código que atiende peticiones. Declara identidad del proyecto, versión de Java, dependencias y herramientas de compilación.

| Elemento | Para qué está aquí |
|---|---|
| `spring-boot-starter-parent` | Define versiones y configuración coordinadas por Spring Boot |
| `java.version=21` | Indica la versión de Java con la que se compila |
| `starter-webmvc` | Permite atender HTTP con controladores y un servidor integrado |
| `starter-data-jpa` | Permite usar repositorios y mapear entidades a tablas |
| `starter-validation` | Hace funcionar validaciones como NotBlank y Email |
| PostgreSQL Driver | Permite que Java se comunique con PostgreSQL |
| H2 | Permite practicar y probar con una base temporal |
| Lombok | Genera getters, setters y constructores al compilar |
| ModelMapper | Copia propiedades entre un objeto entidad y un DTO |
| springdoc | Genera OpenAPI y sirve Swagger UI |
| Dependencias de test | Permiten verificar reglas y ejecutar la aplicación en pruebas |
| `spring-boot-maven-plugin` | Permite ejecutar y empaquetar la aplicación |

Un starter agrupa dependencias. Una dependencia es una biblioteca reutilizable. Un plugin ejecuta tareas de construcción. No todos cumplen la misma función.

El ZIP de clase y esta entrega declaran Spring Boot 4.0.8 y Java 21. Algunas diapositivas muestran ejemplos anteriores con Spring Boot 3 o imports `javax.persistence`; en esta entrega se usa `jakarta.persistence`, como en las entidades del ZIP.

## 3. Entender el arranque

Archivo: `ApidiarioApplication.java`.

Al ejecutar `main`, `SpringApplication.run` crea el contexto de Spring y arranca el servidor. `@SpringBootApplication` activa la configuración automática y el descubrimiento de componentes bajo `com.diario.apidiario`. Por eso los paquetes están debajo de esa raíz.

Spring detecta clases como `@Service`, `@Repository` y `@RestController`, registra los objetos que administra (beans) y conecta sus dependencias. `@Autowired` solicita uno de esos objetos; no crea una nueva copia cada vez que llega una petición.

## 4. Representar los datos: entities

Una clase describe qué datos puede tener un objeto. Una instancia es un objeto concreto creado a partir de esa clase. Una entidad añade información para que JPA pueda guardarla y recuperarla.

- `Usuario`: perfil con nombre, email, nivel y fecha de registro. No es todavía una cuenta con contraseña.
- `EntradaDiario`: texto original, corregido, fecha, puntaje y nivel con el que se corrigió.
- `Correccion`: fragmento original, alternativa, categoría y explicación de una entrada.

Relaciones: un usuario puede tener muchas entradas; una entrada pertenece a un usuario. Una entrada puede tener muchas correcciones; cada corrección pertenece a una entrada.

`@ManyToOne` se coloca en quien mantiene la referencia al objeto único: por ejemplo, cada entrada apunta a un usuario. `@JoinColumn` configura la columna de esa referencia. `@OneToMany(mappedBy="entrada")` indica que la lista es el otro lado de la relación, cuyo campo dueño es `Correccion.entrada`.

`agregarCorreccion` hace dos cosas: asigna el padre a la corrección y agrega esa corrección a la lista. Si solo se agregara a la lista, la columna id_entrada del hijo podría quedar sin establecer. `cascade=ALL` propaga operaciones a los hijos. `orphanRemoval=true` elimina correcciones retiradas de la lista, por ejemplo al editar el texto.

El nivel se guarda también en la entrada. Es una copia histórica necesaria: si mañana cambias tu perfil a B1, el diario de hoy debe seguir indicando que se corrigió con A2.

## 5. Decidir qué datos viajan: dtos

Una entidad responde a persistencia. Un DTO responde al contrato de la API. Pueden tener campos parecidos, pero no tienen por qué coincidir.

| DTO | Función |
|---|---|
| UsuarioDTO | Datos de perfil; validaciones de nombre, email y nivel |
| EntradaRequestDTO | Datos que se reciben al escribir o editar: usuario, fecha opcional y texto |
| EntradaCorregidaDTO | Respuesta de la entrada con correcciones, puntaje, resumen y sugerencias |
| CorreccionDTO | Explicación de un error; no incluye una referencia de vuelta a la entidad padre |
| ResumenTemaDTO | Frecuencia por categoría y consejo dentro de una entrada |
| SugerenciaDTO | Alternativa opcional de vocabulario y umbral configurado |
| ResumenCategoriaDTO | Categoría y conteo agregado de todo el historial |
| ResumenProgresoDTO | Número de entradas, promedio orientativo y errores agrupados |

`@NotNull` rechaza null; `@NotBlank` rechaza null, vacío y espacios en un String; `@Email` comprueba formato; `@Size` limita longitud; `@Positive` exige mayor que cero; `@PastOrPresent` rechaza fechas futuras y permite null, por eso la fecha es opcional.

`@Valid` en el controlador activa la revisión del DTO. Poner solamente `@Valid` sobre un objeto sin restricciones no produce mágicamente validaciones de negocio. El email duplicado se comprueba en el servicio y la unicidad se conserva también en la base de datos.

## 6. Acceder a datos: repositories

Son interfaces que extienden `JpaRepository<Entidad, TipoDelId>`. Spring Data proporciona implementaciones de `save`, `findAll`, `findById` y `delete`; no escribimos el SQL de cada CRUD.

| Método propio | Cómo funciona |
|---|---|
| UsuarioRepositorio.existsByEmail | Spring deriva una consulta por el nombre; devuelve boolean |
| existsByEmailAndIdUsuarioNot | Comprueba duplicados excluyendo al usuario que editamos |
| EntradaDiarioRepositorio.findByUsuarioIdUsuarioOrderByFechaCreacionDesc | Recorre la propiedad usuario y filtra por su idUsuario; orden descendente |
| existsByUsuarioIdUsuario | Comprueba si el perfil tiene entradas |
| countByUsuarioIdUsuario | Cuenta entradas de ese usuario |
| promedioPuntaje | JPQL explícito con AVG; null si no hay entradas |
| CorreccionRepositorio.resumirPorUsuario | JPQL con GROUP BY y COUNT; construye directamente ResumenCategoriaDTO |

JPQL usa nombres de entidades y propiedades Java, no los nombres físicos de las tablas SQL. `:idUsuario` es un parámetro; `@Param` conecta ese nombre con el argumento del método. Las páginas 235–252 del PDF explican estas consultas.

## 7. Definir las operaciones: services

`UsuarioService`, `EntradaDiarioService`, `CorreccionService` y `VocabularioService` son contratos. Una interfaz declara qué operaciones existen. Una implementación escribe cómo se realizan. `@Override` comprueba que un método realmente implementa o sobrescribe el contrato.

El controlador declara una dependencia del contrato, por ejemplo `EntradaDiarioService`. Spring encuentra su única implementación `EntradaDiarioServiceImpl` y la inyecta. Si hubiera dos implementaciones activas del mismo contrato, sería necesario indicar cuál usar.

El `record ResultadoCorreccion` agrupa el texto corregido y una lista de correcciones para uso interno. No es una entidad JPA ni una tabla. Sus accesores se llaman `textoCorregido()` y `correcciones()`, sin el prefijo get.

## 8. Implementar el negocio: serviceimpl

### UsuarioServiceImpl

- `insertar`: rechaza un ID enviado por el cliente, normaliza el email, comprueba que no exista, convierte el DTO en entidad, establece la fecha y guarda. Devuelve un DTO.
- `listar`: consulta todas las entidades y transforma cada una a DTO.
- `buscar`: obtiene la entidad mediante un helper y la convierte a DTO.
- `actualizar`: exige ID, busca el usuario, valida que el email no pertenezca a otro y modifica nombre, email y nivel.
- `eliminar`: comprueba existencia y rechaza borrar un perfil que aún tenga entradas.
- `buscarEntidad`: centraliza findById y el error 404. Optional representa que puede no existir un resultado; orElseThrow lanza la excepción si está vacío.
- `aDTO`: utiliza ModelMapper porque los campos del perfil tienen correspondencia directa.
- `normalizarEmail`: retira espacios exteriores y convierte a minúsculas con una regla de locale estable.

### EntradaDiarioServiceImpl

- `crear`: busca usuario, crea la entrada, fija fecha de creación, la prepara, guarda y construye la respuesta.
- `buscar`: consulta una entrada y construye su DTO.
- `listarPorUsuario`: comprueba que exista el perfil, consulta su historial y transforma cada entrada.
- `actualizar`: impide cambiar de propietario, limpia correcciones antiguas, vuelve a preparar la entrada con el nivel actual y guarda. Recorregir reemplaza la corrección anterior; no hay historial de versiones.
- `eliminar`: elimina una entrada existente. La cascada elimina sus correcciones.
- `resumen`: consulta conteo, promedio y agrupación de errores. Convierte promedio null a cero y redondea a dos decimales.
- `preparar`: limpia espacios exteriores del texto, establece fecha y nivel, llama al corrector, convierte cada CorreccionDTO a entidad Correccion, establece ambas referencias y calcula puntaje.
- `buscarUsuario` y `buscarEntrada`: centralizan búsquedas y excepciones de no encontrado.
- `aDTO`: arma la respuesta enriquecida. Agrupa errores con EnumMap, crea consejos y solicita sugerencias de vocabulario. La conversión manual es apropiada porque no es solo copiar campos de una entidad.

`@Transactional` crea un límite de transacción para la operación del servicio. Si falla una operación con una RuntimeException, se revierte la transacción. `readOnly=true` expresa intención de lectura; los métodos de escritura la sobrescriben. Las listas LAZY se leen al construir los DTO dentro de este límite. Se desactiva open-in-view para no depender de una sesión de persistencia abierta durante la respuesta del controlador.

### CorreccionServiceImpl

- `corregir`: aplica el conjunto explícito de reglas y devuelve ResultadoCorreccion. No llama a una API ni al repositorio.
- `palabra`: prepara un patrón que encuentra una palabra completa y selecciona la explicación por nivel.
- `reemplazar`: recorre coincidencias con Matcher, registra cada aparición y arma un texto nuevo. appendTail conserva el resto que no coincidió.
- `agregar`: crea el DTO de un error y lo agrega a la lista. Cuenta apariciones, incluso si el mismo error se repite.
- `explicar`: selecciona español para A1/A2 e inglés desde B1.

Una expresión regular describe un patrón de texto. `\\b` en el código Java representa un límite de palabra en el motor regex. `Pattern.quote` hace que el texto dado se trate literalmente y `Matcher.quoteReplacement` evita que símbolos de reemplazo se interpreten como instrucciones.

### VocabularioServiceImpl

- `sugerir`: busca dos expresiones y, según el umbral configurado, añade alternativas opcionales. No cambia el texto corregido ni el puntaje.
- `contiene`: comprueba si aparece una expresión completa sin distinguir mayúsculas/minúsculas.

Estos motores son pequeños a propósito para aprender el recorrido. No afirman que un texto sin coincidencias sea gramaticalmente perfecto. Cuando entendamos este contrato, otra implementación podrá usar IA sin obligarnos a rehacer controladores y repositorios.

## 9. Exponer operaciones: controllers

Consulta ENDPOINTS.md para cada función. Los controladores convierten HTTP en llamadas al servicio, no deberían contener regex ni consultas SQL.

`@RestController` hace que Spring interprete los resultados como datos de respuesta. `@RequestBody` convierte el cuerpo JSON en un objeto Java. `@PathVariable` extrae un segmento de la ruta. `@RequestMapping` define el prefijo común y cada Mapping define un endpoint concreto.

`ResponseEntity` permite elegir cuerpo, estado y cabeceras. Crear devuelve 201 y Location; consultar o editar devuelve 200; eliminar devuelve 204. Los métodos que retornan directamente DTO o List se serializan como JSON con estado 200 si finalizan normalmente.

## 10. Seguir una petición completa

Ejemplo: POST /api/entrada con texto, idUsuario y, opcionalmente, fecha.

1. Tomcat recibe la petición HTTP.
2. Spring busca la combinación de método y ruta: EntradaDiarioController.crear.
3. Convierte JSON a EntradaRequestDTO y ejecuta validaciones.
4. El controlador llama a EntradaDiarioService.crear. Spring conecta esa interfaz con su implementación.
5. El servicio busca el usuario mediante UsuarioRepositorio.
6. `preparar` llama a CorreccionService; CorreccionServiceImpl aplica reglas.
7. El servicio crea entidades Correccion y las asocia a EntradaDiario.
8. EntradaDiarioRepositorio.save persiste la entrada; cascade persiste hijos en la misma operación de negocio.
9. `aDTO` prepara la respuesta con categorías y sugerencias.
10. El controlador devuelve 201, Location y JSON.

Swagger actúa como cliente en este recorrido. Puede reemplazar temporalmente a Angular para probar el backend, pero no reemplaza al controlador, al servicio o a la base de datos.

## 11. Configuración compartida

| Archivo / función | Papel |
|---|---|
| ModelMapperConfig.modelMapper | Publica un ModelMapper como bean reutilizable |
| WebConfig.addCorsMappings | Permite que el navegador desde localhost:4200 lea respuestas de /api/** |
| OpenApiConfig.diarioOpenAPI | Configura título y descripción de Swagger |
| CargaInicial.run | Crea un perfil demo si no existe ninguno; se puede desactivar con diario.demo.enabled=false |
| application.properties | Configura servidor, PostgreSQL y comportamiento de JPA/logs |
| application-h2.properties | Sobrescribe conexión para la base temporal del perfil h2 |

`@Value` lee una propiedad; `@Bean` registra el valor retornado por una función; `@Configuration` marca una clase de configuración. `${DB_PASSWORD:}` usa una variable de entorno o el valor por defecto vacío después de los dos puntos.

CORS es una política del navegador, no una prueba de identidad. En este punto todavía no hay autenticación, contraseña ni permisos por propietario. El bloqueo de cambiar propietario al editar es una regla de integridad, no una autorización de acceso.

## 12. Errores y logs

`GlobalExceptionHandler` está marcado con `@RestControllerAdvice`: atiende excepciones de los controladores sin repetir try/catch en todos ellos.

- `noEncontrado`: 404 para RecursoNoEncontradoException.
- `conflicto`: 409 para reglas de conflicto e integridad de la base.
- `validacion`: 400 y detalle por campo cuando falla @Valid.
- `formato`: 400 si JSON, fecha, tipo de ID o enum no se puede leer.
- `solicitud`: 400 para reglas de solicitud inválida.
- `inesperado`: registra el fallo completo y devuelve un mensaje genérico 500.
- `error` y `cuerpo`: helpers que construyen el formato común de respuesta.

`throw` interrumpe el recorrido normal lanzando una excepción. No todo error debe ser 404. Una entrada inexistente y un email duplicado son situaciones diferentes y por eso tienen estados distintos.

`@Slf4j` genera un logger. `log.debug` registra identificador y número de correcciones sin escribir todo el texto personal del diario. Los logs son para diagnóstico; no son el historial de entradas.

## 13. Verificar lo construido

`CorrectorTest` comprueba sustituciones, errores repetidos, conservación de were/everyday, idioma y sugerencias según nivel.

`ApiIntegracionTest` arranca Spring con Tomcat y H2; envía HTTP real. Comprueba guardar, consultar, conservar el nivel histórico, editar y retirar correcciones anteriores, resumir con JPQL, borrar, rechazar duplicados y datos inválidos, abrir Swagger/OpenAPI y permitir el origen de Angular.

H2 demuestra ese flujo con una base de prueba. No demuestra que el usuario o la contraseña de PostgreSQL del equipo estén bien configurados. El navegador Angular tampoco se ejecuta en estas pruebas.

## 14. Preguntas para explicarlo tú

1. ¿Por qué EntradaRequestDTO no recibe textoCorregido ni puntaje?
2. ¿Por qué el controller llama al service y no al corrector directamente?
3. ¿Qué genera JpaRepository y qué escribimos nosotros?
4. ¿Por qué guardar nivel solo en Usuario alteraría la interpretación del historial?
5. ¿Cómo cambian los datos y la respuesta si falla el email duplicado?
6. ¿Dónde empieza una transacción y qué protege?
7. ¿Por qué una sugerencia de vocabulario no se cuenta como error?
8. ¿Qué añade Swagger y qué partes seguirían funcionando si quitamos su dependencia?

Siguiente etapa de aprendizaje: conectar el frontend a este flujo y, cuando se aborde el tema de seguridad, crear cuentas autenticadas y restricciones de propiedad antes de permitir otros usuarios. No hace falta adoptar microservicios para comprender ni completar esta versión del diario.
