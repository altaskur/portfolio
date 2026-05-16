---
title: "Pancitapp: de Artifact a React Native pasando por una PWA que se quedó corta"
description: "Cómo una psicóloga diseñó la lógica de una app de gestión de recetas en tres días y yo le construí la infraestructura para que durara. Stack, decisiones y lo que aprendí en cada iteración."
publishDate: 2026-05-15
type: "article"
coverImage: /assets/blog/pancitapp-header.webp
---

Hace unos días conté que mi pareja diseñó una app en tres días usando Claude. Esto es lo que pasó cuando intenté convertir eso en algo que pudiéramos usar de verdad.

Mi pareja es psicóloga. En tres días, a ratitos, diseñó una app de gestión de recetas y menú semanal usando Claude. No me dijo nada hasta tenerla lista. Me la enseñó ilusionada y tenía razón en estarlo la lógica estaba bien pensada, el diseño era coherente, las funcionalidades eran exactamente las que necesitábamos.

El problema era que vivía dentro de un Artifact de Claude. Los datos estaban en el navegador, no había nada compartido, no se podía usar entre dos dispositivos. Un producto bien pensado sin infraestructura.

Decidí que su idea se merecía ser real. Este es el recorrido.

---

## Qué diseñó ella y por qué importa antes de hablar de tecnología

Antes de entrar en las iteraciones hay que entender qué pensó, porque cada decisión técnica que tomé después sale directamente de su lógica.

Pancitapp planifica el menú semanal de un hogar y lo acompaña durante toda la semana. El lunes planificas los 7 días: comida y cena, con perfiles individuales que conocen las alergias y preferencias de cada persona. A partir del menú la app genera automáticamente la lista de la compra, cruzada con lo que ya tienes en la despensa.

Durante la semana la app vive contigo. Marcas los platos que ya has cocinado, señalas los días que coméis fuera esos platos se excluyen del análisis nutricional y no contaminan la compra. Si un plato no apetece, pides alternativas y la IA sugiere tres opciones contextualizadas con lo que ya hay en el menú. Al terminar la semana la guardas en el historial y empiezas otra.

Las valoraciones cierran el bucle que ella pensó: cada plato se puntúa de 1 a 5 estrellas. No se guardan y se olvidan son la memoria del hogar. La IA las usa en cada petición para saber qué le gusta y qué evitar. Con el tiempo el asistente deja de sugerir lo que no funciona y refuerza lo que sí.

El detalle que mejor explica que esto no es un proyecto técnico sino una herramienta real es la **regla del tupper**: los lunes y martes al mediodía la app sugiere platos que aguanten recalentados (guisos, legumbres, arroces) y penaliza los que no (fritos, ensaladas, huevos). Porque en nuestro hogar ella trabaja fuera y necesita llevarse la comida. Esa lógica no sale de un tutorial, sale de alguien que sabe exactamente qué problema tiene.

Además del flujo semanal diseñó cinco modos de IA: sugerencias de plato, recetas con lo que hay en la nevera, menú económico para toda la semana, reto del chef con un plato que el hogar nunca ha cocinado, y sorpréndeme hoy, este último considera las caducidades pendientes para priorizar lo que está a punto de vencer.

El objetivo que marcó desde el principio, y que condicionó cada decisión de UX que tomamos juntos: la app se amolda a nosotros, no nosotros a la app.

---

## Iteración 1: El Artifact 3 días

Aquí es donde ella construyó todo. Un Artifact de Claude es una aplicación web que corre dentro del contexto de la conversación renderiza UI, guarda estado, funciona. Para prototipar una idea en días es difícil de superar.

El límite es estructural: cada usuario que abre el enlace ve una instancia vacía. Lo que parece una base de datos es localStorage en un navegador concreto. No hay persistencia real, no hay nada compartido entre dispositivos.

Cuando me lo enseñó ya tenía la lógica completa, el diseño definido y las funcionalidades claras. Mi trabajo fue entender que ese Artifact no era un prototipo descartable era la especificación funcional más honesta que podía tener. Y construir para que durara.

