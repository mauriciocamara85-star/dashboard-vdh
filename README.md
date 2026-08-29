# VDH / Dashboard comercial

Dashboard estático para Netlify. Consume las seis tablas planas del endpoint de Apps Script.

## Uso local

Abrir `index.html` en un navegador. Pegar la URL `/exec` del endpoint en la barra superior y presionar **Conectar**.

## Publicación

Subir la carpeta completa a Netlify como sitio estático (`index.html`, `styles.css`, `app.js`, `manifest.json`, `sw.js`, íconos, `assets/` y `equipo/`). No hace falta subir `.claude/` ni este `README.md`.

## Fuente

El endpoint debe devolver las tablas `LOCAL_DIARIO`, `VENDEDOR_DIARIO`, `VENDEDOR_SEMANAL`, `VENDEDOR_FOTOS`, `ECOM_DIARIO` y `ECOM_SEMANAL`.

### Opcional: comparación contra el semestre anterior

El gráfico "Real vs. objetivo" del Resumen general está preparado para dibujar una línea con la venta del semestre anterior apenas el endpoint incluya una tabla `LOCAL_DIARIO_ANTERIOR` (mismas columnas que `LOCAL_DIARIO`; como mínimo necesita `Fecha` y `Venta real`, con las fechas del semestre pasado). Mientras esa clave no exista en la respuesta del endpoint, o venga vacía, la línea no se dibuja — no hace falta tocar `app.js` cuando se agregue, el dashboard la toma sola.
