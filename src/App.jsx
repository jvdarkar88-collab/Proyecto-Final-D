import { useState } from "react";
import { motion } from "framer-motion";

import { CLASE, SECCIONES, OBJETIVOS, ACTIVIDADES } from "./data/clase";
import HeaderClase from "./components/HeaderClase";
import ObjetivoCard from "./components/ObjetivoCard";
import BalanzaInteractiva from "./components/BalanzaInteractiva";
import ActividadItem from "./components/ActividadItem";
import EvaluacionForm from "./components/EvaluacionForm";
import ResultadosLista from "./components/ResultadosLista";

export default function App() {
  // sección visible (solo se muestra una a la vez)
  const [seccion, setSeccion] = useState("objetivos");
  // puntos por actividad: { 1: 1, 2: 0.5, ... }
  const [puntos, setPuntos] = useState({});
  // al cambiar este número, ResultadosLista vuelve a leer NocoDB
  const [refreshKey, setRefreshKey] = useState(0);

  const registrarActividad = (numero, valor) =>
    setPuntos((previo) => ({ ...previo, [numero]: valor }));

  const suma = Object.values(puntos).reduce((a, b) => a + b, 0);
  const porcentaje = Math.round((suma / ACTIVIDADES.length) * 100);
  const resueltas = Object.keys(puntos).length;

  const ir = (id) => {
    setSeccion(id);
    // Si el estudiante estaba más abajo, sube al inicio del contenido
    requestAnimationFrame(() => {
      const main = document.getElementById("contenido");
      if (main && window.scrollY > main.offsetTop) {
        window.scrollTo({ top: main.offsetTop - 8, behavior: "smooth" });
      }
    });
  };

  const indice = SECCIONES.findIndex((s) => s.id === seccion);

  // Las secciones siguen montadas (solo ocultas) para no perder las respuestas
  const panel = (id) => ({ hidden: seccion !== id, className: "panel-in" });

  return (
    <>
      <HeaderClase
        {...CLASE}
        secciones={SECCIONES}
        seccionActiva={seccion}
        onCambiar={ir}
      />

      <main id="contenido" className="mx-auto max-w-4xl px-4 py-10">
        {/* Objetivos */}
        <section {...panel("objetivos")} aria-labelledby="titulo-objetivos">
          <h2 id="titulo-objetivos" className="mb-4 text-2xl font-extrabold">
            <span className="ecuacion mr-2 text-teal-700">π</span>¿Qué vas a aprender?
          </h2>
          <div className="flex flex-col gap-4 md:flex-row">
            {OBJETIVOS.map((o, i) => (
              <ObjetivoCard key={o.texto} indice={i} {...o} />
            ))}
          </div>
          <PieSeccion indice={indice} onIr={ir} />
        </section>

        {/* Exploración con la analogía de la balanza */}
        <section {...panel("explora")} aria-labelledby="titulo-explora">
          <h2 id="titulo-explora" className="mb-2 text-2xl font-extrabold">
            <span className="ecuacion mr-2 text-teal-700">x</span>Explora: la balanza
          </h2>
          <p className="mb-4 text-slate-700">
            Una ecuación es como una balanza en equilibrio. La caja misteriosa es la incógnita
            x. Suma o resta el mismo número en ambos lados para descubrir cuánto pesa. ¿Qué
            pasa si lo haces solo en un lado?
          </p>
          <BalanzaInteractiva />
          <PieSeccion indice={indice} onIr={ir} />
        </section>

        {/* Actividades */}
        <section {...panel("actividades")} aria-labelledby="titulo-actividades">
          <h2 id="titulo-actividades" className="mb-4 text-2xl font-extrabold">
            <span className="ecuacion mr-2 text-teal-700">√</span>Ponte a prueba
          </h2>

          <div className="mb-4" aria-label="Progreso">
            <p className="mb-1 text-sm font-semibold">
              Resueltas: {resueltas} de {ACTIVIDADES.length}
            </p>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-full bg-teal-600"
                animate={{ width: `${(resueltas / ACTIVIDADES.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 80 }}
              />
            </div>
          </div>

          <ul className="flex flex-col gap-4 p-0">
            {ACTIVIDADES.map((a) => (
              <ActividadItem key={a.numero} onResuelta={registrarActividad} {...a} />
            ))}
          </ul>
          <PieSeccion indice={indice} onIr={ir} />
        </section>

        {/* Evaluación y persistencia */}
        <section {...panel("evaluacion")} aria-labelledby="titulo-evaluacion">
          <h2 id="titulo-evaluacion" className="mb-4 text-2xl font-extrabold">
            <span className="ecuacion mr-2 text-teal-700">✓</span>Guarda tu resultado
          </h2>
          <div className="flex flex-col gap-6">
            <EvaluacionForm
              puntaje={porcentaje}
              onGuardado={() => setRefreshKey((k) => k + 1)}
            />
            <ResultadosLista refreshKey={refreshKey} />
          </div>
          <PieSeccion indice={indice} onIr={ir} />
        </section>
      </main>

      <footer className="bg-slate-900 py-6 text-center text-sm text-slate-300">
        <p>Plan de Clase Digital Interactivo · Matemáticas · Hecho con React, Framer Motion y NocoDB</p>
      </footer>
    </>
  );
}

// Botones Anterior / Siguiente al final de cada sección
function PieSeccion({ indice, onIr }) {
  const anterior = SECCIONES[indice - 1];
  const siguiente = SECCIONES[indice + 1];
  return (
    <div className="mt-8 flex justify-between gap-3">
      {anterior ? (
        <button
          type="button"
          onClick={() => onIr(anterior.id)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
        >
          ← {anterior.etiqueta}
        </button>
      ) : (
        <span />
      )}
      {siguiente ? (
        <button
          type="button"
          onClick={() => onIr(siguiente.id)}
          className="rounded-xl bg-teal-700 px-4 py-2 font-semibold text-white shadow hover:bg-teal-800"
        >
          {siguiente.etiqueta} →
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}