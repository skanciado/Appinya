/**
 *  Appinya Open Source Project
 *  Copyright (C) 2019  Daniel Horta Vidal
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as
 *   published by the Free Software Foundation, either version 3 of the
 *   License, or (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 **/
import { Injectable } from "@angular/core";
import { StoreData } from "./storage.data";
import { Platform } from "@ionic/angular";
import { AppVersion } from "@ionic-native/app-version/ngx";
/**
 * Classe de Informació del Dispostiu
 */
@Injectable({
  providedIn: "root",
})
export class DeviceService {
  protected entornWeb: boolean = false;
  protected plataforma: string = "web";
  protected pantallaGran: boolean = false;
  protected senseConexio: boolean = false;
  constructor(
    protected storeData: StoreData,
    protected platform: Platform,
    protected appVersion: AppVersion
  ) {
    this.plataforma = platform.platforms().toString();
    this.pantallaGran = platform.is("desktop") || platform.is("tablet");
    this.entornWeb = !(platform.is("android") || platform.is("ios"));
  }
  /**
   * Valida si el dispositiu es un entorn Web o compilat en dispositiu
   */
  public esEntornWeb() {
    return this.entornWeb;
  }
  /**
   * Retorna si s'està executan en un dispositiu Tablet o Desktop
   */
  public esPantallaGran() {
    return this.pantallaGran;
  }
  /**
   * Funcio per coneixer l'estat de la conexio
   */
  public teConexio() {
    return !this.senseConexio;
  }
  public esConexioActiva() {
    return !this.senseConexio;
  }
  /**
   * Funcio per activar l'estat  conexio
   */
  public activaConexio() {
    this.senseConexio = false;
  }
  /**
   * Funcio per desactivar l'estat  conexio
   */
  public desActivaConexio() {
    this.senseConexio = true;
    //setTimeout(1000, )
  }
  /**
   *  Obtenir Versio
   */
  public obtenirVersio() {
    if (!this.entornWeb) {
      this.appVersion
        .getVersionNumber()
        .then((t) => {
          let version: string[] = t.split(".");
          if (version.length == 1) return Number.parseInt(t);
          else {
            return;
            Number.parseInt(version[0]) * 10000 +
              Number.parseInt(version[1]) * 100 +
              Number.parseInt(version[2]);
          }
          return;
          Number.parseInt(version[0]) * 10000 +
            Number.parseInt(version[1]) * 100 +
            Number.parseInt(version[2]);
        })
        .catch((t) => {
          return 0;
        });
    } else {
      return 0;
    }
  }
  public async obtenirVersioString() {
    try {
      await this.platform.ready();
      let t = await this.appVersion.getVersionNumber();
      return t;
    } catch (e) {
      console.error("e: " + e);
      return "Web";
    }
  }
  /**
   * Obtenir el tipus de plataforma Android IOs Web
   */
  public obtenirPlataformes() {
    return this.plataforma;
  }
}
