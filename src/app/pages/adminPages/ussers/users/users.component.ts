import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../../../services/generic.service';
import { development } from '../../../../../environments/development';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: '../../admin-layout/admin-layout.component.scss'
})
export class UsersComponent implements OnInit{

  errorMessage = ''
  users: any[] = []
  isVisible : boolean = false;
  perPage : number = 5;
  totalCount : number = this.perPage;
  searchQuery:string='';
  url = development.userImageUrl

  constructor(private genericService: GenericService){

  }

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
    this.genericService.gets("Users", this.totalCount, this.searchQuery).subscribe(
      (response: any) => {  
        this.users = response.data;
        //console.log(response.data)
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
    this.genericService.deleteEntityAdmin(id, 'Users', 'Admin').subscribe(
      response => {
        this.users = this.users.filter(x => x.id != id);
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
