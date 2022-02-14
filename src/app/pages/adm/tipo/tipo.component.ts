import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.scss']
})
export class TipoComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  titleModal: string = 'Registro Tipo Usuario';
  listTipo: Array<any> = [];
  Form: FormGroup = new FormGroup({
    idTipo: new FormControl(0),
    rol: new FormControl('', [Validators.required])
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
    await this.ListarSucursales();
    this.dtTrigger.next();
  }

  async ListarSucursales() {
    this.listTipo = await this.server.get('/TipoUsuario') as any;
    console.log(this.listTipo);
  }

  limpiarCampos() {
    this.titleModal = 'Registro Tipo Usuario';
    this.Form.reset();
  }

  async save() {
    if (!this.Form.valid) {
      return;
    }
    try {
      const id = this.Form.get('idTipo')?.value === null ? 0 : this.Form.get('idTipo')?.value;
      if (id === 0) {
        this.Form.get('idTipo')?.setValue(id);
        await this.server.post('/TipoUsuario', this.Form.value) as any;
      } else {
        await this.server.put('/TipoUsuario/' + id, this.Form.value) as any;
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
    this.titleModal = 'Modificar Tipo Usuario';
    this.Form.patchValue(obj);
  }

  async eliminar(id: number) {
    try {
      await this.server.delete('/TipoUsuario/' + id)
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
      await this.ListarSucursales();
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
