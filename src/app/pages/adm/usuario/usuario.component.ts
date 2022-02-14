import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServerService } from 'src/app/services/server.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements AfterViewInit, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  titleModal: string = 'Nuevo Usuario';
  listUsuarios: Array<any> = [];
  listPersona: Array<any> = [];
  listSucursal: Array<any> = [];
  listTipoUsuario: Array<any> = [];
  Form: FormGroup = new FormGroup({
    idUsuario: new FormControl(0),
    claveUs: new FormControl('', [Validators.required]),
    passwordUs: new FormControl('', [Validators.required]),
    idPersona: new FormControl('', [Validators.required]),
    idSucursal: new FormControl('', [Validators.required]),
    idTipo: new FormControl('', [Validators.required])
  });
  constructor(
    private server: ServerService,
    private toastr: ToastrService) { }

  async ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,

      destroy: true,
      info: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
      },
      pageLength: 10
    };

  }

  async ngAfterViewInit() {
    await this.ListarUsuarios();
    await this.ListarPersona();
    await this.ListarSucursal();
    await this.ListarTipoUsuario();
    this.dtTrigger.next();
  }

  async ListarUsuarios() {
    this.listUsuarios = await this.server.get('/Usuario') as any;
  }

  async ListarPersona() {
    this.listPersona = await this.server.get('/Persona') as any;
  }

  async ListarSucursal() {
    this.listSucursal = await this.server.get('/Sucursal') as any;
  }

  async ListarTipoUsuario() {
    this.listTipoUsuario = await this.server.get('/TipoUsuario') as any;
  }

  limpiarCampos() {
    this.titleModal = 'Nuevo Usuario';
    this.Form.reset();
  }

  async save() {
    if (!this.Form.valid) {
      return;
    }
    try {
      const id = this.Form.get('idUsuario')?.value === null ? 0 : this.Form.get('idUsuario')?.value;
      if (id === 0) {
        this.Form.get('idUsuario')?.setValue(id);
        await this.server.post('/Usuario', this.Form.value) as any;
      } else {
        await this.server.put('/Usuario/' + id, this.Form.value) as any;
      }
      this.rerender();
      this.toastr.success('El registro se guardo exitosamente', 'Éxito');
      document.getElementById('modal-default')?.click();
    } catch (error) {
      console.log(error);
      this.toastr.error('Ocurrio un error al guardar el registro', 'Error');
    }

  }

  modificar(obj: any) {
    this.titleModal = 'Modificar Usuario';
    const dto = {
      idUsuario: obj.idUsuario,
      claveUs: obj.claveUs,
      passwordUs: obj.passwordUs,
      idPersona: obj.persona.idPersona,
      idSucursal: obj.sucursal.idSucursal,
      idTipo: obj.tipo.idTipo
    };
    this.Form.patchValue(dto);
  }

  async eliminar(id: number) {
    try {
      await this.server.delete('/Usuario/' + id)
      this.toastr.success('El registro se elimino exitosamente', 'Éxito');
      this.rerender();
    } catch (error) {
      this.toastr.error('Ocurrio un error al eliminar el registro', 'Error');
    }

  }

  rerender() {
    this.dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      await this.ListarUsuarios();
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
