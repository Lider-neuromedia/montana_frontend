import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UsersService } from '../services/users.service';

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

  userdata:any;
  datosDetalles:any;

  id:any;
  usuario:any = [];

  info = {};

  constructor(private activatedRoute: ActivatedRoute, private user: UsersService) {

    this.id = this.activatedRoute.snapshot.params['id'];
    this.user.getClient(this.id).subscribe( (data:any) =>{
      for(var i = 0; i <= data.length - 1; i++){
        var turnAround = data[i].field_key;
        this.info[turnAround] = data[i].value_key;
      }
      console.log(this.info);
    })

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

}
