import { motion } from "framer-motion";

export default function ObjetivoCard({ icono, texto, indice }) {
  return (
    <motion.article
      className="flex flex-1 flex-col gap-3 rounded-2xl border border-slate-200 border-t-4 border-t-teal-600 bg-white p-5 shadow-sm"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: indice * 0.15 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(15,118,110,0.18)" }}
    >
      <span
        className="ecuacion flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-3xl font-bold text-teal-700"
        aria-hidden="true"
      >
        {icono}
      </span>
      <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
        Objetivo {indice + 1}
      </p>
      <p className="text-slate-700">{texto}</p>
    </motion.article>
  );
}