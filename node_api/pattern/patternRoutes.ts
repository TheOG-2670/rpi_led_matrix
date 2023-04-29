import express from 'express'
import * as utils from './patternUtils'
import { PatternObjectModel, PatternsResponse, ResponseEntity } from "./patternModels"
const app = express()


app.route('/patterns')
    .get((req: express.Request, res: express.Response<ResponseEntity>) => {
    utils.loadPatterns().then((content: PatternObjectModel[])=>{
        utils.executeRPiPatternDisplay()
        res.status(200).json([{
            status: "success",
            response: 'display script successfully executed!',
            data: content
        }])
    }).catch(()=>{
        res.status(404).json([{
            status: "error",
            response: "no pattern exists"
        }])
    })
})
.post((req: express.Request, res: express.Response<ResponseEntity>) => {
    try {
        utils.savePatterns(req.body)
        res.status(201).json([{
            status: "success",
            response: "patterns saved!"
        }])
    } catch (e) {
	    console.log(e)
        res.status(401).json([{
            status: "error",
            response: "malformed pattern!"
        }])
    }
})

export default app
