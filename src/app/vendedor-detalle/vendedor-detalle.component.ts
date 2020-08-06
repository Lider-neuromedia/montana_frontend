import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  usuarios = [];
  info = {};

  show = true;

  constructor(private activatedRoute: ActivatedRoute, private user: UsersService) {

    this.id = this.activatedRoute.snapshot.params['id'];

    // this.user.getSeller(this.id).subscribe(
    //   (data:any) =>{
    //     this.usuarios = data;
    //     console.log( this.usuarios );
    //     for(var i = 0; i <= data.length - 1; i++){
    //       var turnAround = data[i].field_key;
    //       this.info[turnAround] = data[i].value_key;
    //     }
    //     this.show;
    //     console.log(this.info);
    //   },
    //   (error) =>{
    //     this.show = false;
    //     console.log(error);
    //   })

    if(this.info != null){
      this.user.getSeller(this.id).subscribe(
        (data:any) =>{
          this.usuarios = data;
          console.log( this.usuarios );
          for(var i = 0; i <= data.length - 1; i++){
            var turnAround = data[i].field_key;
            this.info[turnAround] = data[i].value_key;
          }
          console.log(this.info);
        },
        (error) =>{
          this.show = false;
        })
    }

    
  }

  ngOnInit(): void {
  }

  editarVendedor(){
    $('.editar-vendedor').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

}
