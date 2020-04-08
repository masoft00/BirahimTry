//Importation des modules
const express = require('express')
const router  = express.Router()
const bcrypt  = require('bcrypt')
const jwt     = require('jsonwebtoken')
const User    = require('../models/models')

//Ici le route pour s'inscrire
router.post('/inscrire', function (req, res) {
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) {
      return res.status(500).json({
        error: err
      })
    } else {
      const user = new User({
        prenom       : req.body.prenom,
        nom          : req.body.nom,
        adresse      : req.body.adresse,
        dateNaissance: req.body.dateNaissance,
        email        : req.body.email,
        password     : hash
      })
      user
        .save()
        .then(function (result) {
          console.log(result)
          res.status(200).json({
            success: 'Utilisateur créer'
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

// router.post('/inscrire', async (req, res) => {
//   // Create a new user
//   try {
//       const user = new User(req.body)
//       await user.save()
//       const token = await user.generateAuthToken()
//       res.status(201).send({ user, token })
//   } catch (error) {
//       res.status(400).send(error)
//   }
// })

//Route pour se loger
router.post('/login', function (req, res) {
  User.findOne({ email: req.body.email })
    .exec()
    .then(function (user) {
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        //Ici on renvoie un message d'erreur si les informations ne sont pas dans la base de données
        if (err) {
          return res.status(401).json({
            failed: "Access n'est pas autorisé"
          })
        }

        //Ici on donne les infos qui seront dans le Token
        if (result) {
          const JWTToken = jwt.sign(
            {
              _id          : user._id,
              email        : user.email,
              prenom       : user.prenom,
              nom          : user.nom,
              adresse      : user.adresse,
              dateNaissance: user.dateNaissance
            },
            'secret',
            {
              //Temps d'expiration du Token pour notre cas 2h
              expiresIn: '1h'
            }
          )
          //si la connexion passe bien on retoure le token
          return res.status(200).json({
            success: 'Welcome to the JWT Authentication',
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

// Route pour optenir tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//Cette function nous permet de récuperer un id
async function getUser (req, res, next) {
  try {
    users = await User.findById(req.params.id)
    if (users == null) {
      return res.status(404).json({ message: 'Cant find subscriber' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.users = users
  next()
}

// Route pour obtenir un seul utilisateur
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.prenom != null) {
    res.users.prenom = req.body.users
  }
  try {
    const updateduser = await res.users.save()
    res.json(updateduser)
  } catch {
    res.status(400).json({ message: err.message })
  }
})

// Modifier un utilisateur
router.patch('/updates/:id', getUser, (req, res) => {
  
  //res.json(res.users)
})

// Supprimer un utilisateur
router.delete('/delete/:id', getUser, async (req, res) => {
  try {
    await res.users.remove()
    res.json({ message: "L'utilisateur a été supprimer " })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
module.exports = router
