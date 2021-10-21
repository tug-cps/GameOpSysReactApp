import {CellState} from "../behavior/BehaviorDragSelect";

export interface LoginResponse {
    token: string
}

export interface UserModel {
    id: string
    email: string
    location: string
    type: string
}

export interface ConsumerModel {
    id: string
    type: string
    active: boolean
}

export interface PredictionModel {
    consumerId: string
    data: CellState[]
}

export interface WellBeingModel {
    x: number
    y: number
}

export interface PredictionDateEntry {
    validated: boolean
    date: string
}

export interface TaskModel {
    todoPrediction: boolean
    todoUpload: boolean
    todoWellBeing: boolean
    todoVerifyPrediction: boolean
}
