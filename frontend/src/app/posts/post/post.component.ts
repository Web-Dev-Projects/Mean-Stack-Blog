import { Component, OnInit, OnChanges } from '@angular/core';
import { IPost } from '../post';
import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscriber, Subject } from 'rxjs';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

    private postId;

    post: IPost = undefined;
    pageId = '/posts/';


    constructor(private postsService: PostsService, private activateRoute: ActivatedRoute) {
        this.postId = this.activateRoute.snapshot.params.id;
        this.pageId += this.postId;
    }

    ngOnInit() {
        this.postsService.getPost(this.postId)
            .subscribe((post: IPost) => {
                this.post = post;
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
