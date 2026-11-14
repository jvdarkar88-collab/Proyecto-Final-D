import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// izq y der son los números sumados a x (izquierda) y el valor del lado derecho.
// x es la solución real (la caja misteriosa), que el estudiante debe descubrir.
const ECUACIONES = [
  { izq: 3, der: 7, x: 4 },
  { izq: 6, der: 11, x: 5 },
  { izq: -2, der: 5, x: 7 },
];

const formatearIzq = (c) => (c > 0 ? `x + ${c}` : c < 0 ? `x − ${Math.abs(c)}` : "x");

export default function BalanzaInteractiva() {
  const [indice, setIndice] = useState(0);
  const base = ECUACIONES[indice];

  const [izq, setIzq] = useState(base.izq);
  const [der, setDer] = useState(base.der);
  const [operacion, setOperacion] = useState("restar"); // sumar | restar
  const [lado, setLado] = useState("ambos"); // ambos | izquierdo | derecho
  const [texto, setTexto] = useState("3"); // texto del campo, permite escribir libremente
  const [aviso, setAviso] = useState("");
  const [pasos, setPasos] = useState([]);

  // Física simple: si pesa más la izquierda, el brazo baja de ese lado
  const diferencia = base.x + izq - der;
  const equilibrada = diferencia === 0;
  const resuelta = equilibrada && izq === 0;
  const angulo = Math.max(-18, Math.min(18, -diferencia * 4));

  const elegirEcuacion = (i) => {
    setIndice(i);
    setIzq(ECUACIONES[i].izq);
    setDer(ECUACIONES[i].der);
    setPasos([]);
    setAviso("");
  };

  const reiniciar = () => elegirEcuacion(indice);

  const cambiarCantidad = (delta) => {
    const actual = parseInt(texto, 10) || 0;
    setTexto(String(Math.max(1, Math.min(99, actual + delta))));
    setAviso("");
  };

  const aplicar = () => {
    const n = parseInt(texto, 10);
    if (!n || n < 1) {
      setAviso("Escribe un número entre 1 y 99.");
      return;
    }
    setAviso("");

    const delta = operacion === "sumar" ? n : -n;
    const nuevoIzq = lado === "derecho" ? izq : izq + delta;
    const nuevoDer = lado === "izquierdo" ? der : der + delta;
    setIzq(nuevoIzq);
    setDer(nuevoDer);

    const verbo = operacion === "sumar" ? "Sumaste" : "Restaste";
    const donde =
      lado === "ambos" ? "a ambos lados" : lado === "izquierdo" ? "solo al lado izquierdo" : "solo al lado derecho";
    setPasos((p) => [...p.slice(-4), `${verbo} ${n} ${donde}  →  ${formatearIzq(nuevoIzq)} = ${nuevoDer}`]);
  };

  let mensaje = "La balanza está en equilibrio. ¡Sigue despejando la x!";
  let color = "text-teal-700";
  if (!equilibrada) {
    mensaje = "¡La balanza se desequilibró! Lo que haces en un lado debes hacerlo también en el otro.";
    color = "text-rose-600";
  }
  if (resuelta) {
    mensaje = `¡Lo lograste! La caja pesa x = ${der} y la balanza sigue en equilibrio.`;
    color = "text-emerald-600";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Selector de ecuación */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm font-semibold text-slate-600">Ecuación:</span>
        {ECUACIONES.map((e, i) => (
          <Opcion key={i} activa={i === indice} onClick={() => elegirEcuacion(i)}>
            <span className="ecuacion">
              {formatearIzq(e.izq)} = {e.der}
            </span>
          </Opcion>
        ))}
      </div>

      <p className="ecuacion mt-4 text-center text-4xl font-bold text-slate-900">
        {formatearIzq(izq)} = {der}
      </p>

      {/* Balanza */}
      <div className="relative mx-auto mt-2 h-80 w-full max-w-xl" aria-hidden="true">
        {/* Soporte */}
        <div className="absolute bottom-2 left-1/2 top-10 w-3 -translate-x-1/2 rounded bg-gradient-to-r from-slate-500 to-slate-400" />
        <div className="absolute bottom-0 left-1/2 h-3 w-40 -translate-x-1/2 rounded-t-lg bg-slate-700" />

        {/* Brazo */}
        <motion.div
          className="absolute inset-x-16 top-10 h-2.5 rounded-full bg-gradient-to-b from-slate-500 to-slate-700 shadow"
          animate={{ rotate: angulo }}
          transition={{ type: "spring", stiffness: 60, damping: 7 }}
        >
          <Platillo lado="izquierdo" angulo={angulo}>
            <CajaX />
            <Pesas cantidad={izq} />
          </Platillo>
          <Platillo lado="derecho" angulo={angulo}>
            <Pesas cantidad={der} />
          </Platillo>
        </motion.div>

        {/* Eje central */}
        <div className="absolute left-1/2 top-[2.15rem] h-5 w-5 -translate-x-1/2 rounded-full border-2 border-slate-700 bg-amber-400 shadow" />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={mensaje}
          className={`min-h-[3rem] text-center font-semibold ${color}`}
          role="status"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {mensaje}
        </motion.p>
      </AnimatePresence>

      {/* Panel de operaciones */}
      <div className="mt-4 flex flex-col gap-4 rounded-xl bg-slate-50 p-4">
        <Fila titulo="1. Operación">
          <Opcion activa={operacion === "sumar"} onClick={() => setOperacion("sumar")}>
            ＋ Sumar
          </Opcion>
          <Opcion activa={operacion === "restar"} onClick={() => setOperacion("restar")}>
            － Restar
          </Opcion>
        </Fila>

        <Fila titulo="2. Cantidad">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => cambiarCantidad(-1)}
              aria-label="Disminuir cantidad"
              className="h-10 w-10 rounded-lg border border-slate-300 bg-white text-xl font-bold text-slate-700 hover:bg-slate-100"
            >
              −
            </button>
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value.replace(/\D/g, "").slice(0, 2));
                setAviso("");
              }}
              onKeyDown={(e) => e.key === "Enter" && aplicar()}
              aria-label="Cantidad a aplicar"
              className="h-10 w-16 rounded-lg border border-slate-300 text-center text-lg font-bold focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            <button
              type="button"
              onClick={() => cambiarCantidad(1)}
              aria-label="Aumentar cantidad"
              className="h-10 w-10 rounded-lg border border-slate-300 bg-white text-xl font-bold text-slate-700 hover:bg-slate-100"
            >
              +
            </button>
          </div>
        </Fila>

        <Fila titulo="3. Aplicar a">
          <Opcion activa={lado === "ambos"} onClick={() => setLado("ambos")}>
            Ambos lados
          </Opcion>
          <Opcion activa={lado === "izquierdo"} onClick={() => setLado("izquierdo")}>
            Solo izquierdo
          </Opcion>
          <Opcion activa={lado === "derecho"} onClick={() => setLado("derecho")}>
            Solo derecho
          </Opcion>
        </Fila>

        {aviso && (
          <p className="text-center text-sm font-semibold text-rose-600" role="alert">
            {aviso}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={aplicar}
            className="rounded-xl bg-teal-700 px-6 py-2.5 font-bold text-white shadow hover:bg-teal-800"
          >
            Aplicar
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={reiniciar}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Reiniciar
          </motion.button>
        </div>
      </div>

      {/* Registro de pasos */}
      {pasos.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-bold text-slate-600">Tus pasos:</p>
          <ol className="ecuacion mt-1 list-decimal pl-6 text-slate-700">
            {pasos.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/* ---------- Piezas de la balanza ---------- */

// Platillo colgado de cada extremo; se contra-rota para quedar siempre horizontal
function Platillo({ lado, angulo, children }) {
  const posicion = lado === "izquierdo" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2";
  return (
    <div className={`absolute top-1.5 w-32 ${posicion}`}>
      <motion.div
        className="flex flex-col items-center"
        style={{ originX: 0.5, originY: 0 }}
        animate={{ rotate: -angulo }}
        transition={{ type: "spring", stiffness: 60, damping: 7 }}
      >
        <div className="h-8 w-px bg-slate-400" />
        <div className="flex min-h-[3.5rem] w-32 flex-wrap items-end justify-center gap-0.5 px-1 pb-0.5">
          {children}
        </div>
        <div className="h-2.5 w-32 rounded-b-[100%] bg-gradient-to-b from-slate-500 to-slate-700 shadow" />
      </motion.div>
    </div>
  );
}

// La incógnita: una caja misteriosa con cinta
function CajaX() {
  return (
    <motion.span
      layout
      className="ecuacion relative mr-1 flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border-2 border-amber-600 bg-gradient-to-br from-amber-300 to-amber-500 text-2xl font-bold text-slate-900 shadow"
    >
      <span className="absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 bg-amber-700/40" />
      <span className="relative">x</span>
    </motion.span>
  );
}

// Números positivos = pesas de metal; negativos = globos que tiran hacia arriba
function Pesas({ cantidad }) {
  if (cantidad === 0) return null;
  const negativo = cantidad < 0;
  const total = Math.abs(cantidad);

  if (total > 10) {
    return <Pesa etiqueta={`${negativo ? "−" : ""}${total}`} negativo={negativo} grande />;
  }
  return Array.from({ length: total }, (_, i) => (
    <Pesa key={i} etiqueta={negativo ? "−1" : "1"} negativo={negativo} />
  ));
}

function Pesa({ etiqueta, negativo, grande }) {
  if (negativo) {
    return (
      <motion.span
        layout
        initial={{ scale: 0, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <span
          className={`flex items-center justify-center rounded-full bg-gradient-to-br from-sky-200 to-sky-400 font-bold text-sky-900 shadow ${
            grande ? "h-10 w-10 text-sm" : "h-6 w-6 text-[10px]"
          }`}
        >
          {etiqueta}
        </span>
        <span className="h-2 w-px bg-sky-500" />
      </motion.span>
    );
  }
  return (
    <motion.span
      layout
      initial={{ scale: 0, y: -14 }}
      animate={{ scale: 1, y: 0 }}
      className="flex flex-col items-center"
    >
      <span className="h-1 w-2.5 rounded-t-full bg-slate-600" />
      <span
        className={`flex items-center justify-center rounded-sm border-b-2 border-slate-700 bg-gradient-to-b from-slate-300 to-slate-500 font-bold text-slate-900 shadow ${
          grande ? "h-8 w-11 text-sm" : "h-5 w-6 text-[10px]"
        }`}
      >
        {etiqueta}
      </span>
    </motion.span>
  );
}

/* ---------- Controles ---------- */

function Fila({ titulo, children }) {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
      <p className="text-sm font-bold text-slate-600">{titulo}</p>
      <div className="flex flex-wrap justify-center gap-2">{children}</div>
    </div>
  );
}

function Opcion({ activa, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activa}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        activa
          ? "border-teal-700 bg-teal-700 text-white shadow"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}