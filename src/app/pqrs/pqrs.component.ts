import { Component, OnInit } from '@angular/core';
import { SendHttpData } from '../services/SendHttpData';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-pqrs',
  templateUrl: './pqrs.component.html',
  styleUrls: ['./pqrs.component.css']
})
export class PqrsComponent implements OnInit {

  pqrs : any = [];
  itemPerPage : number = 5;
  current : number = 1;
  clientes : any = [];
  vendedores : any = [];
  createPqrs = {
    cliente : '',
    vendedor : '',
    tipo : '',
    mensaje : ''
  }

  constructor( private route: Router, private http : SendHttpData) { }

  ngOnInit(): void {
    this.getPqrs();
    this.getUsers();
  }

  getPqrs(){
    this.http.httpGet('pqrs', true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.pqrs = response.pqrs;
          this.createPqrs = {
            cliente : '',
            vendedor : '',
            tipo : '',
            mensaje : ''
          }
        }
      },
      error => {

      }
    )
  }

  
  getUsers(){
    // Vendedores
    this.http.httpGet('getUserSmall/' + 2, true).subscribe(
      response => {
        if (response.response == 'success' && response.status) {
          this.vendedores = response.users;
        }
      }, error => { }
    );
    
    // Clientes
    this.http.httpGet('getUserSmall/' + 3, true).subscribe(
      response => {
        if (response.response == 'success' && response.status) {
          this.clientes = response.users;
        }
      }, error => { }
    );
    
  }

  // Change pagination
  changeListPagination(event){
    this.itemPerPage = event.target.value;
    this.current = 1;
  }

  submitCretePqrs(){
    this.http.httpPost('pqrs', this.createPqrs, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            '¡Listo!',
            'Solicitud creada de manera correcta!.',
            'success'
          );
          $('#crearPqrs').modal('hide');
          this.getPqrs();
        }else{
          Swal.fire(
            '¡Ups!',
            response.message,
            'error'
          );
        }
      },
      error => {

      }
    )
  }

  redirectDetalle(id){
    this.route.navigate(['/detalle-pqrs/' + id]);
  }

}
