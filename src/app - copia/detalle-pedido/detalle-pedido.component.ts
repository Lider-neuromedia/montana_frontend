import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css']
})
export class DetallePedidoComponent implements OnInit {

  id_pedido = 0;
  selected = new FormControl(0);
  pedido = {
    id_pedido: 0, 
    fecha: '', 
    codigo: '', 
    metodo_pago: '',
    cliente: 0,
    descuento: 0,
    estado: '',
    id_estado: 0,
    info_cliente: {name: '', apellidos: '', email: '', dni: '', nit : ''},
    notas: '',
    productos: [],
    sub_total: 0,
    total: 0,
    vendedor: 0,
    novedades : []
  };
  novedad = {
    tipo : '',
    descripcion : ''
  }

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private http : SendHttpData){ 
    this.id_pedido = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getPedido();
  }

  getPedido(){
    var route = 'pedidos/' + this.id_pedido;
    this.http.httpGet(route, true).subscribe(
      response =>{
        if (response.status == 200 && response.response == 'success') {
          this.pedido = response.pedido;
        }
      }, 
      error => {

      }
    )
  }

  addNovedad(){
    var data = {
      tipo : this.novedad.tipo,
      descripcion : this.novedad.descripcion,
      pedido : this.pedido.id_pedido
    };
    this.http.httpPost('crear-novedad', data,true).subscribe(
      response => {
        if (response.status == 200 && response.response == 'success') {
          this.getPedido();
          this.novedad = {
            tipo : '',
            descripcion : ''
          }
          // Posicionamos el tab. 
          this.selected.setValue(0);
        }
      },
      error => {

      }
    )
  }

}
