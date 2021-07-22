export interface LoginResponse {
    token: string;
}

export interface UserModel {
    userId: string;
    email: string;
    type: string;
    creationDate: string;
    unlockDate: string;
    treatmentGroup: string;
}

export interface ConsumerModel {
    consumerId: string;
    owner: string;
    name: string;
    variableName: string;
    active: boolean;
}

export interface UserPredictionModel {
    consumerId: string;
    data: boolean[];
}

export interface ProcessedConsumptionModel {
    type: string;
    data: number[];
}
