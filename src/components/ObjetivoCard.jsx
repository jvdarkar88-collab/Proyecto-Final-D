import { motion } from "framer-motion";

export default function ObjetivoCard({ icono, texto, indice }) {
  return (
    <motion.article
      className="flex flex-1 flex-col gap-2 rounded-2xl bg-white p-5 shadow-md"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: indice * 0.15 }}
      whileHover={{ scale: 1.04, rotate: -1 }}
    >
      <span className="text-4xl" aria-hidden="true">{icono}</span>
      <p className="text-sm font-semibold text-indigo-900">
        Objetivo {indice + 1}
      </p>
      <p className="text-slate-700">{texto}</p>
    </motion.article>
  );
}