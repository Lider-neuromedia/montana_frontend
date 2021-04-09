import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SendHttpData } from '../services/SendHttpData';

@Component({
  selector: 'app-dialog-preguntas-pedido',
  templateUrl: './dialog-preguntas-pedido.component.html',
  styleUrls: ['./dialog-preguntas-pedido.component.css']
})
export class DialogPreguntasPedidoComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  nombre: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  columns = ['cantidad', 'lugar', 'referencia'];
  constructor(private dialogRef: MatDialogRef<DialogPreguntasPedidoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private http: SendHttpData) { }

  ngOnInit(): void {    
    this.http.httpGet(`pedidos/${this.data.id}`, true).subscribe(resp => {
      // console.log(resp.pedido);
      this.nombre = resp.pedido.info_cliente.name +' '+ resp.pedido.info_cliente.apellidos;
      this.dataSource = new MatTableDataSource<any>(resp.pedido.productos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

}
