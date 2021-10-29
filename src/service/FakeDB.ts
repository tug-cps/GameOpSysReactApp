import {ConsumerModel} from "./Model";

export function getFakeDB() {
    let db = localStorage.getItem("fake_db");
    if (db == null) {
        const users = [
            "user@test.com",
            "homeowner@test.com",
            "faultyuser@test.com",
            "faultyhomeowner@test.com"
        ];
        db = JSON.stringify({
                location: {
                    "location_1": {
                        name: "greenbox COOLCITY"
                    }
                },
                user: {
                    "user@test.com": {
                        id: 'user1',
                        email: 'user@test.com',
                        location: 'greenbox COOLCITY',
                        type: 'student',
                    },
                    "homeowner@test.com": {
                        id: 'user4',
                        email: 'homeowner@test.com',
                        location: 'location_1',
                        type: 'homeowner',
                    },
                    "faultyuser@test.com": {
                        id: 'faultyuser',
                        email: 'faultyuser@test.com',
                        location: 'greenbox COOLCITY',
                        type: 'student',
                    },
                    "faultyhomeowner@test.com": {
                        id: 'faultyhomeowner',
                        email: 'faultyhomeowner@test.com',
                        location: 'location_1',
                        type: 'homeowner',
                    },
                },
                consumer: Object.assign({}, ...users.map((v) => ({
                    [v]: [
                        {type: 'laundry'}, {type: 'cooking'}, {type: 'dishes'}, {type: 'hygiene'}, {type: 'entertainment'},
                        {type: 'wellness'}, {type: 'homeoffice'}, {type: 'emobility'}, {type: 'temperature'},
                        {type: 'high'}, {type: 'med'}, {type: 'low'},
                    ].map((v, i) => ({
                        id: i.toString(),
                        type: v.type,
                        active: true
                    } as ConsumerModel))
                }))),
                predictions: Object.assign({}, ...users.map((user) => ({
                    [user]: {
                        "2021-01-10": {
                            validated: false,
                            data: []
                        },
                        "2021-01-04": {
                            validated: true,
                            data: []
                        },
                        "2021-01-02": {
                            validated: false,
                            data: []
                        },
                        "2021-01-01": {
                            validated: true,
                            data: []
                        },

                    }
                }))),
                mood: Object.assign({}, ...users.map((v) => ({[v]: {}}))),
                token: {
                    "fakeToken.thistokenisfake": "user@test.com",
                    "fakeToken.thistokenisfake4": "homeowner@test.com",
                    "fakeToken.thistokenisfake5": "faultyuser@test.com",
                    "fakeToken.thistokenisfake6": "faultyhomeowner@test.com"
                }
            }
        );
        localStorage.setItem("fake_db", db);
    }

    return JSON.parse(db);
}

export function resetFakeDB() {
    localStorage.removeItem("fake_db")
}

export function saveFakeDB(db: any) {
    localStorage.setItem("fake_db", JSON.stringify(db))
}
