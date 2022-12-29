import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';
import { RouterLinkDelegateDirective } from '@ionic/angular/directives/navigation/router-link-delegate';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  LoginForm!:FormGroup;
  errBlock: boolean=false;
  errorText: any;
  Response:any;

  constructor(private FormBuilder:FormBuilder,private loginservice:LoginService,private route:Router,private userservice:UserService) {
  
  }

  ngOnInit()
  {
      this.LoginForm=this.FormBuilder.group({
        userName:['',[Validators.required]],
        password:['',[Validators.required,Validators.minLength(8)]]
      })
    
  }


  OnSubmit(){
    if(this.LoginForm.valid)
    {
      this.LoginForm=this.FormBuilder.group({
        userName:[this.LoginForm.value.userName],
        password:[this.LoginForm.value.password]
      })
      
      
      this.loginservice.LoginUser(this.LoginForm.value).subscribe(result=>{
        this.Response=result;
        if(this.Response!=null)
        {
          
          localStorage.setItem('token',this.Response.accessToken);
          localStorage.setItem('refreshtoken',this.Response.refreshToken);
          localStorage.setItem('username',this.LoginForm.value.userName);
          this.loginservice.PostToRedis().subscribe(result=>{});
          this.route.navigateByUrl('/UserList');
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Oops.',
            text: 'Invalid Credentials!'
          })
        }
      });
    }
  }

  
  public hasError = (controlName: string, errorName: string) =>{
    return this.LoginForm.controls[controlName].hasError(errorName);
  }

}
