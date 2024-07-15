import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ShowListComponent } from './show-list/show-list.component';
import { AuthGuard } from './auth.guard';
import { ImdbShowDetailsComponent } from './imdb-show-details/imdb-show-details.component';
import { ShowSearchComponent } from './show-search/show-search.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'imdb', component: ImdbShowDetailsComponent },
  { path: 'imdbsearch', component: ShowSearchComponent },
  { path: '', component: LoginComponent },
  { path: 'shows', component: ShowListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
