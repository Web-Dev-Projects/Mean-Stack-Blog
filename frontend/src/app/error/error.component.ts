import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
    errCode: number;
    errMsg: string;

    constructor(private activedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.errCode = this.activedRoute.snapshot.queryParams.errCode;
        switch (this.errCode) {
            case 401:
                this.errMsg = "uauthenticated access!"
                break;
            default: // no error code or 404
                this.errCode = 404;
                this.errMsg = "url notfound"
                break;
        }
    }

}
