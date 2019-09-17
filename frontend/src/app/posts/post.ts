export interface IPost {
    _id: string,
    title: string,
    contnet: string,
    owner: string,
    date: { dayName: string, month: number, year: number },
    viewsNum: number,
    commentsNum: number,
}