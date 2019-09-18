import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    @Input('headerClass') headerClass: string = "";
    @Input('title') title: string = "";
    @Input('subtitle') subtitle: string = "";
    @Input('content') content: string = "";
    @Input('imageUrl') imageUrl: string = "";

    constructor() { }


}
