import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';


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
    "eliminar": "assets/img/icons-filter/trash.svg",
    "cancelar": "assets/img/cancelar.svg"
  };

  usuarios = [];
  roles = [];
  data = [];

  rol = localStorage.getItem('rol');
  access_token = localStorage.getItem('access_token');

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

  current: number = 1;
  itemPerPage: number = 5;

  formCreateAdmin: FormGroup;
  formUpdatedAdmin: FormGroup;

  nombres;
  email;
  telefono;
  apellidos;

  check_user:any = [];
  check_Update:any = [];
  removeItemsUsers = [];
  active:string = "activeOff";
  user_data : FormArray;

  superAdmin: boolean = false;

  constructor( private userService: UsersService, private route: Router, private activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService, private formb: FormBuilder) {

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
    this.FormUpdateAdmin();
  }

  ngOnInit(): void {
    this.showAdmins();
  }

  get nameNoValid(){
    return this.formCreateAdmin.get('name').invalid && this.formCreateAdmin.get('name').touched;
  }
  get apellidosNoValid(){
    return this.formCreateAdmin.get('apellidos').invalid && this.formCreateAdmin.get('apellidos').touched;
  }
  get dniNoValid(){
    return this.formCreateAdmin.get('dni').invalid && this.formCreateAdmin.get('dni').touched;
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
  get confirmpassNoValid(){
    return this.formCreateAdmin.get('password_confirmation').invalid && this.formCreateAdmin.get('password_confirmation').touched;
  }
  /* UPDATE ADMIN */
  get nameUpdatedNoValid(){
    return this.formUpdatedAdmin.get('name').invalid;
  }
  get apellidosUpdatedNoValid(){
    return this.formUpdatedAdmin.get('apellidos').invalid;
  }
  get emailUpdatedNoValid(){
    return this.formUpdatedAdmin.get('email').invalid;
  }
  get dniUpdatedNoValid(){
    return this.formUpdatedAdmin.get('dni').invalid;
  }
  get passUpdatedNoValid(){
    return this.formUpdatedAdmin.get('password').invalid;
  }
  get userData(): FormArray {
    return this.formUpdatedAdmin.get('user_data') as FormArray;
  }

  FormCreateAdmin(){
    this.formCreateAdmin = this.formb.group({
      rol_id: [1],
      name: ['', [Validators.required]],
      apellidos: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      userdata: this.formb.group({
        telefono: ['', Validators.required],
      })
    });
  }

  FormUpdateAdmin():any{
    this.formUpdatedAdmin = this.formb.group({
      id: [this.check_Update.id],
      rol_id: [this.check_Update.rol_id],
      name: [this.check_Update.name, [Validators.required]],
      apellidos: [this.check_Update.apellidos, [Validators.required]],
      dni: [this.check_Update.dni, [Validators.required]],
      email: [this.check_Update.email, [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      user_data: this.formb.array([this.createUser_data()],[Validators.required])
    });
  }

  createUser_data(): FormGroup{
    if (typeof this.check_Update.user_data !== 'undefined') {
      var user_data;
      var objet;
      this.check_Update.user_data.forEach(element => {
        user_data = this.formUpdatedAdmin.get('user_data') as FormArray;
        objet = this.formb.group({
          id_field: element.id,
          field_key: element.field_key,
          value_key: [element.value_key, Validators.required]
        });
      });
    }else{
      objet = this.formb.group({
        id_field: '',
        field_key: '',
        value_key: ['',Validators.required]
      })
    }

    return objet;
  }

  // addItem(): void {
  //   this.user_data = this.formUpdatedAdmin.get('user_data') as FormArray;
  //   this.user_data.push(this.createUser_data());
  // }

  showAdmins(){
    this.userService.getUsersAdmin().subscribe(
      res =>{
        this.usersAdmins = res['users'];
        this.user_data = this.userColumns = res['fields'];
        console.log(res);
      }
    );
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
    if(this.formCreateAdmin.get('password_confirmation').value !== this.formCreateAdmin.get('password').value){
        Swal.fire('Las contraseñas no coinciden', '', 'error');
      return;
    }
    if(this.formCreateAdmin.get('password').value.length < 6){
      Swal.fire('La contraseña debe ser minimo 6 caracteres', '', 'info');
      return;
    }
    // this.formCreateAdmin.controls['rol_id'].setValue(1);
    this.userService.createUser(this.formCreateAdmin.value).subscribe(
      (data:any) =>{
        // console.log(data);
        // this.showAdmins();
        // this.FormCreateAdmin();
        // this.cerrarFormAdmin();

        Swal.fire({
          icon: 'success',
          title: 'Se ha creado un nuevo administrador'
        });
        this.formCreateAdmin.reset({
          rol_id: 1
        });
        this.cerrarFormAdmin();
        // this.buscarAdmin();
      },
      (error:any) =>{
        if(error.error.errors.email){
          Swal.fire('Email se encuentra registrado', '', 'warning');
        }
        console.log(error);
      }
    );
  }

  procesarData(data: any){
    this.check_Update = data;
    console.log(data);
    this.FormUpdateAdmin();
  }

  updatedAdmin(){
    if(this.formUpdatedAdmin.get('password').value.length >= 1 || this.formUpdatedAdmin.get('password_confirmation').value.length >= 1){
      if(this.formUpdatedAdmin.get('password').value !== this.formUpdatedAdmin.get('password_confirmation').value){
        Swal.fire('Las contraseñas no coinciden', '', 'error');
        return;
      }
      if(this.formUpdatedAdmin.get('password').value.length < 6){
        Swal.fire('La contraseña debe ser minimo 6 caracteres', '', 'info');
        return;
      }
    }
    let telefono: number = this.formUpdatedAdmin.controls['user_data']['controls'][0]['controls']['value_key'].value;
    this.formUpdatedAdmin.controls['user_data']['controls'][0]['controls']['value_key'].setValue(telefono.toString());

    this.userService.updateUser(this.formUpdatedAdmin.value).subscribe(
      (data:any) =>{
        console.log(data);
        this.showAdmins();
        this.formUpdatedAdmin.reset();
        Swal.fire({
          icon: 'success',
          title: 'Se ha actualizado correctamente'
        });
        this.cerrarFormAdminEditar();
        this.check_user = [];
        // this.buscarAdmin();
      },
      (error:any) =>{
        console.log(error);
      }
    );
  }

  checkAdmin(e, data, active){
    let obj = {
      "data" : data
    }

    if (e.target.checked){
      this.check_user.push(obj);
      if(this.check_user.length == 1){
        this.check_user = this.check_user;
        this.check_user.forEach(e => {
          this.check_Update = e.data;
          this.FormUpdateAdmin();
        });
        this.active = "activeOn";
        this.editarAdmin();
      }else{
        this.active = "activeOff";
      }
      // Eliminar.
      this.removeItemsUsers.push(data.id);
    }else {
      
      let removeIndex = this.check_user.findIndex(x => x.data === data);
      if (removeIndex !== -1){
        this.check_user.splice(removeIndex, 1);
      }
      if(removeIndex == 0){
        this.active = "activeOff";
      }
      if(removeIndex == 1){
        this.active = "activeOn";
        this.editarAdmin();
      }

      // eliminar.
      let removeDelete = this.removeItemsUsers.findIndex(x => x == data.id);
      if (removeDelete !== -1) {
        this.removeItemsUsers.splice(removeDelete, 1);
      }
    }
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
        // Método deleteUser para un sólo usuario ---- método deleteUsers para varios usuarios
        var data = {usuarios : this.removeItemsUsers};
        this.userService.deleteUsers(data).subscribe(
          (data:any) =>{
            if (data.response == 'success' && data.status == 200) {
              this.showAdmins();
              Swal.fire(
                'Completado',
                'Los usuarios han sido eliminados correctamente.',
                'success'
              );
              this.check_user = [];
              this.check_Update = [];
              this.removeItemsUsers = [];
              this.active = "activeOff";
            }else{
              this.showAdmins();
              Swal.fire(
                'Completado',
                data.message,
                'success'
              );
            }
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
        'Asegurate de seleccionar 1 usuario',
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