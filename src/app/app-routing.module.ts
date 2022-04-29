import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { IsAuthenticatedGuard } from "./guards/is-authenticated.guard";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostEditComponent } from "./posts/post-edit/post-edit.component";
import { PostListComponent } from "./posts/post-list/post-list.component";

const routes: Routes = [
    {
        path: '',
        component: PostListComponent
    },
    {
        path: 'create',
        canActivate: [IsAuthenticatedGuard],
        component: PostCreateComponent
    },
    {
        path: 'edit/:postId',
        canActivate: [IsAuthenticatedGuard],
        component: PostCreateComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [IsAuthenticatedGuard]
})
export class AppRoutingModule {

}