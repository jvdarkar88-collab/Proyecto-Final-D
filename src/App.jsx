import { useState } from "react";
import { motion } from "framer-motion";

import { CLASE, OBJETIVOS, ACTIVIDADES } from "./data/clase";
import HeaderClase from "./components/HeaderClase";
import ObjetivoCard from "./components/ObjetivoCard";
import BalanzaInteractiva from "./components/BalanzaInteractiva";
import ActividadItem from "./components/ActividadItem";
import EvaluacionForm from "./components/EvaluacionForm";
import ResultadosLista from "./components/ResultadosLista";

export default function App() {
  // puntos por actividad: { 1: 1, 2: 0.5, ... }
  const [puntos, setPuntos] = useState({});
  // al cambiar este número, ResultadosLista vuelve a leer NocoDB
  const [refreshKey, setRefreshKey] = useState(0);

  const registrarActividad = (numero, valor) =>
    setPuntos((previo) => ({ ...previo, [numero]: valor }));

  const suma = Object.values(puntos).reduce((a, b) => a + b, 0);
  const porcentaje = Math.round((suma / ACTIVIDADES.length) * 100);
  const resueltas = Object.keys(puntos).length;

  return (
    <>
      <HeaderClase {...CLASE} />

      <main className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-10">
        {/* Objetivos */}
        <section id="objetivos" aria-labelledby="titulo-objetivos">
          <h2 id="titulo-objetivos" className="mb-4 text-2xl font-extrabold">
            🎯 ¿Qué vas a aprender?
          </h2>
          <div className="flex flex-col gap-4 md:flex-row">
            {OBJETIVOS.map((o, i) => (
              <ObjetivoCard key={o.texto} indice={i} {...o} />
            ))}
          </div>
        </section>

        {/* Exploración con la analogía de la balanza */}
        <section id="explora" aria-labelledby="titulo-explora">
          <h2 id="titulo-explora" className="mb-2 text-2xl font-extrabold">
            🔬 Explora: la balanza
          </h2>
          <p className="mb-4 text-slate-700">
            Una ecuación es como una balanza en equilibrio. Prueba restar el mismo número
            en ambos lados y luego solo en uno. ¿Qué pasa?
          </p>
          <BalanzaInteractiva />
        </section>

        {/* Actividades */}
        <section id="actividades" aria-labelledby="titulo-actividades">
          <h2 id="titulo-actividades" className="mb-4 text-2xl font-extrabold">
            ✏️ Ponte a prueba
          </h2>

          <div className="mb-4" aria-label="Progreso">
            <p className="mb-1 text-sm font-semibold">
              Resueltas: {resueltas} de {ACTIVIDADES.length}
            </p>
            <div className="h-3 overflow-hidden rounded-full bg-indigo-100">
              <motion.div
                className="h-full bg-emerald-500"
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
        </section>

        {/* Evaluación y persistencia */}
        <section id="evaluacion" aria-labelledby="titulo-evaluacion">
          <h2 id="titulo-evaluacion" className="mb-4 text-2xl font-extrabold">
            📝 Guarda tu resultado
          </h2>
          <div className="flex flex-col gap-6">
            <EvaluacionForm
              puntaje={porcentaje}
              onGuardado={() => setRefreshKey((k) => k + 1)}
            />
            <ResultadosLista refreshKey={refreshKey} />
          </div>
        </section>
      </main>

      <footer className="bg-indigo-900 py-6 text-center text-sm text-indigo-200">
        <p>Plan de Clase Digital Interactivo · Matemáticas · Hecho con React, Framer Motion y NocoDB</p>
      </footer>
    </>
  );
}