---

## Iteración 2: PWA con React y Vite una semana

El primer salto fue mío: una PWA con React y Vite para ver si su idea aguantaba fuera del Artifact y cómo se comportaba en móvil.

La señal para abandonarla también vino de ella. Todo lo que había diseñado era costoso de implementar bien en una PWA, y la experiencia no se comportaba como sentíamos que debería comportarse una app. No fue un bug, fue la fricción acumulada de intentar que algo se sintiera nativo sin serlo.

Si tuviera que volver a empezar me saltaría esta fase. Fue una semana que me confirmó algo que ya sospechaba: su idea necesitaba React Native desde el principio.

---

## Iteración 3: React Native

Con la validación hecha el salto fue React Native con Expo. A partir de aquí viene la parte más técnica; si no es tu perfil, el resumen es: tecnología estándar, decisiones pragmáticas, coste cero salvo electricidad.

### Stack

No hay nada especialmente exótico en el stack: React Native con Expo como framework, NativeWind para estilos (Tailwind CSS en nativo, sin mantener dos sistemas), Zustand para estado global, Supabase como backend y Google AI Studio en el tier gratuito para la IA. CI/CD en Forgejo con runner propio, despliegue web con Docker, Nginx, Dokploy y Traefik.

Coste mensual: lo que consume la torre en luz. Supabase tier gratuito, Google AI Studio tier gratuito. Cero euros de servicios externos.

### Por qué Zustand y no Context API

El store gestiona más de 15 acciones y varios slices independientes: menú, compra, despensa, caducidades, historial, catálogo de recetas, perfiles, todo lo que ella diseñó. Context API con ese volumen implica mucho boilerplate y renders innecesarios. Zustand ofrece un API mínimo, sin providers, con persistencia directa sobre AsyncStorage y selectores que evitan suscripciones al estado completo.

### Persistencia, sincronización y Realtime dos mecanismos distintos

Hay dos sistemas de sync con responsabilidades distintas.

**Debounce (salida)**: cada escritura local dispara una sincronización a Supabase con debounce de 1 segundo. Sin debounce, marcar diez productos genera diez escrituras. Con debounce, genera una. La función compara además un snapshot previo para evitar escrituras redundantes.

**Realtime (entrada)**: Supabase Realtime escucha cambios remotos en compra y recetas vía WebSocket. Cuando ella añade algo a la lista desde casa, yo lo veo en el móvil en tiempo real sin refrescar.

El conflicto offline/online se resuelve con una regla simple: al iniciar sesión se carga el estado completo desde Supabase sobreescribiendo el local. Supabase es la fuente de verdad; AsyncStorage es la caché para uso offline.

Supabase puede fallar, y asumo que lo hará. Ahora mismo la app funciona con el último estado disponible en local y reintenta sincronizar en cuanto recupera conexión. No hay resolución de conflictos complejos todavía, para este caso de uso no ha sido necesario, pero sería el siguiente nivel si el proyecto creciera.

### Por qué Supabase en un proyecto que vive en el homelab

No es una contradicción. El homelab es donde vive la app web, el repositorio y el CI/CD. Supabase es la capa que hace que dos móviles en cualquier sitio tengan los mismos datos en tiempo real.

El caso de uso lo explica mejor que cualquier argumento: ella está en casa y añade algo a la lista de la compra. Yo estoy en el súper y lo veo al momento, sin que nadie tenga que encender una VPN. Para una app de uso diario es el mínimo que tiene que funcionar. Pragmatismo al 100%. 

Decidimos que el código no estuviera público, no de forma deliberada, sino porque nunca fue la intención, la idea era tener una herramienta doméstica, no un proyecto de código abierto o de portfolio. El repositorio es privado, el runner de CI/CD corre en otro server junto a la generación APK es localm y se descarga directamente desde Forgejo. No hay nada en la nube que no sea Supabase, y Supabase solo almacena los datos necesarios para que la app funcione.

