import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UsersService } from '../services/users.service';
import { NgForm, FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.css']
})
export class ClienteDetalleComponent implements OnInit {

  datos = {
    "nombres": null,
    "apellidos": null,
    "tipo_doc": null,
    "num_doc": null,
    "telefono": null,
    "email": null,
    "ciudad": null,
    "nit": null
  }

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

  userdata:any;
  datosDetalles:any;

  id:any;
  usuario:any = [];
  vendedor_asoci:any = [];
  vendedor_asoci_tel:any = [];

  info:any = {};
  show:boolean = true;

  active:string = "activeOff";

  openDrawer = false;
  updateDrawer = false;

  constructor(private activatedRoute: ActivatedRoute, private user: UsersService) {

    this.id = this.activatedRoute.snapshot.params['id'];

    if(this.id != null){
      this.user.getClient(this.id).subscribe(
        (data:any) =>{
          // this.usuario = data;
          // console.log( this.usuario );
          // for(var i = 0; i < data.vendedor.length; i++){
          //   this.vendedor_asoci = data.vendedor[i];
          // }
          this.usuario = data;
          this.vendedor_asoci = data.vendedor;
          for(let tel of this.vendedor_asoci.user_data){
            if(tel.field_key == 'celular'){
              this.vendedor_asoci_tel = tel.value_key;
              // console.log(this.vendedor_asoci_tel);
            }
          }
          // console.log(this.vendedor_asoci);
          // console.log(this.usuario);
        },
        (error) =>{
          this.show = false;
        })
    }




    // this.user.getClient(this.id).subscribe( (data:any) =>{
    //   for(var i = 0; i <= data.length - 1; i++){
    //     var turnAround = data[i].field_key;
    //     this.info[turnAround] = data[i].value_key;
    //   }
    //   console.log(this.info);
    // })

    this.datos.nombres = localStorage.getItem('user');
    this.datos.email = localStorage.getItem('email');
    this.userdata = localStorage.getItem('userdata');
    let dataJson = JSON.parse(this.userdata);

    // this.datos.nombres = dataJson[2].value_key;
    // this.datos.apellidos = dataJson[3].value_key;
    // this.datos.tipo_doc = dataJson[4].value_key;
    // this.datos.num_doc = '?';
    // this.datos.telefono = dataJson[5].value_key;
    // //this.datos.email = '?';
    // this.datos.ciudad = dataJson[6].value_key;
    // this.datos.nit = dataJson[7].value_key;

    // console.log( dataJson );

  }

  ngOnInit(): void {
  }

  openDrawerRigth(action : boolean, type : string){
    if (type == 'create') {
      this.openDrawer = action;
      (!action) ? this.updateDrawer = false : '';
    }else{
      this.updateDrawer = action;
      (!action) ? this.openDrawer = false : '';
    }
  }

  submitUpdateClient(){
    // var data = this.catalogo;
    // this.http.httpPost('catalogos', data, true).subscribe(
    //   response => {
    //     if (response.status == 200 && response.response == 'success') {
    //       this.openDrawer = false;
    //       this.getCatalogos();
    //       this.resetForm();
    //     }
    //   }, 
    //   error => {
    //     console.error(error);
    //   }
    // )
  }

  // accionesAdministrador(){
  //   $('.acciones-administrador').toggleClass('open-acciones');
  //   $('.box-editar').toggleClass('box-editar-open');
  // }
}
