import { Component, OnInit } from '@angular/core';
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
  clientes: any[] = [];
  columns: any[] = ['nombre', 'dni', 'correo', 'pedidos'];


  constructor(private userService: UsersService) { 
    
  }

  ngOnInit(): void {
      this.getVendedoresClientes();
      this.getMaxClientesVendedores();
      this.getClientePedidos();
  }
  getClientePedidos(){
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<any>(this.clientes);
    }, 1500);
  }
  getMaxClientesVendedores(){
    setTimeout(() => {
      this.labels1 = ['Vendedores Max Clientes'];
      this.data1 = this.vendedor_max_clientes;
    }, 1500);
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
    })
  }

  getCliente(id: number){
    this.userService.getClient(id).subscribe((resp: any) => {
      this.clientes.push(resp);
    })
  }
}
