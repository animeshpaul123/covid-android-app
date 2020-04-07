import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatePage } from './state.page';

const routes: Routes = [
  {
    path: '',
    component: StatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatePageRoutingModule {}
