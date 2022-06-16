'use strict'

var Cliente = require('../models/cliente');
var Venta = require('../models/venta');
var Dventa = require('../models/dventa');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var Direccion = require('../models/direccion');

const registro_cliente = async function(req, res) {
    var data = req.body;
    console.log(data);
    var cliente_arr = [];
    cliente_arr = await Cliente.find({ email: data.email });

    if (cliente_arr.length == 0) {
        //
        if (data.password) {
            bcrypt.hash(data.password, null, null, async function(err, hash) {
                if (hash) {
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({ data: reg });
                } else {
                    res.status(200).send({ message: 'ErrorServe', data: undefined });
                }
            });
        } else {
            res.status(200).send({ message: 'No hay una contraseña', data: undefined });
        }
    } else {
        res.status(200).send({ message: 'El correo ya existe en la base de datos', data: undefined });
    }


}



const login_cliente = async function(req, res) {
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({ email: data.email })
    if (cliente_arr.length == 0) {
        res.status(200).send({ message: 'No se encuentra el correo', data: undefined });
    } else {
        let user = cliente_arr[0];
        bcrypt.compare(data.password, user.password, async function(err, check) {
            if (check) {
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            } else {
                res.status(200).send({ message: 'La contraseña no es correcta', data: undefined });
            }
        });
    }
}


const listar_clientes_filtro_admin = async function(req, res) {
    console.log(req.user);
    if (req.user) {
        if (req.user.role == 'admin') {
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];;
            //console.log(tipo);

            if (tipo == null || tipo == 'null') {
                let reg = await Cliente.find();
                res.status(200).send({ data: reg });
            } else {
                if (tipo == 'apellidos') {
                    let reg = await Cliente.find({ apellidos: new RegExp(filtro, 'i') });
                    res.status(200).send({ data: reg });
                } else {
                    if (tipo == 'correo') {
                        let reg = await Cliente.find({ email: new RegExp(filtro, 'i') });
                        res.status(200).send({ data: reg });
                    }
                }
            }
        } else {
            res.status(500).send({ message: 'Acceso no permitido' });
        }
    } else {
        res.status(500).send({ message: 'Acceso no permitido' })
    }

}

const registro_cliente_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var data = req.body;

            bcrypt.hash('12345678', null, null, async function(err, hash) {
                if (hash) {
                    data.password = hash;
                    let reg = await Cliente.create(data);
                    res.status(200).send({ data: reg });
                } else {
                    res.status(200).send({ message: 'Hubo un error en el servido', data: undefined });
                }
            })

        } else {
            res.status(500).send({ message: 'Acceso denegado' });
        }
    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}


const obtener_cliente_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];

            try {
                var reg = await Cliente.findById({ _id: id });
                res.status(200).send({ data: reg });
            } catch (error) {
                res.status(200).send({ data: undefined });
            }


        } else {
            res.status(500).send({ message: 'Acceso denegado' });
        }
    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}


const actualizar_cliente_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];
            var data = req.body;
            var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                genero: data.genero
            });
            res.status(200).send({ data: reg });
        } else {
            res.status(500).send({ message: 'Acceso denegado' });
        }
    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}


const eliminar_cliente_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];

            let reg = await Cliente.findByIdAndRemove({ _id: id });
            res.status(200).send({ data: reg });
        } else {
            res.status(500).send({ message: 'Acceso denegado' });
        }
    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}


const obtener_cliente_publico = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];

        try {
            var reg = await Cliente.findById({ _id: id });
            res.status(200).send({ data: reg });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }

    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}

const actualizar_perfil_cliente_guest = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];
        var data = req.body;
        console.log(data.password);
        if (data.password) {
            console.log("con contraseña");
            bcrypt.hash(data.password, null, null, async function(err, hash) {
                var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
                    nombre: data.nombres,
                    apellidos: data.apellidos,
                    telefono: data.telefono,
                    f_nacimiento: data.f_nacimiento,
                    dni: data.dni,
                    genero: data.genero,
                    pais: data.pais,
                    password: hash,
                });
                res.status(200).send({ data: reg });
            });

        } else {

            console.log("Sin contraseña");
            var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
                nombre: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                genero: data.genero,
                pais: data.pais
            });
            res.status(200).send({ data: reg });
        }

    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}

//direcciones 
const registro_direccion_cliente = async function(req, res) {
    if (req.user) {
        var data = req.body;
        if (data.principal) {
            let direccion = await Direccion.find({ Cliente: data.Cliente });
            direccion.forEach(async element => {
                await Direccion.findByIdAndUpdate({ _id: element.id }, { principal: false });
            });
        }


        let reg = await Direccion.create(data);
        res.status(200).send({ data: reg });
    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}


const obtener_direcciones_cliente = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];

        let direccion = await Direccion.find({ Cliente: id }).populate('cliente').sort({ createdAt: -1 });
        res.status(200).send({ data: direccion });
    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}


const cambiar_direcciones_principal_cliente = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];
        var cliente = req.params['cliente'];

        let direcciones = await Direccion.find({ Cliente: id });

        direcciones.forEach(async element => {
            await Direccion.findByIdAndUpdate({ _id: element._id }, { principal: false });
        });

        await Direccion.findByIdAndUpdate({ _id: id }, { principal: true });

        res.status(200).send({ data: true });
    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}


const optener_direccion_principal_cliente = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];
        var direccion = undefined;


        direccion = await Direccion.findOne({ Cliente: id, principal: true });

        if (direccion == undefined) {
            res.status(200).send({ data: undefined });
        } else {
            res.status(200).send({ data: direccion });
        }


    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}



const obtener_ordenes_cliente = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];

        let reg = await Venta.find({ cliente: id }).sort({ createdAt: -1 });

        if (reg.length >= 1) {
            res.status(200).send({ data: reg });
        } else {
            res.status(200).send({ data: undefined });

        }

    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}


const obtener_detalles_ordenes_cliente = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];

        try {
            let venta = await Venta.findById({ _id: id }).populate('direccion').populate('cliente');
            let detalles = await Dventa.find({ venta: id }).populate('producto');

            res.status(200).send({ data: venta, detalles: detalles });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }

    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}
module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_publico,
    actualizar_perfil_cliente_guest,
    registro_direccion_cliente,
    obtener_direcciones_cliente,
    cambiar_direcciones_principal_cliente,
    optener_direccion_principal_cliente,
    obtener_ordenes_cliente,
    obtener_detalles_ordenes_cliente
}