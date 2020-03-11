require("amd-loader");
const mongoose = require('mongoose')
define(['../exporterEntity.js'], function (exporterEntity) {
  let data       = exporterEntity.data
  data           = JSON.parse(JSON.stringify(data))
  const  entite  = new mongoose.Schema(data)
  module.exports = mongoose.model('entite', entite)
})
