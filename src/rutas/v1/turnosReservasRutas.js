import express  from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

import TransformarDTO from '../../middlewares/transformarDTOs.js';
import TurnosReservasControlador from '../../controladores/turnosReservasControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const router = express.Router();

const turnosReservasControlador = new TurnosReservasControlador();
const transformarDTO = new TransformarDTO();

router.get('/', autorizarUsuarios([1,2]), turnosReservasControlador.buscarTodos);

router.get('/por-especialidad', autorizarUsuarios([3]), turnosReservasControlador.porEspecialidad);

router.get('/estadisticas', autorizarUsuarios([3]), turnosReservasControlador.estadisticas);

router.post('/', 
    [
        check('id_medico')
            .notEmpty().withMessage('El id_medico es obligatorio.'),
        check('id_paciente')
            .notEmpty().withMessage('El id_paciente es obligatoria.'),
        check('fecha_hora')
            .notEmpty().withMessage('La fecha_hora es obligatorio.'),
        validarCampos
    ], 
    transformarDTO.turnosReservasCrearDTO,
    turnosReservasControlador.crear);


router.patch('/:id_turno_reserva/atendido',
    autorizarUsuarios([1]),   // solo médico
    [
        param('id_turno_reserva')
            .isInt().withMessage('El id_turno_reserva debe ser un número entero.'),
        validarCampos
    ],
    turnosReservasControlador.marcarAtendido
);

router.patch('/:id_turno_reserva/observaciones',
    autorizarUsuarios([1]),   // solo médico
    [
        param('id_turno_reserva')
            .isInt().withMessage('El id_turno_reserva debe ser un número entero.'),
        check('observaciones')
            .notEmpty().withMessage('Las observaciones son obligatorias.'),
        validarCampos
    ],
    transformarDTO.turnosReservasObservacionesDTO,
    turnosReservasControlador.agregarObservaciones
);

export { router };

/**
 * @swagger
 * /turnos-reservas:
 *   get:
 *     summary: Listar turnos propios (médico ve los suyos, paciente ve los suyos)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos
 *       401:
 *         description: No autorizado
 * 
 *   post:
 *     summary: Crear un turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_medico, id_paciente, fecha_hora]
 *             properties:
 *               id_medico:
 *                 type: integer
 *                 example: 1
 *               id_paciente:
 *                 type: integer
 *                 example: 1
 *               fecha_hora:
 *                 type: string
 *                 example: 2026-07-01 10:00:00
 *     responses:
 *       201:
 *         description: Turno creado
 *       400:
 *         description: Datos inválidos
 * 
 * /turnos-reservas/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de atenciones por especialidad (solo administrador)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generadas
 *       401:
 *         description: No autorizado
 * 
 * /turnos-reservas/por-especialidad:
 *   get:
 *     summary: Reporte PDF de turnos por especialidad
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 * 
 * /turnos-reservas/{id_turno_reserva}/atendido:
 *   patch:
 *     summary: Marcar un turno como atendido (solo médico)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_turno_reserva
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno marcado como atendido
 *       404:
 *         description: Turno no encontrado
 * 
 * /turnos-reservas/{id_turno_reserva}/observaciones:
 *   patch:
 *     summary: Agregar observaciones a un turno (solo médico)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_turno_reserva
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [observaciones]
 *             properties:
 *               observaciones:
 *                 type: string
 *                 example: Paciente presenta fiebre leve.
 *     responses:
 *       200:
 *         description: Observaciones agregadas
 *       404:
 *         description: Turno no encontrado
 */