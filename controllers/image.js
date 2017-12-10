const multer = require('multer')
const fs = require('fs-extra')
const db = require('../models/index')

exports.uploadImages = async(req, res, next) => {
    //check if model exists
    console.log(JSON.stringify(req.files))
    let modelId = parseInt(req.params.modelId)
    let a = await db.Model.findById(modelId)
        .then((data) => {
            if (!data) {
                return res.status(400).send("Model does not exist. Please check the Id")
            }
        }).catch(err => {
            next(err)
        })
    if(a) return

    //check if images are of the correct types
    let files = req.files
    if (!files || files.length == 0) {
        return res.status(400).send("Please add a few files")
    }

    db.Image.bulkCreate(
        files.map((file) => {
            return {
                modelId: modelId,
                name: file.filename
            }
        })
    ).then(() => res.send("Images uploaded successfully"))
    .catch(err => next(err))

}