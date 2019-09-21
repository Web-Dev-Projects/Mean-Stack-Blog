import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DataService } from '../common/data.service';
import { map } from 'rxjs/operators'


@Injectable({
    providedIn: 'root'
})
export class AdminService extends DataService {

    constructor(http: HttpClient) { super(http, "http://localhost:5000/api/users/"); }

    signin(username: string, password: string) {
        return this.create({ username: username, password: password }, 'signin/')
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

}
