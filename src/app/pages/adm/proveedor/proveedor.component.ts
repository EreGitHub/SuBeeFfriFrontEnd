import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss']
})
export class ProveedorComponent implements AfterViewInit, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  titleModal: string = 'Nuevo Proveedor';
  listProveedores: Array<any> = [];
  Form: FormGroup = new FormGroup({
    idProveedor: new FormControl(0),
    nombre: new FormControl('', [Validators.required]),
    nit: new FormControl(''),
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
    this.dtTrigger.next();
  }

  async ListarUsuarios() {
    this.listProveedores = await this.server.get('/Proveedor') as any;
  }

  limpiarCampos() {
    this.titleModal = 'Nuevo Proveedor';
    this.Form.reset();
  }

  async save() {
    if (!this.Form.valid) {
      return;
    }
    try {
      const id = this.Form.get('idProveedor')?.value === null ? 0 : this.Form.get('idProveedor')?.value;
      if (id === 0) {
        this.Form.get('idProveedor')?.setValue(id);
        await this.server.post('/Proveedor', this.Form.value) as any;
      } else {
        await this.server.put('/Proveedor/' + id, this.Form.value) as any;
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
    this.titleModal = 'Modificar Proveedor';
    this.Form.patchValue(obj);
  }

  async eliminar(id: number) {
    try {
      await this.server.delete('/Proveedor/' + id)
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
