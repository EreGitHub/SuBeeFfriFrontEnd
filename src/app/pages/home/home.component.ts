import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cell, Columns, Img, Ol, PdfMakeWrapper, Stack, Table, TocItem, Txt } from 'pdfmake-wrapper';
import { ITable, IText, ITocItem } from 'pdfmake-wrapper/lib/interfaces';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  IsAdm: boolean = false;
  NombreUsuario: string = '';
  constructor(private router: Router, private http: HttpClient, private server: ServerService) { }

  ngOnInit(): void {
    const usurioLocal = localStorage.getItem('usuario') as any;
    const oUsuario = JSON.parse(usurioLocal);
    this.IsAdm = oUsuario.tipo.idTipo === 1;
    this.NombreUsuario = oUsuario.persona.nombres;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async generarReporte1() {
    const pdf = new PdfMakeWrapper();
    const data: any = await this.server.get('/Reporte');
    pdf.add(new Txt('INFORME, SUCURSAL QUE TIENE MAS PEDIDOS.').alignment('center').bold().fontSize(20).margin([0, 0, 0, 10]).end);

    pdf.add(
      new Stack([
        new Txt('Sucursal:   ' + data.nombreSucursal).fontSize(13).end,
        new Txt('Direccion:   ' + data.direccion).fontSize(13).end
      ]).margin([0, 0, 0, 20]).end
    );

    pdf.add(
      new Txt('Productos Solicitados').bold().alignment('center').fontSize(15).end
    );
    pdf.add(
      new Table([
        [
          new Txt('Nº').alignment('center').color('white').end,
          new Txt('Nombre Producto').alignment('center').color('white').end,
          new Txt('Precio Entrega').alignment('center').color('white').end,
          new Txt('Precio Venta').alignment('center').color('white').end,
          new Txt('Proveedor').alignment('center').color('white').end,
        ],
        ...this.getTableDataReporte1(data)
      ]).widths('*')//[10, 60, 80, 40, 50,])
        .layout({
          fillColor: (rowIndex: number | undefined, node: any, columnIndex: number | undefined) => {
            return rowIndex === 0 ? '#000000' : rowIndex! % 2 === 0 ? '#E0E0E0' : '';
          }
        })
        .margin([0, 0, 0, 10])
        .end
    );
    pdf.create().open();
  }

  async generarReporte2() {
    const pdf = new PdfMakeWrapper();
    const fecha = new Date();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const data: any = await this.server.get('/Reporte/' + mesActual);
    pdf.add(new Txt('INFORME, PRODUCTOS MAS VENDIDOS').alignment('center').bold().fontSize(20).margin([0, 0, 0, 10]).end);

    pdf.add(
      new Stack([
        new Txt('Reporte perteneciente al mes de : ' + data.mes).fontSize(13).end,
        new Txt('Monto Total Generado:   ' + data.montoTotal+' (Bs.)').fontSize(13).end
      ]).margin([0, 0, 0, 20]).end
    );

    pdf.add(
      new Txt('Lista de Productos').bold().alignment('center').fontSize(15).end
    );
    pdf.add(
      new Table([
        [
          new Txt('Nº').alignment('center').color('white').end,
          new Txt('Nombre Producto').alignment('center').color('white').end,
          new Txt('Precio Entrega').alignment('center').color('white').end,
          new Txt('Precio Venta').alignment('center').color('white').end,
          new Txt('Proveedor').alignment('center').color('white').end,
          new Txt('Cantidad').alignment('center').color('white').end,
        ],
        ...this.getTableDataReporte2(data)
      ]).widths('*')
        .layout({
          fillColor: (rowIndex: number | undefined, node: any, columnIndex: number | undefined) => {
            return rowIndex === 0 ? '#000000' : rowIndex! % 2 === 0 ? '#E0E0E0' : '';
          }
        })
        .margin([0, 0, 0, 10])
        .end
    );
    pdf.create().open();
  }



  getTableDataReporte1(data: any): any[] {
    return data.items.map((row: any, i: any) => {
      return [
        new Txt(i + 1).alignment('center').fontSize(10).end,
        new Txt(row.nombreProducto).alignment('center').fontSize(10).end,
        new Txt(row.precio_Entrega).alignment('center').fontSize(10).end,
        new Txt(row.precio_Venta).alignment('center').fontSize(10).end,
        new Txt(row.nombreProveedor).alignment('center').fontSize(10).end,
      ]
    });
  }

  getTableDataReporte2(data: any) {
    return data.items.map((row: any, i: any) => {
      return [
        new Txt(i + 1).alignment('center').fontSize(10).end,
        new Txt(row.nombreProducto).alignment('center').fontSize(10).end,
        new Txt(row.precio_Entrega).alignment('center').fontSize(10).end,
        new Txt(row.precio_Venta).alignment('center').fontSize(10).end,
        new Txt(row.proveedor).alignment('center').fontSize(10).end,
        new Txt(row.cantidad).alignment('center').fontSize(10).end,
      ]
    });
  }
}
