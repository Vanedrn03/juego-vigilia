# Guía rápida — Juegos para la vigilia juvenil

## Acceso
- **Sitio en producción**: https://juego-vigilia.vercel.app
- **Panel de administración**: https://juego-vigilia.vercel.app/admin/login
- **Contraseña de administrador**: `GraciaVida8751!` (puedes cambiarla en Vercel → Project Settings → Environment Variables → `ADMIN_PASSWORD`, y volver a desplegar)
- Al iniciar sesión llegas al **panel principal**, que ahora muestra los dos juegos disponibles, cada uno con sus propios accesos.

## Antes del evento
1. Entra al panel — verás una tarjeta para cada juego.
2. En **¿Quién Quiere Ser Bendecido?**: revisa/edita/agrega preguntas en "Preguntas" (30 ya cargadas, RV60) y ajusta la "Escalera de premios" si quieres cambiar etiquetas o puntos.
3. En **100 Cristianos Dijeron**: revisa/edita/agrega preguntas de encuesta en "Preguntas" (12 ya cargadas, cada una con 5-8 respuestas ranqueadas y sus puntos).
4. Abre el sitio en el navegador de la laptop que estará conectada al proyector/TV, para confirmar que se vea bien antes de que lleguen los jóvenes.
5. La base de datos (Neon) puede "dormirse" tras un rato sin uso — si la primera carga del día tarda unos segundos, es normal, solo espera.

## El día del evento — ¿Quién Quiere Ser Bendecido?
1. Desde el panel, ve a **Nueva partida** (en la tarjeta de este juego).
2. Elige el modo: **2 equipos** o **1 vs 1**, pon los nombres, y (opcional) filtra por categorías o rango de dificultad.
3. Presiona "Barajar preguntas e iniciar" — te lleva directo a la pantalla de juego, lista para proyectar.
4. El primer participante/equipo juega hasta ganar, fallar o retirarse; luego pasa el turno al segundo automáticamente. Al terminar ambos, se muestra la pantalla de resultados.
5. Comodines (una vez por equipo/jugador): **50/50**, **Ayuda de un líder**, **Consultar con el equipo** (temporizador de 30s).

## El día del evento — 100 Cristianos Dijeron
1. Desde el panel, ve a **Nueva partida** (en la tarjeta de este juego).
2. Pon el nombre de los dos equipos y elige cuántas rondas (preguntas) se van a jugar.
3. Presiona "Barajar preguntas e iniciar".
4. **Duelo**: lee la pregunta en voz alta a un jugador de cada equipo; según quién respondió primero o mejor, haz clic en el botón del equipo que gana el control del tablero.
5. **Control**: ese equipo sigue adivinando respuestas de la lista. Cuando digan una correcta, haz clic en esa casilla para revelarla (suma puntos al bote). Si fallan, haz clic en "Marcar strike". A los 3 strikes sin completar el tablero, pasa a **Robo**.
6. **Robo**: el otro equipo tiene un solo intento. Si aciertan, haz clic en la respuesta (se roban el bote); si fallan, marca "Strike" y el bote se queda con el equipo original.
7. El bote de la ronda se suma al marcador del equipo ganador; se avanza automáticamente a la siguiente ronda. Al terminar todas, se muestra el marcador final.

## Después / partidas pasadas
- El panel principal muestra las partidas recientes de ambos juegos, con enlaces para revisarlas o reabrir la pantalla de juego.

## Detalles técnicos (por si necesitas ayuda de alguien con conocimientos técnicos)
- Next.js + Prisma + Postgres (Neon), desplegado en Vercel bajo tu cuenta.
- Variables de entorno configuradas en Vercel: `DATABASE_URL` (y variantes de Neon), `ADMIN_PASSWORD`, `SESSION_SECRET`.
- Para actualizar el sitio con cambios de código: `vercel deploy --prod` desde la carpeta del proyecto (requiere Node.js y la CLI de Vercel).
- Migraciones de base de datos se aplican automáticamente en cada build (`prisma migrate deploy`).
