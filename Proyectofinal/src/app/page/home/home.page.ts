import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicio/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('searchBox', { static: true }) searchBox!: ElementRef;
  center: google.maps.LatLngLiteral = { lat: -33.5024, lng: -70.6130 }; // Coordenadas por defecto
  zoom = 8; // Nivel de zoom por defecto
  autocomplete!: google.maps.places.Autocomplete;

  constructor(private firebase: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.loadGoogleMaps().then(() => {
      this.initAutocomplete();
    });
  }

  async logout() {
    await this.firebase.logout();
    this.router.navigateByUrl('/login');
  }

  goToCreateRide() {
    this.router.navigateByUrl('/create-ride');
  }

  goToRideList() {
    this.router.navigateByUrl('/ride-list');
  }

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google && (window as any).google.maps) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject('Google Maps API failed to load');
        document.head.appendChild(script);
      }
    });
  }

  initAutocomplete() {
    if ((window as any).google && google.maps && google.maps.places) {
      this.autocomplete = new google.maps.places.Autocomplete(this.searchBox.nativeElement, {
        types: ['address'], // Permitir direcciones
        componentRestrictions: { country: 'cl' }, // Limitar a Chile
      });
  
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        console.log('Selected place:', place); // Para depuración
  
        if (place.geometry && place.geometry.location) {
          this.center = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          this.zoom = 15; // Ajusta el nivel de zoom al seleccionar un lugar
        } else {
          console.error('No geometry found for place:', place);
          alert('No se pudo obtener la ubicación del lugar seleccionado. Por favor, selecciona un lugar válido.');
        }
      });
    } else {
      setTimeout(() => this.initAutocomplete(), 1000);
    }
  }
  onInput() {
    if (this.autocomplete) {
      this.autocomplete.setBounds(new google.maps.LatLngBounds(this.center));
    }
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.zoom = 15; // Cambia el zoom al mostrar la ubicación
      }, (error) => {
        console.error('Error getting location:', error);
        alert('No se pudo obtener la ubicación. Asegúrate de que los servicios de ubicación estén habilitados.');
      });
    } else {
      alert('La geolocalización no es soportada por este navegador.');
    }
  }
}
