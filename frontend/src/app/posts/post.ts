export interface IPost {
    _id: string,
    title: string,
    content: string,
    owner: string,
    date: { dayName: string, month: number, year: number },
    viewsNum: number,
    commentsNum: number,
    reports: { reporterName: string, reporterMail: string, reporterMsg: string, }[],
}

export function makePost() {
    return Object.assign({}, {
        _id: '',
        title: '',
        content: '',
        owner: '',
        date: { dayName: '', month: 0, year: 0 },
        viewsNum: 0,
        commentsNum: 0,
        reports: [],
    });
}