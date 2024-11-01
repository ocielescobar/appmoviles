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
  map!: google.maps.Map;
  marker!: google.maps.Marker;

  constructor(private firebase: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.loadGoogleMaps().then(() => {
      setTimeout(() => {
        this.initMap(); // Inicializa el mapa después de un breve retraso
        this.initAutocomplete(); // Inicializa la autocompletación
      }, 100); // Pequeño retraso para asegurar que el DOM esté listo
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
        this.initMap(); // Inicializa el mapa aquí
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.initMap(); // Inicializa el mapa cuando la API se haya cargado
          resolve();
        };
        script.onerror = () => reject('Google Maps API failed to load');
        document.head.appendChild(script);
      }
    });
  }
  initAutocomplete() {
    if (window['google'] && window['google'].maps && window['google'].maps.places) {
      this.autocomplete = new window['google'].maps.places.Autocomplete(this.searchBox.nativeElement, {
        types: ['address'], // Permitir solo direcciones
        componentRestrictions: { country: 'cl' } // Limitar a Chile
      });
  
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          // Si se encuentra la ubicación, centrar el mapa y colocar un marcador
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(15);
      
          if (this.marker) {
            this.marker.setMap(null); // Elimina el marcador anterior
          }
          this.marker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name,
          });
        } else if (place.name) {
          // Si no se encuentra la ubicación pero hay un nombre, intenta geocodificar
          this.geocodeAddress(place.name);
        } else {
          alert('No se pudo encontrar la ubicación seleccionada. Intente con otra dirección.');
        }
      });
    }
  }
  initMap() {
    const mapDiv = document.getElementById('map-container') as HTMLElement;
    if (!mapDiv) {
      console.error('El elemento del mapa no se encontró en el DOM.');
      return; // Salir si el div no está disponible
    }
    
    const mapOptions: google.maps.MapOptions = {
      center: this.center,
      zoom: this.zoom,
    };
  
    this.map = new google.maps.Map(mapDiv, mapOptions);
  }
  
  geocodeAddress(address: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address, componentRestrictions: { country: 'cl' } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(15);
  
        if (this.marker) {
          this.marker.setMap(null); // Elimina el marcador anterior
        }
        this.marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
          title: address,
        });
      } else {
        console.error('No se pudo encontrar la ubicación seleccionada.', status);
        alert('No se pudo encontrar la ubicación seleccionada. Asegúrate de que la dirección sea válida.');
      }
    });
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
        this.map.setCenter(this.center); // Centra el mapa en la ubicación actual
        if (this.marker) {
          this.marker.setMap(null); // Elimina el marcador anterior
        }
        this.marker = new google.maps.Marker({
          position: this.center,
          map: this.map,
          title: 'Ubicación Actual',
        });
      }, (error) => {
        console.error('Error getting location:', error);
        alert('No se pudo obtener la ubicación. Asegúrate de que los servicios de ubicación estén habilitados.');
      });
    } else {
      alert('La geolocalización no es soportada por este navegador.');
    }
  }

  goToAddVehicle() {
    this.router.navigateByUrl('/add-vehicle');
  }

  
}
