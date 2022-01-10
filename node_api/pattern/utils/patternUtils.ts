import { PatternObjectModel } from "../models/patternModels"
import * as fs from 'fs'
import * as path from 'path'
import {spawn} from 'child_process'
const file=path.resolve('assets','patterns.txt')


export const executeRPiPatternDisplay=(): void=>{
    spawn('cp', [file, process.env.RPI_PATTERN_FILE_DEST])
    spawn('make', ['-C', process.env.RPI_PATTERN_FILE_DEST]).stdout.on('data', (data)=>{
        process.stdout.write(data.toString())
    })
}

const constructPattern=(patternObject: string): PatternObjectModel=>{
    //extract and parse pattern size
    let numRowNumColString: string=patternObject.split('\n')[0]
    let rows: string | number=parseInt(numRowNumColString.split(',')[0])
    let columns: string | number= parseInt(numRowNumColString.split(',')[1])
    
    //extract the pattern and remove trailing newline (if pattern is last one in file)
    let arr: string[]=patternObject.substring(numRowNumColString.length+1,).split('\n')
    let trailingNewlineIndex: number =arr.indexOf("")
    if(trailingNewlineIndex>0) {
	arr.splice(trailingNewlineIndex,1)
    }
    
    //parse and construct the pattern itself 
    let pattern: number[][]=[]
    arr.forEach((rowString)=>{
        let currentRow: string[] | number[] =rowString.split(',')
        currentRow=Array.from(currentRow, num=>parseInt(num))
        pattern.push(currentRow)
    })
    
    //return as a ready object
    let parsedPattern: PatternObjectModel={
        rows,
        columns,
        pattern
    }
    console.log(`\n\nreading done.\ncontents:\n${JSON.stringify(parsedPattern)}`)
    return parsedPattern
}

export const loadPatterns=(): Promise<PatternObjectModel[]> =>{
    return new Promise((resolve, reject)=>{
        let readStream=fs.createReadStream(file, 'utf-8')
        let content: string=""
        readStream.on('data', (data: string)=>{
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
    let writeStream=fs.createWriteStream(file, 'utf-8')
    

    patternObjectArray.forEach((patternObject: PatternObjectModel, i: number)=>{
        const{rows, columns, pattern}=patternObject
        if(rows===0 || columns===0){
            throw 'invalid pattern!'
        }
        writeStream.write(`${rows},${columns}\n`)
        pattern.forEach((row: string[] | number[])=>{
            writeStream.write(`${row}\n`)
        })
        if(i!==patternObjectArray.length-1)
            writeStream.write('\n')
    })

    writeStream.close()
}
