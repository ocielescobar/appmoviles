import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicio/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { UserModel } from 'src/app/models/usuario';
//import { UserVehiculo } from 'src/app/models/vehiculo';
import { StorageService } from 'src/app/servicio/storage.service';

@Component({
  selector: 'app-ver-vehiculos',
  templateUrl: './ver-vehiculos.page.html',
  styleUrls: ['./ver-vehiculos.page.scss'],
})
export class VerVehiculosPage implements OnInit {
email:string="";
usuario:UserModel[]=[];
//vehiculo:UserVehiculo[]=[];
vehiculos:any[]=[]

  constructor(private apiservice:ApiService, private router:Router, private activate:ActivatedRoute, private storage:StorageService, private animationCtrl:AnimationController, private alertController:AlertController) { 
  this.activate.queryParams.subscribe(params=>{
    this.email=params['email'];
    console.log(this.email)
  })
}

  ngOnInit() {
    this.activate.queryParams.subscribe((params) => {
      this.email = params['email'];
      console.log('Email recibido:', this.email);
      this.cargarUsuario();
    });
  }

  async cargarUsuario(){
    let datastorage = await this.storage.obtenerStorage();
    const req = await this.apiservice.obtenerUsuario(
      {
        p_correo: this.email,
        token: datastorage[0].token
      }
    );
    this.usuario= req.data;
    console.log("Data Inicio Usuario", this.usuario);
    this.obtenerVehiculos();
  } 

  async obtenerVehiculos(){
    let datastorage = await this.storage.obtenerStorage();
    const req = await this.apiservice.obtenerVehiculo(
      {
        p_id: this.usuario[0].id_usuario,
        token: datastorage[0].token
      }
    );
    this.vehiculos= req.data;
    console.log("Data Inicio Vehiculo", this.vehiculos);
  }
}