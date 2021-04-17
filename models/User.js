const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const {isEmail} = require("validator")

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    unique: true,
    required: [true, 'please enter an email'],
    lowercase: true,
    validate: [isEmail, "please enter a valid email"]
  },
  pass:{
    type: String,
    required:[true, 'please enter a password'],
    minlength: [6, 'please enter password of min 6 characters']
  }
})
// fire fuction before saving doc to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt()
  this.pass = await bcrypt.hash(this.pass, salt)
  next()
})
// static method to log in

userSchema.statics.login = async function (email, pass) {
  const user = await this.findOne({email})

  if (user) {
    const isPassCorrect = await bcrypt.compare(pass, user.pass)
    if (isPassCorrect) {
      return user
    }
    throw Error ("incorrect password")
  }
  throw Error ("incorrect email")

}

const User = mongoose.model("user", userSchema)

module.exports = User