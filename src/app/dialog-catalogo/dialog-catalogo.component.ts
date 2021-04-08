import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SendHttpData } from '../services/SendHttpData';

@Component({
  selector: 'app-dialog-catalogo',
  templateUrl: './dialog-catalogo.component.html',
  styleUrls: ['./dialog-catalogo.component.css']
})
export class DialogCatalogoComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  columns = ['codigo', 'nombre', 'nombre_marca', 'precio'];
  constructor(public dialogRef: MatDialogRef<DialogCatalogoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private http: SendHttpData){
    
  }
  ngOnInit(){
    this.getDataProductos();
  }
  
    getDataProductos(){
      this.http.httpGet(`productos/${this.data.id}`, true).subscribe(resp => {
        this.dataSource = new MatTableDataSource<any>(resp.productos);
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource.data);
      });  
    }

}
