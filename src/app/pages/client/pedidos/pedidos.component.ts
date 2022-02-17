import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServerService } from 'src/app/services/server.service';

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
  constructor(
    private server: ServerService,
    private toastr: ToastrService) { }

  async ngOnInit() {
    const userLocal = localStorage.getItem('usuario') as any;
    const user = JSON.parse(userLocal);
    this.listProductos = await this.server.get('/Producto') as any;
    this.listEstadoProductos = await this.server.get('/OrdenPedido/ListarOrdenesPorUsuario/' + user.idUsuario) as any;
    console.log(this.listEstadoProductos);
  }

  async buscarProducto() {
    if (this.textoBuscar.length < 3) {
      this.toastr.error('El texto de busqueda debe tener al menos 3 caracteres');
      return;
    }
    try {
      this.listProductos = await this.server.get('/Producto/' + this.textoBuscar) as any;
    } catch (error: any) {
      this.toastr.error(error.error);
      this.listProductos = [];
    }

  }

  agregarCarrito(item: any, index: number) {
    let obj;
    const existe = this.listCarrito.find(x => x.idProducto == item.idProducto);
    if (existe === undefined) {
      obj = {
        idProducto: item.idProducto,
        nombre: item.nombre,
        precioVenta: item.precioVenta,
        cantidad: 1,
        subTotal: item.precioVenta * 1
      };
      this.listCarrito.push(obj);
    }
    else {
      const cantidad = existe.cantidad + 1;
      obj = {
        idProducto: item.idProducto,
        nombre: item.nombre,
        precioVenta: item.precioVenta,
        cantidad: cantidad,
        subTotal: item.precioVenta * cantidad
      };
      this.listCarrito[index] = obj;
    }
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
  }

  eliminar(index: number) {
    this.listCarrito.splice(index, 1);
  }

  Ordenar() {
    try {
      const userLocal = localStorage.getItem('usuario') as any;
      const user = JSON.parse(userLocal);
      const orden = {
        idUsuario: user.idUsuario,
        detallePedidos: this.listCarrito
      };
      this.server.post('/OrdenPedido/Orden', orden);
      this.toastr.success('Orden enviada', 'Orden');
      this.listCarrito = [];
      this.listProductos = [];
      this.textoBuscar = '';
    } catch (error: any) {
      console.log(error);
      this.toastr.error(`${error.error}
      Ocurrio un error al intentar realizar la orden`, 'Error');
    }
  }

}
