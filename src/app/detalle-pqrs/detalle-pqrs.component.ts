import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';
import Swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-detalle-pqrs',
  templateUrl: './detalle-pqrs.component.html',
  styleUrls: ['./detalle-pqrs.component.css']
})
export class DetallePqrsComponent implements OnInit {

  id_pqrs : any; 
  pqrs : any = {
    codigo : '',
    estado : '',
    fecha_registro : '',
    name_cliente : '',
    apellidos_cliente : '', 
    name_vendedor : '', 
    apellidos_vendedor : '',
    messages_pqrs : []
  };
  mensaje = '';
  fecha: string;
  hora: string;

  constructor( private activatedRoute: ActivatedRoute, private http : SendHttpData) {
    this.id_pqrs = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getPqrs();
  }

  getPqrs(){
    this.http.httpGet('pqrs/' + this.id_pqrs, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.pqrs = response.pqrs;
          // console.log(response);
          this.fecha = new Date().getFullYear()+'-'+new Date().getMonth()+'-'+new Date().getDay()+' '+new Date().getHours()+':'+
          new Date().getMinutes()+':'+new Date().getSeconds();
          
          this.hora = new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();

          console.log(this.hora);
        }
      },  
      error => {

      }
    )
  }

  sendMessage(){
    var data = {
      mensaje : this.mensaje,
      usuario : localStorage.getItem('user_id'),
      pqrs : this.id_pqrs,
      hora: this.hora,
      created_at: this.fecha,
      update_at: this.fecha
    };
    this.mensaje = '';

    this.http.httpPost('newMessage', data, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.pqrs.messages_pqrs.push(response.mensaje);
          console.log(response);
        }
      },
      error =>{

      }
    )
  }

  changeState(state){
    this.http.httpGet('changeState/'+ this.id_pqrs + '/' + state, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.pqrs.estado = state;
          Swal.fire(
            '¡Listo!',
            response.message,
            'success'
          );
        }else{
          Swal.fire(
            '¡Error!',
            response.message,
            'error'
          );
        }
      }, 
      error => {

      }
    )
  }

  accionesPqrs(){
    $('.acciones-pqrs').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

}
