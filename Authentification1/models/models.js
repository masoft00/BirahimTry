const mongoose = require('mongoose')
//ici la structure de ma table (shema)
const user = mongoose.Schema({
  prenom: {
    type: String,
    required: true
  },
  nom: {
    type: String,
    required: false
  },
  adresse: {
    type: String,
    required: false
  },
  dateNaissance: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  password: {
    type: String,
    required: false
  }
})
//exporter mon module
module.exports = mongoose.model('User', user)
