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

  constructor() {}
  private readonly tokenKey = llave; // Nombre de la llave para el token
  
  async clearToken() {
    await Preferences.remove({ key: this.tokenKey });
  }
  
  async getItem(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  }
 
  async setItem(key: string, value: string) {
    await Preferences.set({ key, value });
  }
 
  async removeItem(key: string) {
    await Preferences.remove({ key });
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
