import { Component, OnInit } from '@angular/core';
import { OnlineUsersService } from '../services/online-users.service';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent implements OnInit {
  rows:any;
  r:any;
  p: number = 1;
  total: number = 0;
  constructor(private OnlineUsersService:OnlineUsersService) { }

  ngOnInit(): void {
    this.OnlineUsersService.getOnlineUsers().subscribe(data=>{
      this.r=data;
      this.rows=this.r.result;
    })
  }


  pageChangeEvent(event: number){
    this.p = event;
    this.ngOnInit();
}
}
