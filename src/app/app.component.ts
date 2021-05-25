import { Component } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin-athletic';
  constructor(private paginator: MatPaginatorIntl){
    this.paginator.itemsPerPageLabel = "Registro por página"
    this.paginator.firstPageLabel = "Primera página";
    this.paginator.previousPageLabel = "Página anterior";
    this.paginator.nextPageLabel = "Página siguiente";
    this.paginator.lastPageLabel = "Ultima página";
  }
}
