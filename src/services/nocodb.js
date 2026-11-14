// Servicio de acceso a NocoDB Cloud (API REST v2)
// Documentación: https://docs.nocodb.com

const BASE_URL = import.meta.env.VITE_NOCODB_URL;
const TOKEN = import.meta.env.VITE_NOCODB_TOKEN;
const TABLE_ID = import.meta.env.VITE_NOCODB_TABLE_ID;

export const configuracionLista = Boolean(BASE_URL && TOKEN && TABLE_ID);

const endpoint = `${BASE_URL}/api/v2/tables/${TABLE_ID}/records`;

const headers = {
  "xc-token": TOKEN,
  "Content-Type": "application/json",
};

// READ: obtiene los últimos registros (los más recientes primero)
export async function obtenerResultados(limite = 10) {
  const respuesta = await fetch(`${endpoint}?limit=${limite}&sort=-CreatedAt`, {
    headers,
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudieron leer los registros (código ${respuesta.status})`);
  }

  const datos = await respuesta.json();
  return datos.list ?? [];
}

// CREATE: guarda un nuevo registro
export async function crearResultado({ nombre, grupo, puntaje, comentario }) {
  const respuesta = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ nombre, grupo, puntaje, comentario }),
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo guardar el registro (código ${respuesta.status})`);
  }

  return respuesta.json();
}