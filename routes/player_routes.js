var express = require('express')
const db = require('../db/db')
var router = express.Router()

const Player = require('../models/player')


router.get('/api/players', (req, res) => {
    Player.getAll()
        .then(dbRes => {
            res.json({players: dbRes.rows})
        })
        .catch(err => {
            res.json({message: err.message})
        })
})


//update to filter by game_id
router.get('/api/marking-page/:game_id', (req, res) => {
    //send the client all the player score info stored in players table
    var gameId = req.params.game_id

    var sql = 'SELECT players.player_id, score FROM players INNER JOIN answers ON players.player_id = answers.player_id WHERE players.game_id = $1;'

    db.query(sql, [gameId])
        .then(dbRes => {
            res.json(dbRes.rows)
        })
})


//update to filter by game_id
router.put('/api/marking-page', (req, res) => {
    var instruction = req.body.scoreChange
    var userId = req.body.btnOwner

    if (instruction === 'increase') {
        var sql = `UPDATE players SET score = score + 1 WHERE player_id = $1;`
    } else {
        var sql = `UPDATE players SET score = score - 1 WHERE player_id = $1;`
    }
    db.query(sql, [userId])
        .then( () => {
            res.json( {} )
        })
})


router.patch('/api/players/:id', (req, res) => {
    let playerId = req.params.id
    Player.updatePlayerReady(playerId)
        .then(dbRes => {
            res.json({ player: dbRes.rows[0] })
        })
        .catch(err => {
            res.json({ message: err.message})
        })
})

module.exports = router