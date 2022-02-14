import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoComponent } from './tipo.component';

const routes: Routes = [{ path: '', component: TipoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoRoutingModule { }
