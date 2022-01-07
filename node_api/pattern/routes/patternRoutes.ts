import * as express from 'express'
import * as utils from '../utils/patternUtils'
import { PatternObjectModel, PatternsResponseModel } from "../models/patternModels"
const app = express()


app.route('/patterns')
    .get((req: express.Request, res: express.Response<PatternsResponseModel>) => {
    utils.loadPatterns().then((content: PatternObjectModel[])=>{
        utils.bashExec()
        res.json({
            success: {
                response: 'display script successfully executed!',
                data: content
            } 
        })
    }).catch(()=>{
        res.status(404).json({
            error: {
                response: "no pattern exists"
            }
        })
    })
})
.post((req, res) => {
    try {
        utils.savePatterns(req.body)
        res.status(201).json({
            success:{
                response: "patterns saved!"
            }
        })
    } catch (e) {
        res.status(401).json({
            error: {
                response: e.toString()
            }
        })
    }
})

export default app