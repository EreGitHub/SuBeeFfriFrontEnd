import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {

  private _hubConnection!: HubConnection;
  totalMonto: number = 0;
  totalVentasAprobadas: number = 0;
  totalVentasRechazadas: number = 0;
  totalPedidos: number = 0;
  listOrdenesPendientes: Array<any> = [];
  listOrdenesAprobadas: Array<any> = [];  
  listOrdenesCobradas: Array<any> = [];
  view: any = {};
  constructor(
    private server: ServerService,
    private toastr: ToastrService) { }

  async ngOnInit() {
    try {
      await this.Listar();
      this._hubConnection = new HubConnectionBuilder().withUrl('https://localhost:7091/notify').build();
      this._hubConnection.start()
        .then(() =>
          console.log('connection start'))
        .catch(err => {
          console.log('Error while establishing the connection')
        });

      this._hubConnection.on('BroadcastMessage', (message) => {
        console.info(message);
        this.toastr.info('Se ha recibido una nueva orden de pedido', 'Notificación');
        const audio = new Audio('assets/mp3/noti.mp3');
        audio.play();
        this.Listar();
      })

    } catch (error: any) {
      this.toastr.error(error.error);
      this.listOrdenesPendientes = [];
    }
  }

  async Listar() {
    const lst = await this.server.get('/OrdenPedido/ListarOrdenes') as any;
    this.listOrdenesPendientes = [];
    this.listOrdenesAprobadas = [];    

    this.totalPedidos = lst.length;
    this.listOrdenesPendientes = lst.filter((row: any) => row.estadoOrden == 'Pedido');
    console.log(this.listOrdenesPendientes);
    this.listOrdenesAprobadas = lst.filter((row: any) => row.estadoOrden == 'Enviado');
    this.totalVentasAprobadas = this.listOrdenesAprobadas.length;    
    this.listOrdenesCobradas = lst.filter((row: any) => row.estadoOrden == 'Cobradas');
    this.totalMonto = 0;
    this.listOrdenesCobradas.forEach((row: any) => {
      this.totalMonto += row.montoTotal;
    });    
  }

  async VerDetallePago(detallePago: any) {
    this.view = detallePago;
  }

  async Enviar(pedido: any) {
    debugger
    try {      
      const oUser = localStorage.getItem('usuario') as any;
      const oUserJson = JSON.parse(oUser);
      if (pedido.detallePago === null)
        await this.server.post('/OrdenPedido/Enviar/' + pedido.idPedido, {})
      else
        await this.server.post(`/OrdenPedido/EnviarOrdenPagada?idPedido=${pedido.idPedido}&idUsuarioCobrador=${oUserJson.idUsuario}`, {});
      this.toastr.success('Orden aprobada correctamente', 'Exitoso');
      await this.Listar();
    } catch (error: any) {
      this.toastr.error(error.error);
    }
  }

  async Cobrar(item: any) {
    try {
      const oUser = localStorage.getItem('usuario') as any;
      const oUserJson = JSON.parse(oUser);
      await this.server.post(`/OrdenPedido/Cobrar?idPedido=${item.idPedido}&idUsuarioCobrador=${oUserJson.idUsuario}`, {});
      this.toastr.success('Orden Cobrada correctamente', 'Exitoso');
      await this.Listar();
    } catch (error) {
      this.toastr.error('Ocurio un error', 'Error');
    }
  }

}
