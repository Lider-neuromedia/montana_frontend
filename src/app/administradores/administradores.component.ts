import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { NgForm, FormGroup, FormBuilder, Validators,FormArray } from '@angular/forms';

import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';


declare var jQuery:any;
declare var $:any;

import Swal from 'sweetalert2'
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent implements OnInit {
  
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

  usuarios = [];
  roles = [];
  data = [];

  rol = localStorage.getItem('rol');

  admin = {
    "rol_id": 1,
    "name": null,
    "email": null,
    "password": null,
    "userdata": {
      "apellido": null,
      "telefono": null,
    }
  };

  buscador = '';
  letra = "";

  usersAdmins:any = [];
  userColumns:any = [];

  admins:any = [];

  errors = {
    name: null,
    apellido: null,
    telefono: null,
    email: null,
    password: null
  }

  removeItemsUsers = [];

  current: number = 1;

  formCreateAdmin: FormGroup;

  nombres;
  email;
  telefono;
  apellidos;

  check_user:any = [];
  active:string = "activeOff";

  constructor( private userService: UsersService, private route: Router, private activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService, private formb: FormBuilder  ) {

    // this.userService.getUserForRol(this.rol).subscribe( (data:any) =>{
    //   console.log(data);
    //   this.usuarios = data;
    // })

    // this.userService.searchAdmin(this.buscador).subscribe( (data:any) =>{
    //   this.usuarios = data;
    // });

    // this.userService.getUsersAdmin(this.usersAdmin).subscribe( (data:any) =>{
    //   this.usuarios = data;
    // });
    this.FormCreateAdmin();
  }

  ngOnInit(): void {
    this.showAdmins();
  }

  get nameNoValid(){
    return this.formCreateAdmin.get('name').invalid && this.formCreateAdmin.get('name').touched;
  }
  get apellidosNoValid(){
    return this.formCreateAdmin.get('userdata.apellidos').invalid && this.formCreateAdmin.get('userdata.apellidos').touched;
  }
  get telefonoNoValid(){
    return this.formCreateAdmin.get('userdata.telefono').invalid && this.formCreateAdmin.get('userdata.telefono').touched;
  }
  get emailNoValid(){
    return this.formCreateAdmin.get('email').invalid && this.formCreateAdmin.get('email').touched;
  }
  get passNoValid(){
    return this.formCreateAdmin.get('password').invalid && this.formCreateAdmin.get('password').touched;
  }

  FormCreateAdmin(){
    this.formCreateAdmin = this.formb.group({
      rol_id: [1],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required],
      userdata: this.formb.group({
        apellidos: ['', Validators.required],
        telefono: ['', Validators.required],
      })
    });
  }

  showAdmins(){
    this.userService.getUsersAdmin().subscribe(
      res =>{
        this.usersAdmins = res['admins'];
        // console.log(this.usersAdmins);
        // console.log(res['admins']);
        // this.nombres = this.userColumns = res['fields'][0];
        // this.email = this.userColumns = res['fields'][1];
        this.telefono = this.userColumns = res['fields'][0];
        this.apellidos = this.userColumns = res['fields'][1];
      }
    );
  }

  administradorDetalle(id:number){
    this.route.navigate(['/users/administradores', id]);
  }

  buscarAdmin(text:string){
    this.route.navigate(['/users/buscar', text]);
  }

  agregarAdmin(){
    if(this.formCreateAdmin.invalid){
      return Object.values(this.formCreateAdmin.controls).forEach(control => {
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach(control => control.markAsTouched());
        }else{
          control.markAsTouched();
        }
      });
    }
    console.log(this.formCreateAdmin.value);
    this.userService.createUser(this.formCreateAdmin.value).subscribe(
      (data:any) =>{
        console.log(data);
        this.showAdmins();
        this.formCreateAdmin.reset();
        Swal.fire({
          icon: 'success',
          title: 'Se ha creado un nuevo administrador'
        });
        // this.buscarAdmin();
      },
      (error:any) =>{
        console.log(error);
      }
    );
  }

  updateAdmin(){
    console.log(this.usersAdmins);
  }

  checkAdmin(e, data, active){

    let obj = {
      "data" : data
    }

    let removeIndex = this.check_user.findIndex(x => x.data === data);

    if (e.target.checked){
      this.check_user.push(obj);
      if(this.check_user.length == 1){
        // console.log(this.check_user.length);
        this.active = "activeOn";
        this.editarAdmin();
        // console.log(this.active);
      }else{
        this.active = "activeOff";
        // console.log(this.active);
      }
    }else {
      // console.log(removeIndex);
      if (removeIndex !== -1){
        this.check_user.splice(removeIndex, 1);
      }
      if(removeIndex == 0){
        this.active = "activeOff";
        // console.log(this.active);
      }
      if(removeIndex == 1){
        this.active = "activeOn";
        this.editarAdmin();
        // console.log(this.active);
      }
    }
    // console.log(this.check_user);
  }

  removeUsers(id){
    this.removeItemsUsers.push(id);
    console.log( this.removeItemsUsers );
  }

  getUsersAndDelete(){
    Swal.fire({
      title: 'Está seguro que desea eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Completado',
          'El usuario ha sido eliminado',
          'success'
        );
        // Método deleteUser para un sólo usuario ---- método deleteUsers para varios usuarios
        this.userService.deleteUsers(this.removeItemsUsers).subscribe(
          (data:any) =>{
          console.log(data);
          }
        );
      }
    });
  }

  nuevoAdmin(){
    $('.nuevo-administrador').toggleClass('open');
    $('.overview').css('display', 'block');
  }
  editarAdmin(){
    if($('.open-acciones li:first-child').hasClass('activeOn')){
      $('.editar-administrador').toggleClass('open');
      $('.overview2').css('display', 'block');
    }else if($('.open-acciones li:first-child').hasClass('activeOff')){
      $('.overview2').css('display', 'none');
      Swal.fire(
        'Tienes problemas?',
        'Asegurate de seleccionar algun usuario o tener solo 1 seleccionado',
        'warning'
      );
    }
    
  }
  cerrarFormAdmin(){
    $('.nuevo-administrador').toggleClass('open');
    $('.overview').css('display', 'none');
  }
  cerrarFormAdminEditar(){
    $('.editar-administrador').toggleClass('open');
    $('.overview2').css('display', 'none');
  }

  accionesAdministrador(){
    $('.acciones-administrador').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }
}
