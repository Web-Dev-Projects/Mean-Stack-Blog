import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app.material.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DisqusModule } from 'ngx-disqus'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { AuthenticateComponent } from './Authenticate/authenticate.component';
import { ErrorComponent } from './error/error.component';
import { PostComponent } from './posts/post/post.component';

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
        DisqusModule.forRoot('schneider-task-2')
    ],
    providers: [],
    entryComponents: [
        AuthenticateComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
