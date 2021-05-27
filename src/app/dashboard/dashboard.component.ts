import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SendHttpData } from '../services/SendHttpData';

import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  labels: string[] = [];
  data: any[] = [];
  labels1: string[] = [];
  data1: any[] = [];
  labels2: string[] = [];
  data2: any[] = [];
  filtroCategoria: string;
  filterCatalogo = {
    all : true,
    ninos: false,
    adultos: false
  }

  cantidad_vendedores: number;
  cantidad_clientes: number;
  vendedor_max_clientes: any[] = [];
  dataSource: MatTableDataSource<any>;
  pedidosTabla: MatTableDataSource<any>;
  catalogoTabla: MatTableDataSource<any>;
  productosTabla: MatTableDataSource<any>;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorCatalogo') paginatorCatalogo: MatPaginator;
  clientes: any[] = [];
  columns: any[] = ['nombre', 'dni', 'correo', 'pedidos'];
  columnsPedidos: any[] = ['codigo', 'fecha', 'medio_pago'];
  columnsCatalogos: any[] = ['titulo', 'tipo', 'estado', 'categoria', 'cantidad'];
  columnsProductos: any[] = ['codigo', 'nombre', 'marca', 'precio'];
  pedidos: any;


  constructor(private userService: UsersService, private http: SendHttpData) { 
    
  }

  ngOnInit(): void {
      this.getVendedoresClientes();
  }
  getVendedoresClientes(){
    this.getClientes();
    this.getVendedores();
    this.getCatalogos();
    this.getPedidos();
    setTimeout(() => {
        this.labels = ['Usuarios']
        this.data = [
          {data: [this.cantidad_clientes], label: 'Clientes'},
          {data: [this.cantidad_vendedores], label: 'Vendedores'},
        ]
        
    }, 1500);
  }
  getClientes(search = ''){
    this.userService.getAllClients(search).subscribe((resp: any) => {
      this.cantidad_clientes = resp.users.length;
      resp.users.forEach(element => {
        this.getCliente(element.id);
      });
    });
  }

  getVendedores(search = ''){
    this.userService.getAllSellers(search).subscribe((resp: any) => {
      this.cantidad_vendedores = resp.users.length;
      resp.users.forEach(element => {
        this.getVendedor(element.id);  
      });
      
    })
  }

  getVendedor(id: number){
    this.userService.getSeller(id).subscribe((resp:any) => {
      this.vendedor_max_clientes.push({data: [resp.clientes.length], label: resp.name+' '+resp.apellidos});
      this.labels1 = ['Vendedores Max Clientes'];
      this.data1 = this.vendedor_max_clientes;
    })
  }

  getCliente(id: number){
    this.userService.getClient(id).subscribe((resp: any) => {
      this.clientes.push(resp);
      this.dataSource = new MatTableDataSource<any>(this.clientes);
      this.dataSource.paginator = this.paginator;
    })
  }
  getPedido(pedido: any[]){
    console.log(pedido);
    this.pedidosTabla = new MatTableDataSource<any>(pedido);
  }
  getCatalogos(search = null){
    var route = 'catalogos';
    
    if (search != null) {
      route = 'catalogos?' + search;
    }

    this.http.httpGet(route, true).subscribe(
      response => {
        this.catalogoTabla = new MatTableDataSource<any>(response.catalogos);
        this.catalogoTabla.paginator = this.paginatorCatalogo;
        // console.log(this.catalogoTabla.data);
      },
      error => {
        console.error(error);
      }
    );
  }
  filtro(event: Event, categoria: string){
    this.filtroCategoria = categoria;
    if (categoria != 'all') {
      this.filterCatalogo.all = false;
      if(categoria === 'niños'){
        this.filterCatalogo.ninos = true;
        this.filterCatalogo.adultos = false;
      }
      if(categoria === 'adultos'){
        this.filterCatalogo.adultos = true;
        this.filterCatalogo.ninos = false;
      }
    }else{
      console.log(event.isTrusted);
      if (event.isTrusted) {
        Object.assign(this.filterCatalogo, {all:true, ninos: true, adultos: true});
      }else{
        Object.assign(this.filterCatalogo, {all:false, ninos: false, adultos: false});
      }
    }
    var search = "search=" + JSON.stringify(this.filterCatalogo);
    console.log(search);
    console.log(this.filterCatalogo);
    this.getCatalogos(search);
    console.log(this.filtroCategoria);
    console.log(event.isTrusted);
  }
  getProducts(idCatalogo: number){
    var route = 'productos/' + idCatalogo;
    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.status == 200) {
          this.productosTabla = new MatTableDataSource<any>(response.productos);
          console.log(this.productosTabla.data);
        }else{
          console.error(response);
          const error = [];
          error.push(response);
          this.productosTabla = new MatTableDataSource<any>(error);
        }
      }, 
      error => {
        this.productosTabla = new MatTableDataSource<any>([]);
        console.log(this.productosTabla.data);
      }
    );
  }
  getPedidos(){
    var route = 'pedidos';

    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.pedidos = response.pedidos;
          let aceptado = 0;
          let pendiente = 0;
          let cancelado = 0;
          this.pedidos.forEach(element => {
            if(element.id_estado === 1){
              aceptado++;
            }else if(element.id_estado === 2){
              pendiente++;
            }else if(element.id_estado === 3){
              cancelado++;
            }
          });
          this.labels2 = ['Aceptado', 'Pendiente', 'Cancelado'];
          this.data2 =[ [aceptado, pendiente, cancelado] ];
          console.log(this.data2);
        }
      }, 
      error => {

      }
    )
  }
}
