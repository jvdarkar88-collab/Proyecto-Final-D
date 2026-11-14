import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { crearResultado, configuracionLista } from "../services/nocodb";

export default function EvaluacionForm({ puntaje, onGuardado }) {
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null); // { tipo: "ok" | "error", texto }

  const enviar = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (!configuracionLista) {
      setMensaje({
        tipo: "error",
        texto: "Falta configurar las variables de entorno de NocoDB (.env).",
      });
      return;
    }

    setEnviando(true);
    try {
      await crearResultado({
        nombre: nombre.trim(),
        grupo: grupo.trim(),
        puntaje,
        comentario: comentario.trim(),
      });
      setMensaje({ tipo: "ok", texto: "¡Resultado guardado en la nube!" });
      setNombre("");
      setGrupo("");
      setComentario("");
      onGuardado?.();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    } finally {
      setEnviando(false);
    }
  };

  const campo =
    "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200";

  return (
    <form
      onSubmit={enviar}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-center text-lg font-bold text-slate-700">
        Tu puntaje: <span className="ecuacion text-4xl text-teal-700">{puntaje}%</span>
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <label className="flex flex-1 flex-col gap-1 text-sm font-semibold">
          Nombre
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={campo}
            placeholder="Ej. Ana López"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm font-semibold">
          Grado y sección
          <input
            required
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            className={campo}
            placeholder="Ej. 2.º Básico A"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Hoy aprendí que…
        <textarea
          rows="3"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className={campo}
          placeholder="Escribe con tus propias palabras qué aprendiste"
        />
      </label>

      <motion.button
        type="submit"
        disabled={enviando}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-xl bg-teal-700 px-4 py-3 font-bold text-white shadow hover:bg-teal-800 disabled:opacity-60"
      >
        {enviando ? "Guardando..." : "Guardar mi resultado"}
      </motion.button>

      <AnimatePresence>
        {mensaje && (
          <motion.p
            key={mensaje.texto}
            role="status"
            className={`text-center font-semibold ${
              mensaje.tipo === "ok" ? "text-emerald-600" : "text-rose-600"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {mensaje.texto}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}