### El onboarding y el trigger que lo une todo

Al registrarse, un trigger crea automáticamente el hogar y el perfil. La primera sesión importa automáticamente las recetas de los menús predefinidos al catálogo. Ella arranca con contenido desde el primer minuto, sin construir nada desde cero, exactamente como lo había pensado.

### La IA nunca toca el cliente directamente

Toda la comunicación con el LLM pasa por una Edge Function en Supabase (`ai-proxy`). La clave del proveedor nunca está en el cliente ni en el bundle, ni siquiera los prompts.

Empecé con Claude pero el coste se disparaba con el uso real. El tier gratuito de Google AI Studio lo cubre perfectamente con algo más de latencia. 

La IA no trabaja con un prompt genérico. Antes de cada llamada se construye el contexto que ella diseñó: historial de valoraciones del hogar, restricciones dietéticas de cada perfil, número de personas, caducidades pendientes.

La respuesta se pide en JSON puro y la Edge Function la limpia y valida antes de devolverla. De momento no he tenido respuestas inválidas, en parte porque el formato está bastante acotado, pero es algo que va a pasar y el siguiente paso es añadir fallback cuando ocurra.

### Biometría: su idea, mi implementación

La app soporta huella dactilar o Face ID. La razón no es seguridad, es la que ella planteó desde el principio: cuando estás en el súper con las manos ocupadas no quieres teclear una contraseña. Un toque y estás en la lista. `expo-local-authentication` delega en el sistema operativo; Pancitapp nunca almacena datos biométricos.

### Lo más difícil: compilar el APK sin depender de nadie

Casi toda la documentación asume que vas a compilar en la nube con EAS. Hacerlo local con Gradle, con un runner de Forgejo leyendo los secrets del repositorio y usándolos en la compilación, eso no estaba bien documentado o no encontre nada que me sirviera. Fueron horas de prueba y error.

A nivel técnico puro no hubo un punto especialmente complejo, lo difícil fue traducir una lógica de uso real a decisiones concretas sin sobrecomplicar la app. La única parte realmente incómoda fue la PWA, porque intentaba resolver un problema con una herramienta que no encajaba.

Odio depender de servicios de terceros cuando el proyecto no lo necesita. El precio de esa decisión fue tiempo. Lo volvería a pagar.

El runner corre en una torre con i5 de 13ª, 32GB de RAM y una RTX 5070 Ti con 16GB de VRAM la misma máquina que usamos para modelos de IA local. La APK la generamos nosotros y la descargamos directamente desde Forgejo, sin pasar por ninguna tienda.

### Infraestructura

El inicio de la creación del homelab está en [este post](/blog/mi-homelab-desde-cero). Dokploy para el despliegue, Traefik como reverse proxy, Forgejo para el repositorio y el CI/CD.

No hay sistema de logging todavía. Primero quería validar que la app se usaba de verdad. El siguiente paso es añadir visibilidad de errores cuando empiece a haber más superficie de fallo.

---

## El resultado, su resultado.

42 recetas en el catálogo. 14 platos esta semana. 41 productos en la lista de la compra generados automáticamente. Coste mensual: la luz.

La usamos como estaba pensada: una vez a la semana para planificar y luego cada día para cocinar. No es una app que tengas abierta constantemente, es una herramienta que aparece cuando la necesitas. Desde que la tenemos no hemos vuelto al papel.

Lo que ella quería: comer mejor, sin pensar en qué cocinar cada semana, con la compra resuelta y sin que la app les añadiera trabajo. Eso es exactamente lo que tenemos.

Una app que usamos cada semana. Esa es la mejor métrica que tengo.

---

Lo más interesante no ha sido la tecnología. Ha sido construir algo juntos donde uno entiende el problema y el otro cómo hacerlo real.Ella no solo diseñó una app. Diseñó una forma más inteligente y ligera de vivir nuestra semana. Yo solo me encargué de que esa idea no se quedara atrapada en un Artifact.

