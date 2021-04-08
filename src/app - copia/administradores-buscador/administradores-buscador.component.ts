import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';
import { UsersService } from '../services/users.service';

declare var jQuery:any;
declare var $:any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administradores-buscador',
  templateUrl: './administradores-buscador.component.html',
  styleUrls: ['./administradores-buscador.component.css']
})
export class AdministradoresBuscadorComponent implements OnInit {

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

  admins:any = [];
  info:any = [];

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
  usersAdmins:any = [];
  removeItemsUsers = [];
  current: number = 1;
  vacio: number = 0;

  constructor(private activatedRoute: ActivatedRoute,private userService: UsersService, private route: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params =>{
      this.admins = this.userService.buscarAdmin(params['text']);
    });
  }

  buscarAdmin(text:string){
    this.route.navigate(['/users/buscar', text]);
  }

  administradorDetalle(id:number){
    this.route.navigate(['/users/administradores', id]);
  }

  cerrarFormAdmin(){
    $('.nuevo-administrador').toggleClass('open');
    $('.overview').css('display','none');
  }

  accionesAdministrador(){
    $('.acciones-administrador').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }
  nuevoAdmin(){
    $('.nuevo-administrador').toggleClass('open');
    $('.overview').css('display', 'block');
  }



  removeUsers(id){
    this.removeItemsUsers.push(id);
    console.log( this.removeItemsUsers );
  }
  getUsersAndDelete(){
    Swal.fire({
      title: 'Está seguro que desea eliminar?',
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
        );
        // Método deleteUser para un sólo usuario ---- método deleteUsers para varios usuarios
        this.userService.deleteUsers(this.removeItemsUsers).subscribe(
          (data:any) =>{
          console.log(data);
          }
        );
      }
    });
  }
}
