import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RideListPage } from './ride-list.page';

const routes: Routes = [
  {
    path: '',
    component: RideListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RideListPageRoutingModule {}