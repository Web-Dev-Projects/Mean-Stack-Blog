import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPost } from '../posts/post';
import { PostsService } from '../posts/posts.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from '../authenticate/admin.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    posts: IPost[] = [];
    private postsSub: Subscription;

    constructor(private postsService: PostsService, private router: Router, public adminService: AdminService) { }

    ngOnInit() {
        this.postsSub = this.postsService.posts.subscribe((posts: IPost[]) => this.posts = posts);
    };

    viewPost(postId: string) {
        this.router.navigate(['posts', postId], { fragment: "mainNav" });
    }

    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
    }
}
