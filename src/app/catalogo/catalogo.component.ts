import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';
import Swal from 'sweetalert2'
import { NgForm } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  catalogos : any;
  openDrawer = false;
  updateDrawer = false;
  files: File[] = [];
  catalogo = {
    "nombre": null,
    "descuento": 0,
    "estado": 'activo',
    "tipo": 'general',
    "image": null
  };
  catalogoEdit = {
    "id_catalogo": null,
    "titulo": 0,
    "descuento": null,
    "estado": null,
    "tipo": null,
    "image": null
  };
  showEditDropzone = false;
  // Paginacion
  current: number = 1;
  itemPerPage: number = 8;
  filterCatalogo = {
    all : true,
    general : false,
    show_room : false,
    public : false,
    private : false,
  }
  nombreCatalogo: string;
  flagNombreCatalogo: boolean;


  constructor(private route: Router, private http : SendHttpData) { }

  ngOnInit(): void {
    this.getCatalogos();
  }

  // Obtener catalogos.
  getCatalogos(search = null){
    var route = 'catalogos';
    
    if (search != null) {
      route = 'catalogos?' + search;
    }

    this.http.httpGet(route, true).subscribe(
      response => {
        this.catalogos = response.catalogos;
        console.log(this.catalogos);
      },
      error => {
        console.error(error);
      }
    );
  }

  verDetalle(id){
    this.route.navigate(['/productos/' + id]);
  }

  showCatOptions(id){
    $('#'+ id + '-overblock').addClass('show-over animated fadeIn');
    $('#'+ id + '-box-catalogo ul').addClass('show-options');
  }

  closeCatOptions(id){
    $('#'+ id + '-overblock').removeClass('show-over animated fadeIn');
    $('#'+ id + '-box-catalogo ul').removeClass('show-options');
  }


  openDrawerRight(action : boolean, type : string){
    if (type == 'create') {
      this.openDrawer = action;
      (!action) ? this.updateDrawer = false : '';
    }else{
      this.updateDrawer = action;
      (!action) ? this.openDrawer = false : '';
    }
  }

  onSelect(event, edit = false) {
    this.files = event.addedFiles;
    console.log(this.files);
    this.readFile(this.files[0]).then(fileContents => {
      if (edit) {
        // console.log(edit);
        this.catalogoEdit.image = fileContents;
        // console.log(this.catalogoEdit.imagen);
      }else{
        // console.log(edit);
        this.catalogo.image = fileContents;
        // console.log(this.catalogo.image);
      }
    });
  }
  
  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };
  
      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };
  
      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }
  
      reader.readAsDataURL(file);
    });
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  resetForm(){
    this.catalogo = {
      "nombre": null,
      "descuento": 0,
      "estado": 'activo',
      "tipo": 'general',
      "image": null
    };
    this.files = [];
  }

  submitCreateCat(form: NgForm){
    if(form.invalid){
      console.log(form.form.value);
      if(form.form.value.name === null){
        this.nombreCatalogo = "Ingrese nombre del producto";
        this.flagNombreCatalogo = true;
      }else{
        this.flagNombreCatalogo = false;
      }
      return;
    }
    this.flagNombreCatalogo = false;
    var data = this.catalogo;
    console.log(data);
    this.http.httpPost('catalogos', data, true).subscribe(
      response => {
        if (response.status == 200 && response.response == 'success') {
          console.log(response);
          this.openDrawer = false;
          this.getCatalogos();
          this.resetForm();
          Swal.fire(
            '¡Listo!',
            'Catalogo creado de manera existosa',
            'success'
          );
        }else{
          Swal.fire(
            '¡Ups!',
            response.message,
            response.response
          );
        }
      },
      error => {
        Swal.fire('¡Ups!','Olvidaste subir la imagen', 'error');
        console.error(error);
      }
    )
  }

  deleteCatalogo(id){
    Swal.fire({
      title: 'Está seguro que desea eliminar este catalogo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if(result.value){
        this.http.httpDelete('catalogos', id).subscribe(
          response => {
            if (response.status == 200 && response.response == 'success') {
              this.getCatalogos();
              Swal.fire(
                '¡Exito!',
                'Catalogo eliminado de manera correcta!',
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
            console.error(error);
          }
        );
      }
    })
   
  }

  editCatalogo(catalogo){
    this.openDrawerRight(true, 'edit');
    this.catalogoEdit = catalogo;  
  }

  submitUpdateCatalogo(){
    var data = this.catalogoEdit;
    this.http.httpPut('catalogos', data.id_catalogo ,data, true).subscribe(
      response => {
        console.log(response);
        if (response.status == 200 && response.response == 'success') {
          this.updateDrawer = false;
          this.getCatalogos();
          this.resetForm();
          Swal.fire(
            '¡Listo!',
            'Catalogo actualizado de manera correcta.',
            'success'
          );
        }else{
          Swal.fire(
            '¡Ups!',
            response.message,
            response.response
          );
        }
      }, 
      error => {
        console.error(error);
      }
    )
  }

  showEditImageOptions(){
    $('.overblock-edit').addClass('show-over');
    $('.box-image-edit ul').addClass('show-options');
  }
  
  hideEditImageOptions(){
    $('.overblock-edit').removeClass('show-over');
    $('.box-image-edit ul').removeClass('show-options');
  }

  changeImageEdit(){ this.showEditDropzone = true; }

  // Change pagination
  changeListPagination(event){
    this.itemPerPage = event.target.value;
    this.current = 1;
  }

  accionesCatalogos(){
    $('.filtros-catalogo').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  checkFilterCatalogo(event, type){
    if (type != 'all') {
      this.filterCatalogo.all = false;
    }else{
      if (event.target.checked) {
        Object.assign(this.filterCatalogo, {all:true, general:true, show_room :true, public : true, private: true});
      }else{
        Object.assign(this.filterCatalogo, {all:false, general:false, show_room :false, public : false, private: false});
      }
    }
    var search = "search=" + JSON.stringify(this.filterCatalogo);
    console.log(search);
    console.log(this.filterCatalogo);
    this.getCatalogos(search);
  }
}

