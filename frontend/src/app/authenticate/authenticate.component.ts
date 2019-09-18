import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { AdminService } from './admin.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';


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
                    this.router.navigate(['/home'])
                    this.onNoClick();
                }, (err) => {
                    this.form.setErrors({ 'unauthenticated': true });
                });
        }

    }

    getErrorsMsgs(field, fieldName: string) {
        if (!(field.errors) || !(field.touched) || !(this.triedToSumbit))
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
