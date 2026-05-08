import ObrasSocialesServicio from "../servicios/obrasSocialesServicio.js";

export default class ObrasSocialesControlador {

    constructor () {
        this.obrasSociales = new ObrasSocialesServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const obrasSociales = await this.obrasSociales.buscarTodas();

            res.status(200).json({
                estado: true,
                obrasSociales: obrasSociales
            });
        } catch (error) {
            console.log(`Error en GET /obras-sociales ${error}`);
            res.status(500).json({
                estado: false,
                msg: 'Error interno'
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id_obra_social = req.params.id_obra_social;

            const obrasSociales = await this.obrasSociales.buscarPorId(id_obra_social);

            if (obrasSociales.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Obra social no encontrada' });
            }

            res.status(200).json({
                estado: true,
                obrasSociales: obrasSociales
            });
        } catch (error) {
            console.log(`Error en GET /obras-sociales/:id ${error}`);
            res.status(500).json({
                estado: false,
                msg: 'Error interno'
            });
        }
    }

    crear = async (req, res) => {
        try {
            const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;

            const resultado = await this.obrasSociales.crear(nombre, descripcion, porcentaje_descuento, es_particular);

            if (resultado.conflicto) {
                return res.status(409).json({ estado: false, msg: 'Ya existe una obra social activa con ese nombre.' });
            }

            if (resultado.reactivada) {
                if (resultado.affectedRows > 0) {
                    return res.status(200).json({ estado: true, msg: `Obra social reactivada con ID ${resultado.id}` });
                }
                return res.status(500).json({ estado: false, msg: 'No se pudo reactivar la obra social.' });
            }

            if (resultado.affectedRows > 0) {
                return res.status(201).json({ estado: true, msg: `Obra social creada con ID ${resultado.id}` });
            }

            return res.status(500).json({ estado: false, msg: 'No se pudo crear la obra social.' });

        } catch (error) {
            console.log(`Error en POST /obras-sociales ${error}`);
            res.status(500).json({
                estado: false,
                msg: 'Error interno'
            });
        }
    }

    modificar = async (req, res) => {
        try {
            const id_obra_social = req.params.id_obra_social;

            const existe = await this.obrasSociales.buscarPorId(id_obra_social);

            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Obra social no encontrada' });
            }

            const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;

            const result = await this.obrasSociales.modificar(id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular);

            if (result.conflicto) {
                return res.status(409).json({ estado: false, msg: 'Ya existe una obra social con ese nombre.' });
            }

            if (result.affectedRows > 0) {
                return res.status(200).json({ estado: true, msg: 'Obra social modificada' });
            }

            return res.status(500).json({ estado: false, msg: 'No se pudo modificar la obra social.' });

        } catch (error) {
            console.log(`Error en PUT /obras-sociales/:id ${error}`);
            res.status(500).json({
                estado: false,
                msg: 'Error interno'
            });
        }
    }

    borrar = async (req, res) => {
        try {
            const id_obra_social = req.params.id_obra_social;

            const existe = await this.obrasSociales.buscarPorId(id_obra_social);

            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Obra social no encontrada' });
            }

            const result = await this.obrasSociales.borrar(id_obra_social);

            if (result.affectedRows > 0) {
                return res.status(200).json({ estado: true, msg: 'Obra social eliminada.' });
            }

            return res.status(500).json({ estado: false, msg: 'No se pudo eliminar la obra social.' });

        } catch (error) {
            console.log(`Error en DELETE /obras-sociales/:id ${error}`);
            res.status(500).json({
                estado: false,
                msg: 'Error interno'
            });
        }
    }
}