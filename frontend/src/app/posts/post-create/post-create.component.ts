import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Router } from '@angular/router';
import { UnAuthError } from 'src/app/common/errors/unauth';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

    private form: FormGroup;

    constructor(public postsService: PostsService, private router: Router) {
        this.form = new FormGroup({
            title: new FormControl(''),
            subtitle: new FormControl(''),
            content: new FormControl(''),
        });
    }

    get title(): FormControl { return this.form.get('title') as FormControl }
    get subtitle(): FormControl { return this.form.get('subtitle') as FormControl }
    get content(): FormControl { return this.form.get('content') as FormControl }

    onSave() {
        if (this.form.valid) {
            this.postsService.createPost(this.title.value, this.subtitle.value, this.content.value)
                .subscribe(() => {
                    this.router.navigate(['/home'])
                }, (error) => {
                    this.router.navigate(['error'], { queryParams: { errCode: error.getErrorData().status } })
                })
        }
    }


    getErrorsMsgs(field: AbstractControl, fieldName: string) {
        if (!(field.errors) || !(field.touched))
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
}
