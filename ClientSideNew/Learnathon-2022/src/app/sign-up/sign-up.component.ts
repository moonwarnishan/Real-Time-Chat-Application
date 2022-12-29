import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  RForm!:FormGroup;
  errBlock: boolean=false;
  errorText: any;
  RegForm!:FormGroup;
  constructor(private FormBuilder:FormBuilder,private service:UserService,private route:Router) {}

  ngOnInit()
  {
    this.RForm=this.FormBuilder.group({
      UserName:['',[Validators.required]],
      Email:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')]],
      DateOfBirth:['',[Validators.required,this.ageValidator]],
      Password:['',[Validators.required,Validators.minLength(8),Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      ConfirmPassword:['',[Validators.required]]
    },{
      validator:this.mustMatch('Password','ConfirmPassword')
    })
  }

  Reload()
  {
    window.location.reload();
  }

  OnSubmit(){
    if(this.RForm.valid)
    {
      this.RegForm=this.FormBuilder.group({
        UserName:[this.RForm.value.UserName],
        Email:[this.RForm.value.Email],
        DateOfBirth:[this.RForm.value.DateOfBirth],
        Password:[this.RForm.value.Password],
      })
      this.service.postUser(this.RegForm.value).subscribe((response)=>{
        Swal.fire('Congratulations', 'Registration Success', 'success');
        this.route.navigateByUrl('/login');
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

  
  public hasError = (controlName: string, errorName: string) =>{
    return this.RegForm.controls[controlName].hasError(errorName);
  }

  
//Age Validation 18+
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



  
  //password match validator
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls['Password'];
      const matchingControl = formGroup.controls['ConfirmPassword'];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }
}
