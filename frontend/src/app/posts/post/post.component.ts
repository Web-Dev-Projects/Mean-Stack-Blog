import { Component, OnInit, EventEmitter } from '@angular/core';
import { IPost, makePost } from '../post';
import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
    private postId;

    post: IPost = makePost();
    pageId = '/posts/';

    constructor(private postsService: PostsService, private activateRoute: ActivatedRoute, private router: Router) {
        this.postId = this.activateRoute.snapshot.params.id;
        this.pageId += this.postId;
    }

    ngOnInit() {
        this.postsService.getPost(this.postId)
            .subscribe((post: IPost) => {
                this.post = post;
                this.post.viewsNum++;
                this.postsService.viewPost(this.postId)
                    .subscribe(null, (error) => {
                        this.post = makePost();
                        this.post.viewsNum--;
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
}
