require('amd-loader')
const mongoose = require('mongoose')

define(['../exploitation'], function (exploitation) {
  //console.log(read.data);
  let data = exploitation.data
  data = JSON.parse(JSON.stringify(data))
  console.log(data)
  //console.log(data)
  const tab=process.env.entite;
  const  tab= new mongoose.Schema(
    data
  )
  module.exports = mongoose.model(tab, tab)
})
