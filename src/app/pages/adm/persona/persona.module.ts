import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonaRoutingModule } from './persona-routing.module';
import { PersonaComponent } from './persona.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PersonaComponent
  ],
  imports: [
    CommonModule,
    PersonaRoutingModule,
    ReactiveFormsModule,
  ]
})
export class PersonaModule { }
