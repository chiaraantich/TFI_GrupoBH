import EspecialidadesServicio from "../servicios/especialidadesServicio.js";

export default class EspecialidadesControlador {

    constructor () {
        this.especialidades = new EspecialidadesServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const especialidades = await this.especialidades.buscarTodas();

            res.status(200).json({
                estado: true,
                especialidades: especialidades
            });
        } catch (error) {
            console.log(`Error en GET /especialidades ${error}`);
            res.status(500).json({
                estado: false,
                msg: 'Error interno'
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const id_especialidad = req.params.id_especialidad;

            const especialidades = await this.especialidades.buscarPorId(id_especialidad);

            if (especialidades.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Especialidad no encontrada' });
            }

            res.status(200).json({
                estado: true,
                especialidades: especialidades
            });
        } catch (error) {
            console.log(`Error en GET /especialidades/:id ${error}`);
            res.status(500).json({
                estado: false,
                msg: 'Error interno'
            });
        }
    }

    crear = async (req, res) => {
        try {
            const { nombre } = req.body;

            const resultado = await this.especialidades.crear(nombre);

            if (resultado.conflicto) {
                return res.status(409).json({ estado: false, msg: 'Ya existe una especialidad activa con ese nombre.' });
            }

            if (resultado.reactivada) {
                if (resultado.affectedRows > 0) {
                    return res.status(200).json({ estado: true, msg: `Especialidad reactivada con ID ${resultado.id}` });
                }
                return res.status(500).json({ estado: false, msg: 'No se pudo reactivar la especialidad.' });
            }

            if (resultado.affectedRows > 0) {
                return res.status(201).json({ estado: true, msg: `Especialidad creada con ID ${resultado.id}` });
            }

            return res.status(500).json({ estado: false, msg: 'No se pudo crear la especialidad.' });

        } catch (error) {
            console.log(`Error en POST /especialidades ${error}`);
            res.status(500).json({
                estado: false,
                msg: 'Error interno'
            });
        }
    }

    modificar = async (req, res) => {
        try {
            const id_especialidad = req.params.id_especialidad;

            const existe = await this.especialidades.buscarPorId(id_especialidad);

            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Especialidad no encontrada' });
            }

            const { nombre } = req.body;

            const result = await this.especialidades.modificar(id_especialidad, nombre);

            if (result.conflicto) {
                return res.status(409).json({ estado: false, msg: 'Ya existe una especialidad con ese nombre.' });
            }

            if (result.affectedRows > 0) {
                return res.status(200).json({ estado: true, msg: 'Especialidad modificada' });
            }

            return res.status(500).json({ estado: false, msg: 'No se pudo modificar la especialidad.' });

        } catch (error) {
            console.log(`Error en PUT /especialidades/:id ${error}`);
            res.status(500).json({
                estado: false,
                msg: 'Error interno'
            });
        }
    }

    borrar = async (req, res) => {
        try {
            const id_especialidad = req.params.id_especialidad;

            const existe = await this.especialidades.buscarPorId(id_especialidad);

            if (existe.length === 0) {
                return res.status(404).json({ estado: false, msg: 'Especialidad no encontrada' });
            }

            const result = await this.especialidades.borrar(id_especialidad);

            if (result.affectedRows > 0) {
                return res.status(200).json({ estado: true, msg: 'Especialidad eliminada.' });
            }

            return res.status(500).json({ estado: false, msg: 'No se pudo eliminar la especialidad.' });

        } catch (error) {
            console.log(`Error en DELETE /especialidades/:id ${error}`);
            res.status(500).json({
                estado: false,
                msg: 'Error interno'
            });
        }
    }
}