//Importation des modules
const express      = require('express')
const router       = express.Router()
const bcrypt       = require('bcrypt')
const jwt          = require('jsonwebtoken')
const entites      = require('../models/filemodels.js')
const loadYamlFile = require('load-yaml-file')
 
loadYamlFile('./routes/inscriptionData.yml').then(inscriptionData => {

  //Ici le route pour s'inscrire
  console.log(inscriptionData.prenom)
  router.post('/inscrire', function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      if (err) {
        return res.status(500).json({
          error: err
        })
      } else {
        const entite = new entites(
          inscriptionData
        )
        entite
          .save()
          .then(function (result) {
            console.log(result)
            res.status(200).json({
              success: "supert l'utilisateur à été créé"
            })
          })
          .catch(error => {
            res.status(500).json({
              error: err
            })
          })
      }
    })
  })
})

//Route pour se loger

loadYamlFile('./routes/loginData.yml').then(loginData => {
router.post('/login', function (req, res) {
  entites
    .findOne({ email: req.body.email })
    .exec()
    .then(function (entites) {
      bcrypt.compare(req.body.password, entites.password, function (
        err,
        result
      ) {
        //Ici on renvoie un message d'erreur si les informations ne sont pas dans la base de données
        if (err) {
          return res.status(401).json({
            failed: "Access n'est pas autorisé"
          })
        }

        //Ici on donne les infos qui seront dans le Token
        if (result) {
          const JWTToken = jwt.sign(
            loginData,'secret',
            {
              //Temps d'expiration du Token pour notre cas 2h
              expiresIn: '2h'
            }
          )

          //si la connexion passe bien on retoure le token
          return res.status(200).json({
            success: 'Welcome to the JWT Auth',
            token: JWTToken
          })
        }
        //si la connexion s'est mal passé on retourne une erreur
        return res.status(401).json({
          failed: 'Unauthorized Access'
        })
      })
    })
    .catch(error => {
      res.status(500).json({
        error: error
      })
    })
})
})


// Route pour optenir tous les utilisateurs
router.get('/entite', async (req, res) => {
  try {
    const entite = await entites.find()
    res.json(entite)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//Cette function nous permet de récuperer un id
async function getUser (req, res, next) {
  try {
    entite = await entites.findById(req.params.id)
    if (entites == null) {
      return res.status(404).json({ message: 'Cant find subscriber' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.entites = entite
  next()
}
// Route pour obtenir un seul utilisateur
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.email != null) {
    res.entites.email = req.body.entites
  }
  try {
    const updateduser = await res.entites.save()
    res.json(updateduser)
  } catch {
    res.status(400).json({ message: err.message })
  }
})

// Modifier un utilisateur
router.patch('/update/:id', getUser, (req, res) => {
  res.json(res.entite)
})

// Supprimer un utilisateur
router.delete('/delete/:id', getUser, async (req, res) => {
  try {
    await res.entites.remove()
    res.json({ message: "L'utilisateur a été supprimer " })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//exportation du module
module.exports = router
