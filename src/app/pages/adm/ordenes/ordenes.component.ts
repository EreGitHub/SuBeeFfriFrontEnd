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
  listOrdenesRechazadas: Array<any> = [];
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
    lst.forEach((row: any) => {
      this.totalMonto += row.montoTotal;
    });

    this.listOrdenesPendientes = [];
    this.listOrdenesAprobadas = [];
    this.listOrdenesRechazadas = [];

    this.totalPedidos = lst.length;
    this.listOrdenesPendientes = lst.filter((row: any) => row.estadoOrden == 'Pendiente');
    this.listOrdenesAprobadas = lst.filter((row: any) => row.estadoOrden == 'Aprobado');
    this.totalVentasAprobadas = this.listOrdenesAprobadas.length;
    this.listOrdenesRechazadas = lst.filter((row: any) => row.estadoOrden == 'Rechazado');
    this.totalVentasRechazadas = this.listOrdenesRechazadas.length;
  }

  async Rechazar(idPedido: any) {
    try {
      await this.server.post('/OrdenPedido/Rechazar/' + idPedido, {})
      this.toastr.success('Orden rechazada correctamente', 'Exitoso');
      await this.Listar();
    } catch (error: any) {
      this.toastr.error(error.error);
    }
  }

  async Aprobar(idPedido: any) {
    try {
      await this.server.post('/OrdenPedido/Aprobar/' + idPedido, {})
      this.toastr.success('Orden aprobada correctamente', 'Exitoso');
      await this.Listar();
    } catch (error: any) {
      this.toastr.error(error.error);
    }
  }

}
