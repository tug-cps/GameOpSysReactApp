const now = new Date();

export const createTime = (hours: number, minutes: number) => {
    return new Date(now.getDay(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
}
