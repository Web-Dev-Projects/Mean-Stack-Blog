import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPost } from '../posts/post';
import { PostsService } from '../posts/posts.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    posts: IPost[] = [];
    positionOptions = ["create", "share", "feedback"]

    constructor(private postsService: PostsService, private router: Router) { }

    ngOnInit() {
        this.postsService.getPosts()
            .subscribe((posts: IPost[]) => {
                this.posts = posts;
            });
    };

    viewPost(postId) {
        this.router.navigate(['posts', postId]);
        this.postsService.viewPost(postId).subscribe();
    }


}
