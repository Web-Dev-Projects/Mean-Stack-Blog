import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
    constructor(private http: HttpClient, private baseUrl: string) { }

    getAll(urlExt: string = '') {
        return this.http.get(this.baseUrl + urlExt);
    }

    get(id, urlExt: string = '', options?) {
        return this.http.get(this.baseUrl + urlExt + id + '/', options);
    }

    getWithReqBody(id, urlExt: string = '', reqBoy) {
        return this.http.post(this.baseUrl + urlExt + id + '/', reqBoy);
    }

    create(resource, urlExt: string = '') {
        return this.http.post(this.baseUrl + urlExt, resource);
    }

    update(id, data, urlExt: string = '') {
        return this.http.put(this.baseUrl + urlExt + id + '/', data, { headers: { 'Content-Type': 'application/json' } });
    }

    delete(id, urlExt: string = '') {
        return this.http.delete(this.baseUrl + urlExt + id + '/');
    }

}