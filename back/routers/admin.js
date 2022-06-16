'use strict'

var express = require('express');
var Admincontroller = require('../controllers/admincontroller');
var auth = require('../middlewares/authenticate');
var api = express.Router();

api.post('/registro_admin', Admincontroller.registro_admin);
api.post('/login_admin', Admincontroller.login_admin);
api.get('/obtener_ventas_admin/:desde/:hasta', auth.auth, Admincontroller.obtener_ventas_admin);
module.exports = api;