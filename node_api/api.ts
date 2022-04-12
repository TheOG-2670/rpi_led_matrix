import express from 'express'
import patternRouter from './pattern/patternRoutes'

const app = express()
const SWAGGER_PORT=5000
const HTTP_PORT=8080

//enable swagger for development
if (process.env.NODE_ENV === 'Development') {
    const swaggerUI = require('swagger-ui-express')
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
    app.listen(5000, () => console.log(`swagger ui listening on 5000`))
}

app.use(express.json())
app.use(patternRouter)

app.listen(8080, () => console.log(`main api listening on 8080`))