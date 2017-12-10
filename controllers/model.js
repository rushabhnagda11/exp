const db = require('../models/index')

exports.createModel = (req, res, next) => {
    let name = req.body.name
    if(!name) {
        return res.status(400).send("Please add a model name")
    }
    db.Model.create({
            name: name
        })
        .then((newModel) => {
            res.json(newModel)
        }).catch(err => next(err))
}
exports.getModel = (req, res, next) => {
    let modelId = req.params.modelId
    db.Model.find({
            where: {
                id: modelId
            },
            include: [{
                model: db.Experiment,
                limit : 1,
                order: [['score', 'DESC']],
                include: [{model : db.Parameter}]
            }],
            limit: 1

    }).then(data => res.json(data))
    .catch(err => next(err))
}