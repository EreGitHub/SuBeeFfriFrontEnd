import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoRoutingModule } from './tipo-routing.module';
import { TipoComponent } from './tipo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    TipoComponent
  ],
  imports: [
    CommonModule,
    TipoRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
  ]
})
export class TipoModule { }
