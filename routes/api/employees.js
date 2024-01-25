const express = require('express')
const router = express.Router()
const path = require('path')

data = {}
data.employees = require('../../data/data.json')

router.route('/')
    .get((req, res) => {
        res.json(data.employees)
    })

    .post((req, res) =>{
        res.json({
            'firsname':req.body.firsname,
            'lastname':req.body.lastname
        })
    })

    .put((req, res) => {
        res.json({
            'firsname':req.body.firsname,
            'lastname':req.body.lastname
        })
    })

    .delete((req, res) => {
        res.json({
            'id':req.body.id
        }) 
    })

router.route('/:id')
    .get((req, res) => {
        res.json({"id":req.params.id})
    })

module.exports = router