import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { AdminService } from './admin.service';
import { Router } from '@angular/router';
import { UnAuthError } from '../common/errors/unauth';
import { AppError } from '../common/errors/app-error';


@Component({
    selector: 'app-Authenticate',
    templateUrl: './authenticate.component.html',
    styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent {
    private triedToSumbit = false;
    form: FormGroup;

    constructor(
        private adminService: AdminService,
        private router: Router,
        public dialogRef: MatDialogRef<AuthenticateComponent>,
        @Inject(MAT_DIALOG_DATA) public admin: any) {
        this.form = new FormGroup({
            username: new FormControl(''),
            password: new FormControl(''),
        });
    }

    get username() { return this.form.get('username'); }
    get password() { return this.form.get('password'); }

    onNoClick(): void {
        this.dialogRef.close();
    }

    authenticate() {
        this.triedToSumbit = true;

        if (this.form.valid) {
            this.adminService.signin(this.username.value, this.password.value)
                .subscribe(() => {
                    this.onNoClick();
                    this.router.navigate(['/home'])
                }, (error: AppError) => {
                    if (error instanceof UnAuthError) {
                        this.form.setErrors({ 'unauthenticated': true });
                    } else {
                        throw error;
                    }
                });
        }
    }

    getErrorsMsgs(field: AbstractControl, fieldName: string) {
        if (!(field.errors) || !(this.triedToSumbit))
            return [];

        let errors = field.errors;
        let errorsMsgs = [];

        Object.keys(errors)
            .forEach((errName) => {
                switch (errName) {
                    case "minlength":
                        errorsMsgs.push(fieldName + "'s minimum length is " + errors[errName].requiredLength);
                        break;
                    case "required":
                        errorsMsgs.push(fieldName + " is required.");
                        break;
                    case "unauthenticated":
                        errorsMsgs.push(" username or/and password is wrong.")
                        break;
                    default:
                        break;
                }
            })

        return errorsMsgs;
    }


}
