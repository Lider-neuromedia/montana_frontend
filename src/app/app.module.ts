import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendHttpData } from '../app/services/SendHttpData';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './partials/menu/menu.component';
import { AppRoutingModule } from './app-routing.module';
import { UsersComponent } from './users/users.component';
import { HeaderComponent } from './header/header.component';
import { AdministradoresComponent } from './administradores/administradores.component';
import { VendedoresComponent } from './vendedores/vendedores.component';
import { ClientesComponent } from './clientes/clientes.component';
import { AdministradorDetalleComponent } from './administrador-detalle/administrador-detalle.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { InternaCatalogoComponent } from './interna-catalogo/interna-catalogo.component';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { VendedorDetalleComponent } from './vendedor-detalle/vendedor-detalle.component';
import { ClienteDetalleComponent } from './cliente-detalle/cliente-detalle.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidoComponent } from './pedido/pedido.component';
import { PedidoInternaComponent } from './pedido-interna/pedido-interna.component';
import { RolesComponent } from './roles/roles.component';
import { RolesFormComponent } from './roles-form/roles-form.component';
import { AdministradoresBuscadorComponent } from './administradores-buscador/administradores-buscador.component';
import {MaterialModule} from './material/material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';

// import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {NgxPaginationModule} from 'ngx-pagination';
import { DrawerRigthComponent } from './drawer-rigth/drawer-rigth.component';
import { DrawerAdvancedComponent } from './drawer-advanced/drawer-advanced.component';


// import { Select2Module } from 'ng2-select2';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    UsersComponent,
    HeaderComponent,
    AdministradoresComponent,
    VendedoresComponent,
    ClientesComponent,
    AdministradorDetalleComponent,
    CatalogoComponent,
    InternaCatalogoComponent,
    ProductoDetalleComponent,
    VendedorDetalleComponent,
    ClienteDetalleComponent,
    PedidosComponent,
    PedidoComponent,
    PedidoInternaComponent,
    RolesComponent,
    RolesFormComponent,
    AdministradoresBuscadorComponent,
    DrawerRigthComponent,
    DrawerAdvancedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxDropzoneModule,
    NgxGalleryModule
  ],
  providers: [SendHttpData],
  bootstrap: [AppComponent]
})
export class AppModule { }
