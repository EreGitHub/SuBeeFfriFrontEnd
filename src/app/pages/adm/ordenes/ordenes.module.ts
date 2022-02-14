import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenesRoutingModule } from './ordenes-routing.module';
import { OrdenesComponent } from './ordenes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    OrdenesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OrdenesRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
  ]
})
export class OrdenesModule { }
