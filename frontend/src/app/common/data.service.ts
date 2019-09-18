import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
    constructor(private http: HttpClient, private baseUrl: string) { }

    getAll(urlExt: string = '', headers?) {

        return this.http.get(this.baseUrl + urlExt, { headers: headers });
    }

    get(id, urlExt: string = '', headers?) {
        return this.http.get(this.baseUrl + urlExt + id + '/', { headers: headers });
    }

    getWithReqBody(id, urlExt: string = '', reqBoy, headers?) {
        return this.http.post(this.baseUrl + urlExt + id + '/', reqBoy, { headers: headers });
    }

    create(resource, urlExt: string = '', headers?) {
        return this.http.post(this.baseUrl + urlExt, resource, { headers: headers });
    }

    update(id, data, urlExt: string = '', headers = { 'Content-Type': 'application/json' }) {
        return this.http.put(this.baseUrl + urlExt + id + '/', data, { headers: headers });
    }

    delete(id, urlExt: string = '', headers?) {
        return this.http.delete(this.baseUrl + urlExt + id + '/', { headers: headers });
    }

}