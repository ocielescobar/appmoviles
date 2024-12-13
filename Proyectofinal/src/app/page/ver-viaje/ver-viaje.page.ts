import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { UserModel } from 'src/app/models/usuario';
import { ApiService } from 'src/app/servicio/api.service';
import { StorageService } from 'src/app/servicio/storage.service';

@Component({
  selector: 'app-ver-viaje',
  templateUrl: './ver-viaje.page.html',
  styleUrls: ['./ver-viaje.page.scss'],
})
export class VerViajePage implements OnInit {

  email:string="";
  usuario:UserModel[]=[];
  viajes:any[]=[]
  
  constructor(private apiservice:ApiService, private router:Router, private activate:ActivatedRoute, private storage:StorageService, private animationCtrl:AnimationController, private alertController:AlertController) { 
    this.activate.queryParams.subscribe(params=>{
      this.email=params['email'];
      console.log(this.email)
    })
  }

  ngOnInit() {
    this.cargarUsuario();
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
    this.cargarViajes();
  } 

  async cargarViajes(){
    let dataStorage = await this.storage.obtenerStorage();
    const req = await this.apiservice.obtenerViaje(
      {
        p_id_usuario: this.usuario[0].id_usuario,
        token: dataStorage[0].token,
      }
    );
    this.viajes= req.data;
  }
}
