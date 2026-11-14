import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ActividadItem({
  numero,
  enunciado,
  ecuacion,
  respuesta,
  pista,
  onResuelta,
}) {
  const [valor, setValor] = useState("");
  const [estado, setEstado] = useState("pendiente"); // pendiente | incorrecto | correcto
  const [intentos, setIntentos] = useState(0);
  const [verPista, setVerPista] = useState(false);

  const comprobar = (e) => {
    e.preventDefault();
    if (estado === "correcto" || valor.trim() === "") return;

    const totalIntentos = intentos + 1;
    setIntentos(totalIntentos);

    if (Number(valor) === respuesta) {
      setEstado("correcto");
      // 1 punto si acierta a la primera y sin pista; 0.5 si necesitó ayuda
      const puntos = totalIntentos === 1 && !verPista ? 1 : 0.5;
      onResuelta(numero, puntos);
    } else {
      setEstado("incorrecto");
    }
  };

  const borde =
    estado === "correcto"
      ? "border-emerald-500"
      : estado === "incorrecto"
      ? "border-rose-400"
      : "border-slate-200";

  return (
    <motion.li
      className={`list-none rounded-2xl border-2 bg-white p-5 shadow-sm ${borde}`}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xs font-bold uppercase tracking-widest text-teal-700">
        Actividad {numero}
      </h3>
      <p className="mt-1 text-slate-700">{enunciado}</p>
      <p className="ecuacion my-3 text-center text-4xl font-bold text-slate-900">{ecuacion}</p>

      <form onSubmit={comprobar} className="flex flex-wrap items-center justify-center gap-3">
        <label className="ecuacion flex items-center gap-2 text-xl font-bold">
          x =
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            disabled={estado === "correcto"}
            className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-center text-lg not-italic focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
          />
        </label>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          disabled={estado === "correcto"}
          className="rounded-xl bg-teal-700 px-4 py-2 font-semibold text-white shadow hover:bg-teal-800 disabled:opacity-50"
        >
          Comprobar
        </motion.button>
        <button
          type="button"
          onClick={() => setVerPista(true)}
          className="text-sm font-semibold text-teal-700 underline"
        >
          Ver pista
        </button>
      </form>

      <AnimatePresence mode="wait">
        {verPista && estado !== "correcto" && (
          <motion.p
            key="pista"
            className="mt-3 overflow-hidden rounded-lg bg-amber-50 p-3 text-sm text-amber-900"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            💡 {pista}
          </motion.p>
        )}
      </AnimatePresence>

      {estado === "correcto" && (
        <motion.p
          className="mt-3 text-center font-bold text-emerald-600"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ duration: 0.5 }}
          role="status"
        >
          🎉 ¡Correcto! x = {respuesta}
        </motion.p>
      )}

      {estado === "incorrecto" && (
        <motion.p
          key={intentos}
          className="mt-3 text-center font-semibold text-rose-600"
          initial={{ x: -12 }}
          animate={{ x: [-12, 12, -8, 8, 0] }}
          transition={{ duration: 0.4 }}
          role="status"
        >
          Todavía no. Sustituye tu valor en la ecuación y revisa si se mantiene la igualdad.
        </motion.p>
      )}
    </motion.li>
  );
}