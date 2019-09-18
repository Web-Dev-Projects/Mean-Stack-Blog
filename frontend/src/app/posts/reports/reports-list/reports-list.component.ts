import { Component, OnInit } from '@angular/core';
import { IReport } from '../report';
import { PostsService } from '../../posts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reports-list',
    templateUrl: './reports-list.component.html',
    styleUrls: ['./reports-list.component.css']
})
export class ReportsListComponent {
    reports: IReport[] = []

    constructor(postService: PostsService, activatedRoute: ActivatedRoute) {
        let postId = activatedRoute.snapshot.params.postId;
        postService.getPostReports(postId)
            .subscribe((reports: IReport[]) => {
                this.reports = reports;
            })
    }

}
