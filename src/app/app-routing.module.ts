import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/pages/home/home.component';
import { RegisterComponent } from './pages/pages/register/register.component';
import { LoginComponent } from './pages/pages/login/login.component';
import { ActivationUserComponent } from './pages/pages/activation-user/activation-user.component';
import { ContactComponent } from './pages/pages/contact/contact.component';
import { SingleComponent } from './pages/pages/single/single.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'activateUser', component: ActivationUserComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'single', component: SingleComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
