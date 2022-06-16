'use strict'

var express = require('express');
var ventaController = require('../controllers/ventacontroller');
var auth = require('../middlewares/authenticate');
var api = express.Router();


api.post('/registro_compra_cliente', auth.auth, ventaController.registro_compra_cliente);

module.exports = api;