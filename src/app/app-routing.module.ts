import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/pages/home/home.component';
import { RegisterComponent } from './pages/pages/register/register.component';
import { LoginComponent } from './pages/pages/login/login.component';
import { ActivationUserComponent } from './pages/pages/activation-user/activation-user.component';
import { ContactComponent } from './pages/pages/contact/contact.component';
import { SingleComponent } from './pages/pages/single/single.component';
import { ReservationsComponent } from './pages/pages/reservations/reservations.component';
import { SavedComponent } from './pages/pages/saved/saved.component';
import { SearchComponent } from './pages/pages/search/search.component';
import { RegisterRestaurantComponent } from './pages/pages/register-restaurant/register-restaurant.component'; 
import { AccountComponent } from './pages/pages/account/account.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'activateUser', component: ActivationUserComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'single', component: SingleComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'saved', component: SavedComponent },
  { path: 'search', component: SearchComponent },
  //{ path: 'registerRestaurant', component: RegisterRestaurantComponent }
  { path: 'account', component: AccountComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
