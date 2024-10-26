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

  email=""
  password=""
  tokenID:any="";

  constructor(private firebase:FirebaseService,private storage:StorageService, private router:Router, private alertcontroller:AlertController){ }


  ngOnInit() {
  }
  async login(){
    try {
      let usuario=await this.firebase.auth(this.email,this.password);
      this.tokenID=await usuario.user?.getIdToken();
      console.log(usuario);
      console.log(this.tokenID=await usuario.user?.getIdToken());
      const navigationextras:NavigationExtras = {
        queryParams: {email:this.email, password:this.password, valor: 9999}
      };
      
      this.router.navigate(['/home'],navigationextras);
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
    const jsonToken:any={
      token:this.tokenID
    }
    this.storage.agregarStorage(jsonToken);
    console.log("Obtener", await this.storage.obtenerStorage());
  }

}
