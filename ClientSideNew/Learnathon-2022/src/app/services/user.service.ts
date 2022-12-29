import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { LoginService } from './login.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  response:any;
  constructor(private http:HttpClient,private LService:LoginService,private route:Router) { }
  private basepath="https://localhost:7109/api/User/";

  httpOptions = { headers:
  new HttpHeaders({ 'Content-Type':'application/json','Access-Control-Allow-Origins':'*','Authorization':'Bearer '+localStorage.getItem('token')})}

  

  public postUser(user:any)//:Observable<any>
  {
    return this.http.post(this.basepath+"Register",user,this.httpOptions);
  }

  public getUser()
  {
    return this.http.get(this.basepath+"Get",this.httpOptions);
  }
  public getUserbyId(id:string)
  {
    return this.http.get(this.basepath+"Get/"+id,this.httpOptions);
  }

  public deleteUser(id:string)
  {
    return this.http.delete(this.basepath+"Delete/"+id,this.httpOptions);
  }

 public updateUser(user:any,id:string)
  {
    return this.http.put(this.basepath+"Update/"+id,user,this.httpOptions).pipe(catchError(this.handleError_up));
  }

  public GetUserByUserName(username:string)
  {
    return this.http.get(this.basepath+"GetIdByusername/"+username,this.httpOptions);
  }







  handleError_up(error:any)
  {
    if(error instanceof HttpErrorResponse)
    {
    
      if('Email' in error.error.errors)
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops.',
          text: 'Email already Taken!'
        })
      }
      else if(error.error.status==400)
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops.',
          text: 'Please Give Proper Input'
        })
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops.',
          text: 'Someting is Wrong. Please let us fix it. ErrorCode: ' +error.error.status
        })
        
      }
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops.',
        text: 'Someting is Wrong. Please let us fix it. ErrorCode: ' +error.error.status
      })
    }
    return throwError(error);
  }

  


  
  handleError(error:any)
  {
    if(error instanceof HttpErrorResponse)
    {
     // error.error.errors.Email[0]="Email already exists";
      if('UserName' in error.error.errors)
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops.',
          text: 'UserName already exists, Plase Try Another one'
        })
      }
      else if('Email' in error.error.errors)
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops.',
          text: 'Email already Taken!'
        })
      }
      else if(error.error.status==400)
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops.',
          text: 'Please Give Proper Input'
        })
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops.',
          text: 'Someting is Wrong. Please let us fix it. ErrorCode: ' +error.error.status
        })
        
      }
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops.',
        text: 'Someting is Wrong. Please let us fix it. ErrorCode: ' +error.error.status
      })
    }
    return throwError(error);
  }
}