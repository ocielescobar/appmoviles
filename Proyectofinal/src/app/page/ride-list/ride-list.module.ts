import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RideListPageRoutingModule } from './ride-list-routing.module';

import { RideListPage } from './ride-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RideListPageRoutingModule
  ],
  declarations: [RideListPage]
})
export class RideListPageModule {}
