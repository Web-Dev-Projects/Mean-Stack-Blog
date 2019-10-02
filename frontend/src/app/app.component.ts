import { Component } from '@angular/core';
import { SidService } from './sid.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'task2';
    _isLoading = true;

    constructor(sidService: SidService) {
        sidService.gainSID()
            .subscribe((sid: string) => {
                localStorage.setItem('sid', sid);
                this._isLoading = false;
            })
    }
    get isLoading() { return this._isLoading };

}
