import { Injectable } from '@angular/core';
import { IPost, makePost } from './post';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataService } from '../common/data.service';
import { map } from 'rxjs/operators';
import { AdminService } from '../authenticate/admin.service';
import { IReport } from './reports/report';

@Injectable({
    providedIn: 'root'
})
export class PostsService extends DataService {

    private _posts: IPost[] = [];
    private _posts$ = new BehaviorSubject<IPost[]>(this._posts);

    private _post: IPost = makePost();
    private _post$ = new BehaviorSubject<IPost>(this._post);

    constructor(http: HttpClient, private adminService: AdminService) {
        super(http, "http://localhost:5000/api/posts/");
        this.getAll().subscribe((posts: IPost[]) => {
            this.modifyPostsContentFileSrc(posts);
            this._posts = posts;
            this._posts$.next([...this._posts]);
        });
    }

    get posts(): Observable<IPost[]> { return this._posts$.asObservable() };

    getPost(postId): Observable<IPost> {
        if (this.selectPost(postId)) {
            this._post$.next(Object.assign({}, this._post));
        } else {
            this.get(postId)
                .subscribe((post: IPost) => {
                    this.modifyPostsContentFileSrc([post])
                    this._post = post;
                    this._post$.next(Object.assign({}, this._post));
                });
        }

        return this._post$.asObservable();
    };

    createPost(title: string, subtitle: string, contentFile: File) {
        let curdt = new Date();
        let currDate = {
            monthName: curdt.toLocaleString('default', { month: 'long' }),
            day: curdt.getDate().toString(),
            year: curdt.getFullYear().toString(),
        };

        let newPostData: FormData = new FormData();

        newPostData.append('title', title);
        newPostData.append('subtitle', subtitle);
        newPostData.append('contentFile', contentFile);
        newPostData.append('owner', this.adminService.username);
        newPostData.append('monthName', currDate.monthName);
        newPostData.append('day', currDate.day);
        newPostData.append('year', currDate.year);



        return this.create(newPostData, '', { accessToken: this.adminService.accessToken })
            .pipe(map(((post: IPost) => {
                this.modifyPostsContentFileSrc([post])
                this._posts.push(post);
                let newPosts = [...this._posts];
                this._posts$.next(newPosts);
                return newPosts;
            })));
    }


    viewPost(postId) {
        this.selectPost(postId);
        this.update(postId, { sid: localStorage.getItem('sid') }, 'view/')
            .subscribe((viewsNum: number) => {
                this._post.viewsNum = viewsNum;
                this._post$.next(Object.assign({}, this._post));
                this._posts$.next([...this._posts]);
            })
    }

    likePost(postId, like: boolean) {
        this.selectPost(postId);

        this.update(postId, { sid: localStorage.getItem('sid'), like: like }, 'like/')
            .subscribe((likers: []) => {
                this._post.likers = likers;
                this._post$.next(Object.assign({}, this._post));
                this._posts$.next([...this._posts]);
            });
    }

    commentOnPost(postId) {
        this.selectPost(postId);

        this._post.commentsNum++;
        this._post$.next(Object.assign({}, this._post));
        return this.update(postId, {}, 'comment/')
            .subscribe(() => {
                this._post$.next(Object.assign({}, this._post));
            }, () => {
                this._post.commentsNum--;
                this._post$.next(Object.assign({}, this._post));
            })
    }

    commentOnPostContent(postId, contentSegment, name, comment) {
        return this.update(postId, { contentSegment: contentSegment, name: name, comment: comment }, 'content/');

    }

    reportPost(post: IPost, report: IReport) {
        return this.update(post._id, report, 'report/');
    };

    getPostReports(postId) {
        return new Observable(
            (subscriber) => {
                this.get(postId).subscribe(
                    (post: IPost) => {
                        subscriber.next([...post.reports])
                        subscriber.complete();
                    })
            });
    }

    getPostContent(postId) {
        return this.get(postId, 'content/', { accessToken: this.adminService.accessToken });
    };


    private selectPost(postId) {
        let post = this._posts.find(post => post._id === postId);
        if (post) {
            this._post = post;
            return true
        }
        return false;
    }

    private modifyPostsContentFileSrc(posts: IPost[]) {
        posts.forEach((post) => {
            post.contentFileSrc = this.baseUrl + post.contentFileSrc;
        });
    }

}
