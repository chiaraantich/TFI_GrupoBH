import Pacientes from "../db/pacientes.js";

export default class PacientesServicio {

    constructor(){
        this.pacientes = new Pacientes();
    }

    buscarPorId = (id_paciente) => {
        return this.pacientes.buscarPorId(id_paciente);
    }

    asociarObraSocial = async (id_paciente, id_obra_social) => {
        const existe = await this.pacientes.buscarPorId(id_paciente);
        if (!existe) {
            return null;
        }
        return this.pacientes.asociarObraSocial(id_paciente, id_obra_social);
    }
}