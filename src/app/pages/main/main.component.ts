import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  nombreUsuario: string = '';
  constructor() { }

  ngOnInit(): void {
    const usurioLocal = localStorage.getItem('usuario') as any;
    const oUsuario = JSON.parse(usurioLocal);
    this.nombreUsuario = oUsuario.persona.nombres;
  }

}
