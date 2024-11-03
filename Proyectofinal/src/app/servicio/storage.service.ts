import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const llave='llaveValor';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage1: any;
  guardarStorage: any;

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
  
  async obtenerStorage(){
    const data = await this.getItem(llave);
    if (data==null) {
      return [];
    } else {
      return JSON.parse(data);
    }
  }

  async agregarStorage(data:any){
    this.setItem(llave,JSON.stringify(data));
  }
}
