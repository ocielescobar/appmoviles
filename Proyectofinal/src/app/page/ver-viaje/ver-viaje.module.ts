import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerViajePageRoutingModule } from './ver-viaje-routing.module';

import { VerViajePage } from './ver-viaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerViajePageRoutingModule
  ],
  declarations: [VerViajePage]
})
export class VerViajePageModule {}
