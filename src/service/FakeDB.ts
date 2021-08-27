export function getFakeDB() {
    let db = localStorage.getItem("fake_db");
    if (db == null) {
        db = JSON.stringify({
                user: {
                    "user@test.com": {
                        userId: '1234',
                        email: 'user@test.com',
                        type: 'normal',
                        creationDate: '01-01-2020',
                        unlockDate: '01-01-2020',
                        treatmentGroup: 'group_1'
                    }
                },
                consumer: {
                    "user@test.com":
                        ["Kochen", "Medien", "Wäsche", "Geschirrspülmaschine", "Eigenes Gerät A", "Eigenes Gerät B"].map((v, i) => ({
                            consumerId: i.toString(),
                            owner: 0,
                            name: v,
                            variableName: 'something',
                            active: true
                        }))
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
                                map[val] = [...Array(6)].map((v, id) => ({
                                    "consumerId": id.toString(),
                                    "data": [...Array(24)].map(() => true)
                                }));
                                return map
                            }, {})
                },
                token: {
                    "fakeToken.thistokenisfake": "user@test.com"
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
