import express from 'express';
import { param, check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import PacientesControlador from '../../controladores/pacientesControlador.js';

const router = express.Router();

const pacientesControlador = new PacientesControlador();

router.put('/:id_paciente/obras-sociales',
    [
        param('id_paciente')
            .isInt().withMessage('El id_paciente debe ser un número entero.'),
        check('id_obra_social')
            .notEmpty().withMessage('El id_obra_social es obligatorio.')
            .isInt().withMessage('El id_obra_social debe ser un número entero.'),
        validarCampos
    ],
    pacientesControlador.asociarObraSocial
);

export { router };