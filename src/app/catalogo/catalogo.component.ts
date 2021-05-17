import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';
import Swal from 'sweetalert2'
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogCatalogoComponent } from '../dialog-catalogo/dialog-catalogo.component';
import { Subscription } from 'rxjs';
declare var $:any;
declare var enviarCatalogo: any;

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit, OnDestroy {

  catalogos : any;
  openDrawer = false;
  updateDrawer = false;
  files: File[] = [];
  catalogo = {
    "nombre": null,
    "descuento": 0,
    "estado": 'activo',
    "tipo": 'general',
    "etiqueta": "adultos",
    "image": null
  };
  catalogoEdit = {
    "id_catalogo": null,
    "titulo": 0,
    "descuento": null,
    "estado": null,
    "tipo": null,
    "etiqueta": null,
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
  subscripcion: Subscription;

  constructor(private route: Router, private http : SendHttpData, public dialog: MatDialog) { }
  ngOnDestroy(){
    this.subscripcion.unsubscribe();
  }

  ngOnInit(): void {
    this.getCatalogos();
    this.subscripcion = this.http.refresh.subscribe(() => {
      this.getCatalogos();
    })
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
    $('.acciones-form-adminitrador').addClass('elevar-btns');
    $('.box-cancelar').addClass('icono-catalogo');
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
        this.catalogoEdit.image = this.files[0];
        // console.log(this.catalogoEdit.imagen);
      }else{
        // console.log(edit);
        this.catalogo.image = this.files[0];
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
      "etiqueta": "adultos",
      "image": null
    };
    this.files = [];
  }

  submitCreateCat(form: NgForm){
    console.log(form.value);
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
    if(this.catalogo.image === null){
      Swal.fire('Seleccione una imagen para el catálogo', '', 'error');
      return;
    }
    var data = this.catalogo;
    console.log(data);
    enviarCatalogo(this.catalogo, 'nuevo').then(resp => {
      if (resp.status == 200 && resp.response == 'success') {
        console.log(resp);
        this.openDrawer = false;
          this.getCatalogos();
        this.resetForm();
        Swal.fire(
          '¡Listo!',
          'Catálogo creado de manera existosa',
          'success'
        );
      }else{
        Swal.fire(
          '¡Ups!',
          resp.message,
          resp.response
        );
      }
    }, error => {
      Swal.fire('¡Ups!','Olvidaste subir la imagen', 'error');
      console.error(error);
    })
    this.http.httpPost('catalogos', data, true).subscribe(
      response => {
        
      },
      error => {
        
      }
    )
  }

  deleteCatalogo(id){
    Swal.fire({
      title: 'Está seguro que desea eliminar este catálogo?',
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
                'Catálogo eliminado de manera correcta!',
                'success'
              );
            }else{
              // console.log(response);
            Swal.fire({
              title: 'Este Catálogo tiene productos registrados',
              text: 'Quieres seguir con la eliminación?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, Eliminar'
            }).then(result => {
              if(result.isConfirmed){
                this.http.httpGet( `productos/${id}`, true).subscribe(resp => {
                  
                  for (const iterator of resp['productos']) {
                    console.log(iterator);
                    this.http.httpDelete('producto', iterator.id_producto).subscribe(resp => {
                      this.http.httpDelete('catalogos', id).subscribe(resp => {
                        if (resp.status == 200 && resp.response == 'success') {
                          this.getCatalogos();
                          console.log("catalogo con productos");
                          Swal.fire(
                            '¡Exito!',
                            'Catálogo eliminado de manera correcta!',
                            'success'
                          );
                        }
                      });
                    });    
                  }
                  
                  
                });
              }
            })
              // Swal.fire(
              //   '¡Ups!',
              //   response.message,
              //   'error'
              // );
            }
          },
          error => {
            console.error(error);
          }
        );
      }
    })
   
  }

  tableExport(id: number): void{
    const dialogRef = this.dialog.open(DialogCatalogoComponent, {
      width: '100%',
      height: '60%',
      data: {id}
    });
  }

  editCatalogo(catalogo){
    this.openDrawerRight(true, 'edit');
    this.catalogoEdit = catalogo;
    console.log(this.catalogoEdit);
  }

  submitUpdateCatalogo(){
    // var data = this.catalogoEdit;
    // console.log(this.catalogoEdit);
    enviarCatalogo(this.catalogoEdit, 'editar').then(resp => {
      if (resp.status == 200 && resp.response == 'success') {
        this.updateDrawer = false;
        this.showEditDropzone = false;
        this.catalogoEdit = {
          "id_catalogo": null,
          "titulo": 0,
          "descuento": null,
          "estado": null,
          "tipo": null,
          "etiqueta": null,
          "image": null
        };
        Swal.fire(
          '¡Listo!',
          'Catálogo actualizado de manera correcta.',
          'success'
        );
        this.getCatalogos();
        this.resetForm();
      }else{
        Swal.fire(
          '¡Ups!',
          resp.message,
          'error'
        );
      }
    }, error => {
      console.log(error);
    })
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

