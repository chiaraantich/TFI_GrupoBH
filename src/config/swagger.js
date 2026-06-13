import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Turnos Médicos',
            version: '1.0.0',
            description: 'API REST para gestión de turnos médicos - TFI Programación III'
        },
        servers: [
            {
                url: 'http://localhost:3001/api/v1'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/rutas/v1/*.js']
};

export const specs = swaggerJsdoc(options);