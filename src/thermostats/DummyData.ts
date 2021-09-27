import {createTime} from "../common/Time";
import {ThermostatModel} from "../service/Model";

export const data_ = {
    useAdvanced: false,
    simple: [
        [{time: createTime(0, 0), temperature: 21}],
        [{time: createTime(0, 0), temperature: 21}]
    ],
    advanced: [
        [{time: createTime(0, 0), temperature: 21}],
        [{time: createTime(0, 0), temperature: 21}],
        [{time: createTime(0, 0), temperature: 21}],
        [{time: createTime(0, 0), temperature: 21}],
        [{time: createTime(0, 0), temperature: 21}],
        [{time: createTime(0, 0), temperature: 21}],
        [{time: createTime(0, 0), temperature: 21}]
    ]
} as ThermostatModel
