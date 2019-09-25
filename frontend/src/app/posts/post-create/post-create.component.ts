import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

    private form: FormGroup;
    private triedToSumbit = false;
    contentFile: File = null;

    constructor(public postsService: PostsService, private router: Router) {
        this.form = new FormGroup({
            title: new FormControl(''),
            subtitle: new FormControl(''),
            content: new FormControl('', [this.makeFileValidator("md")])
        });
    }

    get title(): FormControl { return this.form.get('title') as FormControl }
    get subtitle(): FormControl { return this.form.get('subtitle') as FormControl }
    get content(): FormControl { return this.form.get('content') as FormControl }

    onSave() {
        this.triedToSumbit = true;

        if (this.form.valid) {
            this.postsService.createPost(this.title.value, this.subtitle.value, this.contentFile)
                .subscribe(() => {
                    this.router.navigate(['/home'])
                }, (error) => {
                    this.router.navigate(['error'], { queryParams: { errCode: error.getErrorData().status } })
                })
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
                    case "wrongExetention":
                        errorsMsgs.push(`${fieldName} should have ${errors[errName].requiredExetention} exetetion`)
                        break;
                }
            })

        return errorsMsgs;
    }


    private makeFileValidator(exetention) {
        return function (control: AbstractControl) {
            if (!(control.value)) return { required: { required: true } };
            else if (control.value instanceof Array && control.value.length > 1) return { wrongFilesNum: { requiredFilesNum: 1 } }

            let fielExt = control.value.split(".").reverse()[0];

            if (fielExt !== exetention) {
                return { wrongExetention: { requiredExetention: exetention } };
            } else {
                return null;
            }
        }
    }
}
