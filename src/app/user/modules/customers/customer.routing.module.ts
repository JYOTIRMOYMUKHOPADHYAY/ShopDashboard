import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';


const routes: Routes = [
  {
    path: '',
    component: CustomerDashboardComponent
  },
  {
    path: '',
    component: CustomerTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }