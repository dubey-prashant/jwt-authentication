const User = require("../models/User")
const jwt = require('jsonwebtoken')

//  handle err0rs 
const handleErrors = (err) => {
  let errors = { email: "", pass: "" }
  console.log(err.message, err.code);
  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = 'The email entered in not registered'
  }
  // incorrect pass
  if (err.message === "incorrect password") {
    errors.pass = 'The password entered is incorrect'
  }

  // unique err
  if (err.code === 11000) {
    errors.email = "The email entered has been already registered"
    return errors
  }

  // validation error
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }
  return errors
}
// create token
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
  return jwt.sign({ id }, 'secret for auth', { expiresIn: maxAge })
}

// routes
exports.signup_get = (req, res) => {
  res.render("signup")
}
exports.login_get = (req, res) => {
  res.render("login")
}
exports.signup_post = async (req, res) => {
  const { email, pass } = req.body

  try {
    const user = await User.create({ email: email, pass: pass })
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user: user._id })
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors })
  }
}
exports.login_post = async (req, res) => {
  const { email, pass } = req.body

  try {
    const user = await User.login(email, pass)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }


}

exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 })
  res.redirect("/")
}