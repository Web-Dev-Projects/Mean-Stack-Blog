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

    constructor(private postsService: PostsService, private activateRoute: ActivatedRoute) {
        this.postId = this.activateRoute.snapshot.params.id;
        this.pageId += this.postId;
    }

    ngOnInit() {
        this.postsService.getPost(this.postId)
            .subscribe((post: IPost) => {
                this.post = post;
                this.post.viewsNum++;
                this.postsService.viewPost(this.postId)
                    .subscribe(null, () => {
                        this.post.viewsNum--;
                    })
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
