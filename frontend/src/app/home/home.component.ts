import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPost } from '../posts/post';
import { PostsService } from '../posts/posts.service';
import { Router } from '@angular/router';
import { AdminService } from '../authenticate/admin.service';
import { Subject } from 'rxjs';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    posts: IPost[] = [];

    constructor(private postsService: PostsService, private router: Router, private adminService: AdminService) { }


    ngOnInit() {
        this.postsService.getPosts()
            .subscribe((posts: IPost[]) => {
                this.posts = posts;
            });
    };


    viewPost(postId: string) {
        this.router.navigate(['posts', postId]);
        this.postsService.viewPost(postId).subscribe();
    }

}
