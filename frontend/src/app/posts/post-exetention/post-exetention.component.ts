import { Component, Input, ChangeDetectionStrategy, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { IPost } from '../post';
import { MatDialog } from '@angular/material/dialog';
import { ReportComponent } from 'src/app/posts/reports/report-create/report-create.component';
import { AdminService } from 'src/app/authenticate/admin.service';
import { PostsService } from '../posts.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-post-exetention',
    templateUrl: './post-exetention.component.html',
    styleUrls: ['./post-exetention.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostExetentionComponent {

    @Input('post') post: IPost;

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
        let id = this.post ? this.post._id : '';
        return 'https://localhost.com/posts/' + id;
    }


}
