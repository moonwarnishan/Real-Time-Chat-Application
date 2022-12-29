import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { UserListComponent } from '../user-list/user-list.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  UpdateForm!:FormGroup;
  errBlock: boolean=false;
  errorText: any;
  UserData:any;
  constructor(private FormBuilder:FormBuilder,private service:UserService,private router:ActivatedRoute,private route:Router) { }

  ngOnInit(): void {
    
    this.service.getUserbyId(this.router.snapshot.params['id']).subscribe(data=>{
      this.UserData=data;
      this.UpdateForm=this.FormBuilder.group({
        UserName: [this.UserData['userName']],
        Email:[this.UserData['email'],[Validators.required,Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')]],
        DateOfBirth:[this.UserData['dateOfBirth'].split('T')[0],[Validators.required,this.ageValidator]]
      })
      
    })
  }



  UserList()
  {
    this.route.navigateByUrl(`${'UserList'}`)
  }
  

  Reload()
  {
    window.location.reload();
  }
  id:any
  OnSubmit(){
    if(this.UpdateForm.valid)
    {
      this.service.updateUser(this.UpdateForm.value,this.router.snapshot.params['id']).subscribe((response)=>{
        Swal.fire('Congratulations', 'Data Updated', 'success');
        this.route.navigateByUrl(`${'UserList'}`)
      }
      , 
      error => {
        console.log(error);
        this.errBlock=true;
        this.errorText=error.Message;
      });
    }
    else
    {
      Swal.fire('Error', 'Please Give Proper input', 'error');
    }
  }





  ageValidator(control:FormControl)
  {
    if(control.value!=null)
    {
      let age=moment().diff(control.value,'years');
      if(age<18)
      {
        return {'age':true};
      }
      else
      {
        return null;
      }
    }
    return null;
  }

  

}
