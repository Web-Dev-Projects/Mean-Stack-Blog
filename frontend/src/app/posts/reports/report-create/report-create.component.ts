import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostsService } from '../../posts.service';

@Component({
    selector: 'app-report',
    templateUrl: './report-create.component.html',
    styleUrls: ['./report-create.component.css']
})
export class ReportComponent {

    private triedToSumbit = false;
    private form: FormGroup;

    constructor(
        private postsService: PostsService,
        public dialogRef: MatDialogRef<ReportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { targetPostId: string }) {

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
            this.postsService.reportPost(this.data.targetPostId, this.name.value, this.email.value, this.message.value)
                .subscribe(() => {
                    //TODO 
                    this.onNoClick();
                }, this.errorHandler);
        }
    }


    onNoClick(): void {
        this.dialogRef.close();
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
                }
            })

        return errorsMsgs;
    }

    private errorHandler(error) {
        console.log(error)
    }
}
