db = require('../models/index')
const Promise = require('bluebird')
const _ = require('lodash')
exports.initParameters = async(req, res, next) => {
    let learningRate = req.body.learningRate
    let steps = req.body.steps
    let layers = req.body.layers

    let cr = []
    learningRate.forEach((lr) => {
        steps.forEach((s) => {
            layers.forEach((l) => {
                cr.push({
                    learningRate: lr,
                    steps: s,
                    layers: l
                })
            })
        })
    })
    await db.Parameter.findAll({
        where : {learningRate : learningRate, steps : steps, layers : layers}
    })
        .then((data) => {
            cr = cr.filter((c) => {
                return !_.find(data, (o) => {return o.learningRate == c.learningRate && o.layers == c.layers && o.steps == c.steps})
            })
            db.Parameter.bulkCreate(cr)
            .then(() => {
                return res.send("done")
            })
        })
}