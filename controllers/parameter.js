db = require('../models/index')

exports.initParameters = (req,res,next) => {
    let learningRate = req.body.learningRate
    let steps = req.body.steps
    let layers = req.body.layers

    let cr = []
    learningRate.forEach((lr) => {
        steps.forEach((s) => {
            layers.forEach((l) => {
                cr.push({learningRate : lr, steps : s, layers : l})
            })
        })
    })
    console.log(cr)
    db.Parameter.bulkCreate(cr)
    .then(() => {
        res.send("done")
    })
}