import {CellState} from "../behavior/BehaviorDragSelect";

export interface LoginResponse {
    token: string;
}

export interface UserModel {
    userId: string;
    email: string;
    location: string;
    type: string;
}

export interface ConsumerModel {
    consumerId: string;
    owner: string;
    name?: TranslatedString;
    customName?: string;
    type: string;
    active: boolean;
}

export interface TranslatedString {
    de: string;
    en: string;
}

export interface TimeItem {
    time: Date;
    temperature: number;
}

export interface ThermostatModel {
    useAdvanced: boolean
    simple: TimeItem[][]
    advanced: TimeItem[][]
}

export interface UserPredictionModel {
    consumerId: string;
    data: CellState[];
}

export interface ProcessedConsumptionModel {
    type: string;
    data: number[];
}

export interface MoodModel {
    x: number,
    y: number
}

