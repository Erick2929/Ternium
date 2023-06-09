import pool from "../dbConfig";
import { QueryResult } from "pg";

export async function updateTablaTrayectoria(
    empresa: string | null,
    puesto: string | null,
    id_trayectoria: number,
    id_empleado: number
): Promise<QueryResult> {
    const client = await pool.connect();

    try {
        const updateQuery = `
      UPDATE trayectoria
      SET
        empresa = COALESCE($1, empresa),
        puesto = COALESCE($2, puesto)
      WHERE id_empleado = $3 AND id_trayectoria = $4
    `;

        const values = [empresa, puesto, id_empleado, id_trayectoria];

        const result: QueryResult = await client.query(updateQuery, values);
        return result;
    } finally {
        client.release();
    }
}
