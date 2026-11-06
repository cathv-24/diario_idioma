# Aprender practicando

El diario sigue siendo el lugar para contar una experiencia personal. La ruta ofrece actividades breves que ayudan a encontrar palabras para esa experiencia. No hay bloqueo de unidades, pérdida de rachas ni obligación de completar una lección antes de escribir.

## Recorrido implementado

1. Registro: orientación opcional de ocho preguntas sobre estructuras escritas, con vuelta atrás y conservación del formulario. El resultado se guarda como nivel del perfil y se puede cambiar.
2. Mi camino: doce unidades originales A1–A2 en la secuencia temática de las fotografías de Navigate Elementary. Una recomendación usa correcciones de las últimas cinco entradas, con reglas transparentes; no es un diagnóstico de dominio.
3. Una historia: relato corto, comprobación de comprensión y pista gramatical desplegable. Solo una respuesta correcta marca la lectura como completada.
4. Palabras: vocabulario con significado y ejemplo contextual, audio del dispositivo, búsqueda y palabras guardadas por cuenta.
5. Verbos irregulares: consulta con búsqueda en cualquiera de las formas y significado. Para read, el audio usa oraciones que distinguen presente y pasado.
6. Sonidos: 44 casillas. 34 reproducen grabaciones IPA aisladas; las ocho de diptongos y dos de africadas reproducen palabras con TTS y lo indican. No se sintetiza un símbolo IPA como si fuera texto normal.
7. Tu voz: lectura guiada o narración libre con SpeechRecognition cuando está disponible. Se pide consentimiento antes de iniciar. Una alineación de palabras local identifica posibles omisiones e inserciones sin desfasar toda la frase. Una diferencia de transcripción no se presenta como un error fonético confirmado. No se ha probado con micrófono real en la validación de esta entrega.
8. Llevar una idea al diario conserva el borrador. Llevar una transcripción pide confirmar antes de reemplazar un borrador existente.

## Persistencia

`GET /api/aprendizaje` y `PUT /api/aprendizaje` usan el usuario de la sesión; no aceptan un identificador de usuario desde el cliente. La unidad actual, lecturas completadas y palabras guardadas se almacenan en `aprendizaje`, `aprendizaje_lecturas` y `aprendizaje_palabras`. Las escrituras conservan CSRF y validación de tamaño. Un fallo de carga impide sobrescribir el estado remoto con valores vacíos.

El nivel del perfil sigue en `usuarios`. El cuestionario se corrige en el cliente como ayuda de orientación; su resultado no es una prueba supervisada. Los borradores y la idea temporal del editor no se sincronizan.

## Corrección contextual

Se terminó la conexión que había quedado incompleta entre `EntradaRequestDTO.usarIa`, `CorreccionIaService`, el guardado de la entrada y su DTO de respuesta. Sin consentimiento se usa el corrector de reglas. Si la IA falla, se conserva el borrador y no se guarda un resultado fingido de IA.

La función está desactivada por defecto con `GEMINI_ENABLED=false`; requiere también `GEMINI_API_KEY` y un modelo disponible. `GET /api/correccion/disponibilidad` permite a la interfaz mostrar su estado sin exponer credenciales. No se ha realizado una llamada real a Gemini.

Las condiciones actuales de Gemini imponen restricciones de edad, regiones y tratamiento de datos. El servicio gratuito pide no enviar información personal, sensible o confidencial. Antes de habilitarlo para diarios personales debe elegirse una modalidad/proveedor apropiado y validar el tratamiento de datos; añadir una clave no resuelve esa elección. No se contrató ningún servicio.

## Fuentes técnicas y de audio

- [Navigate, Oxford University Press](https://www.oup.com.au/elt/navigate): nombres de niveles; la secuencia concreta de Elementary se tomó de las fotografías de la usuaria.
- [Web Speech API, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API): reconocimiento y síntesis. El reconocimiento tiene compatibilidad limitada y puede enviar el audio al proveedor del navegador.
- [International Phonetic Association, chart interactivo](https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html): audio de J. C. Wells, enlazado en origen. No se redistribuyeron archivos de audio.
- [Condiciones de Gemini API](https://aistudio.google.com/docs/terms): revisar antes de habilitar el proveedor.

## Verificación y alcance pendiente

Se ejecutaron pruebas de frontend y HTTP reales con Spring Boot/Tomcat/H2: orientación, formulario, omisiones de transcripción, recomendación por error de pasado, lectura guardada, fallo de carga, aislamiento entre cuentas, sincronización entre sesiones y rechazo de IA desactivada. La validación visual cubrió escritorio oscuro y móvil claro, además de las vistas de registro, cuestionario, verbos, sonidos, voz, vocabulario, editor y correcciones.

Pendiente: evaluación acústica de pronunciación/ritmo, lectura y voz como parte de una evaluación inicial más completa, contenidos progresivos B1/B1+, repaso espaciado, resultados por habilidad y prueba de esta nueva persistencia contra Neon. La publicación pública debe verificarse por separado de las pruebas locales.
