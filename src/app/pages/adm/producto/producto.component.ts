import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements AfterViewInit, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  titleModal: string = 'Nuevo Producto';
  listProductos: Array<any> = [];
  listProveedor: Array<any> = [];
  previsualizacion: string = '';
  archivo: any;
  productSeleccionado: any = {};
  Form: FormGroup = new FormGroup({
    idProducto: new FormControl(0),
    nombre: new FormControl('', [Validators.required]),
    precioEntrega: new FormControl('', [Validators.required]),
    precioVenta: new FormControl('', [Validators.required]),
    stock: new FormControl('', [Validators.required]),
    peso: new FormControl('', [Validators.required]),
    idProveedor: new FormControl('', [Validators.required]),
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
    await this.ListarProducto();
    await this.ListarProveedor();
    this.dtTrigger.next();
  }

  async ListarProducto() {
    const data = await this.server.get('/Producto/All') as any;    
    this.listProductos = data.map((producto: any) => {
      return {
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        fechaRegistro: producto.fechaRegistro,
        precioEntrega: producto.precioEntrega,
        precioVenta: producto.precioVenta,
        stock: producto.stock,
        peso: producto.peso,
        direccionFoto: (producto.direccionFoto == null) ? 'assets/img/ProductoDefault.png' : producto.direccionFoto,
        proveedor: producto.proveedor
      }
    });
  }

  async ListarProveedor() {
    this.listProveedor = await this.server.get('/Proveedor') as any;
  }

  limpiarCampos() {
    this.titleModal = 'Nuevo Producto';
    this.Form.reset();
  }

  async save() {
    if (!this.Form.valid) {
      return;
    }
    try {
      const id = this.Form.get('idProducto')?.value === null ? 0 : this.Form.get('idProducto')?.value;
      if (id === 0) {
        this.Form.get('idProducto')?.setValue(id);
        await this.server.post('/Producto/Add', this.Form.value) as any;
      } else {
        await this.server.put('/Producto/Update/' + id, this.Form.value) as any;
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
    this.titleModal = 'Modificar Producto';
    const dto = {
      idProducto: obj.idProducto,
      nombre: obj.nombre,
      precioEntrega: obj.precioEntrega,
      precioVenta: obj.precioVenta,
      stock: obj.stock,
      peso: obj.peso,
      idProveedor: obj.proveedor.idProveedor
    }
    this.Form.patchValue(dto);
  }

  async eliminar(id: number) {
    try {
      await this.server.delete('/Producto/Delete/' + id)
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
      await this.ListarProducto();
      this.dtTrigger.next();
    });
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

  seleccionarProducto(item: any) {
    this.productSeleccionado = item;
  }

  async guardarFoto() {
    try {
      const request = new FormData();
      request.append('idProducto', this.productSeleccionado.idProducto);
      request.append('foto', this.archivo);
      await this.server.post('/Producto/SubirFoto', request) as any;
      this.toastr.success('El registro se guardo exitosamente', 'Éxito');
      document.getElementById('modal-foto')?.click();
      this.rerender();
    } catch (error) {
      this.toastr.error('Ocurrio un error al guardar la foto', 'Error');
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
