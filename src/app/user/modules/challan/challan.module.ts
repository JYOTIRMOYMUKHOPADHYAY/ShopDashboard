import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallanDashboardComponent } from './challan-dashboard/challan-dashboard.component';
import { ChallanRoutingModule } from './challan.routing.module';
import { SharedMaterialModuleModule } from 'src/app/shared-material-module/shared-material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChallanDashboardComponent
  ],
  imports: [
    CommonModule,
    ChallanRoutingModule,
    SharedMaterialModuleModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChallanModule { }
