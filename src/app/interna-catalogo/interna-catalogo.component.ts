import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';
import { DialogPedidoComponent } from '../dialog-pedido/dialog-pedido.component';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

declare var enviarProducto: any;
declare var $: any;
declare var ordenarProductosMayor: any;
declare var ordenarProductosMenor: any;
declare var ordenarProductosStock: any;

@Component({
  selector: 'app-interna-catalogo',
  templateUrl: './interna-catalogo.component.html',
  styleUrls: ['./interna-catalogo.component.css']
})
export class InternaCatalogoComponent implements OnInit {

  @ViewChild(DialogPedidoComponent) dialogPedido: DialogPedidoComponent;

  id_catalogo : any;
  id_producto : any;
  productos = [];
  marcas = [];
  openDrawer = false;
  files_1: File[] = [];
  files_2: File[] = [];
  files_3: File[] = [];
  files_4: File[] = [];
  files_5: File[] = [];
  files_6: File[] = [];
  crearProducto = {
    nombre : '',
    catalogo : '',
    codigo : '',
    referencia : '',
    stock : 0,
    marca : '',
    precio : 0,
    descripcion : '',
    imagenes : [],
  };

  error = {
    nombre: 'Ingrese Nombre por favor',
    codigo: 'Ingrese código por favor',
    referencia: 'Ingrese referencia por favor',
    stock: 'Ingrese stock por favor',
    marca: 'Seleccione una marca',
    precio: 'Ingrese un precio por favor',
    descripcion: 'Ingrese una descripción',
  }
  nombreBool: boolean = false;
  codigoBool: boolean = false;
  referenciaBool: boolean = false;
  stockBool: boolean = false;
  marcarBool: boolean = false;
  precioBool: boolean = false;
  descripcionBool: boolean = false;

  columns = ['productos'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private http : SendHttpData) {
    this.id_catalogo = this.activatedRoute.snapshot.params['id'];
    this.crearProducto.catalogo = this.id_catalogo;
  }

  ngOnInit(): void {
    this.getProducts();
    this.getMarcas();
  }
  
  ordenarFiltro(filtro: string){
    if('mayor_menor' == filtro){
      this.dataSource = new MatTableDataSource<any>(ordenarProductosMayor(this.dataSource.data));
      this.dataSource.paginator = this.paginator;
    }else if('menor_mayor' == filtro){
      this.dataSource = new MatTableDataSource<any>(ordenarProductosMenor(this.dataSource.data));
      this.dataSource.paginator = this.paginator;
    }else if('stock' == filtro){
      this.dataSource = new MatTableDataSource<any>(ordenarProductosStock(this.dataSource.data));
      this.dataSource.paginator = this.paginator;
    }
  }
  
  openDrawerRigth(action : boolean, type : string){
    $('.acciones-form-adminitrador').addClass('elevar-btns');
    $('.box-cancelar').addClass('icono-catalogo');
    if (type == 'create') {
      this.openDrawer = action;
      // (!action) ? this.updateDrawer = false : '';
    }else{
      // this.updateDrawer = action;
      // (!action) ? this.openDrawer = false : '';
    }
  }

  getMarcas(){
    this.http.httpGet('marcas', true).subscribe(
      response => {
        if(response.response == 'success' && response.status == 200){
          this.marcas = response.marcas;
        }
      },
      error => {

      }
    )
  }

