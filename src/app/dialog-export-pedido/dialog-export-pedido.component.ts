import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogPreguntasPedidoComponent } from '../dialog-preguntas-pedido/dialog-preguntas-pedido.component';
import { SendHttpData } from '../services/SendHttpData';

@Component({
  selector: 'app-dialog-export-pedido',
  templateUrl: './dialog-export-pedido.component.html',
  styleUrls: ['./dialog-export-pedido.component.css']
})
export class DialogExportPedidoComponent implements OnInit {

  dataSource: MatTableDataSource<any>;

  columns = ['nombre', 'fecha-emision', 'nit', 'pedidos'];
  constructor(private http: SendHttpData, private dialogRef: MatDialogRef<DialogExportPedidoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.http.httpGet(`pedidos/${this.data.id}`, true).subscribe(resp => {
      const pedido = [];
      pedido.push(resp.pedido);
      this.dataSource = new MatTableDataSource<any>(pedido);
      // console.log(this.dataSource.data);
    });
  }
  exportPreguntasPedido(){
    this.dialog.open(DialogPreguntasPedidoComponent, {
      width: '60%',
      height: '60%',
      data: {id: this.data.id}
    })
  }
}
