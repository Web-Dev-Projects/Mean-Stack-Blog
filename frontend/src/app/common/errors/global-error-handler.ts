import { ErrorHandler } from '@angular/core';
import { AppError } from './app-error';

export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: AppError): void {
        console.log(error)
        alert(error.getErrorData().message);
    }
}