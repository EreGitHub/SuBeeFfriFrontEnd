import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedorRoutingModule } from './proveedor-routing.module';
import { ProveedorComponent } from './proveedor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    ProveedorComponent
  ],
  imports: [
    CommonModule,
    ProveedorRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
  ]
})
export class ProveedorModule { }
