import { Component } from '@angular/core';
import { ApiService } from 'src/app/servicio/api.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.page.html',
  styleUrls: ['./add-vehicle.page.scss'],
})
export class AddVehiclePage {
  p_id_usuario: string = '';
  patente: string = '';
  marca: string = '';
  modelo: string = '';
  anio: number | null = null;
  color = '';
  tipoCombustible = '';
  token: string = "";
  archivoImagen: File | null = null;
  
  constructor(private apiService: ApiService,private afAuth: AngularFireAuth, private router: Router) {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
    }
  }

  async addVehicle() {
    // Obtiene el token del usuario
    const user = await this.afAuth.currentUser;
    const token = user ? await user.getIdToken() : null;
  
    if (this.archivoImagen) {
      const vehicleData = {
        p_id_usuario: this.p_id_usuario,  // Reemplaza con el ID del usuario actual
        p_patente: this.patente,
        p_marca: this.marca,
        p_modelo: this.modelo,
        p_anio: this.anio,
        p_color: this.color,
        p_tipo_combustible: this.tipoCombustible,
        token: token,
      };
  
      await this.apiService.agregarVehiculo(vehicleData, this.archivoImagen);
      this.router.navigateByUrl('/home');
    }
  }
  
}
