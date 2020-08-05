import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';

import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';

declare var jQuery:any;
declare var $:any;

import Swal from 'sweetalert2'


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

  admin = {
    "rol_id": 1,
    "name": null,
    "email": null,
    "password": null,
    "userdata": {
      "apellido": null,
      "telefono": null,
    }
  };

  buscador = '';

  errors = {
    name: null,
    apellido: null,
    telefono: null,
    email: null,
    password: null
  }

  removeItemsUsers = [];

  constructor( private userService: UsersService, private route: Router, private activatedRoute: ActivatedRoute  ) {

    // this.userService.getUserForRol(this.rol).subscribe( (data:any) =>{
    //   console.log(data);
    //   this.usuarios = data;
    // })

    this.userService.searchAdmin(this.buscador).subscribe( (data:any) =>{
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

  buscarAdmin(){
    this.userService.searchAdmin(this.buscador).subscribe( (data:any) =>{
      //console.log(data);
    })
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
    // console.log(this.admin);
    this.userService.createUser(this.admin).subscribe(
      (data) =>{
        Swal.fire({
          icon: 'success',
          title: 'Se ha creado un nuevo administrador'
        });
        console.log(data)
        this.buscarAdmin();
      },
      (error) =>{

        console.log(error);

        // apellido
        if( this.errors.apellido == null || this.errors.apellido == '' ){
          this.errors.apellido = 'El apellido es obligatorio';
        } else {
        }
        // telefono
        if( this.errors.telefono == null || this.errors.telefono == '' ){
          this.errors.telefono = 'El teléfono es obligatorio';
        }
        
        this.errors.name = error.error.errors.name;
        this.errors.email = error.error.errors.email;
        this.errors.password = error.error.errors.password;
      }
      );
  }

  removeUsers(id){
    this.removeItemsUsers.push(id);
    console.log( this.removeItemsUsers );
  }

  getUsersAndDelete(){

    Swal.fire({
      title: 'Está seguro que desea eleiminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Completado',
          'El usuario ha sido eliminado',
          'success'
        )
        // Método deleteUser para un sólo usuario ---- método deleteUsers para varios usuarios
        this.userService.deleteUsers(this.removeItemsUsers).subscribe( (data:any) =>{
          console.log(data);
        })
      }
    })
    
  }

}
