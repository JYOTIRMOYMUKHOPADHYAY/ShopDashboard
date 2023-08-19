import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChallanDashboardComponent } from './challan-dashboard/challan-dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: ChallanDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallanRoutingModule { }