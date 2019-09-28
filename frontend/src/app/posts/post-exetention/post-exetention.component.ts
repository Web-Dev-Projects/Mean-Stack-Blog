import { Component, Input } from '@angular/core';
import { IPost, makePost } from '../post';
import { MatDialog } from '@angular/material/dialog';
import { ReportComponent } from 'src/app/posts/reports/report-create/report-create.component';
import { AdminService } from 'src/app/authenticate/admin.service';
import { PostsService } from '../posts.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-post-exetention',
    templateUrl: './post-exetention.component.html',
    styleUrls: ['./post-exetention.component.css'],
})
export class PostExetentionComponent {

    @Input('post') post: IPost = makePost();
    private _canShowShareOpts = false;

    constructor(private reportDialog: MatDialog, private router: Router, public adminService: AdminService, private postsService: PostsService) { }

    get canShowSharingOpts() {
        return this._canShowShareOpts;
    }

    get likeState() {
        return this.post.likers.find(e => e === localStorage.getItem('sid').toString())
    }

    toggleSharingOpts() {
        this._canShowShareOpts = !(this._canShowShareOpts);
    }

    openReports() {
        if (this.adminService.isSignedIn) {
            this.router.navigate(['reports', this.post._id]);
        }
    }

    report() {
        this.reportDialog.open(ReportComponent, {
            width: '600px',
            data: { targetPost: this.post }
        });
    }

    getUrl() {
        return 'https://localhost.com/posts/' + this.post._id;
    }

    changeLikeState() {

        if (this.likeState) {
            this.postsService.likePost(this.post._id, false)
                .subscribe((likers) => {
                    this.post.likers = likers;
                })
        } else {
            this.postsService.likePost(this.post._id, true)
                .subscribe((likers) => {
                    this.post.likers = likers;
                })
        }
    }
}
