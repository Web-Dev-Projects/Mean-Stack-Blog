import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app.material.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DisqusModule } from 'ngx-disqus'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { ErrorComponent } from './error/error.component';
import { PostComponent } from './posts/post/post.component';
import { ReportComponent } from './posts/reports/report-create/report-create.component';
import { ReportsListComponent } from './posts/reports/reports-list/reports-list.component';
import { PostExetentionComponent } from './posts/post-exetention/post-exetention.component';
import { GlobalErrorHandler } from './common/errors/global-error-handler';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        PostCreateComponent,
        NavbarComponent,
        HeaderComponent,
        HomeComponent,
        FooterComponent,
        AuthenticateComponent,
        ErrorComponent,
        PostComponent,
        ReportComponent,
        ReportsListComponent,
        PostExetentionComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        AppMaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AngularFontAwesomeModule,
        HttpClientModule,
        ShareButtonsModule,
        NgFlashMessagesModule.forRoot(),
        DisqusModule.forRoot('schneider-task-2'),
        MarkdownModule.forRoot({ loader: HttpClient }),
    ],
    providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler }
    ],
    entryComponents: [
        AuthenticateComponent,
        ReportComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
