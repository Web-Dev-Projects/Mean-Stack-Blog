import { Component, OnInit, EventEmitter, HostListener } from '@angular/core';
import { IPost, makePost } from '../post';
import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ContentCommentComponent } from './content-comment/content-comment.component';
import { AdminService } from 'src/app/authenticate/admin.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css'],
    host: { 'click': "onContetnComment" }
})
export class PostComponent implements OnInit {
    private postId;
    postContent = '';
    post: IPost = makePost();
    pageId = '/posts/';

    constructor(private postsService: PostsService,
        private contentCommentDialog: MatDialog,
        private activateRoute: ActivatedRoute,
        private router: Router,
        private adminService: AdminService) {
        this.postId = this.activateRoute.snapshot.params.id;
        this.pageId += this.postId;
        this.postsService.getPostContent(this.postId)
            .subscribe((postContent: any) => {
                this.postContent = postContent.content;
            })
    }

    ngOnInit() {
        this.postsService.getPost(this.postId)
            .subscribe((post: IPost) => {
                this.post = post;
                this.postsService.viewPost(this.postId)
                    .subscribe((viewsNum) => {
                        this.post.viewsNum = viewsNum;
                    }, (error) => {
                        this.post = makePost();
                        this.router.navigate(['error'], { queryParams: { errCode: error.getErrorData().status } });
                    })
            }, (error) => {
                this.router.navigate(['error'], { queryParams: { errCode: error.getErrorData().status } });
            });
    }

    onComment() {
        this.post.commentsNum++;
        this.postsService.commentOnPost(this.postId)
            .subscribe(() => {
            }, () => {
                this.post.commentsNum--;
            });
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
}
