import { pool } from "./conexion.js";

export default class TurnosReservas {

    buscarPorId = async (id_turno_reserva) => {
        const sql = `SELECT * FROM turnos_reservas WHERE id_turno_reserva = ? AND activo = 1`;
        const [result] = await pool.execute(sql, [id_turno_reserva]);
        return result[0];
    }

    crear = async (turnoReserva) => {
        const {id_medico, id_paciente, id_obra_social, fecha_hora, valor_total} = turnoReserva;
        const sql = `INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total)
             VALUES (?,?,?,?,?)`;
        const [result] = await pool.execute(sql, [id_medico,id_paciente,id_obra_social,fecha_hora, valor_total ]);     
        if (result.affectedRows === 0){
            return null;
        }
        return result.insertId;
    }

    turnosDeUnMedico = async (id_usuario) => {
        const sql = `SELECT tr.fecha_hora, tr.valor_total
                    FROM usuarios AS u
                    INNER JOIN medicos AS m ON m.id_usuario = u.id_usuario
                    INNER JOIN turnos_reservas AS tr ON tr.id_medico = m.id_medico
                    WHERE u.id_usuario = ?;`
        const [turnos] = await pool.execute(sql, [id_usuario]);
        return turnos;
    } 

    turnosDeUnPaciente = async (id_usuario) => {
        const sql = `SELECT tr.fecha_hora, tr.valor_total
                        FROM usuarios as u
                        INNER JOIN pacientes AS p ON p.id_usuario = u.id_usuario
                        INNER JOIN turnos_reservas AS tr ON tr.id_paciente = p.id_paciente
                        WHERE u.id_usuario = ?`
        const [turnos] = await pool.execute(sql, [id_usuario]);
        return turnos;
    } 

    porEspecialidad = async () => {
        const sql = `CALL sp_turnos_por_especialidad()`;
        const [datos] = await pool.execute(sql);
        return datos[0];
    }

    marcarAtendido = async (id_turno_reserva) => {
        const sql = `UPDATE turnos_reservas SET atentido = 1 
                    WHERE id_turno_reserva = ? AND activo = 1`;
        const [result] = await pool.execute(sql, [id_turno_reserva]);
        if (result.affectedRows === 0) {
            return null;
        }
        return true;
    }

    estadisticas = async () => {
        const sql = `CALL sp_turnos_por_especialidad()`;
        const [datos] = await pool.execute(sql);
        return datos[0];
    }

    resumenObrasSociales = async () => {
        const sql = `SELECT 
                        os.nombre AS obra_social,
                        COUNT(tr.id_turno_reserva) AS cantidad_turnos,
                        COUNT(DISTINCT tr.id_paciente) AS cantidad_pacientes
                    FROM obras_sociales os
                    LEFT JOIN turnos_reservas tr ON tr.id_obra_social = os.id_obra_social
                        AND tr.activo = 1
                    WHERE os.activo = 1
                    GROUP BY os.nombre
                    ORDER BY cantidad_turnos DESC`;
        const [datos] = await pool.execute(sql);
        return datos;
    }

    // funcion extra - medico puede hacer comentarios
    agregarObservaciones = async (id_turno_reserva, observaciones) => {
        const sql = `UPDATE turnos_reservas SET observaciones = ? 
                    WHERE id_turno_reserva = ? AND activo = 1`;
        const [result] = await pool.execute(sql, [observaciones, id_turno_reserva]);
        if (result.affectedRows === 0) {
            return null;
        }
        return true;
    }
}