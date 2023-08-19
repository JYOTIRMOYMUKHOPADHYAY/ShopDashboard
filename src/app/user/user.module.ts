import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChildRoutingModule } from './user.routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatCardModule } from '@angular/material/card';
import { SharedMaterialModuleModule } from '../shared-material-module/shared-material-module.module';



@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    ChildRoutingModule,
    SharedMaterialModuleModule
  ]
})
export class UserModule { }
