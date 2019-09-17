import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { AuthenticateComponent } from '../Authenticate/authenticate.component';
import { AdminService } from '../Authenticate/admin.service';
import { Router } from '@angular/router';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

    toCollapse = true;
    constructor(private router: Router, private authDialog: MatDialog, private adminService: AdminService) {
    }

    navigateToCreate() {
        if (this.adminService.isSignedIn) {
            this.router.navigate(['create']);
        } else {
            this.authDialog.open(AuthenticateComponent, {
                width: '400px',
                data: { username: '', password: '' }
            });
        }
    }



}

