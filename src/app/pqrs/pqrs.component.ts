import { Component, OnInit, ViewChild } from '@angular/core';
import { SendHttpData } from '../services/SendHttpData';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-pqrs',
  templateUrl: './pqrs.component.html',
  styleUrls: ['./pqrs.component.css']
})
export class PqrsComponent implements OnInit {

  pqrs : any = [];
  itemPerPage : number = 5;
  current : number = 1;
  clientes : any = [];
  vendedores : any = [];
  createPqrs = {
    cliente : '',
    vendedor : '',
    tipo : '',
    mensaje : ''
  }

  error = {
    vendedor: 'Seleccione un vendedor',
    cliente: 'Seleccione un cliente',
    tipoPqrs: 'Seleccione un tipo de PQRS',
    mensaje: 'Escriba una descripcion'
  }

  vendedorBool: boolean = false;
  clienteBool: boolean = false;
  tipoPqrsBool: boolean = false;
  mensajeBool: boolean = false;

  formulario: FormGroup;

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selection: SelectionModel<any>;
  columns = ['ticket', 'fechaRegistro', 'cliente', 'vendedor', 'estado'];
  numRows: number;

  constructor( private route: Router, private http : SendHttpData, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.selection = new SelectionModel<any>(true, []);
    this.getPqrs();
    this.getUsers();
    this.crearFormulario();
  }

  crearFormulario(){
    this.formulario = this.formBuilder.group({
      cliente: ['', Validators.required],
      vendedor: ['', Validators.required],
      tipo: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  filtro(event: Event){
    const filtroValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtroValue.trim().toLowerCase();
  }
  getPqrs(){
    this.http.httpGet('pqrs', true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.pqrs = response.pqrs;
          this.dataSource = new MatTableDataSource<any>(response.pqrs);
          this.dataSource.paginator = this.paginator;
          this.numRows = this.dataSource.data.length;
          this.createPqrs = {
            cliente : '',
            vendedor : '',
            tipo : '',
            mensaje : ''
          }
        }
      },
      error => {

      }
    )
  }

  
  getUsers(){
    // Vendedores
    this.http.httpGet('getUserSmall/' + 2, true).subscribe(
      response => {
        if (response.response == 'success' && response.status) {
          this.vendedores = response.users;
        }
      }, error => { }
    );
    
    // Clientes
    this.http.httpGet('getUserSmall/' + 3, true).subscribe(
      response => {
        if (response.response == 'success' && response.status) {
          this.clientes = response.users;
        }
      }, error => { }
    );
    
  }

  // Change pagination
  changeListPagination(event){
    this.itemPerPage = event.target.value;
    this.current = 1;
  }

  submitCretePqrs(){
    if(this.formulario.invalid){
      console.log(this.formulario.value);
      if(this.formulario.value.vendedor === ""){
        this.vendedorBool = true;
      }else{
        this.vendedorBool = false;
      }
      if(this.formulario.value.cliente === ""){
        this.clienteBool = true;
      }else{
        this.clienteBool = false;
      }
      if(this.formulario.value.tipo === ""){
        this.tipoPqrsBool = true;
      }else{
        this.tipoPqrsBool = false;
      }
      if(this.formulario.value.mensaje === ""){
        this.mensajeBool = true;
      }else{
        this.mensajeBool = false;
      }
      return;
    }
    console.log(this.formulario.value);
    this.vendedorBool, this.clienteBool, this.tipoPqrsBool, this.mensajeBool = false;
    this.http.httpPost('pqrs', this.formulario.value, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            '¡Listo!',
            'Solicitud creada de manera correcta!.',
            'success'
          );
          $('#crearPqrs').modal('hide');
          this.getPqrs();
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

  redirectDetalle(id){
    this.route.navigate(['/detalle-pqrs/' + id]);
  }

}
