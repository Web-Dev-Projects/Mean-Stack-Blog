import { AppError } from './apperror';
import { HttpErrorResponse } from '@angular/common/http';

export class UnAuthError extends AppError {
    constructor(err: HttpErrorResponse) {
        super(err)
    }
}