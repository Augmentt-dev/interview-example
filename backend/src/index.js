require('dotenv').config()
const fs = require('fs/promises')
const express = require('express')
const gateway = express()
const path = require('path')
const lambdaLocal = require('lambda-local')
const bodyParser = require('body-parser')

const PORT_LISTENER = process.env.LOCAL_PORT || 3002 // We will use port 3002 if none is specified in the env
const lambdaDirectoryPrefix = '/api/lambdas'
const lambdas = []

const setupDirectories = async () => {
    (await fs.readdir(`${__dirname}${lambdaDirectoryPrefix}`))?.forEach(file => {
        lambdas.push({ route: `/${file}`, path: `${lambdaDirectoryPrefix}/${file}/index` })
    })
}

/**
 * Takes an Express request, simulates an API Gateway event to send to a Lambda, and returns a response for Express
 * @param {Object} req The express request
 * @param {Object} res The express response
 * @param {String} filePath The path to the lambda handler
 * @returns {Object} Returns an HTTP Response from a Lambda API
 */
const executeLambda = async (req, res, filePath) => {
    const response = await lambdaLocal.execute({
        timeoutMs: 29000,
        lambdaPath: path.join(__dirname, filePath),
        lambdaHandler: 'handler',
        event: {
          path: req._parsedUrl.path?.includes('?')
            ? req._parsedUrl.path.split('?')[0]
            : req._parsedUrl.path,
          httpMethod: req.method,
          body: JSON.stringify(req.body),
          queryStringParameters: req.query
        }
      })
    
      // Respond to HTTP Request
      res.status(response.statusCode).end(response.body)
}

const setupLambdas = async () => {
    lambdas.forEach(lambda => {
        lambda.function = (req, res) => executeLambda(req, res, lambda.path)
    })
}

const setupGateway = async () => {
    // Configure body parser to support post/put request body data
    gateway.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    gateway.use(bodyParser.json({ limit: '50mb' }))

    // Handle CORS & preflight check response
    gateway.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', '*')
            res.header('Access-Control-Allow-Methods', '*')
            res.header('Access-Control-Allow-Credentials', 'true')

            return res.status(200).json({})
        }

        next()
    })

    lambdas.forEach(lambda => {
        gateway.use(lambda.route, lambda.function)
    })

    gateway.listen(PORT_LISTENER, () =>
        console.log(`API Gateway is running on localhost: ${PORT_LISTENER}`)
    )
}

const main = async () => {
 await setupDirectories()
 await setupLambdas()
 await setupGateway()
}

main()
