import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/pages/home/home.component';
import { RegisterComponent } from './pages/pages/register/register.component';
import { LoginComponent } from './pages/pages/login/login.component';
import { ActivationUserComponent } from './pages/pages/activation-user/activation-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'ActivateUser', component: ActivationUserComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
