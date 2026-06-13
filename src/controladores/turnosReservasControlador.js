import TurnosReservas from "../servicios/turnosReservasServicio.js";

export default class TurnosReservasControlador {

    constructor() {
        this.turnosReservas = new TurnosReservas();
    }

    crear = async (req, res) => {
        try{            
            const turnoReserva = req.dto;

            const nuevoTurnoReserva = await this.turnosReservas.crear(turnoReserva);
            
            if(!nuevoTurnoReserva || nuevoTurnoReserva.length === 0){
                return res.status(400).json({
                    estado: false, 
                    mensaje: 'No se pudo crear el turno.'
                });
            }

            return res.status(201).json({
                estado: true,
                mensaje: 'Turno Creado.',
                datos: nuevoTurnoReserva
            });

        }catch(error){
            console.log(`Error en POST /turnos-reservas ${error}`);
            res.status(500).json(
                {
                    'estado': false, 
                    'mensaje': 'Error interno.'
                }
            );
        }
    }

    buscarTodos = async (req, res) => {
        try{

            const turnos = await this.turnosReservas.buscarTodas(req.user);

            res.status(200).json(
                {
                    'estado': true, 
                    'mensaje': 'Turnos encontrados.',
                    'turnos': turnos
                }
            );

        }catch(error) {
            console.log(`Error en GET /turnos-reservas ${error}`);            
            res.status(500).json({
                'estado': false,
                'mensaje': 'Error interno'
            })    
        }
    }

    porEspecialidad = async (req, res) => {
        try{
            const { buffer, headers } = await this.turnosReservas.porEspecialidad();
            
            res.set(headers);

            res.status(200).end(buffer);
            
        }catch(error) {
            console.log(`Error en GET /turnos-reservas/por-especialidad ${error}`);            
            res.status(500).json({
                'estado': false,
                'mensaje': 'Error interno'
            })    
        }
    }

    marcarAtendido = async (req, res) => {
        try {
            const id_turno_reserva = req.params.id_turno_reserva;

            const resultado = await this.turnosReservas.marcarAtendido(id_turno_reserva);

            if (resultado === null) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Turno no encontrado.'
                });
            }

            return res.status(200).json({
                estado: true,
                mensaje: 'Turno marcado como atendido.'
            });

        } catch (error) {
            console.log(`Error en PATCH /turnos-reservas/:id_turno_reserva/atendido ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno.'
            });
        }
    }

    estadisticas = async (req, res) => {
        try {
            const datos = await this.turnosReservas.estadisticas();

            res.status(200).json({
                estado: true,
                mensaje: 'Estadísticas de atenciones.',
                datos: datos
            });

        } catch (error) {
            console.log(`Error en GET /turnos-reservas/estadisticas ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno.'
            });
        }
    }

    // extra
    agregarObservaciones = async (req, res) => {
        try {
            const id_turno_reserva = req.params.id_turno_reserva;
            const { observaciones } = req.dto;

            const resultado = await this.turnosReservas.agregarObservaciones(id_turno_reserva, observaciones);

            if (resultado === null) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Turno no encontrado.'
                });
            }

            return res.status(200).json({
                estado: true,
                mensaje: 'Observaciones agregadas.'
            });

        } catch (error) {
            console.log(`Error en PATCH /turnos-reservas/:id_turno_reserva/observaciones ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno.'
            });
        }
    }
}