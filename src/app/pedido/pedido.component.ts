import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  constructor(private route: Router, private http : SendHttpData) { }

  pedido : any; 
  productos = [];
  openDrawer = false;
  openDrawerFinallyPed = false;
  tiendas = [];
  list_buy_products = [];
  editPedido = false;
  total_pedido = 0;
  selectEditPedido = {
    referencia : '',
    tiendas : []
  };
  producto_select = {
    id_producto : '',
    referencia : '',
    total : 0,
    stock : 0
  };
  control_cantidad = 0;
  finalizar_pedido = {
    forma_pago : 'contado',
    descuento : 0,
    notas : ''
  };

  ngOnInit(): void {
    if (localStorage.getItem('pedido') == null) {
      this.route.navigate(['/pedidos']);
    }else{
      this.pedido = JSON.parse(localStorage.getItem('pedido'));
      this.list_buy_products = (this.pedido.productos == undefined) ? [] : this.pedido.productos;
      this.getProductos();
      this.getTiendas();
      
      this.total_pedido = (this.pedido.total_pedido == undefined) ? 0 : this.pedido.total_pedido;
    }
  }

  pedidoInterna(){
    this.route.navigate(['/pedido-interna']);
  }

  getProductos(){
    var url = 'productos/' + this.pedido.catalogo;
    this.http.httpGet(url, true).subscribe(
      response => {
        if (response.status == 200 && response.response == 'success') {
          this.productos = response.productos;    
        }
      }, 
      error => {

      }
    )
  }

  openDrawerRight(action : boolean, producto : any = null){
    this.openDrawer = action;
    if (producto == null) {
      this.producto_select = {
        id_producto: '',
        referencia: '',
        total: 0,
        stock : 0
      };
    }else{
      this.producto_select = producto;
    }
  }

  openDrawerFinally(action : boolean){
    this.openDrawerFinallyPed = action;
  }

  addProducto(){
    var product_add = {
      id_producto : this.producto_select.id_producto,
      referencia : this.producto_select.referencia,
      total_producto : this.producto_select.total,
      tiendas : []
    };
    
    // Tiendas.
    this.tiendas.forEach( (element) => {
      var objet = {
        id_tienda: element.id_tiendas,
        lugar: element.lugar,
        direccion: element.direccion,
        local: element.local,
        cantidad: element.cantidad,
      }
      // Total de la factura.
      this.total_pedido = (this.producto_select.total * element.cantidad) + this.total_pedido;

      product_add.tiendas.push(objet);
    });

    this.list_buy_products.push(product_add);
    this.updateSesionPedido();
    this.openDrawerRight(false);
  }

  updateSesionPedido(){
    // Update sesion pedido.
    var pedido = JSON.parse(localStorage.getItem('pedido'));
    pedido.productos = this.list_buy_products;
    pedido.total_pedido = this.total_pedido;
    this.pedido = pedido;
    localStorage.setItem('pedido', JSON.stringify(pedido));
  }

  getTiendas(){
    this.http.httpGet('tiendas-cliente/' + this.pedido.cliente, true).subscribe(
      response => {
        response.forEach(element => {
          element.cantidad = 0;
        }); 
        this.tiendas = response;
      },
      error => { }
    );
  }

  sumCantidad(position, edit = false){
    if(this.tiendas[position].cantidad == undefined){
      if (edit) {
        this.selectEditPedido.tiendas[position].cantidad = 1;
      }else{
        this.tiendas[position].cantidad = 1;
      }
    }else{
      if (edit) {
        this.selectEditPedido.tiendas[position].cantidad++;
      }else{

        if (this.control_cantidad < this.producto_select.stock) {
          this.control_cantidad ++;
          this.tiendas[position].cantidad++;
        }
      }
    }
  }

  resCantidad(position){
    if (this.tiendas[position].cantidad != undefined && this.tiendas[position].cantidad != 0) {
      this.tiendas[position].cantidad--;
      this.control_cantidad--;
    }
  }

  editarPedido(product){
    this.editPedido = true;
    this.selectEditPedido = product;
  }

  saveEditPedido(){
    this.updateSesionPedido();
    this.selectEditPedido = {
      referencia : '',
      tiendas : []
    };
    this.editPedido = false;
  }
  
  deleteProductPedido(){
    var index = this.list_buy_products.findIndex((element) => element == this.selectEditPedido);
    this.list_buy_products.splice(index, 1);
    this.updateSesionPedido();
    this.selectEditPedido = {
      referencia : '',
      tiendas : []
    };
    this.editPedido = false;
  }

  finallyPedido(){
    var data = this.pedido;
    data.descuento = this.finalizar_pedido.descuento;
    data.forma_pago = this.finalizar_pedido.forma_pago;
    data.notas = this.finalizar_pedido.notas;
    
    this.http.httpPost('pedidos', data, true).subscribe(
      response => {
        if (response.status == 200 && response.response == 'success') {
          this.openDrawerFinally(false);
          localStorage.removeItem('pedido');
          this.route.navigate(['/pedidos']);
        }
      },
      error => {

      }
    )
  }

}