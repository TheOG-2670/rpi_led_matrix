export interface PatternObjectModel{
    rows: string | number,
    columns: string | number,
    pattern: string[][] | number[][]
}

interface patternsSuccessResponseModel {
    response: string,
    data: PatternObjectModel[]
}

interface patternsErrorResponseModel{
    response: string
}

export interface PatternsResponseModel {
    success?: patternsSuccessResponseModel | null,
    error?: patternsErrorResponseModel | null
}