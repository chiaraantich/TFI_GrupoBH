import TurnosReservas from "../db/turnosReservas.js";
import MedicosServicio from "../servicios/medicosServicio.js";
import PacientesServicio from "../servicios/pacientesServicio.js";
import ObrasSocialesServicio from "../servicios/obrasSocialesServicio.js";
import InformeServicio from "../servicios/informesServicio.js";

export default class TurnosReservasServicio {

    constructor(){
        this.turnosReservas = new TurnosReservas();
        this.medicos = new MedicosServicio();
        this.pacientes = new PacientesServicio();
        this.obrasSociales = new ObrasSocialesServicio();
        this.informes = new InformeServicio();
    }

    porEspecialidad = async () => {
        const datos = await this.turnosReservas.porEspecialidad();
        const obrasSociales = await this.turnosReservas.resumenObrasSociales();

        const pdf = await this.informes.reportePorEspecialidades(datos, obrasSociales);

        return {
            buffer: pdf,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="reporte.pdf"'
            }
        }
    }

    buscarTodas = async (usuario) => {
        if (usuario.rol === 1){
            return this.turnosReservas.turnosDeUnMedico(usuario.id_usuario);
        }else{
            return this.turnosReservas.turnosDeUnPaciente(usuario.id_usuario);
        }
    }

    crear = async (turnoReserva) => {
        const medico = await this.medicos.buscarPorId(turnoReserva.id_medico);

        const paciente = await this.pacientes.buscarPorId(turnoReserva.id_paciente);

        const obra_social = await this.obrasSociales.buscarPorId(paciente.id_obra_social);

        let valor = medico.valor_consulta;

        if(obra_social.es_particular === 0){
            valor = valor - (obra_social.porcentaje_descuento * valor);
        }
        
        turnoReserva.valor_total = valor;
        turnoReserva.id_obra_social = paciente.id_obra_social;

        const id_nuevo = await this.turnosReservas.crear(turnoReserva);
        return id_nuevo;
    }

    marcarAtendido = async (id_turno_reserva) => {
        const turno = await this.turnosReservas.buscarPorId(id_turno_reserva);
        if (!turno) {
            return null;
        }
        return this.turnosReservas.marcarAtendido(id_turno_reserva);
    }

    estadisticas = async () => {
        return this.turnosReservas.estadisticas();
    }

    // funcion extra
    agregarObservaciones = async (id_turno_reserva, observaciones) => {
        const turno = await this.turnosReservas.buscarPorId(id_turno_reserva);
        if (!turno) {
            return null;
        }
        return this.turnosReservas.agregarObservaciones(id_turno_reserva, observaciones);
    }
}