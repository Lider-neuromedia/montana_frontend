import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';

import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';

declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent implements OnInit {

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

  usuarios = [];
  roles = [];
  data = [];

  rol = localStorage.getItem('rol');

  campos = [
    {
        "id"  : 1,
        "name" : "name",
        "name_public" : "Nombre",
        "type" : "text",
        "group" : 0
    },
    {
        "id"  : 2,
        "name" : "ciudad",
        "name_public" : "Ciudad",
        "type" : "text",
        "group" : 0
    },
    {
        "id"  : 3,
        "name" : "email",
        "name_public" : "Email",
        "type" : "email",
        "group" : 0
    },
    {
        "id"  : 1,
        "name" : "telefono",
        "name_public" : "Telefono",
        "type" : "text",
        "group" : 0
    }

  ]

  // campos = [
  //   {
  //     "name": "name",
  //     "name_public": "Nombre",
  //     "type": "text",
  //     "grupo": 0
  //   }
  // ] 
  

  admin = {
    "rol_id": 1,
    "name": null,
    "email": null,
    "password": null
  };

  constructor( private userService: UsersService, private route: Router, private activatedRoute: ActivatedRoute  ) {

    this.userService.getUserForRol(this.rol).subscribe( (data:any) =>{
      //console.log(data);
      this.usuarios = data;
    })
 
  }

  ngOnInit(): void {
  }


  administradorDetalle(){
    // this.activatedRoute.params.subscribe( (params : Params) =>{
    //   console.log(params);
    // })
    this.route.navigate(['/users/administradores',1]);
  }

  nuevoAdmin(){
    $('.nuevo-administrador').toggleClass('open');
    $('.overview').css('display','block');
  }

  cerrarFormAdmin(){
    $('.nuevo-administrador').toggleClass('open');
    $('.overview').css('display','none');
  }

  accionesAdministrador(){
    $('.acciones-administrador').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  agregarAdmin(){
    console.log(this.admin);
    this.userService.createAdmin(this.admin).subscribe( (data) =>{
      console.log(data);
    })
  }

}
