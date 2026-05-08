import express from 'express';
import { check } from 'express-validator';
import { param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import ObrasSocialesControlador from "../../controladores/obrasSocialesControlador.js";

const router = express.Router();

const obrasSocialesControlador = new ObrasSocialesControlador();

router.get('/', obrasSocialesControlador.buscarTodas);

router.get('/:id_obra_social',
    [
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    obrasSocialesControlador.buscarPorId
);

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio.')
            .notEmpty()
            .isLength({ max: 120 }).withMessage('El nombre no debe superar los 120 caracteres.'),
        check('descripcion', 'La descripción es obligatoria.')
            .notEmpty()
            .isLength({ max: 255 }).withMessage('La descripción no debe superar los 255 caracteres.'),
        check('porcentaje_descuento', 'El porcentaje de descuento es obligatorio.')
            .notEmpty()
            .isFloat({ min: 0, max: 100 }).withMessage('El porcentaje debe ser un número entre 0 y 100.'),
        check('es_particular', 'El campo es_particular es obligatorio.')
            .notEmpty()
            .isInt({ min: 0, max: 1 }).withMessage('El campo es_particular debe ser 0 o 1.'),
        validarCampos
    ],
    obrasSocialesControlador.crear
);

router.put('/:id_obra_social',
    [
        check('nombre', 'El nombre es obligatorio.')
            .notEmpty()
            .isLength({ max: 120 }).withMessage('El nombre no debe superar los 120 caracteres.'),
        check('descripcion', 'La descripción es obligatoria.')
            .notEmpty()
            .isLength({ max: 255 }).withMessage('La descripción no debe superar los 255 caracteres.'),
        check('porcentaje_descuento', 'El porcentaje de descuento es obligatorio.')
            .notEmpty()
            .isFloat({ min: 0, max: 100 }).withMessage('El porcentaje debe ser un número entre 0 y 100.'),
        check('es_particular', 'El campo es_particular es obligatorio.')
            .notEmpty()
            .isInt({ min: 0, max: 1 }).withMessage('El campo es_particular debe ser 0 o 1.'),
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    obrasSocialesControlador.modificar
);

router.delete('/:id_obra_social',
    [
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    obrasSocialesControlador.borrar
);

export { router };