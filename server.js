const mongoose = require('mongoose')
const express = require('express')
const User = require('./model/user')
const bcrypt = require('bcrypt')
const app = express()


mongoose.connect('mongodb://localhost:27017/UserDB', {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const db = mongoose.connection

app.set('view engine','ejs')
app.use(express.urlencoded({ extended:false }))

app.get('/', (req, res) =>
{
    res.render('index.ejs', {name:'Kyle'})
})

app.get('/login', (req, res) =>{
    res.render('login.ejs')
})

app.get('/register', (req, res) =>{
    res.render('register.ejs')
})


app.post('/login', (req, res) =>
{

})

app.post('/register', (req, res) =>
{
        const {name, email, password, password2} = req.body;

        const errors = []


       //edge case if no input
       if( !name || !email || !password || !password2)
       {
           errors.push({msg: 'Please enter all fields'});
       }
        
       if (password != password2) 
        {
            errors.push({ msg: 'Passwords do not match' });
        }
    
        if (password.length < 6) 
        {
            errors.push({ msg: 'Password must be at least 6 characters' });
        }

        if (errors.length > 0) {
            res.render('register', {
              errors,
              name,
              email,
              password,
              password2
            });
          } else {
            User.findOne({ email: email }).then(user => {
              if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                  errors,
                  name,
                  email,
                  password,
                  password2
                });
              } else {
                const newUser = new User({
                  name,
                  email,
                  password
                });
        
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                      .save()
                      .then(user => {
                        req.flash(
                          'success_msg',
                          'You are now registered and can log in'
                        );
                        res.redirect('/users/login');
                      })
                      .catch(err => console.log(err));
                  });
                });
              }
            });
          }

       

    
})

app.listen(3000)