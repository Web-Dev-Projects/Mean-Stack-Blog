import { AppError } from './apperror';
import { HttpErrorResponse } from '@angular/common/http';

export class NotFoundError extends AppError {
    constructor(err: HttpErrorResponse) {
        super(err)
    }
}