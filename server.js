const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET ='ksvdno@#%#Slkvandlgfaasdfasdf'

mongoose.connect('mongodb://localhost:27017/UserDB', {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/change-password', (req, res) =>{
    const { token } = req.body

    jwt.verify(token.JWT_SECRET)
})

app.post('/api/login', async (req, res,) => {

    const {username, password} = req.body

    const user = await User.findOne({username}).lean()

    
    if(!user)
    {
        return res.json({ status: 'error', error: 'Invalid username/password' })
    }
    
    if(await bcrypt.compare(password, user.password))
    {
        const token = jwt.sign({ 
            id: user._id, 
            username: user.username 
        }, JWT_SECRET)
        return res.json({status: 'ok', data: token})
        
    }
    res.json({status: 'error', error: 'Invalid username/password'})
})



app.post('/api/register', async (req, res) =>{

    const { username, password : plainTextPassword} = req.body

    if (!username || typeof username !== 'string')
    {
        return res.json({status: 'error', error: 'Invalid Username'})
    }

    if (plainTextPassword.length < 1) {
		return res.json({
			status: 'error',
			error: 'Please provide a password.'
		})
	}

    const password = await bcrypt.hash(plainTextPassword, 10)

    try 
    {
       const response = await User.create({
            username,
            password
        })
        console.log('User created successfully: ', response)
    } catch (error)
    {
        if (error.code === 11000) {
		
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error

    }


    res.json({status: 'ok'})
})


app.listen(9999, ()=> {
    console.log('Server up at 9999')}
    )