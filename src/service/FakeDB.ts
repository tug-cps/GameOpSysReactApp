import {ConsumerModel} from "./Model";

export function getFakeDB() {
    let db = localStorage.getItem("fake_db");
    if (db == null) {
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
                    "admin@test.com": {
                        userId: 'user2',
                        email: 'admin@test.com',
                        location: 'location_1',
                        type: 'admin',
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
                consumer: {
                    "user@test.com":
                        [
                            {name: {'de': "Wäsche", 'en': "Laundry"}, type: 'laundry'},
                            {name: {'de': "Kochen", 'en': "Cooking"}, type: 'cooking'},
                            {name: {'de': "Spülen", 'en': "Dishes"}, type: 'dishes'},
                            {name: {'de': "Hygiene", 'en': "Hygiene"}, type: 'hygiene'},
                            {name: {'de': "Entertainment", 'en': "Entertainment"}, type: 'entertainment'},
                            {name: {'de': "Wellness", 'en': "Wellness"}, type: 'wellness'},
                            {name: {'de': "Home-Office", 'en': "Home office"}, type: 'homeoffice'},
                            {name: {'de': "E-Mobilität", 'en': "E-Mobility"}, type: 'emobility'},
                            {name: {'de': "Sonstiges", 'en': "Miscellaneous"}, type: 'misc'},
                            {name: {'de': "Stromheizung/-kühlung", 'en': "Air conditioning"}, type: 'temperature'},
                            {name: {'de': "Gäste", 'en': "Guests"}, type: 'guests'},
                        ].map((v, i) => ({
                            consumerId: i.toString(),
                            owner: '0',
                            name: v.name,
                            customName: undefined,
                            type: v.type,
                            active: true
                        } as ConsumerModel))
                },
                processedConsumption: {
                    "user@test.com":
                        ["01-01-2020", "02-01-2020", "03-01-2020"].reduce((map: any, val: any) => {
                            map[val] = ["actual", "predicted"].map((type) => ({
                                "type": type,
                                "data": [...Array(24)].map(() => Math.random() * 10)
                            }));
                            return map
                        }, {})
                },
                predictions: {
                    "user@test.com":
                        [new Date(), new Date(Date.now() - 86400000 /*1 day*/)]
                            .map((d) => d.toISOString().slice(0, 10))
                            .reduce((map: any, val: any) => {
                                map[val] = [...Array(10)].map((v, id) => ({
                                    "consumerId": id.toString(),
                                    "data": [...Array(24)].map(() => Math.random() < 0.5)
                                }));
                                return map
                            }, {})
                },
                token: {
                    "fakeToken.thistokenisfake": "user@test.com",
                    "fakeToken.thistokenisfake2": "admin@test.com",
                    "fakeToken.thistokenisfake3": "management@test.com",
                    "fakeToken.thistokenisfake4": "homeowner@test.com"
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
