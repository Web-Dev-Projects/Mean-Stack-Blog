export interface IPost {
    _id: string,
    title: string,
    subtitle: string,
    contentFileSrc: string,
    owner: string,
    date: { dayName: string, month: string, year: string },
    viewsNum: number,
    commentsNum: number,
    likers: string[],
    reports: { reporterName: string, reporterMail: string, reporterMsg: string, }[],
}

export function makePost() {
    return Object.assign({}, {
        _id: '',
        title: '',
        subtitle: '',
        contentFileSrc: '',
        owner: '',
        date: { dayName: '', month: '', year: '' },
        viewsNum: 0,
        commentsNum: 0,
        likers: [],
        reports: [],
    });
}