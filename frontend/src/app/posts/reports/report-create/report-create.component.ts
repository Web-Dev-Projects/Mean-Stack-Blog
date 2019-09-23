import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostsService } from '../../posts.service';
import { Router } from '@angular/router';
import { IPost } from '../../post';
import { IReport } from '../report';

@Component({
    selector: 'app-report',
    templateUrl: './report-create.component.html',
    styleUrls: ['./report-create.component.css']
})
export class ReportComponent {

    private triedToSumbit = false;
    private form: FormGroup;

    constructor(
        private router: Router,
        private postsService: PostsService,
        public dialogRef: MatDialogRef<ReportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { targetPost: IPost }) {

        this.form = new FormGroup({
            name: new FormControl(''),
            email: new FormControl(''),
            message: new FormControl(''),
        });
    }

    get name(): FormControl { return this.form.get('name') as FormControl }
    get email(): FormControl { return this.form.get('email') as FormControl }
    get message(): FormControl { return this.form.get('message') as FormControl }

    onSendReport() {
        this.triedToSumbit = true;

        if (this.form.valid) {
            let report: IReport = {
                reporterName: this.name.value,
                reporterMail: this.email.value,
                reporterMsg: this.message.value
            };

            this.data.targetPost.reports.push(report);
            this.postsService.reportPost(this.data.targetPost, report)
                .subscribe(() => {
                    this.onNoClick();
                }, (error) => {
                    let indx = this.data.targetPost.reports.indexOf(report);
                    this.data.targetPost.reports.splice(indx, 1);
                    this.errorHandler(error);
                });
        }
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    getErrorsMsgs(field, fieldName: string) {
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
                }
            })

        return errorsMsgs;
    }

    private errorHandler(error) {
        this.router.navigate(['error'], { queryParams: { errCode: error.errorData.status } })
    }
}
