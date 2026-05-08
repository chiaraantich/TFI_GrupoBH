import { pool } from "./conexion.js";


export default class Especialidades {

    buscarTodas = async() => {
        const sql = "SELECT * FROM especialidades WHERE activo = 1";        
        const [especialidades] = await pool.query(sql);
        return especialidades;
    }

    buscarPorId = async(id_especialidad) => {
        const sql = "SELECT * FROM especialidades WHERE activo = 1 AND id_especialidad = ?";
        const [especialidades] = await pool.execute(sql, [id_especialidad]);
        return especialidades;
    }

    crear = async (nombre) => {
        // verificar si ya existe activa
        const sqlActiva = "SELECT * FROM especialidades WHERE nombre = ? AND activo = 1";
        const [activa] = await pool.execute(sqlActiva, [nombre]);
 
        if (activa.length > 0) {
            return { conflicto: true };
        }
 
        // verificar si existe pero inactiva (soft deleted)
        const sqlInactiva = "SELECT * FROM especialidades WHERE nombre = ? AND activo = 0";
        const [inactiva] = await pool.execute(sqlInactiva, [nombre]);
 
        if (inactiva.length > 0) {
            const sqlReactivar = "UPDATE especialidades SET activo = 1 WHERE id_especialidad = ?";
            const [result] = await pool.execute(sqlReactivar, [inactiva[0].id_especialidad]);
            return { reactivada: true, id: inactiva[0].id_especialidad, affectedRows: result.affectedRows };
        }
 
        // si no existe ni estaba inactiva, crear nueva
        const sql = "INSERT INTO especialidades (nombre) VALUES (?)";
        const [result] = await pool.execute(sql, [nombre]);
        return { affectedRows: result.affectedRows, id: result.insertId };
    }

    modificar = async (id_especialidad, nombre) => {
        // verificar si ya existe otra especialidad activa con ese nombre
        const sqlDuplicado = "SELECT * FROM especialidades WHERE nombre = ? AND activo = 1 AND id_especialidad != ?";
        const [duplicado] = await pool.execute(sqlDuplicado, [nombre, id_especialidad]);

        if (duplicado.length > 0) {
            return { conflicto: true };
        }

        const sql = "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?";
        const [result] = await pool.execute(sql, [nombre, id_especialidad]);
        return result;
    }
       
    borrar = async (id_especialidad) => {
        const sql = "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?";
        const [result] = await pool.execute(sql, [id_especialidad]);
        return result;
    }
}