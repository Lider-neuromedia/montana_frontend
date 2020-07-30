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

  generales = true;
  credenciales = false;
  asignar = false;

  activeDatos = true;
  activeUsuario = false;
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

  constructor( private sellers: UsersService, private route: Router) {
    this.sellers.getAllSellers().subscribe( (data:any) =>{
      console.log(data);
      this.vendedores = data;
    })
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

}
