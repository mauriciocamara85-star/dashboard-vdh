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

### Consolidador (Apps Script)

`consolidador.gs` es una copia del script que vive en la planilla CONSOLIDADORA y arma esas seis
tablas. Está acá solo para tenerlo versionado y poder revisar los cambios: **el que corre de verdad
es el que está pegado en el editor de Apps Script de la planilla**, así que tocar este archivo no
cambia nada hasta copiarlo y pegarlo allá.

### Objetivos de ticket y conversión de E-commerce

La tabla **Real vs. objetivo** de E-commerce necesita dos constantes que viven en el bloque
CONFIGURACIÓN de la planilla de E-commerce y que el consolidador manda en `ECOM_SEMANAL` desde la v11:

| Columna | Valor de la planilla | Formato |
|---|---|---|
| `Ticket obj` | Ticket Promedio ($80.000) | número |
| `Conversión obj` | Conversión obj (1%) | **fracción**: `0.01`, no `1` |

Con esas dos, el resto se deriva solo del objetivo mensual (la suma de `Objetivo` de `ECOM_DIARIO`):
Q Ventas objetivo = objetivo mensual / ticket objetivo, Visitas objetivo = Q Ventas objetivo /
conversión objetivo, y Tráfico restante = (objetivo mensual − venta acumulada) / ticket objetivo /
conversión objetivo. El dashboard las busca en `ECOM_SEMANAL` y en `ECOM_DIARIO`; si no están, esas
filas muestran `—` en la columna Objetivo en vez de inventar un número.

Ojo con los nombres: las columnas `Facturación Meta`, `Ventas Meta`, `Visitas Meta` y `Carritos Meta`
de `ECOM_SEMANAL` son **Meta Ads** (lo atribuido a la pauta), no "meta" de objetivo. Confundir las dos
cosas fue lo que hacía que el ROAS del dashboard diera 3,44 en vez de 2,48 y que la columna Objetivo
mostrara lo que trajo la pauta en lugar de la meta del mes.

### Opcional: comparación contra el semestre anterior

El gráfico "Real vs. objetivo" del Resumen general está preparado para dibujar una línea con la venta del semestre anterior apenas el endpoint incluya una tabla `LOCAL_DIARIO_ANTERIOR` (mismas columnas que `LOCAL_DIARIO`; como mínimo necesita `Fecha` y `Venta real`, con las fechas del semestre pasado). Mientras esa clave no exista en la respuesta del endpoint, o venga vacía, la línea no se dibuja — no hace falta tocar `app.js` cuando se agregue, el dashboard la toma sola.
