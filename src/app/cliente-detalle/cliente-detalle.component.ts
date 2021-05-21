import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { SendHttpData } from '../services/SendHttpData';
import Swal from 'sweetalert2'
import { MatTableDataSource } from '@angular/material/table';
import { AmplicacionCupoService } from '../services/amplicacion-cupo.service';
declare var $:any;

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.css']
})
export class ClienteDetalleComponent implements OnInit {

  datos = {
    "nombres": null,
    "apellidos": null,
    "tipo_doc": null,
    "num_doc": null,
    "telefono": null,
    "email": null,
    "ciudad": null,
    "nit": null
  }

  templateImage = {
    "lupa": "assets/img/search.svg",
    "lapiz": "assets/img/editar.svg",
    "points": "assets/img/edit_points.svg",
    "mas": "assets/img/mas.svg",
    "ordenar": "assets/img/arrows_orden.svg",
    "dmVerde": "assets/img/iniciales_ba.svg",
    "dmAzul": "assets/img/iniciales_dm_azul.svg",
    "dmRojo": "assets/img/iniciales_dm_rojo.svg",
    "btnCerrar": "assets/img/cerrar.svg",
    "exportar": "assets/img/icons-filter/export.svg",
    "eliminar": "assets/img/icons-filter/trash.svg"
  };

  userdata:any;
  datosDetalles:any;

  id:any;
  usuario:any = [];
  vendedor_asoci:any = [];
  vendedor_asoci_tel:any = [];

  info:any = {};
  show:boolean = true;

  active:string = "activeOff";

  openDrawer = false;
  updateDrawer = false;
  tiendas = [];
  selectTiendas : any;
  checkTiendas = [];
  dataSource: MatTableDataSource<any>;
  dataCupo: MatTableDataSource<any>;
  columns = ['Pedidos'];
  columnsCupo = ['cupos']
  iniciales: string;

  error = {
    direccion: 'Ingrese una dirección',
    local: 'Ingrese un local',
    lugar: 'Ingrese un lugar',
    nombre: 'Ingrese un nombre',
    telefono: 'Ingrese un teléfono'
  }

  direccionBool: boolean = false;
  localBool: boolean = false;
  lugarBool: boolean = false;
  nombreBool: boolean = false;
  telefonoBool: boolean = false;

