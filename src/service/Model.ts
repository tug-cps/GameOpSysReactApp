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

export interface UserPredictionModel {
    consumerId: string;
    data: boolean[];
}

export interface ProcessedConsumptionModel {
    type: string;
    data: number[];
}

export interface MoodModel {
    x: number,
    y: number
}

