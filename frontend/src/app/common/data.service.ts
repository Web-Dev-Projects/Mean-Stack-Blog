import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AppError } from './errors/app-error';
import { NotFoundError } from './errors/not-found';
import { UnAuthError } from './errors/unauth';
import { BadInputError } from './errors/bad-input';

@Injectable()
export class DataService {
    constructor(private http: HttpClient, private _baseUrl: string) { }

    get baseUrl() { return this._baseUrl };

    getAll(urlExt: string = '', headers?) {
        if (localStorage.getItem('sid'))
            headers = Object.assign({}, headers, { sid: localStorage.getItem('sid') });


        return this.http.get(this._baseUrl + urlExt, { headers: headers })
            .pipe(catchError(this.errorHandler))
            .pipe(map((res: any) => { if (res && res.sid) { localStorage.setItem('sid', res.sid); res = res.data; } return res; }))
    }

    get(id, urlExt: string = '', headers?) {
        if (localStorage.getItem('sid'))
            headers = Object.assign({}, headers, { sid: localStorage.getItem('sid') });

        return this.http.get(this._baseUrl + urlExt + id + '/', { headers: headers, })
            .pipe(catchError(this.errorHandler))
            .pipe(map((res: any) => { if (res && res.sid) { localStorage.setItem('sid', res.sid); res = res.data; } return res; }))
    }

    create(resource, urlExt: string = '', headers?) {
        if (localStorage.getItem('sid'))
            headers = Object.assign({}, headers, { sid: localStorage.getItem('sid') });

        return this.http.post(this._baseUrl + urlExt, resource, { headers: headers, })
            .pipe(catchError(this.errorHandler))
            .pipe(map((res: any) => { if (res && res.sid) { localStorage.setItem('sid', res.sid); res = res.data; } return res; }))
    }

    update(id, data, urlExt: string = '', headers = { 'Content-Type': 'application/json' }) {
        if (localStorage.getItem('sid'))
            headers = Object.assign({}, headers, { sid: localStorage.getItem('sid') });

        return this.http.put(this._baseUrl + urlExt + id + '/', data, { headers: headers, })
            .pipe(catchError(this.errorHandler))
            .pipe(map((res: any) => { if (res && res.sid) { localStorage.setItem('sid', res.sid); res = res.data; } return res; }))
    }

    delete(id, urlExt: string = '', headers?) {
        if (localStorage.getItem('sid'))
            headers = Object.assign({}, headers, { sid: localStorage.getItem('sid') });

        return this.http.delete(this._baseUrl + urlExt + id + '/', { headers: headers, })
            .pipe(catchError(this.errorHandler))
            .pipe(map((res: any) => { if (res && res.sid) { localStorage.setItem('sid', res.sid); res = res.data; } return res; }))
    }

    getWithReqBody(id, urlExt: string = '', reqBoy, headers?) {
        if (localStorage.getItem('sid'))
            headers = Object.assign({}, headers, { sid: localStorage.getItem('sid') });

        return this.http.post(this._baseUrl + urlExt + id + '/', reqBoy, { headers: headers, })
            .pipe(catchError(this.errorHandler))
            .pipe(map((res: any) => { if (res && res.sid) { localStorage.setItem('sid', res.sid); res = res.data; } return res; }))
    }

    private errorHandler(error) {
        if (error.status === 404) return throwError(new NotFoundError(error));
        if (error.status === 400) return throwError(new BadInputError(error));
        if (error.status === 401 || error.status === 402) return throwError(new UnAuthError(error));
        return throwError(new AppError(error));
    }
}