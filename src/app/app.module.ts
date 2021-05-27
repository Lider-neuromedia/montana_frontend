import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendHttpData } from '../app/services/SendHttpData';
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './partials/menu/menu.component';
import { AppRoutingModule } from './app-routing.module';
import { UsersComponent } from './users/users.component';
import { HeaderComponent } from './header/header.component';
import { AdministradoresComponent } from './administradores/administradores.component';
import { VendedoresComponent } from './vendedores/vendedores.component';
import { ClientesComponent } from './clientes/clientes.component';
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
import { PaginatePipe } from './pipes/paginate.pipe';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SignaturePadModule } from 'angular2-signaturepad';

// import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {NgxPaginationModule} from 'ngx-pagination';
import { DrawerRigthComponent } from './drawer-rigth/drawer-rigth.component';
import { DrawerAdvancedComponent } from './drawer-advanced/drawer-advanced.component';
import { DialogPedidoComponent } from './dialog-pedido/dialog-pedido.component';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import { EncuestasComponent } from './encuestas/encuestas.component';
import { DetalleEncuestaComponent } from './detalle-encuesta/detalle-encuesta.component';
import { AmpliacionCupoComponent } from './ampliacion-cupo/ampliacion-cupo.component';
import { PqrsComponent } from './pqrs/pqrs.component';
import { DetallePqrsComponent } from './detalle-pqrs/detalle-pqrs.component';
import { ShowRoomComponent } from './show-room/show-room.component';
import { RestablecerComponent } from './restablecer/restablecer.component';
import { TablaAdministradoresComponent } from './tabla-administradores/tabla-administradores.component';
import { DialogCatalogoComponent } from './dialog-catalogo/dialog-catalogo.component';
import { DialogExportPedidoComponent } from './dialog-export-pedido/dialog-export-pedido.component';
import { DialogPreguntasPedidoComponent } from './dialog-preguntas-pedido/dialog-preguntas-pedido.component';
import { RestablecerContrasenaComponent } from './restablecer-contrasena/restablecer-contrasena.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraficoBarComponent } from './components/grafico-bar/grafico-bar.component';
import { GraficoDonaComponent } from './components/grafico-dona/grafico-dona.component';


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
    DialogPedidoComponent,
    DetallePedidoComponent,
    PaginatePipe,
    EncuestasComponent,
    DetalleEncuestaComponent,
    AmpliacionCupoComponent,
    PqrsComponent,
    DetallePqrsComponent,
    ShowRoomComponent,
    RestablecerComponent,
    TablaAdministradoresComponent,
    DialogCatalogoComponent,
    DialogExportPedidoComponent,
    DialogPreguntasPedidoComponent,
    RestablecerContrasenaComponent,
    DashboardComponent,
    GraficoBarComponent,
    GraficoDonaComponent
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
    NgxGalleryModule,
    ChartsModule,
    EditorModule,
    SignaturePadModule,
    
  ],
  providers: [SendHttpData],
  bootstrap: [AppComponent]
})
export class AppModule { }
