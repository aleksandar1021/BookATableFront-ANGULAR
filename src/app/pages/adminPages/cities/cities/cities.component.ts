import { Component, OnInit } from '@angular/core';
import { CityService } from '../../../../services/city.service';
import { GenericService } from '../../../../services/generic.service';


@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class CitiesComponent implements OnInit{
  errorMessage: string=''
  cities: any[] = [];

  constructor(private cityService: CityService, private genericService: GenericService){

  }

  ngOnInit(): void {
    this.getCities()
  }

  getCities(): void {
    this.cityService.getCities().subscribe(
      (response: any) => {  
        this.cities = response.data;
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  delete(id: number) {
    this.genericService.deleteEntity(id, 'Cities').subscribe(
      response => {
        this.cities = this.cities.filter(x => x.id != id);
      },
      error => {
        if(error.status == 409){
          this.errorMessage = "The city cannot be deleted because it exists in other tables."
        }else{
          this.errorMessage = 'An error occurred, please try again later.';
        }
      }
    );
  }

}
