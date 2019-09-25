import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { AuthenticateComponent } from '../authenticate/authenticate.component';
import { AdminService } from '../authenticate/admin.service';
import { Router } from '@angular/router';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

    toCollapse = true;
    constructor(private router: Router, private authDialog: MatDialog, public adminService: AdminService) {
    }

    gainAdminAccess() {
        if (!(this.adminService.isSignedIn)) {
            this.authDialog.open(AuthenticateComponent, {
                width: '400px',
                data: { username: '', password: '' }
            });
        }
    }

    loseAdminAccess() {
        if (this.adminService.isSignedIn) {
            this.adminService.signout();
            this.router.navigate(['/'])
        }
    }

}

