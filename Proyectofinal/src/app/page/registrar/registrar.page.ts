import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/servicio/api.service';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from 'src/app/servicio/storage.service';
@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
 
  constructor(
    private navCtrl: NavController,
    private firebase:FirebaseService,
    private router:Router,
    private crearuser: ApiService,
    private alertcontroller: AlertController,
    private storage: StorageService,
  ) { }

  nombre: string = '';
  email: string = '';
  telefono: string = '';
  token : string = '';
  password: string = '';

  archivoImagen: File | null = null;
  public imagen: string | null = null;

  ngOnInit() {
  }
  async registrar() {
    try {
      let usuario = await this.firebase.registrar(this.email, this.password);
      const token = await usuario.user?.getIdToken();
      if (this.archivoImagen) {
        const request = await this.crearuser.agregarUsuario(
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

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
    }
  }

  async popAlert(){
    const alert = await this.alertcontroller.create({
      header: 'Error',
      message: 'Usuario o Contraseña incorrecta',
      buttons: ['OK'],
    });
    await alert.present();
  }

atras() {
  this.navCtrl.back();
}
async tomarFoto() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // Permite seleccionar o tomar una foto
    });

    this.imagen = image.dataUrl || null; // Asigna la dataUrl o null
    console.log('Foto tomada:', this.imagen);
  } catch (error) {
    console.error('Error al tomar la foto:', error);
  }
}
}