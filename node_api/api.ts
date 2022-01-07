import * as express from 'express'
import patternRouter from './pattern/routes/patternRoutes'
const swaggerDoc =require('./swagger.json')
const app = express()

//enable swagger for development
if (process.env.NODE_ENV === 'Development') {
    const swaggerUI = require('swagger-ui-express')
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
    app.listen(5000, () => console.log(`swagger ui listening on 5000`))
}

app.use(express.json())
app.use(patternRouter)

app.listen(8080, () => console.log(`main api listening on 8080`))