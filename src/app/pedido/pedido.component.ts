import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SendHttpData } from '../services/SendHttpData';
import { SignaturePad } from 'angular2-signaturepad';
declare var $: any;
declare var enviarPedido: any;
declare var ordenarProductosMayor: any;
declare var ordenarProductosMenor: any;
declare var ordenarProductosStock: any;

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions:Object = {
    'minWidth': 5,
    'canvasWidth': 380,
    'canvasHeight':170
  }
  imagen_catalogo: string;
  cantidad: any;
  tempStock: number;
  notasBool: boolean;
  error = {
    notas: 'Debes ingresar una nota',
  }

  constructor(private route: Router, private http : SendHttpData) { 
  }
  ngAfterViewInit(){
    this.signaturePad.set('minWidth', 5);
    this.signaturePad.clear();
  }

  drawComplete() {
    // console.log(this.signaturePad.toDataURL());
    let file = this.base64ToFile(this.signaturePad.toDataURL(), 'firma.png');
    this.pedido.firma = file;
    console.log(file);
  }
  base64ToFile(url, filename){
    let arr = url.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
  }

  drawStart() {
    console.log('begin drawing');
  }
  

  ngOnDestroy(){
    console.log("destruir");
    delete this.pedido.total_pedido;
    localStorage.setItem('pedido', JSON.stringify(this.pedido));
  }

  pedido : any; 
  productos = [];
  show_room = false;
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
    setTimeout(() => {
      $('#final-pedido').addClass('btn-relativos');
    }, 500);
    if (localStorage.getItem('pedido') == null) {
      this.route.navigate(['/pedidos']);
    }else{
      this.pedido = JSON.parse(localStorage.getItem('pedido'));
      this.list_buy_products = (this.pedido.productos == undefined) ? [] : this.pedido.productos;
      this.imagen_catalogo = localStorage.getItem('img-catalogo');
      this.getProductos();
      this.getTiendas();
      console.log(this.pedido);
      
      this.total_pedido = (this.pedido.total_pedido == undefined) ? 0 : this.pedido.total_pedido;
    }
  }

  pedidoInterna(id){
    this.route.navigate(['/pedido-interna', id]);
  }

  ordenarFiltro(filtro: string){
    if('mayor_menor' == filtro){
      this.productos = ordenarProductosMayor(this.productos);

    }else if('menor_mayor' == filtro){
      this.productos = ordenarProductosMenor(this.productos);

    }else if('stock' == filtro){
      this.productos =ordenarProductosStock(this.productos);
    }
  }

  getProductos(){
    var url = 'productos/' + this.pedido.catalogo;
    this.http.httpGet(url, true).subscribe(
      response => {
        if (response.status == 200 && response.response == 'success') {
          this.productos = response.productos;  
          console.log(this.productos);
          let productoTemp = JSON.parse(localStorage.getItem('pedido'));
          // console.log(JSON.parse(localStorage.getItem('pedido')));
          let i = 0;
          productoTemp.productos.forEach(element1 => {
            if(element1.id_producto == this.productos[i].id_producto){
              element1.tiendas.forEach(element2 => {
                if(element2.cantidad > 0){
                  this.productos[i].stock -= element2.cantidad;
                }
              });
            }
            i++;
          });
          console.log();
          this.show_room = response.show_room;
        }
      }, 
      error => {

      }
    )
  }

  openDrawerRight(action : boolean, producto : any = null){
    $('.box-cancelar').addClass('iconos-pedido');
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
      this.tempStock = this.producto_select.stock;
    }
  }

  openDrawerFinally(action : boolean){
    this.openDrawerFinallyPed = action;
  }

  addProducto(){
    
    if(this.producto_select.stock === this.tempStock){
      Swal.fire('No se puede crear un pedido en 0', '', 'error');
      return;
    }
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

  sumCantidad(position){
    if(this.tiendas[position].cantidad <= this.producto_select.stock || this.tiendas[position].cantidad > this.producto_select.stock &&
      this.producto_select.stock > 0){
        if(this.tiendas[position].cantidad === this.producto_select.stock && this.producto_select.stock === 0){
          return;
        }
     this.cantidad++;
     this.producto_select.stock--;
     this.tiendas[position].cantidad++;
   }
  }

  resCantidad(position){
    if (this.tiendas[position].cantidad <= this.producto_select.stock || this.tiendas[position].cantidad > this.producto_select.stock &&
      this.producto_select.stock != 0) {
        if(this.tiendas[position].cantidad === 0){
          return;
        }
    this.tiendas[position].cantidad--;
    this.producto_select.stock++;
  }else if(this.tiendas[position].cantidad > this.producto_select.stock && this.producto_select.stock === 0){
    this.tiendas[position].cantidad--;
    this.producto_select.stock++;
  }
  }

  editarPedido(product){
    this.editPedido = true;
    this.selectEditPedido = product;
    setTimeout(() => {
      $('#actualizar').addClass('pedido-btn-relativos');
    }, 500);
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
    if(data.notas === "" || !data.firma){
      if(data.notas === ""){
        this.notasBool = true;
      }else{
        this.notasBool = false;
      }
      if(!data.firma){
        Swal.fire('La firma debe ser ingresada', '', 'warning');
      }
      return;
    }
    this.notasBool = false;
    console.log(data); 
    Swal.fire('Creando Pedido', '', 'info');
    Swal.showLoading();
    enviarPedido(data, 'nuevo').then(response => {
      if (response.status == 200 && response.response == 'success') {
        Swal.fire(response.message,'','success');
        this.openDrawerFinally(false);
        localStorage.removeItem('pedido');
        this.route.navigate(['/pedidos']);
      }
    }, error => {

    })
  }
}