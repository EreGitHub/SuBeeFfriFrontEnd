import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalRoutingModule } from './sucursal-routing.module';
import { SucursalComponent } from './sucursal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    SucursalComponent
  ],
  imports: [
    CommonModule,
    SucursalRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
  ]
})
export class SucursalModule { }
