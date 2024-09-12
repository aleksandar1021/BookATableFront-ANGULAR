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
import { AuthGuard } from './auth.guard';
import { AdminLayoutComponent } from './pages/adminPages/admin-layout/admin-layout.component';
import { AdminRestaurantsComponent } from './pages/adminPages/admin-restaurants/admin-restaurants.component';
import { RestaurantTypesComponent } from './pages/adminPages/restaurant-types/restaurant-types.component';
import { AddRestaurantTypeComponent } from './pages/adminPages/add-restaurant-type/add-restaurant-type.component';
import { UpdateRestaurantTypeComponent } from './pages/adminPages/update-restaurant-type/update-restaurant-type.component';
import { CitiesComponent } from './pages/adminPages/cities/cities/cities.component';
import { AddCitiesComponent } from './pages/adminPages/cities/add-cities/add-cities.component';
import { UpdateCitiesComponent } from './pages/adminPages/cities/update-cities/update-cities.component';
import { AppendicesComponent } from './pages/adminPages/appendices/appendices/appendices.component';
import { AddAppendicesComponent } from './pages/adminPages/appendices/add-appendices/add-appendices.component';
import { UpdateAppendicesComponent } from './pages/adminPages/appendices/update-appendices/update-appendices.component';
import { MealCategoriesComponent } from './pages/adminPages/meal-categories/meal-categories/meal-categories.component';
import { AddMealCategoriesComponent } from './pages/adminPages/meal-categories/add-meal-categories/add-meal-categories.component';
import { UpdateMealCategoriesComponent } from './pages/adminPages/meal-categories/update-meal-categories/update-meal-categories.component';
import { RestaurantsComponent } from './pages/adminPages/restaurants/restaurants/restaurants.component';
import { ReadMoreComponent } from './pages/adminPages/restaurants/read-more/read-more.component';
import { ContactsComponent } from './pages/adminPages/contacts/contacts/contacts.component';
import { UsersComponent } from './pages/adminPages/ussers/users/users.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'activateUser', component: ActivationUserComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'single', component: SingleComponent },
  { path: 'reservations', component: ReservationsComponent, canActivate: [AuthGuard] },
  { path: 'saved', component: SavedComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent },
  { path: 'registerRestaurant', component: RegisterRestaurantComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'restaurants', component: RestaurantsComponent, canActivate: [AuthGuard] },
      { path: 'readMore/:id', component: ReadMoreComponent, canActivate: [AuthGuard] },


      { path: 'restaurantTypes', component: RestaurantTypesComponent, canActivate: [AuthGuard] },
      { path: 'addRestaurantType', component: AddRestaurantTypeComponent, canActivate: [AuthGuard] },
      { path: 'updateRestaurantType/:id', component: UpdateRestaurantTypeComponent, canActivate: [AuthGuard] },


      { path: 'cities', component: CitiesComponent, canActivate: [AuthGuard] },
      { path: 'addCity', component: AddCitiesComponent, canActivate: [AuthGuard] },
      { path: 'updateCity/:id', component: UpdateCitiesComponent, canActivate: [AuthGuard] },


      { path: 'appendices', component: AppendicesComponent, canActivate: [AuthGuard] },
      { path: 'addAppendice', component: AddAppendicesComponent, canActivate: [AuthGuard] },
      { path: 'updateAppendice/:id', component: UpdateAppendicesComponent, canActivate: [AuthGuard] },


      { path: 'mealCategories', component: MealCategoriesComponent, canActivate: [AuthGuard] },
      { path: 'addMealCategory', component: AddMealCategoriesComponent, canActivate: [AuthGuard] },
      { path: 'updateMealCategory/:id', component: UpdateMealCategoriesComponent, canActivate: [AuthGuard] },


      { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard] },


      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
