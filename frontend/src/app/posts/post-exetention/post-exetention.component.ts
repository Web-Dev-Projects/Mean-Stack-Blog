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
    private _canShowQR = false;

    constructor(private reportDialog: MatDialog, private router: Router, public adminService: AdminService, private postsService: PostsService) { }

    get canShowSharingOpts() { return this._canShowShareOpts; }
    get canShowQR() { return this._canShowQR; }
    get likeState() { return this.post.likers.find(e => e === localStorage.getItem('sid').toString()) }
    get url() { return 'https://localhost:4200/posts/' + this.post._id; }

    toggleSharingOpts() {
        this._canShowShareOpts = !(this._canShowShareOpts);
        if (this._canShowShareOpts) this._canShowQR = false;
    }

    toggleQR() {
        this._canShowQR = !(this._canShowQR);
        if (this._canShowQR) this._canShowShareOpts = false;
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


    changeLikeState() {

        if (this.likeState) {
            this.postsService.likePost(this.post._id, false);
        } else {
            this.postsService.likePost(this.post._id, true);
        }
    }
}
