const db = require('../models/index')
const moment = require('moment')
const Promise = require('bluebird')
const util = require('util')
const exec = util.promisify(require('child_process').exec);
const _ = require('lodash')
setInterval(() => {
    db.Experiment.findAll({
            where: {
                status: "executing",
                updatedAt: {
                    $lt: moment().subtract(60, 'seconds').format()
                }
            },
            include: [{
                model: db.Parameter,
            }, {
                model: db.Model
            }]
        })
        .then((data) => {
            if (!data || data.length == 0) {
                return
            }
            console.log(JSON.stringify(data, null, 2))
            ids = data.map((o) => o.id)
            db.Experiment.update({
                    status: "executing"
                }, {
                    where: {
                        id: ids
                    }
                })
                .then((a) => {
                    let promiseArr = []
                    data.forEach((exp) => {
                        let command = 'python train.py --i ' + exp.Parameter.learningRate + ' --j ' + exp.Parameter.layers + ' --k ' + exp.Parameter.steps + ' --images ' + ' ./uploads/' + exp.Model.id + '/train/'
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
                                        status: "completed",
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
                })
        })
}, (Math.random() * 20000) + 10000)