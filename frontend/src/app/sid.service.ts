import { Injectable } from '@angular/core';
import { DataService } from './common/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidService extends DataService {
    constructor(http: HttpClient, sid: SidService) {
        super(http, "http://localhost:5000/api/sid");
    }

    gainSID() {

        return new Observable((observer) => {
            if (!(localStorage.getItem('sid'))) {
                return this.get('').subscribe((sid: string) => {
                    observer.next(sid);
                })
            } else {
                observer.next(localStorage.getItem('sid'));
            }
        })

    }

}
