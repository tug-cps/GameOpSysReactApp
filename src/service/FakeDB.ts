import {ConsumerModel} from "./Model";

export function getFakeDB() {
    let db = localStorage.getItem("fake_db");
    if (db == null) {
        const users = [
            "user@test.com",
            "faulty@test.com",
            "homeowner@test.com"
        ];
        const dates = [0, -1, -2, -3, -4].map(o => {
            const today = new Date();
            today.setDate(today.getDate() + o);
            return today.toISOString().slice(0, 10);
        });
        db = JSON.stringify({
                location: {
                    "location_1": {
                        name: "greenbox COOLCITY"
                    }
                },
                user: {
                    "user@test.com": {
                        userId: 'user1',
                        email: 'user@test.com',
                        location: 'greenbox COOLCITY',
                        type: 'student',
                    },
                    "faulty@test.com": {
                        userId: 'faulty',
                        email: 'faulty@test.com',
                        location: 'greenbox COOLCITY',
                        type: 'student',
                    },
                    "management@test.com": {
                        userId: 'user3',
                        email: 'management@test.com',
                        location: 'location_1',
                        type: 'management',
                    },
                    "homeowner@test.com": {
                        userId: 'user4',
                        email: 'homeowner@test.com',
                        location: 'location_1',
                        type: 'homeowner',
                    }
                },
                consumer: Object.assign({}, ...users.map((v) => ({
                    [v]: [
                        {name: {'de': "Wäsche", 'en': "Laundry"}, type: 'laundry'},
                        {name: {'de': "Kochen", 'en': "Cooking"}, type: 'cooking'},
                        {name: {'de': "Spülen", 'en': "Dishes"}, type: 'dishes'},
                        {name: {'de': "Hygiene", 'en': "Hygiene"}, type: 'hygiene'},
                        {name: {'de': "Entertainment", 'en': "Entertainment"}, type: 'entertainment'},
                        {name: {'de': "Wellness", 'en': "Wellness"}, type: 'wellness'},
                        {name: {'de': "Home-Office", 'en': "Home office"}, type: 'homeoffice'},
                        {name: {'de': "E-Mobilität", 'en': "E-Mobility"}, type: 'emobility'},
                        {name: {'de': "Stromheizung/-kühlung", 'en': "Air conditioning"}, type: 'temperature'},
                        {name: {'de': "Sonstiges (hoher Verbrauch)", 'en': "Miscellaneous high"}, type: 'misc'},
                        {name: {'de': "Sonstiges (mittlerer Verbrauch)", 'en': "Miscellaneous mid"}, type: 'misc'},
                        {name: {'de': "Sonstiges (niedriger Verbrauch)", 'en': "Miscellaneous low"}, type: 'misc'},
                    ].map((v, i) => ({
                        consumerId: i.toString(),
                        owner: '0',
                        name: v.name,
                        customName: undefined,
                        type: v.type,
                        active: true
                    } as ConsumerModel))
                }))),
                processedConsumption: Object.assign({}, ...users.map((v) => ({
                    [v]: dates.reduce((map: any, val: any) => {
                        map[val] = ["actual", "predicted"].map((type) => ({
                            "type": type,
                            "data": [...Array(24)].map(() => Math.random() * 10)
                        }));
                        return map
                    }, {})
                }))),
                predictions: Object.assign({}, ...users.map((v) => ({
                    [v]: dates.reduce((map: any, val: any) => {
                        map[val] = [...Array(10)].map((v, id) => ({
                            "consumerId": id.toString(),
                            "data": [...Array(24)].map(() => Math.random() < 0.5 ? 4 : 0)
                        }));
                        return map
                    }, {})
                }))),
                thermostats: Object.assign({}, ...users.map((v) => ({[v]: null}))),
                mood: Object.assign({}, ...users.map((v) => ({[v]: {}}))),
                token: {
                    "fakeToken.thistokenisfake": "user@test.com",
                    "fakeToken.thistokenisfake3": "management@test.com",
                    "fakeToken.thistokenisfake4": "homeowner@test.com",
                    "fakeToken.thistokenisfake5": "faulty@test.com"
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
