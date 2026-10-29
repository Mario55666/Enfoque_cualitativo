# Diseño Metodológico Cualitativo · Semana 3

Landing interactiva del curso de Investigación Cualitativa (Doctorado). Lleva del problema de investigación a una propuesta metodológica completa. En el camino construye la matriz de categorización, orienta el muestreo y el tamaño de la muestra, genera la guía de entrevista y la ficha de observación, y verifica el cumplimiento de los procedimientos. Cada sección cita las fuentes del curso en formato APA 7.

Versión del 28 de octubre de 2026.

---

## Contenido de la carpeta

| Archivo | Qué es |
|---|---|
| `Diseño Metodológico Cualitativo.html` | La landing: un solo archivo con estilos, figuras SVG y lógica en JavaScript (≈ 170 KB). |
| `diagramas/proceso-investigacion.html` | Diagrama A: ruta del diseño metodológico (archify). |
| `diagramas/procedimiento-matriz.html` | Diagrama B: construcción de la matriz de categorización (archify). |
| `diagramas/ciclo-muestreo.html` | Diagrama C: ciclo del muestreo hasta la saturación (archify). |
| `diagramas/*.workflow.json` | Especificaciones de los tres diagramas, para regenerarlos. |
| `README.md` | Este documento. |

> **Importante:** la carpeta `diagramas/` debe estar junto al HTML. Los diagramas A, B y C se cargan desde ahí; si se copia solo el HTML, sus marcos aparecen vacíos y el resto de la página funciona igual.

---

## Cómo abrirla

1. Abra `Diseño Metodológico Cualitativo.html` con doble clic en Chrome, Edge o Firefox.
2. Funciona sin conexión. Solo las tipografías (Google Fonts) requieren internet; sin ellas se usan las del sistema.

Para revisarla con un servidor local (útil si el navegador bloquea los marcos de archivos locales):

```bash
py -m http.server 8776 --directory "C:\Users\Mario\Dropbox\Doctorado\Investigacion Cualitativo\Semana 3"
```

Luego abra `http://localhost:8776/Dise%C3%B1o%20Metodol%C3%B3gico%20Cualitativo.html`.

---

## Recorrido por pasos

| Paso | Sección | Qué hace |
|---|---|---|
| 1 | Entrada | Título, ámbito, escenario, problema, pregunta, objetivos y marco teórico (`Categoría: sub1; sub2`). Incluye ayudas de redacción y dos ejemplos cargables. |
| 2 | Metodología | 11 selectores (paradigma, lógica, tipo, alcance, diseño, modalidad del caso, temporalidad, modalidad, análisis, software y justificación del tamaño) y 3 grupos de casillas (técnicas, rigor y ética). El botón «Sugerir opciones según el paso 1» propone una combinación coherente. |
| 3 | Matriz | Matriz de categorización automática (objetivo → categoría → subcategorías → técnica → instrumento → fuente), árbol categorial y plantilla de codificación de tres columnas (código, aserto y fragmento). |
| 4 | Muestreo | Probabilístico frente a dirigido, fases de la muestra inicial, árbol de decisión del tipo de muestra, criterios de representatividad, curva de saturación y cuadro de tamaños por tradición. |
| 5 | Recolección | Proceso iterativo, unidades de análisis, técnicas según su estructuración, guía de entrevista generada y ficha de observación. |
| 6 | Propuesta | Botón **«Construir propuesta metodológica»**: redacta el capítulo de método (apartados 3.1 a 3.11), muestra alertas de coherencia y permite copiarlo o descargarlo como Word (`.doc`). |
| 7 | Checklist | Cumplimiento de procedimientos con barra de avance. Los grupos A a F se verifican solos y el grupo G se marca a mano. |
| 8 | Exportar | Copia la matriz (tabulada, para Excel o Word) y el informe completo en texto plano, con la metodología y el checklist. |

---

## Figuras, diagramas y animaciones

**Figuras SVG** (se adaptan a modo claro y oscuro):

