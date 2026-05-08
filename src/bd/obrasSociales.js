import { pool } from "./conexion.js";


export default class ObrasSociales {

    buscarTodas = async () => {
        const sql = "SELECT * FROM obras_sociales WHERE activo = 1";
        const [obrasSociales] = await pool.query(sql);
        return obrasSociales;
    }

    buscarPorId = async (id_obra_social) => {
        const sql = "SELECT * FROM obras_sociales WHERE activo = 1 AND id_obra_social = ?";
        const [obrasSociales] = await pool.execute(sql, [id_obra_social]);
        return obrasSociales;
    }

    crear = async (nombre, descripcion, porcentaje_descuento, es_particular) => {
        // verificar si ya existe activa
        const sqlActiva = "SELECT * FROM obras_sociales WHERE nombre = ? AND activo = 1";
        const [activa] = await pool.execute(sqlActiva, [nombre]);

        if (activa.length > 0) {
            return { conflicto: true };
        }

        // verificar si existe pero inactiva (soft deleted)
        const sqlInactiva = "SELECT * FROM obras_sociales WHERE nombre = ? AND activo = 0";
        const [inactiva] = await pool.execute(sqlInactiva, [nombre]);

        if (inactiva.length > 0) {
            const sqlReactivar = `
                UPDATE obras_sociales 
                SET activo = 1, descripcion = ?, porcentaje_descuento = ?, es_particular = ?
                WHERE id_obra_social = ?
            `;
            const [result] = await pool.execute(sqlReactivar, [
                descripcion,
                porcentaje_descuento,
                es_particular,
                inactiva[0].id_obra_social
            ]);
            return { reactivada: true, id: inactiva[0].id_obra_social, affectedRows: result.affectedRows };
        }

        // si no existe ni estaba inactiva, crear nueva
        const sql = `INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.execute(sql, [nombre, descripcion, porcentaje_descuento, es_particular]);
        return { affectedRows: result.affectedRows, id: result.insertId };
    }

    modificar = async (id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular) => {
        const sqlDuplicado = "SELECT * FROM obras_sociales WHERE nombre = ? AND activo = 1 AND id_obra_social != ?";
        const [duplicado] = await pool.execute(sqlDuplicado, [nombre, id_obra_social]);

        if (duplicado.length > 0) {
            return { conflicto: true };
        }
        
        const sql = `
            UPDATE obras_sociales 
            SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ?
            WHERE id_obra_social = ?
        `;
        const [result] = await pool.execute(sql, [nombre, descripcion, porcentaje_descuento, es_particular, id_obra_social]);
        return result;
    }

    borrar = async (id_obra_social) => {
        const sql = "UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?";
        const [result] = await pool.execute(sql, [id_obra_social]);
        return result;
    }
}