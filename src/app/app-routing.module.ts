import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './login/login.component';

import { UsersComponent } from './users/users.component';
import { AdministradoresComponent } from './administradores/administradores.component';
import { AdministradorDetalleComponent } from './administrador-detalle/administrador-detalle.component';
import { AdministradoresBuscadorComponent } from './administradores-buscador/administradores-buscador.component';



import { ClientesComponent } from './clientes/clientes.component';
import { ClienteDetalleComponent } from './cliente-detalle/cliente-detalle.component';

import { RolesComponent } from './roles/roles.component';
import { RolesFormComponent } from './roles-form/roles-form.component';

import { VendedoresComponent } from './vendedores/vendedores.component';
import { VendedorDetalleComponent } from './vendedor-detalle/vendedor-detalle.component';

import { CatalogoComponent } from './catalogo/catalogo.component';
import { InternaCatalogoComponent } from './interna-catalogo/interna-catalogo.component';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';

import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidoComponent } from './pedido/pedido.component';
import { PedidoInternaComponent } from './pedido-interna/pedido-interna.component';

import { AuthGuard } from './guards/auth.guard';
// import { AuthGuardService } from './services/auth-guard.service';
// import { GuestGuardService } from './services/guest-guard.service';

const routes : Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'productos/:id', component: InternaCatalogoComponent },
  { path: 'producto-detalle', component: ProductoDetalleComponent },
  {
    path: 'users', component: UsersComponent,
    children: [
      { path: 'administradores', component: AdministradoresComponent, canActivate: [AuthGuard] },
      { path: 'administradores/:id', component: AdministradorDetalleComponent, canActivate: [AuthGuard]},
      { path: 'buscar/:text', component: AdministradoresBuscadorComponent,canActivate: [AuthGuard]},
      { path: 'vendedores', component: VendedoresComponent, },
      { path: 'vendedores/:id', component: VendedorDetalleComponent,  },
      { path: 'clientes', component: ClientesComponent,  },
      { path: 'clientes/:id', component: ClienteDetalleComponent,  },
      // { path: '**', pathMatch: 'full', redirectTo: 'login'}
    ]
  },
  { path: 'roles', component: RolesComponent },
  { path: 'roles-form', component: RolesFormComponent },
  { path: 'roles-form/:id', component: RolesFormComponent },
  {
    path: 'catalogos', component: CatalogoComponent,
    // children: [
    //   { path: 'productos', component: InternaCatalogoComponent },
    // ]
  },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'pedido', component: PedidoComponent },
  { path: 'pedido-interna', component: PedidoInternaComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
