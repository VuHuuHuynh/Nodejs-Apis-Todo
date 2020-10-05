const USER = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.create = async(req, res) =>{
    try {
        let user = new USER(req.body)
    
        user.password = bcrypt.hashSync(user.password, 10)
        user.roles = ['USER']
    
        await user.save()
    
        return res.jsonp({
          message: 'success',
        })
      } catch (error) {
        console.log(error)
        return res.status(500).jsonp({
          message: error,
        })
      }
   }

exports.login = async (req, res) => {
    try {
      const user = await USER.findOne({ email: req.body.email })
  
      if (!user || !bcrypt.compareSync(req.body.password, user.password))
        return res.status(403).jsonp({ message: 'login failed' })
  
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          roles: user.roles,
        },
        process.env.JWT_TOKEN
      )
  
      user.token.push(token)
  
      await user.save()
  
      return res.jsonp({
        message: 'success',
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          roles: user.roles,
        },
        token,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).jsonp({
        message: error,
      })
    }
  }

exports.userByEmail = async (req, res, next, email) => {
    try {
      if (req.user.email != email && !req.user.roles.includes('SUPERUSER'))
        return res.status(401).jsonp({
          message: 'Unauthorized',
        })
  
      const user = await USER.findOne({ email: email }).select({ token: 0, password: 0 })
  
      if (!user) return res.status(404).jsonp({ message: 'cannot find email' })
  
      req.userByEmail = user
  
      next()
    } catch (error) {
      console.log(error)
      return res.status(500).jsonp({
        message: error,
      })
    }
  }

  exports.update = async (req, res) => {
    try {
      if (!req.user.roles.includes('SUPERUSER'))
        return res.status(401).jsonp({message:'Unauthorized!'})
      
      const user = req.userByEmail
      const updateUser = req.body
      await user.updateOne({$set:updateUser})
      
      return res.jsonp({message:'update success!'})
      
    } catch (error) {
      console.log(error)
      return res.status(500).jsonp({
        message: error,
      })
    }
  }

  exports.list = async (req, res) => {
    try {
      const users = await USER.find({})
        .select({
          password: 0,
          token: 0,
        })
        .lean()
  
      return res.jsonp({ message: 'success', users })
    } catch (error) {
      console.log(error)
      return res.status(500).jsonp({
        message: error,
      })
    }
  }
  
exports.delete = async (req, res) => {
  try {
    const user = req.userByEmail

    if (user.email === req.user.email)
      return res.status(500).json({ message: 'Can not remove yourself' })

    if (user.roles.includes('SUPERUSER'))
      return res.status(500).json({ message: 'Can not remove superuser' })

    await user.remove()

    return res.jsonp({ message: 'success' })
  } catch (error) {
    console.log(error)
    return res.status(500).jsonp({
      message: error,
    })
  }
}