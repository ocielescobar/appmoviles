import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Asegúrate de importar Router
import { StorageService } from 'src/app/servicio/storage.service'; // Ajusta la ruta según la ubicación real
import { ApiService, dataGetUser } from 'src/app/servicio/api.service'; // Ajusta la ruta según la ubicación real
import { HttpErrorResponse } from '@angular/common/http';
import { UserModel } from 'src/app/models/usuario';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-create-ride',
  templateUrl: './create-ride.page.html',
  styleUrls: ['./create-ride.page.scss'],
})
export class CreateRidePage implements OnInit {
  usuario:UserModel[]=[];
  email: string = "";
  id_usuario: number = 0; // Asegúrate de asignar este valor correctamente
  dataStorage: any[] = []; // O ajusta el tipo según lo que devuelva tu StorageService
  p_ubicacion_origen: string = "";
  p_ubicacion_destino: string = "";
  p_costo: number = 0;
  vehiculo: any[] = [];
  
  constructor(
    private apiservice: ApiService,
    private storage: StorageService,
    private activate: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService,
    private alertController: AlertController,
  ) {
    this.activate.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      console.log("Email obtenido:", this.email);
    });
  }
  
  ngOnInit() {
    this.cargarUsuario();

  }
  async cargarUsuario(){
    let dataStorage = await this.storage.obtenerStorage();    
    const req = await this.apiservice.obtenerUsuario(
      {
        p_correo: this.email,
        'token':dataStorage[0].token
      }
    );
    this.usuario = req.data;
    console.log("DATA INICIO USUARIO ", this.usuario);
  }

  async registrarViaje() {
    let dataStorage = await this.storage.obtenerStorage();
    try {
      const request = await this.apiservice.agregarViaje(
        {
          p_id_usuario: this.usuario[0].id_usuario,
          p_ubicacion_origen: this.p_ubicacion_origen,
          p_ubicacion_destino: this.p_ubicacion_destino,
          p_costo: this.p_costo,
          p_id_vehiculo: this.vehiculo[0].idVehiculo,
          token: dataStorage[0].token
        }
      );
      this.router.navigateByUrl('home');
    } catch (error){
      console.log(error)
    }
}
async popAlertNoVehiculos(){
  const alert = await this.alertController.create({
    header:'Error',
    message:"Sin vehiculos registrados",
    buttons:['Ok']
  })
  await alert.present();
}
}
