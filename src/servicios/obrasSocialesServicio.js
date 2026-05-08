import ObrasSociales from "../bd/obrasSociales.js";

export default class ObrasSocialesServicio {

    constructor () {
        this.obrasSociales = new ObrasSociales();
    }

    buscarTodas = () => {
        return this.obrasSociales.buscarTodas();
    }

    buscarPorId = (id_obra_social) => {
        return this.obrasSociales.buscarPorId(id_obra_social);
    }

    crear = (nombre, descripcion, porcentaje_descuento, es_particular) => {
        return this.obrasSociales.crear(nombre, descripcion, porcentaje_descuento, es_particular);
    }

    modificar = (id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular) => {
        return this.obrasSociales.modificar(id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular);
    }

    borrar = (id_obra_social) => {
        return this.obrasSociales.borrar(id_obra_social);
    }
}