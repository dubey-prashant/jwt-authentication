const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const authRoutes = require("./routes/authRoutes")
const {requireAuth, checkUser} = require("./middleware/authMiddleware")
const mongoauth = require('./mongoauth.js')
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
// view engine
app.set('view engine', 'ejs');

// database connection
const mongoId = mongoauth.id()
const mongoPass = mongoauth.pass()
const dbURI = 'mongodb+srv://'+ mongoId +':'+ mongoPass +'@dubeytech.xuq1b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).catch((err) => console.log(err));

// routes
app.get("*", checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)

app.listen(process.env.PORT || 3000, ()=> console.log("working...."))