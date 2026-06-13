import express  from 'express';
import apicache from 'apicache';
import { check, param } from 'express-validator';
import {validarCampos} from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import EspecialidadesControlador from "../../controladores/especialidadesControlador.js";

const router = express.Router();

const cache = apicache.middleware;

const especialidadesControlador = new EspecialidadesControlador();

router.get('/', autorizarUsuarios([2,3]), cache('5 minutes'), especialidadesControlador.buscarTodas);

router.get('/:id_especialidad', 
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),    
        validarCampos
    ],
    especialidadesControlador.buscarPorId);

router.post('/', 
    [
        check('nombre')
            .notEmpty().withMessage('El nombre es obligatorio.')
            .isLength({max:120}).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        validarCampos
    ], 
    especialidadesControlador.crear);

router.put('/:id_especialidad', 
    [
        check('nombre')
            .notEmpty().withMessage('El nombre es obligatorio.')
            .isLength({max:120}).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),    
        validarCampos
    ],
    especialidadesControlador.modificar);

router.delete('/:id_especialidad', 
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),    
        validarCampos
    ],
    especialidadesControlador.eliminar);

export { router };

/**
 * @swagger
 * /especialidades:
 *   get:
 *     summary: Listar todas las especialidades
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *       401:
 *         description: No autorizado
 * 
 *   post:
 *     summary: Crear una especialidad
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: CARDIOLOGÍA
 *     responses:
 *       201:
 *         description: Especialidad creada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 * 
 * /especialidades/{id_especialidad}:
 *   get:
 *     summary: Obtener una especialidad por ID
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Especialidad encontrada
 *       404:
 *         description: Especialidad no encontrada
 * 
 *   put:
 *     summary: Modificar una especialidad
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: CARDIOLOGÍA
 *     responses:
 *       200:
 *         description: Especialidad modificada
 *       404:
 *         description: Especialidad no encontrada
 * 
 *   delete:
 *     summary: Eliminar una especialidad (soft delete)
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Especialidad eliminada
 *       404:
 *         description: Especialidad no encontrada
 */