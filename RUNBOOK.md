# Guía rápida — ¿Quién Quiere Ser Millonario? Bíblico

## Acceso
- **Sitio en producción**: https://juego-vigilia.vercel.app
- **Panel de administración**: https://juego-vigilia.vercel.app/admin/login
- **Contraseña de administrador**: `GraciaVida8751!` (puedes cambiarla en Vercel → Project Settings → Environment Variables → `ADMIN_PASSWORD`, y volver a desplegar)

## Antes del evento
1. Entra al panel y ve a **Preguntas** para revisar/editar/agregar las 30 preguntas ya cargadas (Reina Valera 1960). Puedes agregar más desde "Nueva pregunta".
2. Revisa **Escalera de premios** si quieres cambiar las etiquetas o los puntos de los 15 niveles.
3. Abre el sitio en el navegador de la laptop que estará conectada al proyector/TV, para confirmar que se vea bien en esa pantalla antes de que lleguen los jóvenes.
4. La base de datos (Neon) puede "dormirse" tras un rato sin uso — si la primera carga del día tarda unos segundos, es normal, solo espera.

## El día del evento
1. Desde el panel, ve a **Nueva partida**.
2. Elige el modo: **2 equipos** o **1 vs 1**, pon los nombres, y (opcional) filtra por categorías o rango de dificultad.
3. Presiona "Barajar preguntas e iniciar" — esto te lleva directo a la pantalla de juego, lista para proyectar.
4. El primer participante/equipo juega hasta ganar, fallar o retirarse; luego automáticamente pasa el turno al segundo. Al terminar ambos, se muestra la pantalla de resultados.
5. Comodines disponibles una vez por equipo/jugador: **50/50**, **Ayuda de un líder**, **Consultar con el equipo** (temporizador de 30s).

## Después / partidas pasadas
- Panel → Panel principal (dashboard) muestra las partidas recientes con enlaces para revisarlas o reabrir la pantalla de juego.

## Detalles técnicos (por si necesitas ayuda de alguien con conocimientos técnicos)
- Next.js + Prisma + Postgres (Neon), desplegado en Vercel bajo tu cuenta.
- Variables de entorno configuradas en Vercel: `DATABASE_URL` (y variantes de Neon), `ADMIN_PASSWORD`, `SESSION_SECRET`.
- Para actualizar el sitio con cambios de código: `vercel deploy --prod` desde la carpeta del proyecto (requiere Node.js y la CLI de Vercel).
- Migraciones de base de datos se aplican automáticamente en cada build (`prisma migrate deploy`).
