import express from 'express'
import patternRouter from './pattern/patternRoutes'
import * as dotenv from 'dotenv'

dotenv.config()
const app = express()
const SWAGGER_PORT=5000
const HTTP_PORT=8080

//enable swagger for development
if (process.env.NODE_ENV === 'Development') {
    const swaggerDoc = require('./swagger.json')
    const swaggerUI = require('swagger-ui-express')
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
    app.listen(SWAGGER_PORT, () => console.log(`swagger ui listening on ${SWAGGER_PORT}`))
}

app.use(express.json())
    .use(patternRouter)

app.listen(HTTP_PORT, () => console.log(`main api listening on ${HTTP_PORT}`))
