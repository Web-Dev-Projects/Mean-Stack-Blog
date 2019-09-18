import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { AdminService } from 'src/app/authenticate/admin.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGaurd implements CanActivate {

    constructor(private adminService: AdminService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.adminService.isSignedIn) {
            return true;
        }

        this.router.navigate(["/error"], { queryParams: { errCode: 401 } });
        return false;
    }

}