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
                    [
                        {
                            consumerId: 0,
                            owner: 0,
                            name: 'Kochen',
                            variableName: 'something',
                            active: true
                        },
                        {
                            consumerId: 1,
                            owner: 0,
                            name: 'Medien',
                            variableName: 'something else',
                            active: true
                        },
                        {
                            consumerId: 2,
                            owner: 0,
                            name: 'Wäsche',
                            variableName: 'something else',
                            active: true
                        },
                        {
                            consumerId: 3,
                            owner: 0,
                            name: 'Geschirrspülmaschine',
                            variableName: 'something else',
                            active: true
                        },
                        {
                            consumerId: 4,
                            owner: 0,
                            name: 'Eigenes Gerät A',
                            variableName: 'something else',
                            active: true
                        },
                        {
                            consumerId: 5,
                            owner: 0,
                            name: 'Eigenes Gerät b',
                            variableName: 'something else',
                            active: true
                        },
                    ]
            },
            token: {
                "fakeToken.thistokenisfake": "user@test.com"
            }
        });
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
