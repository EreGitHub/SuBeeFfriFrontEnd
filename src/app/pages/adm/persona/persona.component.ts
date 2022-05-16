import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServerService } from 'src/app/services/server.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent implements OnInit {

  titleModal: string = 'Registro de Persona';
  listPersonas: Array<any> = [];
  previsualizacion: string = '';
  archivo: any;
  Form: FormGroup = new FormGroup({
    idPersona: new FormControl(0),
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl(''),
    ci: new FormControl('', [Validators.required]),
    direccion: new FormControl(''),
  });
  constructor(
    private server: ServerService,
    private toastr: ToastrService,
    private utilities: UtilitiesService) { }

  ngOnInit(): void {
    this.All();
  }

  async All() {
    const data = await this.server.get('/Persona') as any;
    this.listPersonas = data.map((persona: any) => {
      return {
        idPersona: persona.idPersona,
        nombres: persona.nombres,
        apellidos: persona.apellidos,
        ci: persona.ci,
        direccion: persona.direccion,
        foto: (persona.direccionFoto == null) ? 'assets/img/avatar.png' : persona.direccionFoto,
      }
    });
  }

  limpiarCampos() {
    this.titleModal = 'Registro de Persona';
    this.Form.reset();
  }

  file(event: any) {
    try {
      const file = event.target.files[0];
      this.archivo = file;
      this.extraerBase64(file).then((data: any) => {
        this.previsualizacion = data;
      });
    } catch (error) {
      console.log(error);
    }
  }

  extraerBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async save() {
    if (!this.Form.valid) {
      return;
    }
    try {
      const Nombre = this.Form.get('nombres')?.value;
      const Apellidos = this.Form.get('apellidos')?.value;
      if (this.utilities.ValidarLetras(Nombre)) {
        this.toastr.error('El nombre solo puede contener letras', 'Error');
        return;
      }
      if (this.utilities.ValidarLetras(Apellidos)) {
        this.toastr.error('El apellido solo puede contener letras', 'Error');
        return;
      }
      if (this.archivo === undefined) {
        this.toastr.error('Es obligatorio adjuntar una imagen', 'Error');
        return;
      }
      const request = new FormData();
      request.append('nombres', Nombre);
      request.append('apellidos', Apellidos);
      request.append('ci', this.Form.get('ci')?.value);
      request.append('direccion', this.Form.get('direccion')?.value);
      request.append('Archivo', this.archivo);
      const idPersona = this.Form.get('idPersona')?.value === null ? 0 : this.Form.get('idPersona')?.value;
      if (idPersona === 0) {
        request.append('idPersona', idPersona);
        await this.server.post('/Persona', request) as any;
      } else {
        //this.Form.value
        await this.server.put('/Persona/' + idPersona, request) as any;
      }
      this.toastr.success('El registro se guardo exitosamente', 'Éxito');
      document.getElementById('modal-default')?.click();
      this.All();
    } catch (error: any) {
      console.log(error);
      this.toastr.error(error.error, 'Error');

    }

  }

  modificar(persona: any) {
    this.titleModal = 'Modificar Persona';
    this.previsualizacion = (persona.foto !== 'assets/img/avatar.png') ? persona.foto : '';
    this.Form.patchValue(persona);
  }

  async eliminar(idPersona: number) {
    try {
      await this.server.delete('/Persona/' + idPersona)
      this.toastr.success('El registro se elimino exitosamente', 'Éxito');
      this.All();
    } catch (error) {
      this.toastr.error('Ocurrio un error al eliminar el registro', 'Error');
    }

  }

}
