import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServerService } from 'src/app/services/server.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  listProductos: Array<any> = [];
  listCarrito: Array<any> = [];
  listEstadoProductos: Array<any> = [];
  textoBuscar: string = '';
  montoTotalPagar: number = 0;
  previsualizacion: string = '';
  previsualizacionView: string = '';
  archivo: any;
  Form: FormGroup = new FormGroup({
    idDetallePago: new FormControl(0),
    numeroTransferencia: new FormControl('', [Validators.required]),
    nombreBanco: new FormControl('', [Validators.required]),
    monto: new FormControl('', [Validators.required]),
  });
  view: any = {};
  constructor(
    private server: ServerService,
    private toastr: ToastrService,
    private utilities: UtilitiesService) { }

  async ngOnInit() {
    await this.ListarProducto();
  }

  async ListarProducto() {
    const userLocal = localStorage.getItem('usuario') as any;
    const user = JSON.parse(userLocal);
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
      }
    });
    const dataProductoHistorico = await this.server.get('/OrdenPedido/ListarOrdenesPorUsuario/' + user.idUsuario) as any;
    console.log(dataProductoHistorico);
    this.listEstadoProductos = //dataProductoHistorico;
      dataProductoHistorico.map((producto: any) => {
        return {
          idPerdido: producto.idPerdido,
          nombreSucursal: producto.nombreSucursal,
          numeroPedido: producto.numeroPedido,
          fecha: producto.fecha,
          montoTotal: producto.montoTotal,
          estado: producto.estado,
          detallePago: producto.detallePago,
          detalleProducto: producto.detalleProducto
        }
      });
  }

  async buscarProducto() {
    if (this.textoBuscar.length < 3) {
      this.toastr.error('El texto de busqueda debe tener al menos 3 caracteres');
      return;
    }
    try {
      this.listProductos = await this.server.get('/Producto/BuscarProducto/' + this.textoBuscar) as any;
    } catch (error: any) {
      this.toastr.error(error.error);
      this.listProductos = [];
    }

  }

  agregarCarrito(item: any, index: number) {
    const product = this.listProductos.find((x: any) => x.idProducto == item.idProducto);
    let obj;
    const existe = this.listCarrito.find(x => x.idProducto == item.idProducto);
    if (existe === undefined) {
      obj = {
        idProducto: item.idProducto,
        nombre: item.nombre,
        precioVenta: item.precioVenta,
        cantidad: 1,
        subTotal: item.precioVenta * 1,
        direccionFoto: item.direccionFoto
      };
      this.listCarrito.push(obj);
    } else {
      const cantidad = existe.cantidad + 1;
      if (cantidad > product.stock) {
        this.toastr.error('No hay stock suficiente');
        return;
      }
      obj = {
        idProducto: item.idProducto,
        nombre: item.nombre,
        precioVenta: item.precioVenta,
        cantidad: cantidad,
        subTotal: item.precioVenta * cantidad,
        direccionFoto: item.direccionFoto
      };
      this.listCarrito[index] = obj;
    }
    this.calcularMontoTotal();
  }

  calcularMontoTotal(): void {
    this.montoTotalPagar = 0;
    this.listCarrito.forEach(producto => {
      this.montoTotalPagar += producto.subTotal;
    });
  }

  quitar(index: number) {
    const existe = this.listCarrito[index];
    const cantidad = existe.cantidad - 1;
    if (cantidad > 0) {
      const obj = {
        idProducto: existe.idProducto,
        nombre: existe.nombre,
        precioVenta: existe.precioVenta,
        cantidad: cantidad,
        subTotal: existe.precioVenta * cantidad
      };
      this.listCarrito[index] = obj;
    } else {
      this.eliminar(index);
    }
    this.calcularMontoTotal();
  }

  eliminar(index: number) {
    this.listCarrito.splice(index, 1);
  }

  async Ordenar() {
    try {
      const userLocal = localStorage.getItem('usuario') as any;
      const user = JSON.parse(userLocal);
      const orden = {
        idUsuario: user.idUsuario,
        detallePedidos: this.listCarrito
      };
      this.server.post('/OrdenPedido/OrdenSinPago', orden);
      this.toastr.success('Orden enviada', 'Orden');
      this.listCarrito = [];
      this.listProductos = [];
      this.textoBuscar = '';
      await this.ListarProducto();
    } catch (error: any) {
      console.log(error);
      this.toastr.error(`${error.error} Ocurrio un error al intentar realizar la orden`, 'Error');
    }
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

  VerDetallePago(detallePago: any) {
    this.view = detallePago;
  }

  async OrdenarConTranferencia() {
    if (!this.Form.valid) {
      return;
    }
    try {
      if (this.montoTotalPagar !== this.Form.value.monto) {
        this.toastr.error('El monto a transferir deber ser igual al monto total a pagar: ' + this.montoTotalPagar);
        return;
      }
      if (this.listCarrito.length == 0) {
        this.toastr.error('No hay productos en el carrito');
        return;
      }
      const userLocal = localStorage.getItem('usuario') as any;
      const user = JSON.parse(userLocal);
      const orden = {
        idUsuario: user.idUsuario,
        detallePedidos: this.listCarrito
      };
      debugger
      const result = await this.server.post('/OrdenPedido/OrdenConPago', orden) as any

      const request = new FormData();
      request.append('numeroTransferencia', this.Form.get('numeroTransferencia')?.value);
      request.append('nombreBanco', this.Form.get('nombreBanco')?.value);
      request.append('monto', this.Form.get('monto')?.value);
      request.append('foto', this.archivo);
      request.append('idOrderPedido', result.idPedido);
      this.server.post('/OrdenPedido/AdjuntarComprobantePago', request);
      this.toastr.success('Orden enviada', 'Orden');
      this.listCarrito = [];
      this.listProductos = [];
      this.textoBuscar = '';
      await this.ListarProducto();
      this.toastr.success('El registro se guardo exitosamente', 'Éxito');
      document.getElementById('modal-default')?.click();
    } catch (error: any) {
      this.toastr.error(`${error.error} Ocurrio un error al intentar realizar la orden`, 'Error');
    }
  }

}
