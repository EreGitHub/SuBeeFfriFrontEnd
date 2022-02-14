import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { PedidosComponent } from './pedidos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    PedidosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PedidosRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
  ]
})
export class PedidosModule { }
