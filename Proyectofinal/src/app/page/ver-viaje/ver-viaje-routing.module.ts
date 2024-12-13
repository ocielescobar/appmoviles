import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerViajePage } from './ver-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: VerViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerViajePageRoutingModule {}
