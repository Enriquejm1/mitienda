var config = require('../models/config');
var fs = require('fs');
var path = require('path');

const obtener_config_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let reg = await config.findById({ _id: "629bfbdaf97f66da359327c1" });
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'Acceso denegado' });
        }
    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}


const actualizar_config_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {


            let data = req.body;
            if (req.files) {
                console.log('si hay img');
                var img_path = req.files.logo.path;
                var name = img_path.split('\\');
                var logo_name = name[2];
                let reg = await config.findByIdAndUpdate({ _id: "629bfbdaf97f66da359327c1" }, {
                    categorias: JSON.parse(data.categorias),
                    titulo: data.titulo,
                    serie: data.serie,
                    logo: logo_name,
                    correlativo: data.correlativo,
                });

                fs.stat('./uploads/configuraciones/' + reg.logo, function(error) {
                    if (!error) {
                        fs.unlink('./uploads/configuraciones/' + reg.logo, (err) => {
                            if (err) throw err;
                        });
                    } else {
                        console.log('error');
                    }
                });
                res.status(200).send({ data: reg });
            } else {
                console.log('No hay img');
                let reg = await config.findByIdAndUpdate({ _id: "629bfbdaf97f66da359327c1" }, {
                    categorias: data.categorias,
                    titulo: data.titulo,
                    serie: data.serie,
                    correlativo: data.correlativo,
                });
                res.status(200).send({ data: reg });
            }

        } else {
            res.status(500).send({ message: 'Acceso denegado' });
        }
    } else {
        res.status(500).send({ message: 'Acceso denegado' });
    }
}


const obtener_logo = async function(req, res) {
    var img = req.params['img'];
    fs.stat('./uploads/configuraciones/' + img, function(error) {
        if (!error) {
            let path_img = './uploads/configuraciones/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/default.jpg' + img;
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}


const obtener_config_publico = async function(req, res) {
    let reg = await config.findById({ _id: "629bfbdaf97f66da359327c1" });
    res.status(200).send({ data: reg });
}

module.exports = {
    actualizar_config_admin,
    obtener_config_admin,
    obtener_logo,
    obtener_config_publico
}