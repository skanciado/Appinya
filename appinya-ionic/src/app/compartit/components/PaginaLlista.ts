/**
 *  Appinya Open Source Project
 *  Copyright (C) 2021  Daniel Horta Vidal
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
import {
  NavController,
  ToastController,
  AlertController,
  LoadingController,
} from "@ionic/angular";

import { PaginaNavegacio } from "./PaginaNavegacio";
import { Router } from "@angular/router";
import { UsuariBs } from "src/app/business/Usuari.business";
import { StoreData } from "src/app/services/storage.data";
import { Constants } from "src/app/Constants";

import { ArrayUtils } from "src/app/utils/ArrayUtils";

@Injectable()
export class PaginaLlista extends PaginaNavegacio {
  /** Llista que es visualitza en la vista */
  public llistaItems: any[] = [];
  /** Llista que està en memoria */
  public llistaTreball: any[] = [];
  /** quantitat d'items que es visualitzen  */
  protected paginacio: number = 20;
  public estatCarrega: number = Constants.ESTAT_LLISTAT_CARREGANT;

  protected funcioActualitzacio: () => Promise<void> = async () => { return; };
  protected funcioPaginacio: (reg: number) => Promise<any[]> = async (reg: number) => { return []; };
  constructor(
    usuariBS: UsuariBs,
    route: Router,
    navCtrl: NavController,
    toastCtlr: ToastController,
    alertCtlr: AlertController,
    loadingCtrl: LoadingController,
    storeData: StoreData
  ) {
    super(
      usuariBS,
      route,
      navCtrl,
      toastCtlr,
      alertCtlr,
      loadingCtrl,
      storeData
    );
  }
  /**
   * Inicia la llista de cerca
   * @param llista Llista d'items que es vol llista per pantalla
   * @param fActualitzacio funcio d'actualitzacio per fer el refresh
   * @param numpagina la el nombre de items per cada paginació
   */
  public iniciarLlista(
    llista: any[],
    fActualitzacio: () => Promise<void>,
    fPaginacio: (reg: number) => Promise<any[]>,
    numpagina: number
  ): void {
    this.estatCarrega = Constants.ESTAT_LLISTAT_CARREGANT;
    this.llistaItems = [];
    if (numpagina) this.paginacio = numpagina;
    this.funcioActualitzacio = fActualitzacio;
    this.funcioPaginacio = fPaginacio;
    this.llistaTreball = llista;
    // S'inicia la funcio d'actualització si accedeix amb una llista de treball es carrega i despres s'actualitza
    if (this.llistaTreball && this.llistaTreball.length > 0) {
      this.seguentPagina();
      //this.funcioActualitzacio();
    } else {
      // Si esta buit i la funció paginar està informada, s'executa la paginacio 
      this.estatCarrega = Constants.ESTAT_LLISTAT_SENSE_RESULTATS;
      /*this.funcioActualitzacio()
        .then((t) => {
          if (this.llistaTreball.length == 0)
            this.estatCarrega = Constants.ESTAT_LLISTAT_SENSE_RESULTATS;
          else {
            this.seguentPagina();
          }
        })
        .catch((e) => {
          this.estatCarrega = Constants.ESTAT_LLISTAT_SENSE_RESULTATS;
          throw e;
        });*/
    }
  }
  /**
   * Actualitzar llista per força un canvi
   * @param llista
   */
  public actualitzarLlista(llista: any[]) {
    this.llistaTreball = llista;
    this.llistaItems = [];
    for (
      var i = 0;
      i < this.paginacio && this.llistaTreball.length > this.llistaItems.length;
      i++
    ) {
      this.llistaItems.push(this.llistaTreball[this.llistaItems.length]);
    }
    if (!this.llistaItems || this.llistaItems.length == 0) {
      this.estatCarrega = Constants.ESTAT_LLISTAT_SENSE_RESULTATS;
    } else {
      this.estatCarrega = Constants.ESTAT_LLISTAT_CARREGAT;
    }
  }
  /**
   * Metode per neteixar la llista de treball
   * */
  public neteixar() {
    this.llistaItems = [];
  }
  /**
   * Per pagina una nova pagina en el llistat
   * */
  public seguentPagina(): void {
    if (this.funcioPaginacio != undefined) {
      this.funcioPaginacio(this.llistaTreball.length)
        .then((t) => {
          if (t) this.llistaTreball.push(...t);
          if (this.llistaTreball.length == 0)
            this.estatCarrega = Constants.ESTAT_LLISTAT_SENSE_RESULTATS;
          else this.estatCarrega = Constants.ESTAT_LLISTAT_CARREGAT;
          for (
            var i = 0;
            i < this.paginacio &&
            this.llistaTreball.length > this.llistaItems.length;
            i++
          ) {
            this.llistaItems.push(this.llistaTreball[this.llistaItems.length]);
          }
        })
        .catch((e) => {
          this.estatCarrega = Constants.ESTAT_LLISTAT_ERROR_CONEXIO;
          throw e;
        });
    } else {
      for (
        var i = 0;
        i < this.paginacio &&
        this.llistaTreball.length > this.llistaItems.length;
        i++
      ) {
        this.llistaItems.push(this.llistaTreball[this.llistaItems.length]);
      }
      // Si no hi ha resultats per pantalla
      if (this.llistaItems.length > 0) {
        this.estatCarrega = Constants.ESTAT_LLISTAT_CARREGAT;
      } else {
        this.estatCarrega = Constants.ESTAT_LLISTAT_SENSE_RESULTATS;
      }
    }
  }
  /**
   * Funcio per fer la paginació de una llista
   * @param infiniteScroll UI infiniteScroll de la capa presentació
   */
  public async ferScrollInfinit(event: any) {
    setTimeout(() => {
      this.seguentPagina();
      event.target.complete();
    }, 800);
  }
  /**
   * Funcio per refrescar la pagina en format llista
   * @param refresher UI Refresher de la capa presentació
   */
  public async ferActualitzar(event: any) {
    if (this.funcioActualitzacio) {
      try {
        await this.funcioActualitzacio();
      } catch (e) {
        event.target.complete();
        throw e;
      }
      if (this.llistaTreball.length == 0)
        this.estatCarrega = Constants.ESTAT_LLISTAT_SENSE_RESULTATS;
      else {
        // TODO corregir

        ArrayUtils.replaceGenericElementsOfArray(
          this.llistaItems,
          this.llistaTreball
        );
      }
      event.target.complete();
    } else {
      this.presentarAlerta(
        "Error",
        "No hi ha definida cap funció d'actualització"
      );
      event.target.complete();
    }
  }
}
