import { motion, useAnimationControls } from "framer-motion";

export default function HeaderClase({
  curso,
  grado,
  titulo,
  subtitulo,
  secciones,
  seccionActiva,
  onCambiar,
}) {
  const controles = useAnimationControls();

  // La balanza solo se mueve al pasar el cursor (computadora) o al tocarla (teléfono)
  const moverBalanza = () =>
    controles.start({
      rotate: [0, 22, -18, 12, -6, 0],
      transition: { duration: 1.4, ease: "easeInOut" },
    });

  return (
    <header className="fondo-header relative overflow-hidden text-white">
      <div className="cuadricula-header absolute inset-0" aria-hidden="true" />

      {/* Símbolos decorativos */}
      <div
        className="ecuacion pointer-events-none absolute inset-0 select-none text-white/10"
        aria-hidden="true"
      >
        <span className="absolute right-[28%] top-3 text-6xl">π</span>
        <span className="absolute bottom-16 left-[6%] text-7xl">∑</span>
        <span className="absolute right-[8%] bottom-14 text-5xl">x²</span>
        <span className="absolute left-[45%] top-2 text-5xl">√</span>
        <span className="absolute left-[22%] bottom-20 text-4xl">÷</span>
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-200">
            {curso} · {grado}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold md:text-5xl">{titulo}</h1>
          <p className="mt-3 max-w-xl text-slate-200">{subtitulo}</p>
        </motion.div>

        <div className="flex flex-col items-center">
          <motion.button
            type="button"
            aria-label="Mover la balanza"
            onHoverStart={moverBalanza}
            onTap={moverBalanza}
            animate={controles}
            whileTap={{ scale: 0.92 }}
            style={{ originY: 0.15 }}
            className="cursor-pointer select-none text-7xl md:text-8xl"
          >
            ⚖️
          </motion.button>
          <span className="mt-1 text-xs text-teal-200">Toca la balanza</span>
        </div>
      </div>

      <nav aria-label="Secciones de la clase" className="relative border-t border-white/10 bg-black/20">
        <ul className="mx-auto flex max-w-4xl gap-2 overflow-x-auto px-4 py-3">
          {secciones.map((s) => {
            const activa = s.id === seccionActiva;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onCambiar(s.id)}
                  aria-current={activa ? "page" : undefined}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                    activa
                      ? "bg-amber-400 text-slate-900 shadow"
                      : "text-teal-50 hover:bg-white/10"
                  }`}
                >
                  <span className="ecuacion text-base" aria-hidden="true">
                    {s.simbolo}
                  </span>
                  {s.etiqueta}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}