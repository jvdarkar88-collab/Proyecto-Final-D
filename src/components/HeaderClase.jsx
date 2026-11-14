import { motion } from "framer-motion";

export default function HeaderClase({ curso, grado, titulo, subtitulo }) {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">
            {curso} · {grado}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold md:text-5xl">{titulo}</h1>
          <p className="mt-3 max-w-xl text-indigo-100">{subtitulo}</p>
        </motion.div>

        <motion.div
          className="text-7xl"
          aria-hidden="true"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          ⚖️
        </motion.div>
      </div>

      <nav aria-label="Secciones de la clase" className="bg-indigo-800/40">
        <ul className="mx-auto flex max-w-4xl flex-wrap gap-x-6 gap-y-1 px-4 py-3 text-sm font-semibold">
          <li><a className="hover:underline" href="#objetivos">Objetivos</a></li>
          <li><a className="hover:underline" href="#explora">Explora</a></li>
          <li><a className="hover:underline" href="#actividades">Actividades</a></li>
          <li><a className="hover:underline" href="#evaluacion">Evaluación</a></li>
        </ul>
      </nav>
    </header>
  );
}