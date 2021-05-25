import { Component, OnInit, ViewChild } from '@angular/core';
import { SendHttpData } from '../services/SendHttpData';
import { DialogPedidoComponent } from '../dialog-pedido/dialog-pedido.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

declare var ordenarProductosMayor: any;
declare var ordenarProductosMenor: any;
declare var ordenarProductosStock: any;

@Component({
  selector: 'app-show-room',
  templateUrl: './show-room.component.html',
  styleUrls: ['./show-room.component.css']
})
export class ShowRoomComponent implements OnInit {

  @ViewChild(DialogPedidoComponent) dialogPedido: DialogPedidoComponent;

  productos : any = [];
  selectCatalogo : number = 0;
  selectProduct : number = 0;

  constructor( private http : SendHttpData, private router : Router) { }

  ngOnInit(): void {
    this.getProductsShowRoom();
  }
  ordenarFiltro(filtro: string){
    if('mayor_menor' == filtro){
      this.productos =ordenarProductosMayor(this.productos);
    }else if('menor_mayor' == filtro){
      this.productos =ordenarProductosMenor(this.productos);
    }else if('stock' == filtro){
      this.productos =ordenarProductosStock(this.productos);
    }
  }
  getProductsShowRoom(){

    this.http.httpGet('getProductsShowRoom', true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.productos = response.productos;
          console.log(this.productos);
        }else{
          Swal.fire(
            '¡Ups!',
            response.message,
            'error'
          );
          this.router.navigate(['catalogos']);
        }
      },
      error => {

      }
    )
  }

  pedidoInterna(id){
    this.router.navigate(['/producto-detalle', id]);
  }

  addPedido(producto){
    this.selectCatalogo = producto.catalogo;
    this.selectProduct = producto.id_producto;
    this.dialogPedido.openDialog();
  }

}
