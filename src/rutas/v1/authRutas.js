import express from 'express';
import AuthController from '../../controladores/authControlador.js';

import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const router = express.Router();
const authController = new AuthController();

router.post('/login', 
    [
        check('email')
            .notEmpty().withMessage('El correo electrónico es requerido!.')
            .isEmail().withMessage('Revisar el formato del correo electrónico.'),
        check('contrasenia')
            .notEmpty().withMessage('La contraseña es requerida.'),
        validarCampos
    ], 
    authController.login);

export {router};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, contrasenia]
 *             properties:
 *               email:
 *                 type: string
 *                 example: lopmar@correo.com
 *               contrasenia:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 *       400:
 *         description: Credenciales incorrectas
 */