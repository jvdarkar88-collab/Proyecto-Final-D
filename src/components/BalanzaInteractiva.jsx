import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Ecuación inicial: x + 3 = 7  (la solución real es x = 4)
const X_REAL = 4;
const INICIO = { izq: 3, der: 7 };

const formatear = (c) => (c > 0 ? `x + ${c}` : c < 0 ? `x − ${Math.abs(c)}` : "x");

export default function BalanzaInteractiva() {
  const [izq, setIzq] = useState(INICIO.izq);
  const [der, setDer] = useState(INICIO.der);
  const [n, setN] = useState(3);

  // Si el lado izquierdo pesa distinto al derecho, la balanza se inclina
  const diferencia = X_REAL + izq - der;
  const equilibrada = diferencia === 0;
  const resuelta = equilibrada && izq === 0;
  const angulo = Math.max(-20, Math.min(20, -diferencia * 5));

  const restarAmbos = () => {
    setIzq((v) => v - n);
    setDer((v) => v - n);
  };
  const restarSoloIzquierda = () => setIzq((v) => v - n);
  const reiniciar = () => {
    setIzq(INICIO.izq);
    setDer(INICIO.der);
  };

  let mensaje = "Balanza en equilibrio. ¡Sigue despejando la x!";
  let color = "text-indigo-700";
  if (!equilibrada) {
    mensaje = "¡La balanza se desequilibró! Lo que haces a un lado debes hacerlo al otro.";
    color = "text-red-600";
  }
  if (resuelta) {
    mensaje = `¡Lo lograste! x = ${der}. La balanza sigue en equilibrio.`;
    color = "text-emerald-600";
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <p className="text-center text-3xl font-extrabold tracking-wide text-indigo-700">
        {formatear(izq)} = {der}
      </p>

      {/* Balanza */}
      <div className="relative mx-auto mt-4 h-72 w-80 sm:w-[28rem]" aria-hidden="true">
        {/* Soporte */}
        <div className="absolute bottom-0 left-1/2 top-9 w-2 -translate-x-1/2 rounded bg-slate-400" />
        <div className="absolute bottom-0 left-1/2 h-3 w-32 -translate-x-1/2 rounded bg-slate-500" />

        {/* Brazo que se inclina */}
        <motion.div
          className="absolute inset-x-14 top-8 h-2 rounded bg-slate-700"
          animate={{ rotate: angulo }}
          transition={{ type: "spring", stiffness: 70, damping: 8 }}
        >
          <Platillo lado="left" etiqueta={`x + ${izq}`} angulo={angulo}>
            <Ficha texto="x" tipo="x" />
            {izq !== 0 && <Ficha texto={izq > 0 ? `+${izq}` : `${izq}`} />}
          </Platillo>
          <Platillo lado="right" etiqueta={`${der}`} angulo={angulo}>
            <Ficha texto={`${der}`} />
          </Platillo>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={mensaje}
          className={`mt-2 text-center font-semibold ${color}`}
          role="status"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {mensaje}
        </motion.p>
      </AnimatePresence>

      {/* Controles */}
      <div className="mt-5 flex flex-col items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          Número a restar:
          <input
            type="number"
            min="1"
            max="9"
            value={n}
            onChange={(e) => setN(Math.max(1, Math.min(9, Number(e.target.value) || 1)))}
            className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-center"
          />
        </label>

        <div className="flex flex-wrap justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restarAmbos}
            className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white shadow"
          >
            Restar {n} a ambos lados
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restarSoloIzquierda}
            className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white shadow"
          >
            Restar {n} solo a la izquierda
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reiniciar}
            className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 shadow"
          >
            Reiniciar
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Platillo colgado de cada extremo del brazo (se contra-rota para quedar derecho)
function Platillo({ lado, angulo, children }) {
  const posicion = lado === "left" ? "left-0" : "right-0";
  const traslado = lado === "left" ? "-translate-x-1/2" : "translate-x-1/2";
  return (
    <div className={`absolute top-1 w-24 ${posicion} ${traslado}`}>
      <motion.div
        className="flex flex-col items-center"
        animate={{ rotate: -angulo }}
        transition={{ type: "spring", stiffness: 70, damping: 8 }}
      >
        <div className="h-10 w-px bg-slate-500" />
        <div className="flex min-h-12 w-24 flex-wrap items-end justify-center gap-1 rounded-b-3xl border-2 border-slate-500 bg-slate-100 p-1">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function Ficha({ texto, tipo }) {
  return (
    <motion.span
      layout
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`rounded-md px-2 py-1 text-sm font-bold text-white ${
        tipo === "x" ? "bg-violet-600" : "bg-indigo-500"
      }`}
    >
      {texto}
    </motion.span>
  );
}