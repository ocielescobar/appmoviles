import { ɵnormalizeQueryParams } from '@angular/common';
import { StorageService } from './../../servicio/storage.service';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/servicio/firebase.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string ="";
  password: string ="";
  tokenID:any="";

  constructor(
    private firebase:FirebaseService,
    private storage:StorageService,
     private router:Router,
      private alertcontroller:AlertController,
    ){ }


  ngOnInit() {
  }
  async login(){
    try {
      let usuario=await this.firebase.auth(this.email,this.password);
      this.tokenID=await usuario.user?.getIdToken();
      //console.log(usuario);
      //console.log("TokenID",await usuario.user?.getIdToken());
      const navigationExtras:NavigationExtras = {
        queryParams: {email: this.email}
      };
      this.Storage1();
      this.router.navigate(['/home'], navigationExtras);
    } catch (error) {
      console.log(error);
      this.popAlert();
    }
  }
  async popAlert(){
    const alert = await this.alertcontroller.create({
      header:'Error',
      message:"Usuario o contrasena incorrecta",
      buttons:['OK']
    })
    await alert.present();
  }

  async Storage1(){
    const jsonToken:any=[
      {
        "token":this.tokenID,
      }
    ];
    this.storage.agregarStorage(jsonToken);
    console.log(await this.storage.obtenerStorage());
  }

}
