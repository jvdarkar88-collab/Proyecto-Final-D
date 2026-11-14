export const CLASE = {
  curso: "Matemáticas",
  grado: "2.º Básico · Ciclo Básico",
  titulo: "La balanza de las ecuaciones",
  subtitulo:
    "Descubre cómo resolver ecuaciones de primer grado manteniendo siempre el equilibrio.",
};

// Cada sección se muestra por separado (pestañas)
export const SECCIONES = [
  { id: "objetivos", etiqueta: "Objetivos", simbolo: "π" },
  { id: "explora", etiqueta: "Explora", simbolo: "x" },
  { id: "actividades", etiqueta: "Actividades", simbolo: "√" },
  { id: "evaluacion", etiqueta: "Evaluación", simbolo: "✓" },
];

export const OBJETIVOS = [
  {
    icono: "=",
    texto: "Comprender que una ecuación es una igualdad que debe mantenerse en equilibrio.",
  },
  {
    icono: "x",
    texto: "Resolver ecuaciones de primer grado con una incógnita aplicando operaciones inversas.",
  },
  {
    icono: "✓",
    texto: "Comprobar la solución sustituyendo el valor encontrado en la ecuación original.",
  },
];

export const ACTIVIDADES = [
  {
    numero: 1,
    enunciado: "Resuelve la ecuación y escribe el valor de x.",
    ecuacion: "x + 5 = 12",
    respuesta: 7,
    pista: "¿Qué operación deshace el “+ 5”? Aplícala en ambos lados de la balanza.",
  },
  {
    numero: 2,
    enunciado: "Ahora la incógnita está multiplicada. ¿Cuánto vale x?",
    ecuacion: "3x = 18",
    respuesta: 6,
    pista: "3x significa 3 · x. La operación inversa de multiplicar es dividir.",
  },
  {
    numero: 3,
    enunciado: "Reto: combina dos pasos para despejar x.",
    ecuacion: "2x + 4 = 14",
    respuesta: 5,
    pista: "Primero quita el 4 en ambos lados y luego divide entre 2.",
  },
];