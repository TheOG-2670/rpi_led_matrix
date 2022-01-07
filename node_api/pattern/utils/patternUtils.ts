import { PatternObjectModel } from "../models/patternModels"
import * as fs from 'fs'
import * as path from 'path'
import {spawn} from 'child_process'
const file=path.resolve('assets','patterns.txt')


export const bashExec=(): void=>{
    let dest='~/led_matrix'
    spawn('cp', [file, dest])
    spawn('make', ['-C', dest]).stdout.on('data', (data)=>{
        process.stdout.write(data.toString())
    })
}

const constructPattern=(patternObject: string): PatternObjectModel=>{
    //extract and parse pattern size
    let numRowNumColString: string=patternObject.split('\n')[0]
    let rows: string | number=parseInt(numRowNumColString.split(',')[0])
    let columns: string | number= parseInt(numRowNumColString.split(',')[1])
    
    //extract the pattern and remove trailing newline (if any)
    let arr: string[]=patternObject.substring(numRowNumColString.length+1,).split('\n')
    let n: number =arr.indexOf("")
    if(n>0) arr.splice(n,1)
    
    //parse and construct the pattern itself 
    let pattern: number[][]=[]
    arr.forEach((a)=>{
        let b: string[] | number[] =a.split(',')
        b=Array.from(b, i=>parseInt(i))
        pattern.push(b)
    })
    
    //return as a ready object
    let obj: PatternObjectModel={
        rows,
        columns,
        pattern
    }
    console.log(`\n\nreading done.\ncontents:\n${JSON.stringify(obj)}`)
    return obj
}

export const loadPatterns=(): Promise<PatternObjectModel[]> =>{
    return new Promise((resolve, reject)=>{
        let rs=fs.createReadStream(file, 'utf-8')
        let content: string=""
        rs.on('data', (data: string)=>{
            content+=data
        })
        .once('end', ()=>{
            if(content.length===0){
                reject()
            }
            else{
                
                /*separate the pattern strings and parse each one.
                add the pattern object to an array which will be
                sent back to add to the response object*/
                let patternsArray: PatternObjectModel[] =[]
                let patternStrings: string[]=content.split('\n\n')
                patternStrings.forEach((pattern: string)=>{
                    patternsArray.push(
                        constructPattern(pattern)
                    )
                })
                resolve(patternsArray)
            }
        })
    })
}

export const savePatterns=(patternObjectArray: PatternObjectModel[]): void=>{
    let ws=fs.createWriteStream(file, 'utf-8')
    

    patternObjectArray.forEach((p: PatternObjectModel,i: number)=>{
        const{rows, columns, pattern}=p
        if(rows===0 || columns===0){
            throw 'invalid pattern!'
        }
        ws.write(`${rows},${columns}\n`)
        pattern.forEach((row: string[] | number[])=>{
            ws.write(`${row}\n`)
        })
        if(i!==patternObjectArray.length-1)
            ws.write('\n')
    })

    ws.close()
}
