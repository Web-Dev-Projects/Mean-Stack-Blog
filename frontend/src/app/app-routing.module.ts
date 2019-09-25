import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { AuthGaurd } from './common/guards/auth-gaurd';
import { PostComponent } from './posts/post/post.component';
import { ReportsListComponent } from './posts/reports/reports-list/reports-list.component';


const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'posts/:id', component: PostComponent },
    { path: 'reports/:postId', component: ReportsListComponent, canActivate: [AuthGaurd] },
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGaurd] },
    { path: '**', component: ErrorComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: false,
        anchorScrolling: 'enabled'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
