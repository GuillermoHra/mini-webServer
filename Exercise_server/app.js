
const express = require('express')
const path = require('path')
const omdb = require('./omdb.js')
const app = express()

const publicDir = path.join(__dirname, 'public')
console.log(publicDir)

app.use(express.static(publicDir))

app.get('/', function(req, res){
    res.send('<h1>Hola mundo</h1>')
})

app.get('/about', function(req, res){
    res.send('About')
})

app.get('/contact', function(req, res){
    res.send('Contact')
})

app.get('/productos/', function(req, res) {
    if(!req.query.search) {
        res.send({
            error: 'Debes poner un search term'
        })
    } 
    if(req.query.color) {
        console.log(req.query.color)
    }
    res.send({
        productos: []
    })
})

app.get('/omdb', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if(!req.query.search){
        return res.send({
            error: 'Tienes que dar una pelicula'
        })
    }
    omdb.omdbMovie(req.query.search, function(error, response) {
        if(error) {
            return res.send({
                error: error
            })
        }
        if(req.query.season) {
            omdb.omdbSeason(response.title, req.query.season, function(error, response) {
                if(error) {
                    return res.send({
                        error: error
                    })
                }
                res.send({
                    title: response.title,
                    season: response.season,
                    episodes: response.episodes
                })
            })
        } else {
            res.send({
                title: response.title,
                plot: response.plot,
                rating: response.rating
            })
        }
    })
})

app.get('*', function(req, res) {
    res.send({
        error: 'Esta ruta no existe'
    })
})

app.listen(3000, function(){
    console.log('up and running')
})