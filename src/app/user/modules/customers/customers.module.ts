import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerRoutingModule } from './customer.routing.module';
import { GlobaltopbarComponent } from 'src/app/globaltopbar/globaltopbar.component';
import { SharedMaterialModuleModule } from 'src/app/shared-material-module/shared-material-module.module';
import { CustomerTableComponent } from './customer-table/customer-table.component';

@NgModule({
  declarations: [
    CustomerDashboardComponent,
    CustomerTableComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    GlobaltopbarComponent,
    SharedMaterialModuleModule
  ]
})
export class CustomersModule { }
