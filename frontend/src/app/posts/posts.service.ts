import { Injectable } from '@angular/core';
import { IPost, makePost } from './post';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { DataService } from '../common/data.service';
import { AppError } from '../common/errors/apperror';
import { NotFoundError } from '../common/errors/notfound';
import { catchError, map } from 'rxjs/operators';
import { AdminService } from '../authenticate/admin.service';
import { UnAuthError } from '../common/errors/unauth';

@Injectable({
    providedIn: 'root'
})
export class PostsService extends DataService {

    private posts: IPost[] = [];
    private selectedPost: IPost = makePost();

    constructor(http: HttpClient, private router: Router, private adminService: AdminService) {
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
            .pipe(map((post: IPost) => { this.posts.push(post); }))
            .pipe(catchError(this.errorHandler));
    }

    getPosts() {
        return new Observable(
            (subscriber) => {
                subscriber.next(this.posts)
                this.getAll().subscribe((posts: IPost[]) => {
                    this.posts = posts;
                    subscriber.next(this.posts);
                    subscriber.complete();
                });
            }).pipe(catchError(this.errorHandler));
    }

    getPost(postId) {
        if (!this.selectedPost && this.posts) {
            let posts = this.posts.filter(post => post._id === postId);
            this.selectedPost = posts ? posts[0] : null;
        }

        if (this.selectedPost && (this.selectedPost._id === postId)) {
            return new Observable((subscriber) => {
                subscriber.next(this.selectedPost)
                subscriber.complete();
            })
        } else {
            return this.get(postId)
                .pipe(catchError(this.errorHandler))
                .pipe(map((post: any) => {
                    this.selectedPost = post;
                    return this.selectedPost;
                }));
        }
    }

    viewPost(postId) {
        return this.update(postId, {}, 'view/')
            .pipe(catchError(this.errorHandler));
    }

    commentOnPost(postId) {
        return this.update(postId, {}, 'comment/')
            .pipe(catchError(this.errorHandler));
    }

    reportPost(postId: string, reporterName: string, reporterMail: string, reporterMsg: string) {
        let report = { reporterName, reporterMail, reporterMsg };
        return this.update(postId, report, 'report/')
            .pipe(catchError(this.errorHandler));
    }


    getPostReports(postId) {
        return new Observable(
            (subscriber) => {
                this.getPost(postId)
                    .subscribe((post: IPost) => {
                        subscriber.next(post.reports)
                        subscriber.complete();
                    })
            }).pipe(catchError(this.errorHandler));
    }

    private errorHandler(error) {
        if (error.status === 404) return throwError(new NotFoundError(error));
        if (error.status === 401 || error.status === 402) return throwError(new UnAuthError(error));
        return throwError(new AppError(error));
    }

}
