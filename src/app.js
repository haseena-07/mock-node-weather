const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('postman-request');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname , '../templates/partials')


app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Cube Works'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us',
        name: 'Tritian Works'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpmsg: 'You can mail us at tritianworks@gmail.com for any queries',
        title: 'Help',
        name: 'Cube Works'
    })
})

app.get('/weather', (req, res) => {
    
    if(!req.query.address) {
        return res.send({
            error: 'Enter an address to know the weather'
        })
    }

    geocode(req.query.address, (error,{ latitude, longitude, location} = {} ) => {
        if(error) {
            return res.send( {error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })

    })
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'Enter a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Cube Works',
        errormsg: 'Help article not found'
    })
})

app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Cube Works',
        errormsg: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})