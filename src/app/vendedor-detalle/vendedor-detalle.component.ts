// import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { UsersService } from '../services/users.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-vendedor-detalle',
  templateUrl: './vendedor-detalle.component.html',
  styleUrls: ['./vendedor-detalle.component.css']
})
export class VendedorDetalleComponent implements OnInit {

  templateImage = {
    "lupa": "assets/img/search.svg",
    "lapiz": "assets/img/editar.svg",
    "points": "assets/img/edit_points.svg",
    "mas": "assets/img/mas.svg",
    "ordenar": "assets/img/arrows_orden.svg",
    "dmVerde": "assets/img/iniciales_ba.svg",
    "dmAzul": "assets/img/iniciales_dm_azul.svg",
    "dmRojo": "assets/img/iniciales_dm_rojo.svg",
    "btnCerrar": "assets/img/cerrar.svg",
    "exportar": "assets/img/icons-filter/export.svg",
    "eliminar": "assets/img/icons-filter/trash.svg",
    "editar": "assets/img/editar.svg"
  };

  id:any;

  usuarios:any = {};
  info:any = {};
  iniciales: string;
  dataSource: MatTableDataSource<any>;
  columns = ['Pedidos'];
  show = true;

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private user: UsersService) {
    this.id = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getVendedor();
  }
  filtro(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getVendedor(){

    if(this.id != null){
      this.user.getSeller(this.id).subscribe(
        (data:any) =>{
          console.log(data);
          this.usuarios = data;
          this.iniciales = data.name.charAt(0)+data.apellidos.charAt(0);
          this.dataSource = new MatTableDataSource<any>(data.pedidos);
          console.log(this.iniciales);
        },
        (error) =>{
          this.show = false;
        })
    }
  }

  editarVendedor(){
    $('.editar-vendedor').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  navigatePedido(pedido){
    this.route.navigate(['/pedido-detalle/' + pedido]);
  }

}
