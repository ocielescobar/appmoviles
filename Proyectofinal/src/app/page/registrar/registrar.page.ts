import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/servicio/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  constructor(private allertController: AlertController, private navCtrl: NavController, private firebase:FirebaseService,private router:Router, private registraruser: ApiService) { }

  nombre: string = '';
  email: string = '';
  telefono: string = '';
  token: string = '';
  password: string = '';
  archivoImagen: File | null = null;

  ngOnInit() {}

  async registrar() {
    try {
      let usuario = await this.firebase.registrar(this.email, this.password);
      const token = await usuario.user?.getIdToken();
      if (this.archivoImagen) {
        const request = await this.registraruser.agregarUsuario(
          {
            p_correo_electronico: this.email,
            p_nombre: this.nombre,
            p_telefono: this.telefono,
            token: token,
          },

          this.archivoImagen
        );
      }
      console.log(usuario);
      this.router.navigateByUrl('login');
    } catch (error) {
      this.popAlert();
      console.log(error);
    }
  }
atras() {
  this.navCtrl.back();
}

  onFileChange(event:any) {
    if(event.target.files.length > 0){
      this.archivoImagen = event.target.files[0];
    }
  }

  async popAlert() {
    const alert = await this.allertController.create({
      header: 'Error',
      message: 'Usuario o Contraseña incorrecta',
      buttons: ['OK'],
    });
    await alert.present();
  }
  
}