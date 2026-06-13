import PacientesServicio from "../servicios/pacientesServicio.js";

export default class PacientesControlador {

    constructor() {
        this.pacientes = new PacientesServicio();
    }

    asociarObraSocial = async (req, res) => {
        try {
            const id_paciente = req.params.id_paciente;
            const { id_obra_social } = req.body;

            const resultado = await this.pacientes.asociarObraSocial(id_paciente, id_obra_social);

            if (resultado === null) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Paciente no encontrado.'
                });
            }

            return res.status(200).json({
                estado: true,
                mensaje: 'Obra social asociada al paciente.'
            });

        } catch (error) {
            console.log(`Error en PUT /pacientes/:id_paciente/obras-sociales ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno.'
            });
        }
    }
}