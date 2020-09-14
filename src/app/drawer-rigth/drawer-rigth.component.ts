import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-drawer-rigth',
  templateUrl: './drawer-rigth.component.html',
  styleUrls: ['./drawer-rigth.component.css']
})
export class DrawerRigthComponent implements OnInit, OnChanges {

  constructor() { }
  // Outputs
  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();
  // Inputs
  @Input() open : boolean; //Controla la accion de abrir y cerrar el drawer.
  @Input() title : string; //Titulo del contenido.
  @Input() subtitle : string; //Sub titulo del contenido
  //Nombre del drawer. Nombre interno para cuando existan mas de 1 en algun componente.
  @Input() name : string; 

  ngOnInit(): void { }

  ngOnChanges() {
    if (this.open) {
      this.openDrawer();
    }else{
      this.closeDrawer();
    }
  }

  closeDrawer(){
      $('.drawer-right').removeClass('open');
      $('.overview').css('display', 'none');
      this.close.emit();
  }

  openDrawer(){
    $('.' + this.name).toggleClass('open');
    $('.overview').css('display', 'block');
  }

  submitCatalogo(){
    this.submit.emit();
  }

}
