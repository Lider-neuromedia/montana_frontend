import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';
import {FormControl, NgForm} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';

declare var $: any;

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
  tipoNovedad: string = "";
  descripcion: string = "";
  flagTipoNovedad: boolean = false;
  flagDescripcion:  boolean = false;
  columns = ['Referencia', 'Cantidad', 'Tienda'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
          this.dataSource = new MatTableDataSource<any>(response.pedido.productos);
          this.dataSource.paginator = this.paginator;
          // console.log(this.dataSource.data);
        }
      }, 
      error => {

      }
    )
  }

  addNovedad(form: NgForm){
    if(form.invalid){
      console.log(form.form.value);
      if(form.form.value.tipo === ""){
        this.tipoNovedad = "Seleccione una novedad";
        this.flagTipoNovedad = true;
      }else{
        this.flagTipoNovedad = false;
      }
      if(form.form.value.descripcion === ""){
        this.descripcion = "Ingrese una descripción";
        this.flagDescripcion = true;
      }else{
        this.flagDescripcion = false;
      }
      return;
    }
    this.flagDescripcion = false;
    this.flagTipoNovedad = false;
    var data = {
      tipo : this.novedad.tipo,
      descripcion : this.novedad.descripcion,
      pedido : this.pedido.id_pedido
    };
    Swal.fire('Cargando...', '', 'info');
    Swal.showLoading();
    this.http.httpPost('crear-novedad', data,true).subscribe(
      response => {
        if (response.status == 200 && response.response == 'success') {
          Swal.fire('Registro hecho correctamente', '', 'success');
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

  acccionPedido(){
    $('.acciones-cliente').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }
}
