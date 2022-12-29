import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

import { LoginComponent } from '../login/login.component';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  p: number = 1;
  total: number = 0;
  rows:any;
  constructor(private services:UserService,private router:Router,private loginService:LoginService)  {
   }
  
  ngOnInit(): void {
    if(localStorage.getItem('token')==null)
    {
      this.router.navigateByUrl('/login');
    } 
  
    this.services.getUser().subscribe(data=>{
      this.rows=data;   
    })
  }
  LogOut()
  {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  Update(row:any)
  {
    this.router.navigateByUrl(`${'updateUser'}/${row['id']}`);
  }
  Delete(id:string) 
  {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.services.deleteUser(id).subscribe(data=>{
          this.ngOnInit();
        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })

  }
  pageChangeEvent(event: number){
    this.p = event;
    this.ngOnInit();
}



}
