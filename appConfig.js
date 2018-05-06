module.exports = {
    elastic: {
        host: 'localhost:9200'
    },
    security: {
        tokenBytes: 24,
        hashMethod: 'sha512',

        hashBytes: 32,
        saltBytes: 16,
        iterations: 100
    },

//poner aqui los mensages que mostrara el controllardor de errores
    messages: {
        500: "Internal Error",
        503:"Se ha esgotado el tiempo de espera",
        404: "No encontrado",
        401: "Error contraseña o usuario incorrecto",


        'EAUTH':"No tienes permisios suficientes",
        "ERegister": "Error no se ha podido realizar la operacion"
    }
};