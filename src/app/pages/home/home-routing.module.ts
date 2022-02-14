import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', loadChildren: () => import('../main/main.module').then(m => m.MainModule) },
      { path: 'adm-persona', loadChildren: () => import('../adm/persona/persona.module').then(m => m.PersonaModule) },
      { path: 'adm-usuario', loadChildren: () => import('../adm/usuario/usuario.module').then(m => m.UsuarioModule) },
      { path: 'adm-proveedor', loadChildren: () => import('../adm/proveedor/proveedor.module').then(m => m.ProveedorModule) },
      { path: 'adm-producto', loadChildren: () => import('../adm/producto/producto.module').then(m => m.ProductoModule) },
      { path: 'adm-sucursal', loadChildren: () => import('../adm/sucursal/sucursal.module').then(m => m.SucursalModule) },
      { path: 'adm-tipo', loadChildren: () => import('../adm/tipo/tipo.module').then(m => m.TipoModule) },
      { path: 'adm-ordenes', loadChildren: () => import('../adm/ordenes/ordenes.module').then(m => m.OrdenesModule) },
      { path: 'client-pedido', loadChildren: () => import('../client/pedidos/pedidos.module').then(m => m.PedidosModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
