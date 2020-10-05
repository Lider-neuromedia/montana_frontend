import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';
import {  SendHttpData } from '../services/SendHttpData';
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
  crear_pedido = {
    cliente : '',
    vendedor : '',
    catalogo : '',
    codigo_pedido : ''
  };

  constructor(private route: Router, private http : SendHttpData) { }

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
  
  accionesPedido(){

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

  getPedidos(){
    this.http.httpGet('pedidos', true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.pedidos = response.pedidos;
        }
      }, 
      error => {

      }
    )
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

}
