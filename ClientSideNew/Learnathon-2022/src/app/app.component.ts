import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { OnlineUsersComponent } from './online-users/online-users.component';
import { LoginService } from './services/login.service';
import { OnlineUsersService } from './services/online-users.service';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'Learnathon-2022';
  constructor(private Service:LoginService,private OnlineUserService:OnlineUsersService)
  {
    this.ngOnInit();
  }
  ngOnInit():void
  {
    interval(30000).subscribe(d=>{
      this.Service.PostToRedis().subscribe(result=>{});;
    })

    interval(15000).subscribe(d=>{
      this.OnlineUserService.getOnlineUsers().subscribe(result=>{});;
    })
  }
  
}