1. Árbol categorial generado desde el marco teórico.
2. Matriz de tres columnas con un ejemplo y la dirección inductiva.
3. Procedimiento de construcción en cinco pasos y niveles de agrupamiento.
4. Lógica de selección: probabilístico frente a dirigido.
5. Criterios de representatividad conceptual.
6. Curva de saturación ilustrativa, ligada al tamaño previsto.
7. Rangos de tamaño de muestra por tradición (clic en una fila para elegir el diseño).
8. Mapa de unidades de análisis (clic en un nodo para activarla).
9. Técnicas según su grado de estructuración previa.

**Diagramas archify** A, B y C, insertados en los pasos 2, 3 y 4. El botón «Live» del visor anima el recorrido, y cada diagrama trae dos o tres vistas guiadas por capítulos. El visor permite acercar, buscar y exportar en PNG, SVG o video.

**Animaciones CSS:**

- Ruta del proceso bajo la portada: un foco recorre los siete pasos y el paso 5 gira para indicar que recolección y análisis son simultáneos. Se detiene al pasar el cursor y cada paso es un enlace.
- Revelado de cada figura al entrar en pantalla, en el orden de lectura. En la figura 2 el orden va de derecha a izquierda, como la inducción.
- Movimiento continuo: pulso en el punto de saturación, flujo en las líneas del proceso iterativo y en las unidades activas, y un marcador que recorre la barra de técnicas.
- Con la opción del sistema «reducir movimiento», todo se muestra estático.

---

## Ayudas de redacción y validación

Cada campo del paso 1 y de la ficha de observación tiene:

- un **texto de ejemplo** con la estructura esperada;
- un desplegable **«Ayuda para redactar»**, con la fórmula, lo que conviene evitar y la cita que lo respalda;
- una **revisión en vivo**: ✓ en verde si cumple, • si conviene revisar y ! en naranja si es un problema.

Entre otras cosas, la revisión detecta:

- una pregunta de sí o no, o sin los signos ¿ ?;
- verbos de medición en los objetivos;
- que no coincida el número de objetivos con el de categorías;
- líneas del marco teórico sin dos puntos o con menos de dos subcategorías;
- términos cuantitativos como «variable» o «hipótesis»;
- un título de más de 25 palabras.

---

## Checklist de cumplimiento (paso 7)

- **A. Planteamiento**, **B. Diseño**, **C. Matriz**, **D. Muestreo**, **E. Recolección** y **F. Rigor, ética y propuesta**: 26 ítems que se verifican con los datos de la página. Cada uno queda como *Cumple*, *Revisar*, *Pendiente* o *No aplica*, con su detalle y un enlace al paso.
- **G. Trabajo de campo y análisis**: 15 ítems manuales, desde la validación por expertos y la prueba piloto hasta la devolución de resultados.
- «Copiar checklist» lo copia como texto; también se incluye en el informe del paso 8.

---

## Ejemplos incluidos

- **Ejemplo: tutoría.** Estudio ficticio sobre la interacción tutorial en una universidad privada de Lima.
- **Ejemplo: tesis Lozano (2025).** Componente cualitativo de Lozano Martelo (2025), *Evaluación del impacto del modelo pedagógico diseñado de competencias socioemocionales para la convivencia escolar en instituciones educativas públicas de Fundación, Magdalena* (tesis doctoral, UMECIT).
  - **Datos literales:** título, pregunta, objetivo general y los seis objetivos específicos (pp. 39–40).
  - **Problema:** resumido a partir de la descripción de la problemática (pp. 38–39).
  - **Categorías:** tomadas de la operacionalización (tablas 3 a 5, pp. 122–123), de las bases conceptuales (apartado 2.2) y del capítulo VI.
  - **Decisiones metodológicas (pp. 117–137):**
    - paradigma pragmático;
    - diseño fenomenológico hermenéutico dentro de un diseño mixto convergente con predominio cualitativo;
    - investigación evaluativa;
    - muestreo intencional por cuotas;
    - 32 informantes: 8 docentes, 4 coordinadores de convivencia y 4 grupos focales de 5 estudiantes;
    - entrevista semiestructurada y grupo focal;
    - codificación, categorización y triangulación en ATLAS.ti;
    - consentimiento y asentimiento, anonimato con números y resguardo digital de los datos.
  - **Fuera del ejemplo:** el componente cuantitativo (encuesta con cuestionario de 30 ítems, alfa de Cronbach y SPSS), porque la página trabaja solo con el enfoque cualitativo.
  - **Alertas esperables:** al cargarlo, la página marca la pregunta («¿Cuál ha sido el impacto…?»), el verbo «Determinar» de un objetivo, los 32 informantes frente al rango fenomenológico (3–10) y que solo hay dos criterios de rigor. Son rasgos de un estudio evaluativo y mixto, útiles para discutir en clase.
