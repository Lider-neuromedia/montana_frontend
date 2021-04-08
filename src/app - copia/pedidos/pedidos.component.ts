import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';
import {  SendHttpData } from '../services/SendHttpData';
import Swal from 'sweetalert2'
declare var $:any;

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  pedidos = [];
  clientes = [];
  vendedores = [];
  catalogos = [];
  openDrawer = false;
  crear_pedido = {
    cliente : '',
    vendedor : '',
    catalogo : '',
    codigo_pedido : ''
  };
  change_state = 0;
  pedido_select = 0;
  page_size: number = 5;
  page_number: number = 1;
  pages: any = {
    first_page : null,
    last_page : null,
    max_pages : null
  };
  checkPedido = [];
  control_cantidad = 0;
  edit_pedido : any = {
    id_pedido: null,
    metodo_pago: null,
    productos : [],
    sub_total: 0,
    total: 0
  };

  @ViewChild('changeState') changeState: TemplateRef<any>;


  constructor(private route: Router, private http : SendHttpData, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPedidos(); //Consumo de los pedidos.
    this.getRecursosCrearPedido(); //Consumo de los recursos para crear(Clientes, vendedores, catalogos).
  }

  showOverPedido(){
    $('.overpedido').css('display','none');
  }

  nuevoPedido(){
    $('.overpedido').css('display','flex');
  }

  changeFilterDate(date){
    // Change color.
    $('.fechas p').removeClass('fecha-active');
    $('.'+date).addClass('fecha-active');
    this.getPedidos(null, date);
  }


  openDialogState(id) {
    this.pedido_select = id;
    this.dialog.open(this.changeState);
  }

  continuarPedido(){
    this.http.httpGet('generate-code', true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          // Traemos el codigo generado desde el backend.
          this.crear_pedido.codigo_pedido = response.code;
          // Crerar la sesion con la informacion correspondiente al pedido.
          var new_pedido = JSON.stringify(this.crear_pedido);
          localStorage.setItem('pedido', new_pedido);
          this.route.navigate(['/pedido']);
        }
        
      },
      error => {

      }
    );
  }

  getPedidos(search : string = null, date : string = null){
    var route = 'pedidos';
    if(search !== null){
      route = 'pedidos?search=' + search;
    }
    if(date !== null){
      route = 'pedidos?date=' + date;
    }

    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.pedidos = response.pedidos;
          this.calcularPaginas();
        }
      }, 
      error => {

      }
    )
  }

  searchTable(event){
    this.getPedidos(event.target.value);
  }

  getRecursosCrearPedido(){
    this.http.httpGet('recursos-crear-pedido', true).subscribe(
      response => {
        if (response.status == 200 && response.response == 'success') {
          this.vendedores = response.vendedores;
          this.clientes = response.clientes;
          this.catalogos = response.catalogos;
        }
      }, 
      error => {

      }
    )
  }

  redirectDetalle(id){
    this.route.navigate(['/pedido-detalle/' + id]);
  }

  closeDialog(){
    this.dialog.closeAll();
  }

  cambiarEstado(){
    var data = {
      pedido : this.pedido_select, 
      state : this.change_state
    }

    this.http.httpPost('change-state-pedido', data, true).subscribe(
      response => {
        this.change_state = 0;
        this.pedido_select = 0;
        this.getPedidos();
        this.closeDialog();
      },
      error => {

      }
    );

  }

  /* 
    PAGINACION
  */
  // Cambia la cantidad de productos a mostrar.
  changePaginate(event) {
    this.page_size = event.target.value;
    this.page_number = 1;
    this.calcularPaginas();
  }

  // Calcula las paginas totales que existen.
  calcularPaginas() {
    var cant_pages = Math.ceil(this.pedidos.length / this.page_size);
    this.pages = {
      first_page : 1,
      last_page : cant_pages,
      max_pages : (cant_pages > 6) ? 6 : cant_pages
    }
    // this.pages = cant_pages;
  }

  // Cambia de pagina. 
  changePage(page, left = null, right = null) {
    
    // Si el cambio es seleccionado pagina.
    if (page != null) {
      // Definir la pagina en donde se va posicionar.
      this.page_number = page;
      // Definir las variables cambiantes.
      var first_page : any;
      var max_page : number;
      // Si la pagina no supera 6 items (El maximo para que no se desface)
      if (this.pages.length > 6) {
        // Se define el maximo de paginas como 6.
        max_page = 6;
        // ultimas 6 paginas restantes. Se le resta 5 porque no se cuenta el mismo.
        var ultimo_tramo = this.pages.last_page - 5;
        // Si la pagina a ver es mayor o igual al ultimo tramo de paginas restantes. Se planta en el ultimo tramo.
        if (this.page_number >= ultimo_tramo) {
          first_page = ultimo_tramo;
        }else{
          first_page = this.page_number;
        }
      }else{
        // Sigue siendo el mismo maximo de paginas.
        max_page = this.pages.max_pages;
        // Si el numero actual de pagina es mayor o igual a la ultima pagina.
        if (this.page_number >= this.pages.last_page) {
          // La primera pagina sigue siendo la misma.
          first_page = this.pages.first_page;
        }else{
          // Se puede correr el paginador.
          first_page = this.page_number;
        }
      }
      
      // Se redefine las paginas con los datos actualizados.
      this.pages = {
        first_page : first_page,
        last_page : this.pages.last_page,
        max_pages : max_page
      }
    }

    // Pagina siguiente.
    if (right) {
      var total_pages = Math.ceil(this.pedidos.length / this.page_size);
      if (this.page_number < total_pages) {
        this.page_number = this.page_number + 1;
        // Si la pagina no supera 6 items (El maximo para que no se desface)
        if (this.pages.length > 6) {
          // Se define el maximo de paginas como 6.
          max_page = 6;
          // ultimas 6 paginas restantes. Se le resta 5 porque no se cuenta el mismo.
          var ultimo_tramo = this.pages.last_page - 5;
          // Si la pagina a ver es mayor o igual al ultimo tramo de paginas restantes. Se planta en el ultimo tramo.
          if (this.page_number >= ultimo_tramo) {
            first_page = ultimo_tramo;
          }else{
            first_page = this.page_number;
          }
        }else{
          // Sigue siendo el mismo maximo de paginas.
          max_page = this.pages.max_pages;
          // Si el numero actual de pagina es mayor o igual a la ultima pagina.
          if (this.page_number >= this.pages.last_page) {
            // La primera pagina sigue siendo la misma.
            first_page = this.pages.first_page;
          }else{
            // Se puede correr el paginador.
            first_page = this.page_number;
          }
        }

        this.pages = {
          first_page : first_page,
          last_page : this.pages.last_page,
          max_pages : max_page
        }

      }
    }

    // Pagina anterior.
    if (left) {
      var total_pages = Math.ceil(this.pedidos.length / this.page_size);
      if (this.page_number > 1 && this.page_number <= total_pages) {
        this.page_number = this.page_number - 1;
        // Si la pagina no supera 6 items (El maximo para que no se desface)
        if (this.pages.length > 6) {
          // Se define el maximo de paginas como 6.
          max_page = 6;
          // ultimas 6 paginas restantes. Se le resta 5 porque no se cuenta el mismo.
          var ultimo_tramo = this.pages.last_page - 5;
          // Si la pagina a ver es mayor o igual al ultimo tramo de paginas restantes. Se planta en el ultimo tramo.
          if (this.page_number >= ultimo_tramo) {
            first_page = ultimo_tramo;
          }else{
            first_page = this.page_number;
          }
        }else{
          // Sigue siendo el mismo maximo de paginas.
          max_page = this.pages.max_pages;
          // Si el numero actual de pagina es mayor o igual a la ultima pagina.
          if (this.page_number >= this.pages.last_page) {
            // La primera pagina sigue siendo la misma.
            first_page = this.pages.first_page;
          }else{
            // Se puede correr el paginador.
            first_page = this.page_number;
          }
        }

        this.pages = {
          first_page : first_page,
          last_page : this.pages.last_page,
          max_pages : max_page
        }
      }
    }    
  }

  selectPedidoCheckbox(event, pedido){
    if (event.target.checked) {
      this.checkPedido.push(pedido);
    }else{
      let removeIndex = this.checkPedido.findIndex(x => x.id_pedido === pedido.id_pedido);
      if (removeIndex !== -1){
        this.checkPedido.splice(removeIndex, 1);
      }
    }
  }

  openDrawerRigth(action : boolean){
    if (action) {
      if (this.checkPedido.length > 1 || this.checkPedido.length === 0) {
        Swal.fire(
          'Tienes problemas?',
          'Asegurate de seleccionar algun pedido o tener solo 1 seleccionado.',
          'warning'
          );
      }else{
        this.openDrawer = action;
        this.getEditPedido();
      }
    }else{
      this.openDrawer = action;
    }
  }

  getEditPedido(){
    var edit_pedido = this.checkPedido[0];
    this.http.httpGet('edit-pedido/' + edit_pedido.id_pedido, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.edit_pedido = response.pedido;
        }
      },
      error => {

      }
    );
  }

  sumCantidad(positionProd, positionTienda){
    var tienda = this.edit_pedido.productos[positionProd].tiendas[positionTienda];
    var producto = this.edit_pedido.productos[positionProd];
    if(tienda.cantidad_producto == undefined){
        tienda.cantidad_producto = 1;
    }else{
      if (this.control_cantidad < producto.stock) {
        this.control_cantidad ++;
        tienda.cantidad_producto++;
      }
      this.edit_pedido.total += producto.total;
    }
  }

  resCantidad(positionProd, positionTienda){
    var tienda = this.edit_pedido.productos[positionProd].tiendas[positionTienda];
    var producto = this.edit_pedido.productos[positionProd];
    if (tienda.cantidad_producto != undefined && tienda.cantidad_producto != 0) {
      tienda.cantidad_producto--;
      this.control_cantidad--;
      this.edit_pedido.total -= producto.total;
    }
  }

  submitEditPedido(){
    this.http.httpPost('update-pedido', this.edit_pedido, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.edit_pedido = {
            id_pedido: null,
            metodo_pago: null,
            productos : [],
            sub_total: 0,
            total: 0
          }
          this.checkPedido = [];
          this.openDrawerRigth(false);
          this.getPedidos();
        }
      },
      error => {

      }
    );
  }

  exportPedido(){
    this.http.downloadFile('export-pedido', 'pedidos.xlsx');
  }

  // Metodos boton acciones.
  accionesAdministrador(){
    $('.acciones-administrador').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

}
