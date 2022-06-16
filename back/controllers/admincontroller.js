'use strict'

var Admin = require('../models/admin');
var Venta = require('../models/venta');
var Dventa = require('../models/dventa');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
const registro_admin = async function(req, res) {
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({ email: data.email });

    if (admin_arr.length == 0) {
        //
        if (data.password) {
            bcrypt.hash(data.password, null, null, async function(err, hash) {
                if (hash) {
                    data.password = hash;
                    var reg = await Admin.create(data);
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


const login_admin = async function(req, res) {
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({ email: data.email })
    if (admin_arr.length == 0) {
        res.status(200).send({ message: 'No se encuentra el correo', data: undefined });
    } else {
        let user = admin_arr[0];
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


//Ventas

const obtener_ventas_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {

            let ventas = [];
            let desde = req.params['desde'];
            let hasta = req.params['hasta'];

            if (desde == 'undefined' && hasta == 'undefined') {
                ventas = await Venta.find().populate('cliente').populate('direccion').sort({ createAt: -1 });
                res.status(200).send({ data: ventas });
            } else {
                let tt_desde = Date.parse(new Date(desde + 'T00:00:00')) / 1000;
                let tt_hasta = Date.parse(new Date(hasta + 'T00:00:00')) / 1000;
                let tem_ventas = await Venta.find().populate('cliente').populate('direccion').sort({ createAt: -1 });

                for (var item of tem_ventas) {
                    var tt_created = Date.parse(new Date(item.createAt)) / 1000;
                    if (tt_created >= tt_desde && tt_created <= tt_hasta) {
                        ventas.push(item);
                    }
                }
                res.status(200).send({ data: ventas });
            }

        } else {
            res.status(200).send({ message: 'No acceso' });
        }
    } else {
        res.status(500).send({ message: 'No acceso' })
    }

}


module.exports = {
    registro_admin,
    login_admin,
    obtener_ventas_admin
}