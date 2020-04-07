import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatePageRoutingModule } from './state-routing.module';

import { StatePage } from './state.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatePageRoutingModule
  ],
  declarations: [StatePage]
})
export class StatePageModule {}
