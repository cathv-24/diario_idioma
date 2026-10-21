# Endpoints: dónde están y para qué sirven

Un endpoint combina método HTTP y ruta. `GET /api/entrada/5` y `DELETE /api/entrada/5` comparten dirección pero realizan operaciones distintas. `{id}` representa un valor que sustituimos al llamar: no enviamos las llaves.

Todos están en `src/main/java/com/diario/apidiario/controllers`. `@RequestMapping("/api")` aporta el prefijo; `@GetMapping`, `@PostMapping`, `@PutMapping` o `@DeleteMapping` añade el resto y el verbo.

| Método | Ruta | Función del controlador | Qué hace | Éxito |
|---|---|---|---|---|
| POST | `/api/usuario` | `UsuarioController.insertar` | Crea un perfil y genera su ID | 201 |
| GET | `/api/usuarios` | `UsuarioController.listar` | Devuelve todos los perfiles | 200 |
| GET | `/api/usuario/{id}` | `UsuarioController.buscar` | Busca un perfil | 200 |
| PUT | `/api/usuario` | `UsuarioController.actualizar` | Modifica nombre, email y nivel; necesita idUsuario en JSON | 200 |
| DELETE | `/api/usuario/{id}` | `UsuarioController.eliminar` | Elimina un perfil si no tiene entradas | 204 |
| POST | `/api/entrada` | `EntradaDiarioController.crear` | Corrige, guarda y devuelve la entrada | 201 |
| GET | `/api/entradas/{idUsuario}` | `EntradaDiarioController.historial` | Lista entradas desde la creación más reciente | 200 |
| GET | `/api/entrada/{id}` | `EntradaDiarioController.buscar` | Devuelve una entrada con correcciones y sugerencias | 200 |
| PUT | `/api/entrada/{id}` | `EntradaDiarioController.actualizar` | Vuelve a corregir el texto y reemplaza correcciones antiguas | 200 |
| DELETE | `/api/entrada/{id}` | `EntradaDiarioController.eliminar` | Borra la entrada y sus correcciones | 204 |
| GET | `/api/entradas/{idUsuario}/resumen` | `EntradaDiarioController.resumen` | Cuenta entradas, calcula promedio y agrupa errores | 200 |

`204` significa éxito sin cuerpo. Los `POST` devuelven también una cabecera `Location` indicando dónde consultar el recurso creado. Crear una entrada incluye corregirla y guardarla en una sola acción; no hay endpoint independiente para corregir sin guardar en esta versión.

## Recorrido en Swagger

1. Arranca con el perfil `h2` como indica el README y abre Swagger.
2. Expande un endpoint y pulsa **Try it out**.
3. Completa los datos y pulsa **Execute**.
4. Mira **Server response**: código HTTP y cuerpo real. **Example Value** es un ejemplo, no un registro ya creado.

### 1. Crear tu perfil

En `POST /api/usuario`, envía:

```json
{
  "nombre": "Cathe",
  "email": "cathe@example.com",
  "nivel": "A2"
}
```

No envíes `idUsuario` ni `fechaRegistro`. El backend controla esos datos. Guarda el `idUsuario` del response: en los ejemplos siguientes, reemplaza 1 por el ID real. Si repites el mismo email, obtendrás 409.

### 2. Corregir y guardar

En `POST /api/entrada`:

```json
{
  "idUsuario": 1,
  "texto": "Yesterday i goed to the park. I was very happy."
}
```

Resultado esperado: `textoCorregido` contiene `Yesterday I went to the park. I was very happy.`; aparecen dos correcciones, puntaje 90 y una sugerencia opcional `delighted`. Omite `fecha` para usar el día actual de la aplicación, o envía una fecha real con formato `YYYY-MM-DD`, sin que sea futura.

### 3. Consultar

- `GET /api/entrada/{id}`: ID de la entrada del paso 2.
- `GET /api/entradas/{idUsuario}`: ID del perfil del paso 1.
- `GET /api/entradas/{idUsuario}/resumen`: comprueba conteos y categorías.

### 4. Cambiar el nivel

`PUT /api/usuario` recibe los campos completos, incluido `idUsuario`:

```json
{
  "idUsuario": 1,
  "nombre": "Cathe",
  "email": "cathe@example.com",
  "nivel": "B1"
}
```

Las entradas antiguas conservan A2. Una entrada nueva usará B1 y sus explicaciones de reglas estarán en inglés. Editar una entrada la vuelve a corregir con el nivel actual del perfil; se conserva su fecha de creación. La API no conserva versiones anteriores de una edición.

### 5. Editar una entrada

`PUT /api/entrada/{id}` recibe el mismo formato de `POST /api/entrada`. Envíalo con el mismo propietario:

```json
{
  "idUsuario": 1,
  "texto": "Today I feel good."
}
```

Debe devolver cero correcciones. Al consultar el resumen, los errores viejos de esa entrada ya no deben contarse.

### 6. Borrar

Primero prueba `DELETE /api/usuario/{id}` mientras tiene entradas: devuelve 409 para evitar una eliminación accidental en cascada. Luego borra la entrada y, si deseas, el perfil. No hace falta borrar datos para seguir practicando.

## Cómo interpretar errores

| Código | Significado en esta API | Ejemplo |
|---|---|---|
| 400 | Solicitud inválida | Texto vacío, email inválido, nivel Z9 o fecha futura |
| 404 | Recurso inexistente | ID de entrada que no existe |
| 409 | Conflicto con datos existentes | Email repetido o perfil con entradas al intentar borrarlo |
| 500 | Error inesperado | Fallo no previsto; el detalle se registra en logs |

Los errores de validación incluyen un mapa `errores` con el nombre del campo. Los fallos internos no exponen al cliente una traza ni el mensaje SQL. En esta etapa no hay login ni botón Authorize configurado.
