import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const llave='llaveValor';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage1: any;

  constructor() { }

  async getItem(key: string): Promise<string | null> {
    try {
      const obj = await Preferences.get({ key }); // Obtener el valor desde Preferences
      return obj.value; // Devuelve el valor almacenado
    } catch (error) {
      console.error(`Error obteniendo el item con la llave ${key}:`, error);
      return null; // Manejo de errores
    }
  }
 
  private async setItem(key:string,valor:string){ 
    await Preferences.set({key:key,value:valor}); 
  } 
 
  private async removeItem(key:string){ 
    await Preferences.remove({key:key}); 
  }    
  
  async obtenerStorage() {
    try {
      const data = await this.getItem(llave); // Utiliza getItem para obtener el valor
      return data ? JSON.parse(data) : null; // Maneja el JSON
    } catch (error) {
      console.error("Error al obtener almacenamiento:", error);
      return null; // Manejo de errores
    }
  }

  async agregarStorage(data: any) {
    try {
      await this.setItem(llave, JSON.stringify(data)); // Almacena el objeto como cadena JSON
    } catch (error) {
      console.error("Error al agregar datos al almacenamiento:", error);
    }
  }
}
