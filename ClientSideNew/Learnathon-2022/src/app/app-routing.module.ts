import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { OnlineUsersComponent } from './online-users/online-users.component';

const routes: Routes = [
  { path: 'signup', component: SignUpComponent } ,
  { path: 'UserList', component:UserListComponent },
  { path:'updateUser/:id',component:UpdateUserComponent},
  { path:'login',component:LoginComponent},
  { path:'OnlineUsers',component:OnlineUsersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
