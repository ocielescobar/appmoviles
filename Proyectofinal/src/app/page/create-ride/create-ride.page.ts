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
  viaje:any[] = [];
  
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
    this.vehiculo= req.data;
    console.log("Data Inicio Vehiculo", this.vehiculo);
  }
  
  async registrarViaje() {
    // Verificar que el usuario esté cargado
    if (!this.usuario || this.usuario.length === 0) {
      console.error("Usuario no cargado o está vacío.");
      return;
    }
  
    // Obtener datos del almacenamiento
    let dataStorage = await this.storage.obtenerStorage();
  
    try {
      // Obtener los vehículos asociados al usuario
      const vehiculos = await this.apiservice.obtenerVehiculo({
        p_id: this.usuario[0]?.id_usuario,
        token: dataStorage[0]?.token,
      });
  
      console.log("Vehículos obtenidos:", vehiculos);
  
      // Verificar que existan vehículos disponibles
      if (vehiculos.data.length > 0) {
        const navigationExtras: NavigationExtras = {
          queryParams: { email: this.email },
        };
  
        // Intentar registrar el viaje
        try {
          const request = await this.apiservice.agregarViaje({
            p_id_usuario: this.usuario[0]?.id_usuario,
            p_ubicacion_origen: this.p_ubicacion_origen,
            p_ubicacion_destino: this.p_ubicacion_destino,
            p_costo: this.p_costo,
            p_id_vehiculo: this.vehiculo[0].id_vehiculo,
            token: dataStorage[0]?.token,
          });
  
          console.log("Viaje registrado con éxito:", request);
          this.router.navigateByUrl('home');
        } catch (error) {
          console.error("Error al registrar el viaje:", error);
        }
      } else {
        console.error("No se encontraron vehículos asociados.");
      }
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
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
