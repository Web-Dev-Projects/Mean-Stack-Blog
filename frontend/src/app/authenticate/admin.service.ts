import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DataService } from '../common/data.service';
import { map, catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';
import { UnAuthError } from '../common/errors/unauth';
import { AppError } from '../common/errors/apperror';


@Injectable({
    providedIn: 'root'
})
export class AdminService extends DataService {

    constructor(http: HttpClient) { super(http, "http://localhost:5000/api/users/"); }

    signin(username: string, password: string) {
        return this.create({ username: username, password: password }, 'signin/')
            .pipe(catchError(this.errorHandler))
            .pipe(map((res: any) => {
                if (res.accessToken) {
                    localStorage.setItem('accessToken', res.accessToken);
                }
            }))
    }

    signout() {
        localStorage.removeItem('accessToken');
    }

    get username() {
        return (this.isSignedIn) ?
            new JwtHelperService().decodeToken(localStorage.getItem('accessToken')).username : "";
    }

    get isSignedIn(): boolean {
        return localStorage.getItem('accessToken') ? true : false;
    }

    get accessToken() {
        return localStorage.getItem('accessToken') || '';
    }

    private errorHandler(error: HttpErrorResponse) {
        if (error.status === 401 || error.status === 402) return throwError(new UnAuthError(error));
        return throwError(new AppError(error));
    }

}
