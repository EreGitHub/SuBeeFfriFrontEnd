import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  IsAdm: boolean = false;
  NombreUsuario: string = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
    const usurioLocal = localStorage.getItem('usuario') as any;
    const oUsuario = JSON.parse(usurioLocal);
    this.IsAdm = oUsuario.tipo.idTipo === 1;
    this.NombreUsuario = oUsuario.persona.nombres;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
