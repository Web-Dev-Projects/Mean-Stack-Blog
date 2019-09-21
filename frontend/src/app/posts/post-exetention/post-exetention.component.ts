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
            data: { targetPostId: this.post._id }
        });
    }

    getUrl() {
        return 'https://localhost.com/posts/' + this.post._id;
    }
}
