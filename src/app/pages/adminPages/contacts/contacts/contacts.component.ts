import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../../../services/generic.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class ContactsComponent implements OnInit{

  errorMessage:string=''
  isVisible : boolean = false;
  perPage : number = 5;
  totalCount : number = this.perPage;
  searchQuery:string='';

  constructor(private genericService: GenericService){

  }

  contacts:any[]=[]

  ngOnInit(): void {
    this.gets()
  }

  loadMore(){
    this.totalCount += this.perPage;
    this.gets();
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value; 
    this.gets()
  }

  gets(): void {
    this.genericService.gets("Contacts", this.totalCount, this.searchQuery).subscribe(
      (response: any) => {  
        this.contacts = response.data;
        if(response.totalCount > this.perPage){
            this.isVisible = true
          }
          if(response?.totalCount <= this.totalCount){
            this.isVisible = false;
          }
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  delete(id: number) {
    this.genericService.deleteEntity(id, 'Contacts').subscribe(
      response => {
        this.contacts = this.contacts.filter(x => x.id != id);
      },
      error => {
        if(error.status == 409){
          this.errorMessage = "The message cannot be deleted because it exists in other tables."
        }else{
          this.errorMessage = 'An error occurred, please try again later.';
        }
      }
    );
  }

}
