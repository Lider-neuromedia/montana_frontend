import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { SendHttpData } from '../services/SendHttpData';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
  ]
})
export class EncuestasComponent implements OnInit {

  // Variables o estados.
  openDrawer: boolean = false;
  updateDrawer: boolean = false;
  tipo : boolean = true;
  catalogo : boolean = false;
  tabPreguntas : boolean = false;
  itemPerPage : number = 5;
  current : number = 1;
  encuestas : any = [];
  catalogos : any = [];
  createEncuesta : any = {
    tipo : 'satisfaccion',
    catalogo : '',
    preguntas : []
  };


  constructor( private http : SendHttpData, private router : Router ) { }

  ngOnInit(): void {
    this.getEncuestas();
    this.getCatalogos();
  }

  // Obtener encuestas.
  getEncuestas(){
    this.http.httpGet('encuestas', true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.encuestas = response.encuestas;
        }
      },
      error =>{

      }
    )
  }

  // Obtener catalogos.
  getCatalogos(){
    this.http.httpGet('consumerCatalogos', true).subscribe(
      response =>{
        if (response.response == 'success' && response.status == 200) {
          this.catalogos = response.catalogos;
        }
      },
      error => {

      }
    )
  }

  changeTab(tab){
    // Recibimos la variable a cambiar y le seteamos su valor contrario.
    this[tab] = true;
    if (tab == 'tipo') {
      this.catalogo = false;
      this.tabPreguntas = false;
    }
    if (tab == 'catalogo') {
      this.tipo = false;
      this.tabPreguntas = false;
    }
    if (tab == 'tabPreguntas') {
      this.tipo = false;
      this.catalogo = false;
    }
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

  addPregunta(){
    if (this.createEncuesta.preguntas.length == 5) {
      Swal.fire(
        '¡Ups!',
        'No puedes crear más de 5 preguntas.',
        'error'
      );
    }else{
      this.createEncuesta.preguntas.push({name : ''});
    }
  }

  removePregunta(index){
    this.createEncuesta.preguntas.splice(index, 1);
  }

  submitCrearEncuesta(){
    this.http.httpPost('encuestas', this.createEncuesta, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == '200') {
          Swal.fire(
            '¡Listo!',
            'Encuesta creada de manera correcta!.',
            'success'
          );
          this.openDrawerRigth(false, 'create');
          this.getEncuestas();
          this.createEncuesta = {
            tipo : 'satisfaccion',
            catalogo : '',
            preguntas : []
          }
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

  // Change pagination
  changeListPagination(event){
    this.itemPerPage = event.target.value;
    this.current = 1;
  }

  detalleEncuesta(id){
    this.router.navigate(['detalle-encuesta', id]);
  }

}
