import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';

import { UsersService } from '../services/users.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.css']
})
export class VendedoresComponent implements OnInit {

  generales = false;
  credenciales = true;
  asignar = false;

  activeDatos = false;
  activeUsuario = true;
  asignarCliente = false;

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

  vendedores = [];

  vendedor = {
    /* datos modelo usuario */
    "id": null,
    "rol_id": 2,
    "name": null,
    "email": null,
    "password": null,
    /* datos modelo usuario */
    "userdata": {
      "apellido": null,
      "telefono": null,
    }
  };

  masDatos = {
    // "user_id": parseInt(this.tmp),
    "nombres": null,
    "apellidos": null,
    "tipo_documento": null,
    "numero_documento": null,
    "celular": null,
    "codigo": null
  }

  datos:any = [];
  info = {
    'user_id': null,
    'field_key': null,
    'value_key': null
  };

  rol = localStorage.getItem('rol');
  tmp = localStorage.getItem('tmp_user');

  constructor( private sellers: UsersService, private route: Router, private userService: UsersService) {
    let id = localStorage.getItem('user_id');
    this.traerVendedores();
  }

  ngOnInit(): void {
  }

  datosGenerales(){
    this.generales = !this.generales;
    this.credenciales = false;
    this.asignar = false;
    this.activeDatos = true;
    this.activeUsuario = false;
    this.asignarCliente = false;
  }

  datosCredenciales(){
    this.credenciales = !this.credenciales;
    this.generales = false;
    this.asignar = false;
    this.activeDatos = false;
    this.activeUsuario = true;
    this.asignarCliente = false;
  }

  datosAsignar(){
    this.asignar = !this.asignar;
    this.credenciales = false;
    this.generales = false;
    this.activeDatos = false;
    this.activeUsuario = false;
    this.asignarCliente = true;
  }

  traerVendedores(){
    this.sellers.getUserForRol(2).subscribe( (data:any) =>{
      this.vendedores = data;
    });
  }

  nuevoVendedor(){
    $('.nuevo-vendedor').toggleClass('open');
    $('.overview').css('display','block');
  }

  cerrarFormVendedor(){
    $('.nuevo-vendedor').toggleClass('open');
    $('.overview').css('display','none');
  }

  accionesVendedor(){
    $('.acciones-vendedor').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  vendedorDetalle(id){
    this.route.navigate(['/users/vendedores',id]);
  }

  agregarVendedor(){
    this.userService.createUser(this.vendedor).subscribe( (data:any) =>{
      console.log(data);
      let tmpUser = localStorage.setItem('tmp_user',data.tmp_user);
    });
  }

  agregarMasDatos(){

    this.datos = this.masDatos;
    var objeto = [];

    for (const key in this.masDatos) {
      if (this.masDatos.hasOwnProperty(key)) {
        // console.log(key + " -> " + masDatos[key]);
        objeto.push({
            user_id: this.tmp,
            field_key : key,
            value : this.masDatos[key]
        });
      }
    }

    this.userService.setUserData(objeto).subscribe( (data) =>{
      console.log(data);
      this.traerVendedores();
    });

    

  }

}
