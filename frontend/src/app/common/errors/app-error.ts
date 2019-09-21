import { HttpErrorResponse } from '@angular/common/http';

export class AppError {
    constructor(private _error: HttpErrorResponse) { }
    getErrorData() {
        return this._error
    }
}