import express  from 'express';
import { check, param, query } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import TransformarDTO from '../../middlewares/transformarDTOs.js';
import MedicosControlador from '../../controladores/medicosControlador.js';

const router = express.Router();

const medicosControlador = new MedicosControlador();
const transformarDTO = new TransformarDTO();

router.get('/',
    [
        query('especialidad')
            .optional()
            .isInt().withMessage('El parámetro especialidad debe ser un número entero.'),
        validarCampos
    ],
    (req, res) => {
        if (req.query.especialidad) {
            return medicosControlador.buscarPorEspecialidad(req, res);
        }
        return medicosControlador.buscarTodos(req, res);
    }
);

router.post('/:id_medico/obras-sociales', 
   [        
        param('id_medico')
            .notEmpty().withMessage('El id_medico es obligatorio.')
            .isInt().withMessage('El id_medico debe ser un número entero.'),
        check('obras_sociales')
            .isArray().withMessage('obras_sociales debe ser un array.')
            .notEmpty().withMessage('obras_sociales no puede estar vacío.'),
        check('obras_sociales.*.id_obra_social') 
            .notEmpty().withMessage('Cada obra social debe tener id_obra_social.')
            .isInt().withMessage('id_obra_social debe ser un número entero.'),
        validarCampos
    ],
    transformarDTO.medicosAsociarDTO,
    medicosControlador.asociarMedicoObrasSociales);

export { router };