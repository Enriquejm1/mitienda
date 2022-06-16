'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DventaSchema = Schema({
    producto: { type: Schema.ObjectId, ref: 'producto', required: true },
    venta: { type: Schema.ObjectId, ref: 'venta', required: true },
    subtotal: { type: Number, require: true },
    cantidad: { type: Number, require: true },
    createAt: { type: Date, default: Date.now, require: true }
});

module.exports = mongoose.model('dventa', DventaSchema);