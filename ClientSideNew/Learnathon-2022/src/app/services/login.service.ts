import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http:HttpClient, private router:Router) { }
  private basepath="https://localhost:7109/api/User/";
  private heartbeatpath="http://localhost:5170/api/Cache";
  httpOptions = { headers:
  new HttpHeaders({ 'Content-Type':'application/json','Access-Control-Allow-Origins':'*'})}

  public PostToRedis()
  {
    var k='"'+localStorage.getItem('username')+'"';
    return this.http.post(this.heartbeatpath,k,this.httpOptions);
  }

  public LoginUser(userInfo:any)//:Observable<any>
  {
    return this.http.post(this.basepath+"Login",userInfo,this.httpOptions);
  }

  
  IsLogged() {
    return localStorage.getItem("token") != null;
  }
  GetToken() {
    return localStorage.getItem("token") || '';
  }
  GetRefreshToken() {
    return localStorage.getItem("refreshtoken") || '';
  }

  SaveTokens(tokendata: any) {
    localStorage.setItem('token', tokendata.token);
    localStorage.setItem('refreshtoken', tokendata.refreshToken);
  }

  Logout() {
    alert('Your session expired')
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }


  GenerateRefreshToken() {
    let input = {
      "accessToken": this.GetToken(),
      "refreshToken": this.GetRefreshToken()
    }
    return this.http.post(this.basepath + 'RefreshToken', input);
  }

  handleError(error:any)
  {
    if(error instanceof HttpErrorResponse)
    {
     // error.error.errors.Email[0]="Email already exists";
      
      if(error.error.status==400)
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
          text: 'Error code: ' +error.error.status
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