  dataAmpliacion: any;

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private user: UsersService, private http: SendHttpData, private ampliacionCupo: AmplicacionCupoService) {

    this.id = this.activatedRoute.snapshot.params['id'];

    this.datos.nombres = localStorage.getItem('user');
    this.datos.email = localStorage.getItem('email');
    this.userdata = localStorage.getItem('userdata');
    let dataJson = JSON.parse(this.userdata);

  }

  ngOnInit(): void {
    setTimeout(() => {
      $('.mat-tab-body-content').addClass('scroll-desctivado');
    }, 500);
    if(this.id != null){
      this.getCliente();
        this.getCupo();
    }
    this.asignTiendasClient();
  }

  getCupo(){
    this.ampliacionCupo.getAumentarCupo().subscribe(resp => {
      const clientes = [];
        for (const cliente of resp) {
          // console.log(resp);              
          if(this.id == cliente.cliente){
            
            clientes.push(cliente)
              this.dataAmpliacion = clientes; 
              
              this.dataCupo = new MatTableDataSource<any>(clientes);
              // console.log(clientes);
              // console.log(this.dataCupo.data);
          }
        }
        if(this.dataCupo === undefined){
          
          const noHay = [];
          noHay.push({noHay: 'No tiene solicitud de pedidos'})
          console.log(noHay);
          this.dataCupo = new MatTableDataSource<any>(noHay);
        }
        
        
    });
  }

  filtro(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  filtroCupo(event: Event){
    const filtroValue = (event.target as HTMLInputElement).value;
    this.dataCupo.filter = filtroValue.trim().toLowerCase();
    
  }

  getCliente(){
    this.user.getClient(this.id).subscribe(
      (data:any) =>{
        this.usuario = data;
        this.vendedor_asoci = data.vendedor;
        this.iniciales = data.name.charAt(0)+data.apellidos.charAt(0);
        // console.log(this.usuario);
        this.dataSource = new MatTableDataSource<any>(this.usuario['pedidos']);

      },
      (error) =>{
        this.show = false;
      })
  }
  
  asignTiendasClient(){
    this.selectTiendas = {
      nombre : '',
      lugar : '',
      local : '',
      direccion : '',
      telefono : ''
    }
  }

  openDrawerRigth(action : boolean, type : string){
    if (type == 'create') {
      this.openDrawer = action;
      // this.selectTiendas = '';
      this.asignTiendasClient();
      (!action) ? this.updateDrawer = false : '';
    }else{
      this.updateDrawer = action;
      (!action) ? this.openDrawer = false : '';
    }
  }
  
  // Agregar tienda.
  addTienda(){
    // Validates.
    if(this.selectTiendas.nombre === "" && this.selectTiendas.lugar === "" && this.selectTiendas.local === "" &&
      this.selectTiendas.direccion === "" && this.selectTiendas.telefono === ""){
        this.nombreBool = this.lugarBool = this.localBool = this.direccionBool = this.telefonoBool = true;
        return;
      }else if(this.selectTiendas.nombre === "" || this.selectTiendas.lugar === "" || this.selectTiendas.local === "" ||
           this.selectTiendas.direccion === "" || this.selectTiendas.telefono === ""){

            if(this.selectTiendas.nombre === ""){
              this.nombreBool = true;
            }else{
              this.nombreBool = false;
            }
            if(this.selectTiendas.lugar === ""){
              this.lugarBool = true;
            }else{
              this.lugarBool = false;
            }
            if(this.selectTiendas.local === ""){
              this.localBool = true;
            }else{
              this.localBool = false;
            }
            if(this.selectTiendas.direccion === ""){
              this.direccionBool = true;
            }else{
              this.direccionBool = false;
            }
            if(this.selectTiendas.telefono === ""){
              this.telefonoBool = true;
            }else{
              this.telefonoBool = false;
            }
             return;
           }
           this.nombreBool = this.lugarBool = this.localBool = this.direccionBool = this.telefonoBool = true;

      console.log(this.selectTiendas);
    this.tiendas.push(this.selectTiendas);
    this.asignTiendasClient();
    
  }

  submitCreateStore(){
    var data = {
      cliente : this.id,
      tiendas : this.tiendas
    }
    this.http.httpPost('tiendas', data, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            'Completado',
            'Tienda creada de manera correcta.',
            'success'
          );
          this.tiendas = [];
          this.getCliente();
          this.openDrawerRigth(false, 'create');
          this.asignTiendasClient();
        }
      },
      error => {

      }
    )
  }

  selectTiendaCheckbox(event, tienda){
    if (event.target.checked) {
      this.checkTiendas.push(tienda);
    }else{
      let removeIndex = this.checkTiendas.findIndex(x => x.id_tiendas === tienda.id_tiendas);
      if (removeIndex !== -1){
        this.checkTiendas.splice(removeIndex, 1);
      }
    }
  }

  editTienda(){
    if (this.checkTiendas.length > 1 || this.checkTiendas.length === 0) {
      Swal.fire(
        'Tienes problemas?',
        'Asegurate de seleccionar alguna tienda o tener solo 1 seleccionado.',
        'warning'
        );
    }else{
      this.openDrawerRigth(true, 'edit');
      this.selectTiendas = this.checkTiendas[0];
    }
  }

  submitUpdateTienda(){
    this.http.httpPut('tiendas', this.selectTiendas.id_tiendas, this.selectTiendas, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            'Completado',
            'Tienda actualizada de manera correcta.',
            'success'
          );
          this.getCliente();
          this.openDrawerRigth(false, 'edit');
          this.asignTiendasClient();
          this.selectTiendas = [];
          this.checkTiendas = [];
        }
      },
      error => {

      }
    )
  }

  deleteTienda(){
    if (this.checkTiendas.length === 0) {
      Swal.fire(
        'Tienes problemas?',
        'Asegurate de seleccionar alguna tienda.',
        'warning'
        );
    }else{

      Swal.fire({
        title: 'Está seguro que desea eliminar estas tiendas?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar'
      }).then((result) => {
        if (result.value) {
          var tiendas = [];
          this.checkTiendas.forEach(element => {
            tiendas.push(element.id_tiendas);
          }); 
          var data = {tiendas : tiendas};
          this.http.httpPost('delete-tiendas', data, true).subscribe(
            response =>{
              if (response.response == 'success' && response.status == 200) {
                Swal.fire(
                  'Completado',
                  'Tiendas eliminadas de manera correcta.',
                  'success'
                );
                this.getCliente();
                this.openDrawerRigth(false, 'edit');
                this.asignTiendasClient();
                this.selectTiendas = [];
                this.checkTiendas = [];
              }else{
                Swal.fire(
                  '¡Ups!',
                  response.message,
                  'error'
                );
                this.asignTiendasClient();
                this.selectTiendas = [];
                this.checkTiendas = [];
              }
            }, 
            error => {

            }
          )
        }
      });
      
    }
  }

  navigatePedido(pedido){
    this.route.navigate(['/pedido-detalle/' + pedido]);
  }
  
  accionesAdministrador(){
    $('.acciones-administrador').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }


}
