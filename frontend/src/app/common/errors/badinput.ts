import { AppError } from './apperror';
import { HttpErrorResponse } from '@angular/common/http';

export class BadInputError extends AppError {
    constructor(err: HttpErrorResponse) {
        super(err)
    }

}