export interface PatternObjectModel{
    rows: string | number,
    columns: string | number,
    pattern: string[][] | number[][]
}

export interface PatternsResponse {
    status: string,
    response: string,
    data?: PatternObjectModel[] | null
}