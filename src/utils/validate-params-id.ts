import { invalidDataError } from "../errors/invalid-data-erro"

export default function validateParamsId(params){
    const {id} = params
    if(!Number.isInteger(Number(id))) throw invalidDataError("id params must be a integer number")
    if(Number(id) <= 0) throw invalidDataError("id params must be a integer number greater than 0")
    return Number(id)
}