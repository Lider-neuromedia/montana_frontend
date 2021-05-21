import { Component, OnInit, Input } from '@angular/core';
import { SendHttpData } from '../services/SendHttpData';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-dialog-pedido',
  templateUrl: './dialog-pedido.component.html',
  styleUrls: ['./dialog-pedido.component.css']
})
export class DialogPedidoComponent implements OnInit {

  @Input() id_catalogo : any = 0; //Sub titulo del contenido
  @Input() id_producto : any; //Sub titulo del contenido
  clientes = [];
  vendedores = [];
  catalogos = [];
  crear_pedido = {
    cliente : '',
    vendedor : '',
    catalogo : '',
    codigo_pedido : ''
  };
  error = {
    cliente: 'Seleccione un cliente',
    vendedor: 'Seleccione un vendedor',
    catalogo: 'Seleccione un catálogo'
  }
  catalogoBool: boolean;
  clienteBool: boolean;
  vendedorBool: boolean;

  constructor( private http : SendHttpData, private route: Router) { }

  ngOnInit(): void {
    this.getRecursosCrearPedido();
  }
  
  closeDialog(){
    $('.overpedido').css('display','none');
  }

  openDialog(){
    $('.overpedido').css('display','flex');
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
  
  continuarPedido(){
    console.log(this.crear_pedido);
    if(this.crear_pedido.cliente === '' && this.crear_pedido.vendedor === '' && this.crear_pedido.catalogo === ''){
      this.clienteBool = this.vendedorBool = this.catalogoBool = true;
      return;
    }else if(this.crear_pedido.catalogo === "" || this,this.crear_pedido.cliente === "" || this.crear_pedido.vendedor === "" ||
       this.crear_pedido.catalogo === null || this,this.crear_pedido.cliente === null || this.crear_pedido.vendedor === null){
      if(this.crear_pedido.catalogo === "" || this.crear_pedido.catalogo === null){
        this.catalogoBool = true;
      }else{
        this.catalogoBool = false;
      }
      if(this.crear_pedido.cliente === "" || this.crear_pedido.cliente === null){
        this.clienteBool = true;
      }else{
        this.clienteBool = false;
      }
      if(this.crear_pedido.vendedor === "" || this.crear_pedido.vendedor === null){
        this.vendedorBool = true;
      }else{
        this.vendedorBool = false;
      }
      return;
    }
    this.catalogoBool = this.vendedorBool = this.clienteBool = false;
    this.http.httpGet('generate-code', true).subscribe(
      response => {

        if (response.response == 'success' && response.status == 200) {
          // Traemos el codigo generado desde el backend.
          this.crear_pedido.codigo_pedido = response.code;
          if (this.id_catalogo != 0) {
            this.crear_pedido.catalogo = this.id_catalogo;
          }
          // Crerar la sesion con la informacion correspondiente al pedido.
          var new_pedido = JSON.stringify(this.crear_pedido);
          localStorage.setItem('pedido', new_pedido);
          this.route.navigate(['/pedido-interna/' + this.id_producto]);
        }

      },
      error => {

      }
    );
  }

}
