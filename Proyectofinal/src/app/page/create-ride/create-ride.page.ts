import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Asegúrate de importar Router
import { StorageService } from 'src/app/servicio/storage.service'; // Ajusta la ruta según la ubicación real
import { ApiService, dataGetUser } from 'src/app/servicio/api.service'; // Ajusta la ruta según la ubicación real
import { HttpErrorResponse } from '@angular/common/http';
import { UserModel } from 'src/app/models/usuario';
import { FirebaseService } from 'src/app/servicio/firebase.service';

@Component({
  selector: 'app-create-ride',
  templateUrl: './create-ride.page.html',
  styleUrls: ['./create-ride.page.scss'],
})
export class CreateRidePage implements OnInit {
  usuario:UserModel[]=[];
  ubicacionOrigen: string = "";
  ubicacionDestino: string = "";
  costo: number = 0;
  idVehiculo: number = 0; // Asegúrate de inicializar este valor en tu formulario o componente
  email: string = "";
  id_usuario: number = 0; // Asegúrate de asignar este valor correctamente
  dataStorage: any[] = []; // O ajusta el tipo según lo que devuelva tu StorageService

  
  constructor(
    private apiservice: ApiService,
    private storage: StorageService,
    private activate: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService,
  ) {
    this.activate.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      console.log("Email obtenido:", this.email);
    });
  }
  
  ngOnInit() {
    // Inicializa o recupera datos si es necesario
  }
  async cargarUsuario() {
    this.dataStorage = await this.storage.obtenerStorage();
    console.log("Datos de storage:", this.dataStorage); // Verificar el contenido del storage
  
    // Crea el objeto dataGetUser
    const userData: dataGetUser = {
      p_correo: this.email,
      token: this.dataStorage[0]?.token, // Usar el token del storage
    };
  
    // Llama al servicio para obtener el usuario
    const req = await this.apiservice.obtenerUsuario(userData);
  
    if (req && req.data) {
      this.usuario = req.data; // Asigna la respuesta a usuario
      console.log("Datos del usuario:", this.usuario); // Muestra los datos en la consola
  
      // Asegúrate de que esto coincida con la estructura de tus datos
      this.id_usuario = this.usuario[0]?.id_usuario; // Suponiendo que el ID está en el primer elemento
      console.log(`ID de usuario: ${this.id_usuario}`);
    } else {
      console.error("No se encontraron datos del usuario");
    }
  }
  async registrarViaje() {
    try {
      
        let dataStorage = await this.storage.obtenerStorage();

        if (!this.ubicacionOrigen || !this.ubicacionDestino || !this.costo) {
            console.error('Por favor completa todos los campos requeridos.');
            return; 
        }

        if (this.usuario.length === 0) {
            console.error('No se encontró información del usuario.');
            return;
        }

        const viajeData = {
            p_id_usuario: this.usuario[0].id_usuario,
            p_id_vehiculo: this.idVehiculo,
            p_ubicacion_origen: this.ubicacionOrigen,
            p_ubicacion_destino: this.ubicacionDestino,
            p_costo: this.costo,
            token: dataStorage[0].token,
        };

        const request = await this.apiservice.agregarViaje(viajeData);
        console.log('Viaje registrado exitosamente:', request);
        this.router.navigateByUrl('home');

    } catch (error) {
        if (error instanceof HttpErrorResponse) {
            console.error('Error de conexión:', error.message);
            console.error('Detalles del error:', error);
        } else {
            console.error('Error al registrar viaje:', error);
        }
    }
}
}
