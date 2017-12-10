const db = require('../models/index')
const util = require('util')
const Promise = require('bluebird')
const exec = util.promisify(require('child_process').exec);
const _ = require('lodash')
exports.generateExperiments = async(req, res, next) => {
    let modelId = parseInt(req.body.modelId)
    let exp = []
    await db.Parameter.findAll()
        .then((params) => {
            if (!params || params.length == 0) {
                return res.status(400).send("Experiment params havent been generated. Please do that first.")
            }
            params.forEach(o => exp.push({
                modelId: modelId,
                parametersId: o.id
            }))
        })


    await db.Experiment.findAll({
            where: {
                modelId: modelId
            }
        })
        .then((data) => {
            if (data && data.length > 0) {
                return res.status(400).send("Experiments have already been generated. Please delete them and then generate them again")
            }
        })
    db.Experiment.bulkCreate(exp)
        .then(() => {
            return res.send("Experiments generated successfully")
        })
}

exports.runExperiments = (req, res, next) => {
    let modelId = req.body.modelId
    db.Experiment.findAll({
            where: {
                modelId: modelId
            },
            include: [{
                model: db.Parameter
            }]
        })
        .then((data) => {
            if (data && data.length > 0) {
                let promiseArr = []
                res.send("Running experiments. Please check after some time")
                data.forEach((exp) => {
                    let command = 'python train.py --i ' + exp.Parameter.learningRate + ' --j ' + exp.Parameter.layers + ' --k ' + exp.Parameter.steps + ' --images ' + ' ./uploads/' + modelId + '/train/'
                    promiseArr.push(exec(command))
                })
                Promise.all(promiseArr)
                    .then((expData) => {
                        expData.forEach((outputStr) => {
                            let err = outputStr.stderr ? JSON.parse(JSON.stringify(outputStr.stderr)) : ''
                            let output = JSON.parse(outputStr.stdout.replace(/'/g, '"'))
                            //console.log(JSON.parse(outputStr.stdout.replace(/'/g,'"')))
                            if (!err) {
                                let expObj = _.find(data, (o) => {
                                    return o.Parameter.learningRate == parseFloat(output.i) && o.Parameter.layers == parseInt(output.j) && o.Parameter.steps == parseInt(output.k)
                                })
                                db.Experiment.update({
                                    score: output.accuracy
                                }, {
                                    where: {
                                        id: expObj.id
                                    }
                                })
                                //db.Experiment.update({where : {}})

                            }
                        })
                    })
            } else {
                res.status(400).send("Please generate experiments first")
            }
        }).catch(err => next(err))
}

exports.runTest = (req, res, next) => {
    let file = req.file
    if (!file) {
        return res.status(400).send("Please add one test image")
    }
    let modelId = req.params.modelId
    db.Model.find({
            where: {
                id: modelId
            },
            include: [{
                model: db.Experiment,
                limit: 1,
                order: [
                    ['score', 'DESC']
                ],
                include: [{
                    model: db.Parameter
                }]
            }],
            limit: 1

        }).then((data) => {
            let command = 'python train.py --i ' + data.Experiments[0].Parameter.learningRate + ' --j ' + data.Experiments[0].Parameter.layers + ' --k ' + data.Experiments[0].Parameter.steps + ' --images ' + file.path
            exec(command)
                .then((result) => {
                    let err = result.stderr ? JSON.parse(JSON.stringify(result.stderr)) : ''
                    let output = JSON.parse(result.stdout.replace(/'/g, '"'))
                    if (!err) {
                        res.send(output)
                    }
                })
        })
        .catch(err => next(err))
}