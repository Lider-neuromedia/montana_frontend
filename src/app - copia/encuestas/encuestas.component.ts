import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { SendHttpData } from '../services/SendHttpData';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
declare var $:any;

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
  checkEncuesta = [];
  selectEncuesta : any = [];

  constructor( private http : SendHttpData, private router : Router ) { }

  ngOnInit(): void {
    this.getEncuestas();
    this.getCatalogos();
  }

  // Obtener encuestas.
  getEncuestas(search = null){
    if (search != null) {
      var router = 'encuestas?search=' + search;
    }else{
      var router = 'encuestas';
    }
    this.http.httpGet(router, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.encuestas = response.encuestas;
          this.checkEncuesta = [];
        }
      },
      error =>{

      }
    )
  }
  
  //Buscar encuesta 
  searchTable(event){
    this.getEncuestas(event.target.value);
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

  // Acciones encuestas.
  accionesEncuestas(){
    $('.acciones-encuestas').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }
  
  selectClientCheckbox(event, encuesta){
    if (event.target.checked) {
      this.checkEncuesta.push(encuesta);
    }else{
      let removeIndex = this.checkEncuesta.findIndex(x => x.id === encuesta.id);
      if (removeIndex !== -1){
        this.checkEncuesta.splice(removeIndex, 1);
      }
    }
  }

  editEncuesta(){
    if (this.checkEncuesta.length > 1 || this.checkEncuesta.length === 0) {
      Swal.fire(
        'Tienes problemas?',
        'Asegurate de seleccionar alguna cliente o tener solo 1 seleccionado.',
        'warning'
        );
    }else{
      this.openDrawerRigth(true, 'edit');
      this.selectEncuesta = this.checkEncuesta[0];
      this.http.httpGet('editEncuesta/' + this.selectEncuesta.id_form, true).subscribe(
        response => {
          if (response.response == 'success' && response.status == 200) {
            this.selectEncuesta = response.encuesta;
            this.openDrawerRigth(true, 'edit');
          }
        },
        error => {

        }
      )  
    }
  }

  deletePreguntaUpdateEn(id_pregunta, index){
    if (id_pregunta == undefined) {
      this.selectEncuesta.preguntas.splice(index, 1);
    }else{
      this.http.httpGet('eliminarPregunta/' + id_pregunta, true).subscribe(
        response => {
          if (response.response == 'success') {
            this.selectEncuesta.preguntas.splice(index, 1);
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
  }

  
  addPreguntaUpdate(){
    if (this.selectEncuesta.preguntas.length == 5) {
      Swal.fire(
        '¡Ups!',
        'No puedes crear más de 5 preguntas.',
        'error'
      );
    }else{
      this.selectEncuesta.preguntas.push({pregunta : ''});
    }
  }

  submitEditEncuesta(){
    this.http.httpPut('encuestas', this.selectEncuesta.id_form, this.selectEncuesta, true ).subscribe(
      response => {
        if (response.response == 'success') {
          this.getEncuestas();
          this.openDrawerRigth(false, 'edit');
          this.selectEncuesta = [];
          Swal.fire(
            '¡Exito!',
            'Encuesta actualizada de manera correcta',
            'success'
          );
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

}
