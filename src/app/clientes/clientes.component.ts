import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';

import { UsersService } from '../services/users.service';

declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  generales = true;
  credenciales = false;
  tienda = false;
  asignar = false;

  activeDatos = true;
  activeUsuario = false;
  activeTienda = false;
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

  clientes = [];
  rol = localStorage.getItem('rol');

  info = {};

  roles = [];

  constructor( private clients: UsersService, private route: Router) {

    this.clients.getRoles().subscribe( (data:any) =>{

      this.roles = data;

      let user_vendedor =  localStorage.getItem('userdata');
      let dataString = user_vendedor;
      let dataJson = JSON.parse(dataString);

      if(this.rol == this.roles[1].id){
        this.clients.getUserForRol(3).subscribe( (data:any) =>{
          console.log(data);
          this.clientes = data;
        })
      }

      let id = localStorage.getItem('user_id');

      if(this.rol == this.roles[2].id){
        this.clients.clientesAsignados(id).subscribe( (data:any) =>{
          this.clientes = data;

          for(var i = 0; i <= dataJson.length - 1; i++){
            var turnAround = dataJson[i].field_key;
            this.info[turnAround] = dataJson[i].value_key;
          }
          console.log(this.info);
        });

      }
    })

    

    // let id = localStorage.getItem('user_id');
    
    // this.clients.clientesAsignados(id).subscribe( (data:any) =>{
    //   this.clientes = data;
    //   console.log(this.clientes);
    // });


  }

  ngOnInit(): void {
  }

  nuevoCliente(){
    $('.nuevo-cliente').toggleClass('open');
    $('.overview').css('display','block');
  }

  cerrarFormCliente(){
    $('.nuevo-cliente').toggleClass('open');
    $('.overview').css('display','none');
  }

  accionesCliente(){
    $('.acciones-cliente').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  datosGenerales(){
    this.generales = !this.generales;
    this.credenciales = false;
    this.tienda = false;
    this.asignar = false;

    this.activeDatos = true;
    this.activeUsuario = false;
    this.activeTienda = false;
    this.asignarCliente = false;
  }

  datosCredenciales(){
    this.generales = false;
    this.credenciales = !this.credenciales;
    this.tienda = false;
    this.asignar = false;

    this.activeDatos = false;
    this.activeUsuario = true;
    this.activeTienda = false;
    this.asignarCliente = false;
  }

  crearTienda(){
    this.generales = false;
    this.credenciales = false;
    this.tienda = !this.tienda;
    this.asignar = false;

    this.activeDatos = false;
    this.activeUsuario = false;
    this.activeTienda = true;
    this.asignarCliente = false;
  }

  datosAsignar(){
    this.generales = false;
    this.credenciales = false;
    this.tienda = false;
    this.asignar = !this.asignar;

    this.activeDatos = false;
    this.activeUsuario = false;
    this.activeTienda = false;
    this.asignarCliente = true;
  }

  clienteDetalle(id){
    this.route.navigate(['/users/clientes',id]);
  }

}
