import { Injectable } from '@angular/core';
import { IPost } from './post';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { DataService } from '../common/data.service';
import { AppError } from '../common/errors/apperror';
import { NotFoundError } from '../common/errors/notfound';
import { BadInputError } from '../common/errors/badinput';
import { catchError, map } from 'rxjs/operators';
import { AdminService } from '../Authenticate/admin.service';

@Injectable({
    providedIn: 'root'
})
export class PostsService extends DataService {

    private posts: IPost[] = [];
    private selectedPost: IPost = null;

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

        let post = { _id: undefined, date: currDate, title: title, subtitle: subtitle, content: content, owner: this.adminService.username }
        let resource = Object.assign(post, { accessToken: localStorage.getItem('accessToken') });

        return this.create(resource)
            .pipe(catchError(this.errorHandler));
    }

    addPost(post: IPost) {
        this.posts.push(post);
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

    // getMyRating(postId) {
    //     let reqBody = { accessToken: localStorage.get('accessToken') };
    //     return this.getWithReqBody(postId, "userRating/", reqBody)
    //         .pipe(catchError(this.errorHandler));
    // }




    // addComment(postId, comment: IComment) {
    //     return this.update(postId, comment, 'comments/')
    //         .pipe(catchError(this.errorHandler));
    // }




    // private modifypostsData(posts) {
    //     let baseUrl = "http://www.localhost:5000/";
    //     const extractFileName = (path) => {
    //         let dirs = (path as string).split('/');
    //         let fileName = dirs[dirs.length - 1];
    //         return fileName;
    //     }

    //     posts.forEach((post) => {
    //         post.imgFileSrc = baseUrl + extractFileName(post.imgFileSrc);
    //         post.exeFileSrc = extractFileName(post.exeFileSrc);
    //     });

    // }

    private errorHandler(error) {
        console.log(error)
        if (error.status === 404) return throwError(new NotFoundError(error));
        if (error.status === 400 || error.status === 401) return throwError(new BadInputError(error));
        return throwError(new AppError(error));
    }

}
