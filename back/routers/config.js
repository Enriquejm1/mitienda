'use strict'

var express = require('express');
var confiController = require('../controllers/configcontroller');
var auth = require('../middlewares/authenticate');
var api = express.Router();
var multiparty = require('connect-multiparty');
var path = multiparty({ uploadDir: './uploads/configuraciones' });

api.put('/actualizar_config_admin/:id', [auth.auth, path], confiController.actualizar_config_admin);
api.get('/obtener_config_admin', auth.auth, confiController.obtener_config_admin);
api.get('/obtener_logo/:img', confiController.obtener_logo);
api.get('/obtener_config_publico', confiController.obtener_config_publico);

module.exports = api;