import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';  
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; // Dodaj ovaj import
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/fixed/header/header.component';
import { FooterComponent } from './pages/fixed/footer/footer.component';
import { HomeComponent } from './pages/pages/home/home.component';
import { LoginComponent } from './pages/pages/login/login.component';
import { RegisterComponent } from './pages/pages/register/register.component';
import { ActivationUserComponent } from './pages/pages/activation-user/activation-user.component';
import { ContactComponent } from './pages/pages/contact/contact.component';
import { SingleComponent } from './pages/pages/single/single.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { ReservationsComponent } from './pages/pages/reservations/reservations.component';
import { SavedComponent } from './pages/pages/saved/saved.component';
import { SearchComponent } from './pages/pages/search/search.component';
import { RegisterRestaurantComponent } from './pages/pages/register-restaurant/register-restaurant.component';
import { AccountComponent } from './pages/pages/account/account.component';
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
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ActivationUserComponent,
    ContactComponent,
    SingleComponent,
    ReservationsComponent,
    SavedComponent,
    SearchComponent,
    RegisterRestaurantComponent,
    AccountComponent,
    AdminLayoutComponent,
    AdminRestaurantsComponent,
    RestaurantTypesComponent,
    AddRestaurantTypeComponent,
    UpdateRestaurantTypeComponent,
    CitiesComponent,
    AddCitiesComponent,
    UpdateCitiesComponent,
    AppendicesComponent,
    AddAppendicesComponent,
    UpdateAppendicesComponent,
    MealCategoriesComponent,
    AddMealCategoriesComponent,
    UpdateMealCategoriesComponent,
    RestaurantsComponent,
    ReadMoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
