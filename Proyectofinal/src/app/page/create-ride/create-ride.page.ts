import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Asegúrate de importar Router
import { StorageService } from 'src/app/servicio/storage.service'; // Ajusta la ruta según la ubicación real
import { ApiService } from 'src/app/servicio/api.service'; // Ajusta la ruta según la ubicación real
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-ride',
  templateUrl: './create-ride.page.html',
  styleUrls: ['./create-ride.page.scss'],
})
export class CreateRidePage implements OnInit {
  ubicacionOrigen: string = "";
  ubicacionDestino: string = "";
  costo: number = 0;
  idVehiculo: number = 0; // Asegúrate de inicializar este valor en tu formulario o componente

  constructor(
    private storage: StorageService,
    private apiservice: ApiService,
    private router: Router // Inyecta el router
  ) { }

  ngOnInit() {
    // Inicializa o recupera datos si es necesario
  }

  async registrarViaje() {
    try {
        let dataStorage = await this.storage.obtenerStorage();
        
        if (!this.ubicacionOrigen || !this.ubicacionDestino || !this.costo) {
            console.error('Por favor completa todos los campos requeridos.');
            return; 
        }

        const viajeData = {
            p_id_usuario: 27,
            p_id_vehiculo: 43,
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
