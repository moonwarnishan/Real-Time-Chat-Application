import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnlineUsersService {

  constructor(private http:HttpClient) { }
  private basepath="https://localhost:7109/api/OnlineUsers";
  httpOptions = { headers:
    new HttpHeaders({ 'Content-Type':'application/json','Access-Control-Allow-Origins':'*','Authorization':'Bearer '+localStorage.getItem('token')})}
  
  getOnlineUsers()
  {
    return this.http.get(this.basepath,this.httpOptions);
  }
}
