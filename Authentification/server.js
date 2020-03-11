const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')
const entite     = require('./routes/routefile')
const mongoose   = require('mongoose')
//permer d lire et d'ecrire dans le fichier yaml
const fs         = require('fs')
const js_yaml    = require('js-yaml')
//lecture du fichier
const fichier    = fs.readFileSync('./config/conf.yml')
const data       = js_yaml.safeLoad(fichier)

//connexion à la base de données
mongoose.connect('mongodb://localhost/' + data.DatabaseName);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//appel de mes routes
app.use('/entite', entite);

app.listen(data.PORT, function() {
  console.log('Server is running on Port', data.PORT);
});
