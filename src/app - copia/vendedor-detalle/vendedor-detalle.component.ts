import { Component, OnInit } from '@angular/core';
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
    "eliminar": "assets/img/icons-filter/trash.svg"
  };

  id:any;

  usuarios:any = {};
  info:any = {};

  show = true;

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private user: UsersService) {
    this.id = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getVendedor();
  }

  getVendedor(){

    if(this.id != null){
      this.user.getSeller(this.id).subscribe(
        (data:any) =>{
          console.log(data);
          this.usuarios = data;
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