- **Ejemplo: tesis Toscano (2024).** Toscano Achote (2024), *Modelo pedagógico de enseñanza enfocada en el aprendizaje basado en proyectos para la formación de competencias tecnológicas en escenarios de educación superior en Quito, Ecuador* (tesis doctoral, UMECIT).
  - **Es una tesis cuantitativa:** paradigma positivista, método hipotético-deductivo con hipótesis, diseño no experimental, transversal y descriptivo, cuestionario tipo Likert de 36 ítems aplicado a 31 docentes y 800 estudiantes, y análisis en SPSS. La página no maneja ese enfoque, así que se carga como **ejercicio de reconversión**:
    - el paso 1 reproduce su planteamiento: título, pregunta y objetivos literales (pp. 5–6) y el problema según su síntesis (p. 5);
    - las categorías salen de sus variables, dimensiones e indicadores (tabla 3, p. 71), de la tabla 12 de conclusiones y del capítulo VI;
    - el paso 2 muestra la **sugerencia cualitativa de la página** para ese problema (estudio de caso múltiple, lógica abductiva, entrevista semiestructurada y análisis documental), con un aviso que aclara que esa no es la metodología de la tesis;
    - el tamaño previsto queda vacío para que se defina en el ejercicio.

---

## Fuentes y citas

- Las citas de cada sección son **paráfrasis** de los PDF de la carpeta del curso, con la página impresa verificada en cada documento. Son paráfrasis y no citas textuales para no reproducir fragmentos con derechos de autor.
- **Flick (2026)** se cita por sección («glosario» o «prefacio»), porque su edición digital de Sage no tiene paginación impresa. **Bunge (s. f.)** se cita por sección y párrafo.
- **Van sin página** las obras que no están en la carpeta: Creswell y Creswell, Creswell y Guetterman, Creswell y Poth, Hernández-Sampieri y Mendoza, Hernández-Sampieri et al., Morse, Guest et al., Hennink y Kaiser, Malterud et al., Braun y Clarke, Lincoln y Guba, Stake, Yin, Patton y Tracy. Hay que tomar la página del original.
- La lista completa de referencias APA 7 se genera al pie de la página. La propuesta incluye solo las referencias que cita.

### Cuadro de tamaños de muestra (paso 4)

| Diseño | Mín. | Máx. | Fuentes |
|---|---|---|---|
| Fenomenológico | 3 | 10 | Creswell y Creswell (2023) y Creswell y Poth (2024): 3–10, según Dukes (1984); Creswell y Poth (2024): 5–25, según Polkinghorne (1989); Hernández-Sampieri y Mendoza (2018): alrededor de 10; Morse (1994): al menos 6 |
| Teoría fundamentada | 20 | 30 | Creswell y Creswell (2023), Creswell y Poth (2024) y Hernández-Sampieri y Mendoza (2018): 20–30; hasta 60 en la tabla comparativa de Creswell y Poth (2024); Morse (1994): 30–50 |
| Etnográfico | 30 | 50 | Grupo cultural o social estudiado a lo largo del tiempo (Creswell y Guetterman, 2025; Creswell y Poth, 2024); Morse (1994) y Hernández-Sampieri y Mendoza (2018): 30–50 |
| Narrativo | 1 | 2 | Creswell y Creswell (2023) y Creswell y Poth (2024) |
| Estudio de caso | 1 | 5 | Creswell y Creswell (2023) y Creswell y Poth (2024): alrededor de 4–5 casos en estudios múltiples |
| Entrevistas (población homogénea) | 9 | 17 | Hennink y Kaiser (2022); Guest et al. (2006): 12; Guest et al. (2020): de 6 a 7 con un umbral de 5 % de información nueva |
| Grupos de enfoque (por sesión) | 6 | 10 | Hernández-Sampieri y Mendoza (2018): 6–10 y 3–5 en temas complejos; Barraza (2023, p. 56): 6–12 según Monje (2011) y 4–6 según Krueger (1988); Hennink y Kaiser (2022): 4–8 grupos |
| Investigación-acción | — | — | Sin rango fijo |

