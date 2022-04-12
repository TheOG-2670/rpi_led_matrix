import { PatternObjectModel } from "./patternModels"
import * as fs from 'fs'
import * as path from 'path'
import {spawn} from 'child_process'
const file=path.resolve('assets','patterns.txt')
import * as dotenv from 'dotenv'

dotenv.config({"path": "../.env"})
/*
    Pattern file copied from 'assets' folder to directory on raspberry pi. 
    'make' command compiles and execute the program, displaying patterns on the LED matrix,
    and prints patterns to the console.
*/
export const executeRPiPatternDisplay=(): void=>{
    //@ts-ignore
    spawn('cp', [file, process.env.RPI_DIR])
    //@ts-ignore
    spawn('make', ['-C', process.env.RPI_DIR, 'run', `ARG=${process.env.PATTERN_FILE}`]).stdout.on('data', (data: Uint16Array)=>{
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
        let currentRow: string[] | number[]=rowString.split(' ')
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

/**
 * reads patterns from file, checking that the file is not empty, and 
 * returns the constructed pattern objects as a response.
*/
export const loadPatterns=(): Promise<PatternObjectModel[]> =>{
    return new Promise((resolve, reject)=>{
        let readStream=fs.createReadStream(file, 'utf-8')
        let content: string=""

        //read data in chunks from file and append them as a long string
        readStream.on('data', (data: string)=>{
            content+=data
        })
        .once('end', ()=>{
            //if the file is empty, send a rejection
            if(content.length===0){
                reject()
            }
            else{
                
                /*  separate the patterns from the original string and parse each one.
                    add the pattern objects to an array which will be sent back as part 
                    of the response object.
                */
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

/**
 * each pattern object in the array is parsed and written to file
 */
export const savePatterns=(patternObjectArray: PatternObjectModel[]): void=>{
    let writeStream=fs.createWriteStream(file, 'utf-8')
    
    /*
        each pattern object's row, column, and pattern array are extracted and
        The object's validity is checked before being written to file.
    */
    patternObjectArray.forEach((patternObject: PatternObjectModel, i: number)=>{
        const{rows, columns, pattern}=patternObject
        if(rows===0 || columns===0){
            throw 'invalid pattern!'
        }
        writeStream.write(`${rows},${columns}\n`)
        pattern.forEach((row: string[] | number[])=>{
            writeStream.write(`${row.join(' ')}\n`)
        })
        if(i!==patternObjectArray.length-1)
            writeStream.write('\n')
    })

    writeStream.close()
}
