# VDH / Dashboard comercial

Dashboard estático. Consume las seis tablas planas del endpoint de Apps Script.

El ranking del equipo vive aparte, en su propio repo: [ranking-vdh](https://github.com/mauriciocamara85-star/ranking-vdh)
(publicado en https://mauriciocamara85-star.github.io/ranking-vdh/) — antes era la carpeta
`/equipo/` de este repo, se separó para que cada PWA tenga su propio `scope` y se pueda instalar
en el celular sin que una tape a la otra.

## Uso local

Abrir `index.html` en un navegador. Pegar la URL `/exec` del endpoint en la barra superior y presionar **Conectar**.

## Publicación

GitHub Pages, rama `main`, carpeta raíz. Publicado en https://mauriciocamara85-star.github.io/dashboard-vdh/.
Cada `git push` a `main` republica el sitio solo, en 1-2 minutos.

## Fuente

El endpoint debe devolver las tablas `LOCAL_DIARIO`, `VENDEDOR_DIARIO`, `VENDEDOR_SEMANAL`, `VENDEDOR_FOTOS`, `ECOM_DIARIO` y `ECOM_SEMANAL`.

### Opcional: comparación contra el semestre anterior

El gráfico "Real vs. objetivo" del Resumen general está preparado para dibujar una línea con la venta del semestre anterior apenas el endpoint incluya una tabla `LOCAL_DIARIO_ANTERIOR` (mismas columnas que `LOCAL_DIARIO`; como mínimo necesita `Fecha` y `Venta real`, con las fechas del semestre pasado). Mientras esa clave no exista en la respuesta del endpoint, o venga vacía, la línea no se dibuja — no hace falta tocar `app.js` cuando se agregue, el dashboard la toma sola.
