import { Injectable } from '@angular/core';
import { IPost, makePost } from './post';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from '../common/data.service';
import { map } from 'rxjs/operators';
import { AdminService } from '../authenticate/admin.service';
import { IReport } from './reports/report';

@Injectable({
    providedIn: 'root'
})
export class PostsService extends DataService {

    private posts: IPost[] = [];
    private selectedPost: IPost = makePost();

    constructor(http: HttpClient, private adminService: AdminService) {
        super(http, "http://localhost:5000/api/posts/");
    }

    createPost(title: string, subtitle: string, contentFile: File) {
        let curdt = new Date();
        let currDate = {
            monthName: curdt.toLocaleString('default', { month: 'long' }),
            day: curdt.getDate().toString(),
            year: curdt.getFullYear().toString(),
        };

        let newPostData: FormData = new FormData();

        newPostData.append('owner', this.adminService.username);
        newPostData.append('title', title);
        newPostData.append('subtitle', subtitle);
        newPostData.append('contentFile', contentFile);
        newPostData.append('monthName', currDate.monthName);
        newPostData.append('day', currDate.day);
        newPostData.append('year', currDate.year);

        return this.create(newPostData, '', { accessToken: this.adminService.accessToken })
            .pipe(map((post: IPost) => {
                this.modifyPostsContentFileSrc([post])
                this.posts.push(post);
            }));
    }


    getPosts() {
        return new Observable(
            (subscriber) => {
                subscriber.next(this.posts)
                this.getAll().subscribe(
                    (posts: IPost[]) => {
                        this.modifyPostsContentFileSrc(posts);
                        this.posts = posts;
                        subscriber.next([...posts]);
                        subscriber.complete();
                    });
            });
    }

    getPost(postId) {
        if (this.posts.length) {
            let posts = this.posts.filter(post => post._id === postId);
            if (posts.length)
                this.selectedPost = posts[0];
        }

        if (this.selectedPost._id === postId) {
            return new Observable((subscriber) => {
                subscriber.next(Object.assign({}, this.selectedPost));
                subscriber.complete();
            })
        } else {
            return this.get(postId)
                .pipe(map((post: IPost) => {
                    this.modifyPostsContentFileSrc([post])
                    this.selectedPost = post;
                    return Object.assign({}, this.selectedPost);
                }));
        }
    }

    viewPost(postId) {
        return this.update(postId, {}, 'view/');
    }

    commentOnPost(postId) {
        return this.update(postId, {}, 'comment/');
    }

    reportPost(post: IPost, report: IReport) {
        return this.update(post._id, report, 'report/');
    };

    getPostReports(postId) {
        return new Observable(
            (subscriber) => {
                this.getPost(postId).subscribe(
                    (post: IPost) => {
                        subscriber.next([...post.reports])
                        subscriber.complete();
                    })
            });
    }


    private modifyPostsContentFileSrc(posts: IPost[]) {
        posts.forEach((post) => {
            post.contentFileSrc = this.baseUrl + post.contentFileSrc;
        });
    }

}
