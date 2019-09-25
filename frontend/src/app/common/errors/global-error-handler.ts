import { ErrorHandler } from '@angular/core';
import { AppError } from './app-error';

export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: any): void {
        console.log(error)
        if (error instanceof AppError) {
            // alert(error.getErrorData().message);
        } else {
        }
    }
}