**Notas sobre las ediciones:**

- Los rangos coinciden con los de las ediciones anteriores: Creswell (2013) y Hernández-Sampieri et al. (2014).
- El año de Creswell y Poth figura como 2024, que es la fecha de publicación de Sage. El documento del CEA del curso lo cita como 2025.
- No se usaron Johnson y Christensen (2014), porque no se encontró qué rangos proponen, ni Barraza (2021), porque es un manual de investigación cuantitativa.

---

## Datos guardados

La página guarda lo escrito en el navegador (`localStorage`), así que cada equipo y cada navegador tienen su propia copia:

- `dmc-v1`: campos, tamaño previsto, diseño y opciones metodológicas;
- `dmc-ck`: ítems manuales del checklist.

Para empezar de cero use «Vaciar campos» o borre los datos del sitio desde el navegador.

---

## Regenerar los diagramas archify

Desde la carpeta de la skill (`C:\Users\Mario\.claude\skills\archify`):

```bash
node bin/archify.mjs validate workflow "C:\Users\Mario\Dropbox\Doctorado\Investigacion Cualitativo\Semana 3\diagramas\proceso-investigacion.workflow.json" --quality showcase --json
```

```bash
node bin/archify.mjs deliver workflow "C:\Users\Mario\Dropbox\Doctorado\Investigacion Cualitativo\Semana 3\diagramas\proceso-investigacion.workflow.json" "C:\Users\Mario\Dropbox\Doctorado\Investigacion Cualitativo\Semana 3\diagramas\proceso-investigacion.html" --quality showcase --json
```

Repita con `procedimiento-matriz` y `ciclo-muestreo`. Los tres pasan las 9 comprobaciones del perfil *showcase* sin errores ni advertencias. La interfaz del visor (Light, Live, Export) está en inglés porque archify no ofrece español; el contenido está en español.

---

## Dónde editar el contenido

Todo está en el `<script>` final del HTML:

| Constante o función | Contenido |
|---|---|
| `SIZES` | Cuadro de tamaños de muestra (rangos, rango ampliado y fuentes). |
| `TREE`, `VOL` | Árbol de decisión del tipo de muestra. |
| `UNITS` | Unidades de análisis. |
| `MET`, `MCK` | Opciones metodológicas y su fundamentación. |
| `sugerir()`, `alertas()` | Reglas de sugerencia y de coherencia. |
| `propuesta()` | Redacción del capítulo 3.1 a 3.11. |
| `REFS` | Referencias APA 7; la expresión `m` detecta la cita en el texto. |
| `HELP`, `OBSH` | Ayudas y validación de los campos. |
| `CK_AUTO`, `CK_MAN` | Ítems del checklist. |
| `EJ`, `OBS` | Datos del ejemplo de tutoría. |
| `TESIS`, `TESIS_MET`, `TESIS_UNI` | Datos del ejemplo Lozano (campos, opciones metodológicas y unidades de análisis). |
| `TOSCANO`, `UNI_BASE`, `cargarToscano()` | Datos del ejemplo Toscano; sus opciones del paso 2 se generan con `sugerir()`. |

---

## Limitaciones conocidas

- Los diagramas A, B y C dependen de la carpeta `diagramas/`.
- La descarga «Word (.doc)» es HTML que Word abre directamente. Para entregar el documento, guárdelo como `.docx` desde Word.
- La curva de saturación es un modelo ilustrativo calibrado con Guest et al. (2006); no reemplaza el seguimiento de la saturación en el propio estudio.
- Las sugerencias y alertas usan reglas de palabras clave. Orientan la decisión, pero no sustituyen el juicio del investigador ni del asesor.

---

## Créditos

Diseñado por el **Mg. Mario Rafael Quiroz Martínez** · d3magindesign · 2026.
