// Get the packages we need
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const compression = require('compression')
const multer = require('multer')
const fs = require('fs-extra')
const path = require('path')

// new controllers
const modelController = require('./controllers/model')
const imageController = require('./controllers/image')
const experimentController = require('./controllers/experiments')
const parameterController = require('./controllers/parameter')

//mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/nanonets')
const kafkaConfig = process.env.KAFKA_CONFIG ? JSON.parse(process.env.KAFKA_CONFIG) : {
    'topic': 'test2',
    'connectionString': '10.112.98.41:2181'
}
// Create our Express application
const app = express()
app.use(compression())

app.disable('x-powered-by')

// Use environment defined port or 3000
const port = process.env.PORT || 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

// Create our Express router

let upload1 = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let type = req.params.modelId;
            let path = `./uploads/${type}/train`;
            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: async(req, file, callback) => {
            //originalname is the uploaded file's name with extn
            let type = req.params.modelId
            let filePath = `./uploads/${type}/train`
            let filename = file.originalname
            let index = 1
            while(true) {
                let a = await fs.pathExists(filePath + "/" + filename)
                if(a) {
                    filename = index > 1 ? filename.substring(0, filename.length -1) + index : filename + "-" + index
                    index += 1
                } else { 
                    break
                }
            }

            callback(null, filename);
        }
    }),
    fileFilter: (req, file, callback) => {
        if (!file.originalname.endsWith('.jpg')) {
            return callback('Only jpgs are allowed')
        }
        callback(null, true)
    }
})

let upload2 = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let type = req.params.modelId;
            let path = `./uploads/${type}/test`;
            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: (req, file, callback) => {
            //originalname is the uploaded file's name with extn
            callback(null, file.originalname);
        }
    }),
    fileFilter: (req, file, callback) => {
        if (!file.originalname.endsWith('.jpg')) {
            return callback('Only jpgs are allowed')
        }
        callback(null, true)
    }
})

const router = express.Router()

router.route('/model')
    .post(modelController.createModel)
router.route('/model/:modelId')
    .get(modelController.getModel)

router.route('/model/:modelId/image/upload')
    .post(upload1.array('images', 12), imageController.uploadImages)

router.route('/model/genexp')
    .post(experimentController.generateExperiments)

router.route('/parameter/init')
    .post(parameterController.initParameters)

router.route('/model/runexp')
    .post(experimentController.runExperiments)
router.route('/model/:modelId/test')
    .post(upload2.single('image'), experimentController.runTest)

// Register all our routes with /api
app.use(router)

const errorHandler = (err, req, res, next) => {
    if (err == 'Only jpgs are allowed') return res.status(400).send(err)
    console.error(err.stack)
    return res.status(500).send('Something Went Wrong')
}

app.use(errorHandler)
// Start the server
app.listen(port)
console.log('api server started on port ' + port)