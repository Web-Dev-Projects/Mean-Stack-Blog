import { Injectable } from '@angular/core';
import { IPost, makePost } from './post';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from '../common/data.service';
import { map } from 'rxjs/operators';
import { AdminService } from '../authenticate/admin.service';

@Injectable({
    providedIn: 'root'
})
export class PostsService extends DataService {

    private posts: IPost[] = [];
    private selectedPost: IPost = makePost();

    constructor(http: HttpClient, private adminService: AdminService) {
        super(http, "http://localhost:5000/api/posts/");
    }

    createPost(title: string, subtitle: string, content: string) {
        let curdt = new Date();
        let currDate = {
            monthName: curdt.toLocaleString('default', { month: 'long' }),
            day: curdt.getDate(),
            year: curdt.getFullYear()
        };

        let post = { date: currDate, title: title, subtitle: subtitle, content: content, owner: this.adminService.username }

        return this.create(post, '', { accessToken: this.adminService.accessToken })
            .pipe(map((post: IPost) => { this.posts.push(post); }));
    }

    getPosts() {
        return new Observable(
            (subscriber) => {
                subscriber.next(this.posts)
                this.getAll().subscribe(
                    (posts: IPost[]) => {
                        this.posts = posts;
                        subscriber.next(this.posts);
                        subscriber.complete();
                    });
            });
    }

    getPost(postId) {
        if (this.posts.length) {
            let posts = this.posts.filter(post => post._id === postId);
            this.selectedPost = posts ? posts[0] : null;
        }

        if (this.selectedPost._id === postId) {
            return new Observable((subscriber) => {
                subscriber.next(this.selectedPost)
                subscriber.complete();
            })
        } else {
            return this.get(postId)
                .pipe(map((post: IPost) => {
                    this.selectedPost = post;
                    return this.selectedPost;
                }));
        }
    }

    viewPost(postId) {
        return this.update(postId, {}, 'view/');
    }

    commentOnPost(postId) {
        return this.update(postId, {}, 'comment/');
    }

    reportPost(postId: string, reporterName: string, reporterMail: string, reporterMsg: string) {
        let report = { reporterName, reporterMail, reporterMsg };
        return this.update(postId, report, 'report/');
    }


    getPostReports(postId) {
        return new Observable(
            (subscriber) => {
                this.getPost(postId).subscribe(
                    (post: IPost) => {
                        subscriber.next(post.reports)
                        subscriber.complete();
                    })
            });
    }

}
