import express from 'express';
import { check } from 'express-validator';
import { param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import EspecialidadesControlador from "../../controladores/especialidadesControlador.js";

const router = express.Router();

const especialidadesControlador = new EspecialidadesControlador();

router.get('/', especialidadesControlador.buscarTodas);

router.get('/:id_especialidad',
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    especialidadesControlador.buscarPorId
);

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio.').notEmpty(),
        check('nombre').isLength({ max: 120 }).withMessage('El nombre no debe superar los 120 caracteres.'),
        validarCampos
    ],
    especialidadesControlador.crear
);

router.put('/:id_especialidad',
    [
        check('nombre')
            .notEmpty().withMessage('El nombre es obligatorio.')
            .isLength({ max: 120 }).withMessage('El nombre no debe superar los 120 caracteres.'),
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    especialidadesControlador.modificar
);

router.delete('/:id_especialidad',
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    especialidadesControlador.borrar
);

export { router };