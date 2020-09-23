import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';
import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {

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
          this.producto.imagenes.forEach( (element) => {
              this.galleryImages.push({
                small: element.image,
                medium: element.image,
                big: element.image
              })
          });
        }
      }, 
      error => {

      }
    )
  }

  openDrawerRigth(action : boolean, type : string){
    if (type == 'edit') {
      this.openDrawer = action;
      // (!action) ? this.updateDrawer = false : '';
    }else{
      // this.updateDrawer = action;
      // (!action) ? this.openDrawer = false : '';
    }
  }
  submitEditProduct(){
    var data = this.producto;
    this.http.httpPut('producto', this.id_producto, data, true).subscribe(
      response => {
        if (response.status == 200 && response.response == 'success') {
          this.openDrawerRigth(false, 'edit');
        }
      }, 
      error => {

      }
    )
  }

  onSelect(event, edit = false, fileSelect) {
    this[fileSelect] = event.addedFiles;
    this.readFile(this[fileSelect][0]).then(fileContents => {
      if (edit) {
        // this.catalogoEdit.imagen = fileContents;
      }else{
        if (fileSelect == 'files_1') {
          this.producto.imagenes.push({image : fileContents, destacada : 1});
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


}
