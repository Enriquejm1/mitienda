'use strict'

var express = require('express');
var clienteController = require('../controllers/Clientecontroller');
var auth = require('../middlewares/authenticate');
var api = express.Router();

api.post('/registro_cliente', clienteController.registro_cliente);
api.post('/login_cliente', clienteController.login_cliente);

api.get('/listar_clientes_filtro_admin/:tipo/:filtro', auth.auth, clienteController.listar_clientes_filtro_admin);
api.post('/registro_cliente_admin', auth.auth, clienteController.registro_cliente_admin);
api.get('/obtener_cliente_admin/:id', auth.auth, clienteController.obtener_cliente_admin);
api.put('/actualizar_cliente_admin/:id', auth.auth, clienteController.actualizar_cliente_admin);
api.delete('/eliminar_cliente_admin/:id', auth.auth, clienteController.eliminar_cliente_admin);
api.get('/obtener_cliente_publico/:id', auth.auth, clienteController.obtener_cliente_publico);
api.put('/actualizar_perfil_cliente_guest/:id', auth.auth, clienteController.actualizar_perfil_cliente_guest);


//direcciones
api.post('/registro_direccion_cliente', auth.auth, clienteController.registro_direccion_cliente);
api.get('/obtener_direcciones_cliente/:id', auth.auth, clienteController.obtener_direcciones_cliente);
api.put('/cambiar_direcciones_principal_cliente/:id/:cliente', auth.auth, clienteController.cambiar_direcciones_principal_cliente);
api.get('/optener_direccion_principal_cliente/:id', auth.auth, clienteController.optener_direccion_principal_cliente);


//ordenes
api.get('/obtener_ordenes_cliente/:id', auth.auth, clienteController.obtener_ordenes_cliente);
api.get('/obtener_detalles_ordenes_cliente/:id', auth.auth, clienteController.obtener_detalles_ordenes_cliente);

module.exports = api;