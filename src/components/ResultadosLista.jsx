import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { obtenerResultados, configuracionLista } from "../services/nocodb";

export default function ResultadosLista({ refreshKey }) {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!configuracionLista) {
      setError("Falta configurar las variables de entorno de NocoDB (.env).");
      return;
    }

    let cancelado = false;
    setCargando(true);
    setError(null);

    obtenerResultados(10)
      .then((lista) => {
        if (!cancelado) setResultados(lista);
      })
      .catch((e) => {
        if (!cancelado) setError(e.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [refreshKey]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-bold text-indigo-700">Últimos resultados del grupo</h3>

      {cargando && <p className="mt-3 text-slate-500">Cargando registros…</p>}
      {error && <p className="mt-3 font-semibold text-red-600">{error}</p>}
      {!cargando && !error && resultados.length === 0 && (
        <p className="mt-3 text-slate-500">Todavía no hay resultados. ¡Sé el primero!</p>
      )}

      <ul className="mt-3 flex flex-col gap-3">
        <AnimatePresence>
          {resultados.map((r) => (
            <motion.li
              key={r.Id}
              layout
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-indigo-50 p-3"
            >
              <div>
                <p className="font-bold text-indigo-900">{r.nombre}</p>
                <p className="text-sm text-slate-600">{r.grupo}</p>
                {r.comentario && (
                  <p className="mt-1 text-sm italic text-slate-700">“{r.comentario}”</p>
                )}
              </div>
              <span className="rounded-full bg-violet-600 px-3 py-1 text-sm font-bold text-white">
                {r.puntaje}%
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}