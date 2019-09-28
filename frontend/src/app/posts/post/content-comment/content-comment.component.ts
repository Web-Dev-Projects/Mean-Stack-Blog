import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostsService } from '../../posts.service';

@Component({
    selector: 'app-content-comment',
    templateUrl: './content-comment.component.html',
    styleUrls: ['./content-comment.component.css']
})
export class ContentCommentComponent {

    private triedToSumbit = false;
    form: FormGroup;

    constructor(
        private postsService: PostsService,
        public dialogRef: MatDialogRef<ContentCommentComponent>,
        @Inject(MAT_DIALOG_DATA) public target: { postId: string, contentSegment: string }) {
        this.form = new FormGroup({
            name: new FormControl(''),
            comment: new FormControl(''),
        });
    }

    get name() { return this.form.get('name'); }
    get comment() { return this.form.get('comment'); }

    onNoClick(): void {
        this.dialogRef.close();
    }


    onComment() {
        this.triedToSumbit = true;

        if (this.form.valid) {
            this.postsService.commentOnPostContent(this.target.postId, this.target.contentSegment, this.name.value, this.comment.value)
                .subscribe(() => {
                    this.onNoClick();
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
                    default:
                        break;
                }
            })

        return errorsMsgs;
    }
}
