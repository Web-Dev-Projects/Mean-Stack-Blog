import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
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
        return this.http.get(this._baseUrl + urlExt, { headers: headers })
            .pipe(catchError(this.errorHandler))
    }

    get(id, urlExt: string = '', headers?) {
        return this.http.get(this._baseUrl + urlExt + id + '/', { headers: headers })
            .pipe(catchError(this.errorHandler))
    }

    getWithReqBody(id, urlExt: string = '', reqBoy, headers?) {
        return this.http.post(this._baseUrl + urlExt + id + '/', reqBoy, { headers: headers })
            .pipe(catchError(this.errorHandler))
    }

    create(resource, urlExt: string = '', headers?) {
        return this.http.post(this._baseUrl + urlExt, resource, { headers: headers })
            .pipe(catchError(this.errorHandler))
    }

    update(id, data, urlExt: string = '', headers = { 'Content-Type': 'application/json' }) {
        return this.http.put(this._baseUrl + urlExt + id + '/', data, { headers: headers })
            .pipe(catchError(this.errorHandler))
    }

    delete(id, urlExt: string = '', headers?) {
        return this.http.delete(this._baseUrl + urlExt + id + '/', { headers: headers })
            .pipe(catchError(this.errorHandler))
    }

    private errorHandler(error) {
        if (error.status === 404) return throwError(new NotFoundError(error));
        if (error.status === 400) return throwError(new BadInputError(error));
        if (error.status === 401 || error.status === 402) return throwError(new UnAuthError(error));
        return throwError(new AppError(error));
    }
}