import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

  cantidad_vendedores: number;
  cantidad_clientes: number;
  vendedor_max_clientes: any[] = [];
  dataSource: MatTableDataSource<any>;
  pedidosTabla: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  clientes: any[] = [];
  columns: any[] = ['nombre', 'dni', 'correo', 'pedidos'];
  columnsPedidos: any[] = ['codigo', 'fecha', 'medio_pago'];


  constructor(private userService: UsersService) { 
    
  }

  ngOnInit(): void {
      this.getVendedoresClientes();
  }
  getVendedoresClientes(){
    this.getClientes();
    this.getVendedores();
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
}
