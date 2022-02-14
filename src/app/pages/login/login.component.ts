import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServerService } from 'src/app/services/server.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  constructor(
    private router: Router,
    private http: HttpClient,
    private server: ServerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  async login() {
    if (!this.loginForm.valid) {
      return;
    }
    try {
      const token: any = await this.server.post('/Token', this.loginForm.value);
      localStorage.setItem('token-SuBeefrri', JSON.stringify(token.token));
      localStorage.setItem('usuario', JSON.stringify(token.usuario));
      this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);
      this.toastr.error('Usuario o contraseña incorrectos', 'Error');
    }
  }
}
