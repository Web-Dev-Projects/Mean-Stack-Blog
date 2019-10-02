import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { IPost, makePost } from '../post';
import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ContentCommentComponent } from './content-comment/content-comment.component';
import { AdminService } from 'src/app/authenticate/admin.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css'],
    host: { 'click': "onContetnComment" }
})
export class PostComponent implements OnInit, OnDestroy {

    private postId;
    private postSub: Subscription;
    post: IPost = makePost();
    postContent = '';
    pageId = '/posts/';

    constructor(private postsService: PostsService,
        private contentCommentDialog: MatDialog,
        private activateRoute: ActivatedRoute,
        private router: Router,
        private adminService: AdminService) {
        this.postId = this.activateRoute.snapshot.params.id;
        this.pageId += this.postId;
    }

    ngOnInit() {
        this.postsService.viewPost(this.postId);
        this.postSub = this.postsService.getPost(this.postId)
            .subscribe((post: IPost) => {
                this.post = post;
            }, (error) => {
                this.router.navigate(['error'], { queryParams: { errCode: error.getErrorData().status } });
            });

        this.postsService.getPostContent(this.postId)
            .subscribe((postContent: any) => {
                this.postContent = postContent.content;
            })
    }

    onComment() {
        this.postsService.commentOnPost(this.postId);
    }

    @HostListener('click', ['$event.target']) onContentComment(target: HTMLElement) {
        if (target.localName === 'i' && (target.className.includes("contentComments"))) {
            if (this.adminService.isSignedIn) {

                if (this.postContent.includes(`<ul id=${target.id} name='contentComments' hidden>`)) {
                    this.postContent = this.postContent.replace(`<ul id=${target.id} name='contentComments' hidden>`
                        , `<ul id=${target.id} name='contentComments'>`);
                } else {
                    this.postContent = this.postContent.replace(`<ul id=${target.id} name='contentComments'>`
                        , `<ul id=${target.id} name='contentComments' hidden>`);
                }
            } else {
                this.contentCommentDialog.open(ContentCommentComponent, {
                    width: '400px',
                    data: { postId: this.postId, contentSegment: target.id }
                })
            }

        }
    }

    ngOnDestroy(): void {
        this.postSub.unsubscribe();
    }

}
