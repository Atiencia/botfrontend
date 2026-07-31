# NOTAS PROYECTO 

# para portafolio 

Video demo (2-3 min) — esto es no negociable. Grabate usando el bot: mandale un mensaje de Instagram real (a una cuenta de test/developer de Meta, que sí podés usar sin app review), mostrá cómo responde con RAG, mostrá el dashboard, el chunking en acción. Subilo a YouTube/Loom y linkealo desde el README y el portafolio.

README con arquitectura visual — un diagrama (aunque sea simple, hecho en excalidraw) del flujo: Instagram → Webhook → Express → Groq/RAG → respuesta → chunking → Meta. Un diagrama vale más que tres párrafos para alguien que revisa 50 portafolios.



# para implementar 

Datos/métricas de mentira pero verosímiles en el demo — mostrar el dashboard con conversaciones simuladas, gráficas de mensajes respondidos, etc. Le da cuerpo aunque sea un modo "demo" sin conexión real a Meta.

Un modo demo público sin necesidad de Instagram real — esto es clave: agregá un "chat simulator" en el frontend donde cualquiera (reclutador incluido) pueda escribir mensajes como si fuera un cliente de Instagram y ver al bot responder usando tu RAG real. Así sí pueden probar el producto sin que dependa de la app review de Meta. Esto resuelve tu problema de "no puedo hacerlo público" de la forma más elegante posible.

Tests (aunque sean unitarios básicos del chunking, del provider de IA, o de las políticas RLS). Ahora mismo no lo mencionás y es lo primero que preguntan en una entrevista técnica seria.

Embeddings reales para el RAG — decís "RAG básico" con inyección directa de la knowledge base en el prompt. Si tenés tiempo, pasar a embeddings + búsqueda semántica (pgvector en Supabase, que es gratis y nativo) te permite decir "RAG real" en vez de "prompt stuffing", y es una skill muy demandada ahora mismo.

Observabilidad: mencionás Winston para logs, pero ¿tenés algún dashboard de métricas (latencia del LLM, tasa de error, mensajes/día)? Aunque sea con algo simple, suma mucho a "esto está pensado para producción".
"cuántos mensajes respondió el bot hoy", "tiempo de respuesta promedio", "tasa de mensajes que no supo responder". Para un SaaS esto es lo que un dueño de negocio realmente quiere ver primero. Aunque sea un gráfico simple con recharts, sube mucho el valor percibido.

CI/CD básico: un GitHub Actions que corra lint/tests en cada push. Cuesta 20 minutos y es una señal fuerte de profesionalismo.

Rate limiting / manejo de costos de IA: un negocio real necesita controlar cuánto gasta en tokens. Si tenés algo de esto (o lo agregás), mencionalo — muestra pensamiento de producto, no solo de código.

Manejo de duplicados/reintentos de Meta.
Meta reenvía el webhook si no le respondés 200 rápido, o si hay fallas de red. Si no tenés una forma de detectar "este messageId ya lo procesé", el bot puede llegar a responder dos veces al mismo mensaje. Esto es el bug clásico de integraciones con webhooks y es una pregunta muy probable en entrevista. Si ya lo tenés resuelto, genial — pero asegurate de poder explicarlo con seguridad. Si no lo tenés, es la mejora #1 a implementar.

Handoff a humano.
En el visor de conversaciones no veo botón de "tomar esta conversación" o "pausar el bot para este cliente". Es una feature típica de estos productos (cuando el bot no sabe responder, un humano interviene) y es fácil de agregar con lo que ya tenés (solo un flag is_bot_active por conversación)

Búsqueda/paginación en Conversaciones.
Si el negocio tiene 500 chats, necesita buscar por cliente o filtrar por fecha. Ahora mismo parece una lista simple.

