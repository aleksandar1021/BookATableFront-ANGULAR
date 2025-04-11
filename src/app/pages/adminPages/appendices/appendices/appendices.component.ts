import { Component, OnInit } from '@angular/core';
import { RestaurantTypeService } from '../../../../services/restaurantType.service'; 
import { GenericService } from '../../../../services/generic.service';
import { AppendiceService } from '../../../../services/appendices.service';
@Component({
  selector: 'app-appendices',
  templateUrl: './appendices.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class AppendicesComponent implements OnInit{
  appendices: any[] = []; 

  errorMessage : string = ''


  constructor(private appendiceService:AppendiceService, private genericService: GenericService){

  }

  ngOnInit(): void {
    this.gets()
  }

  gets(): void {
    this.appendiceService.gets().subscribe(
      (response: any) => {  
        this.appendices = response.data;
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  delete(id: number) {
    this.genericService.deleteEntity(id, 'Appendices').subscribe(
      response => {
        this.appendices = this.appendices.filter(x => x.id != id);
      },
      error => {
        if(error.status == 409){
          this.errorMessage = "The appendice cannot be deleted because it exists in other tables."
        }else{
          this.errorMessage = 'An error occurred, please try again later.';
        }
      }
    );
  }
}