  getProducts(){
    var route = 'productos/' + this.id_catalogo;
    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.status == 200) {
          this.productos = response.productos;
          this.dataSource = new MatTableDataSource<any>(response.productos);
          this.dataSource.paginator = this.paginator;
          console.log(this.dataSource);
        }else{
          console.error(response);
          const error = [];
          error.push(response);
          this.dataSource = new MatTableDataSource<any>(error);
        }
      }, 
      error => {
        this.dataSource = new MatTableDataSource<any>([]);
        console.log(this.dataSource.data);
      }
    );
  }
  filtro(event: Event){
    const filtroValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtroValue.trim().toLowerCase();
  }
  submitCreateProduct(form: NgForm){
    if(form.invalid){
      console.log(form.invalid);
      console.log(form.form.value);
      if(form.form.value.nombre === ""){
        this.nombreBool = true;
      }else{
        this.nombreBool = false;
      }
      if(form.form.value.codigo === ""){
        this.codigoBool = true;
      }else{
        this.codigoBool = false;
      }
      if(form.form.value.referencia === ""){
        this.referenciaBool = true;
      }else{
        this.referenciaBool = false;
      }
      if(form.form.value.stock === ""){
        this.stockBool = true;
      }else{
        this.stockBool = false;
      }
      if(form.form.value.marca === ""){
        this.marcarBool = true;
      }else{
        this.marcarBool = false;
      }
      if(form.form.value.precio === ""){
        this.precioBool = true;
      }else{
        this.precioBool = false;
      }
      if(form.form.value.descripcion === ""){
        this.descripcionBool = true;
      }else{
        this.descripcionBool = false;
      }
      return;
    }
    if(this.crearProducto.imagenes.length === 0){
      Swal.fire('Debe subir por lo mínimo una imagen', '', 'error');
      return;
    }
    this.nombreBool, this.codigoBool, this.referenciaBool, this.stockBool, this.marcarBool,
    this.precioBool, this.descripcionBool = false;
    var data = this.crearProducto;
    console.log(this.crearProducto);
    Swal.fire('Cargando', '', 'info');
    Swal.showLoading();
    enviarProducto(data, 'nuevo').then(response => {
        if (response.response == "success" && response.status == 200) {
          Swal.fire('Producto creado correctamente', '', 'success');
          this.getProducts();
          this.crearProducto.imagenes.forEach(element => {
            
          })
          this.crearProducto = {
            nombre : '',
            catalogo : '',
            codigo : '',
            referencia : '',
            stock : 0,
            marca : '',
            precio : 0,
            descripcion : '',
            imagenes : [],
          };
          this.openDrawerRigth(false, 'create');
        }
        },
        error => {
          console.log(error);
          Swal.fire('Sube una imagen', 'Debe subir por lo minimo 1 imagen', 'error' );
    })
    // this.http.httpPost('productos', data, true).subscribe(
    //   response => {
    //     if (response.response == "success" && response.status == 200) {
    //       Swal.fire('Producto creado correctamente', '', 'success');
    //       this.getProducts();
    //       this.openDrawerRigth(false, 'create');
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //     Swal.fire('Sube una imagen', 'Debe subir por lo minimo 1 imagen', 'error' );
    //   }
    // );
  }

  verProducto(id){
    this.route.navigate(['/producto-detalle/' + id]);
  }
  
  onSelect(event, edit = false, fileSelect) {
    this[fileSelect] = event.addedFiles;
    console.log(event.addedFiles);
    this.readFile(this[fileSelect][0]).then(fileContents => {
      if (edit) {
        // this.catalogoEdit.imagen = fileContents;
      }else{
        if (fileSelect == 'files_1') {
          this.crearProducto.imagenes.push({image : this[fileSelect][0], destacada : 1});
        }else{
          this.crearProducto.imagenes.push({image : this[fileSelect][0], destacada : 0});
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

  onRemove(event, propiedad) {
    console.log(this.crearProducto.imagenes);
    this.crearProducto.imagenes.forEach((element, index) => {
      element.imageArr = [element.image]
      if(element.imageArr.indexOf(event) === 0){
        console.log(index);
        this.crearProducto.imagenes.splice(index, 1);
        this.crearProducto.imagenes[0].destacada = 1;
      }
    })
    this[propiedad].splice(this[propiedad].indexOf(event), 1);
  }

  openDialogPedido(id){
    this.id_producto = id;
    this.dialogPedido.openDialog();
  }

}
