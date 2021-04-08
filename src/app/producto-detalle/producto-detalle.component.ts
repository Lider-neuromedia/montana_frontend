import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';
import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import { DialogPedidoComponent } from '../dialog-pedido/dialog-pedido.component';

import Swal from 'sweetalert2'
import { MatTableDataSource } from '@angular/material/table';
declare var $:any;

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})

export class ProductoDetalleComponent implements OnInit {

  @ViewChild(DialogPedidoComponent) dialogPedido: DialogPedidoComponent;

  id_producto : any;
  files_1: File[] = [];
  files_2: File[] = [];
  files_3: File[] = [];
  files_4: File[] = [];
  files_5: File[] = [];
  files_6: File[] = [];
  openDrawer = false;
  producto = {
    nombre: '', 
    codigo: '',
    referencia: '',
    catalogo: '',
    descripcion: '',
    descuento: '',
    destacada: '',
    id_marca: '',
    id_producto: '',
    imagenes: [],
    iva: 0,
    marca: '',
    nombre_marca: '',
    precio: '',
    stock: '',
    total: ''
  };
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  preguntas : any = [];
  valoraciones: any = [];
  respuesta_usuario = false; //Si el usuario respondio ya la encuesta.
  dataSource: MatTableDataSource<any>;
  columns = ['valoraciones'];

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private http : SendHttpData) {
    this.id_producto = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {

    this.getProduct();
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        arrowPrevIcon: 'fa fa-chevron-left',
        arrowNextIcon: 'fa fa-chevron-right',
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: true,
      }
    ];

  }
  getProduct(){
    var route = 'producto/' + this.id_producto;
    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.status == 200) {
          this.producto = response.producto;
          this.getPreguntasCatalogo();
          this.getValoraciones();
          (this.galleryImages.length >= 1) ? this.galleryImages = [] : '';
          this.producto.imagenes.forEach( (element) => {
              this.galleryImages.push({
                small: element.image,
                medium: element.image,
                big: element.image
              })
          });
        }
      }, 
      error => {    }
    )
  }

  getValoraciones(){
    this.http.httpGet(`getValoraciones/${this.producto.catalogo}`, true).subscribe(
      resp => {
        if(resp.response === 'success' && resp.status === 200){
          this.valoraciones = resp.preguntas;
          // console.log("Funciona");
          this.dataSource = new MatTableDataSource<any>(this.valoraciones);
          console.log(this.valoraciones);
        }
      },error => {
        console.log(error)
        ;
      }
    )
  }

  getPreguntasCatalogo(){
    this.http.httpGet(`getPreguntas/${this.producto.catalogo}`, true).subscribe(
      response =>{
        if (response.response == 'success' && response.status == 200) {
          this.preguntas = response.preguntas;
          this.respuesta_usuario = response.respuesta_usuario;
          // console.log("Bueno");
          // console.log(this.preguntas);
        }
      },
      error => {
        // console.log("Malo");
      }
    );
  }

  openDrawerRigth(action : boolean, type : string){
    if (type == 'edit') {
      this.openDrawer = action;
    }else{  }
  }

  submitEditProduct(){
    var data = this.producto;
    this.http.httpPut('producto', this.id_producto, data, true).subscribe(
      response => {
        if (response.status == 200 && response.response == 'success') {
          this.openDrawerRigth(false, 'edit');
          this.getProduct();
        }
      },
      error => {

      }
    )
  }

  onSelect(event, fileSelect) {
    this[fileSelect] = event.addedFiles;
    this.readFile(this[fileSelect][0]).then(fileContents => {
      if (fileSelect == 'files_1') {
        this.producto.imagenes.push({image : fileContents, destacada : 1});
      }else{
        var position_file = fileSelect[fileSelect.length - 1];
        
        if (this.producto.imagenes[position_file - 1]) {
          this.producto.imagenes[position_file - 1].image = fileContents;
        }else{
          this.producto.imagenes.push({image : fileContents, destacada : 0});
        }
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
    this.files_1.splice(this.files_1.indexOf(event), 1);
  }

  deleteProduct(){
    Swal.fire({
      title: 'Está seguro que desea eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.value) {
        this.http.httpDelete('producto', this.id_producto).subscribe(
          response => {
            if(response.status == 200 && response.response == 'success'){
              this.route.navigate(['/productos/' + this.producto.catalogo]);
            }else{
              Swal.fire(
                'Error',
                response.message,
                'error'
              )
            }
          },
          error => {
            Swal.fire(
              'Error',
              'Error en el servidor.',
              'error'
            )
          }
        );
      }
    })
  }

  createCalificacion(){
    var data = {
      usuario : localStorage.getItem('user_id'),
      producto: this.producto.id_producto,
      preguntas : []
    };
    this.preguntas.forEach(element => {
      var objet = {
        pregunta : element.id_pregunta,
        respuesta : element.respuesta,
      }
      data.preguntas.push(objet);
    });

    this.http.httpPost('storeRespuestas', data, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            '¡Registro exitoso!',
            'Calificación creada con exito. Muchas gracias por tus aportes.',
            'success'
          );
          this.respuesta_usuario = true;
        }
      }
    )
    
  }

  // Metodos boton acciones.
  accionesAdministrador(){
    $('.acciones-administrador').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  
  openDialogPedido(){
    this.dialogPedido.openDialog();
  }
}
