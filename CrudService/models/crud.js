require("amd-loader");
const mongoose = require('mongoose')
define(['../exploitation'], function (exploitation) {
  let data   = exploitation.data
  data       = JSON.parse(JSON.stringify(data))
 const  Crud = new mongoose.Schema(data)
  module.exports = mongoose.model('Crud', Crud)
})
