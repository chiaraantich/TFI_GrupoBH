import Especialidades from "../bd/especialidades.js"

export default class EspecialidadesServicio {

    constructor(){
        this.especialidades = new Especialidades();
    }

    buscarTodas = () => {
        return this.especialidades.buscarTodas();
    }

    buscarPorId = (id_especialidad) => {
        return this.especialidades.buscarPorId(id_especialidad);
    }

    crear = (nombre) => {
        return this.especialidades.crear(nombre);
    }
 
    modificar = (id_especialidad, nombre) => {
        return this.especialidades.modificar(id_especialidad, nombre);
    }
 
    borrar = (id_especialidad) => {
        return this.especialidades.borrar(id_especialidad);
    }
}