import { AppError } from './app-error';
import { HttpErrorResponse } from '@angular/common/http';

export class NotFoundError extends AppError {
    constructor(err: HttpErrorResponse) {
        super(err)
    }
}