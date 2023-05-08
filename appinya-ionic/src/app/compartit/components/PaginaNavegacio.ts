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
  ToastController,
  AlertController,
  NavController,
  LoadingController,
} from "@ionic/angular";

import { PaginaGenerica } from "./PaginaGenerica";
import { Router } from "@angular/router";
import { UsuariBs } from "src/app/business/Usuari.business";
import { StoreData } from "src/app/services/storage.data";
import { Constants } from "src/app/Constants";

/**
 * Pagina amb utilitzats per navegar
 * */
@Injectable()
export abstract class PaginaNavegacio extends PaginaGenerica {
  constructor(
    protected usuariBS: UsuariBs,
    protected route: Router,
    protected navCtrl: NavController,
    protected toastCtlr: ToastController,
    protected alertCtlr: AlertController,
    loadingCtrl: LoadingController,
    storeData: StoreData
  ) {
    super(usuariBS, toastCtlr, alertCtlr, loadingCtrl, storeData);
  }
  /**
   * Metode per navegar a una url
   * @param ruta
   */
  navegar(ruta: string) {
    this.navCtrl.navigateRoot(ruta);
  }
  /**
   * Metode per navegar a una url
   * @param ruta
   */
  navegarAPagina(ruta: string) {
    this.navCtrl.navigateForward(ruta);
  }
  /**
   * Metode per navegar a l'inici de la app
   * */
  navegarAInici() {
    this.navCtrl.navigateRoot(Constants.URL_INICI);
  }

  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAAcces() {
    this.navCtrl.navigateRoot(Constants.URL_ACCES);
  }
  /**
   * Metode per navegar a la pagina fitxa casteller
   * @param id
   */
  navegarAFitxaCasteller(id?: string) {
    if (id) {
      this.navCtrl.navigateForward(`${Constants.URL_SOCIS_DET}/${id}`);
    } else this.navCtrl.navigateForward(`${Constants.URL_SOCIS_DET}/0`);
  }
  /**
   * Metode per navegar a la pagina Usuari
   */
  navegarAFitxaUsuari() {
    this.navCtrl.navigateRoot(`${Constants.URL_FITXA_USUARI}`);
  }

  /**
   * Metode per navegar a la pagina bustia
   */
  navegarACastells() {
    this.navCtrl.navigateRoot(`${Constants.URL_SOCIS}`);
  }
  /**
   * Metode per navegar a la pagina bustia
   */
  navegarABustia() {
    this.navCtrl.navigateRoot(`${Constants.URL_BUSTIA}`);
  }
  /**
   * Metode per navegar a la pagina incidencies
   */
  navegarAIncidencia() {
    this.navCtrl.navigateRoot(`${Constants.URL_INCIDENCIA}`);
  }
  /**
   * Metode per navegar a la pagina esdeveniment
   * @param id
   */
  navegarAEsdeveniment(id: string) {
    this.navCtrl.navigateRoot(`${Constants.URL_ESDEVENIMENT_DET}/${id}`);
  }

  navegarAEsdevenimentForm(id: string, clone?: boolean) {
    if (clone) {
      this.navCtrl.navigateRoot(
        `${Constants.URL_ESDEVENIMENT_EDIT}/${id}?clone=true`
      );
    } else this.navCtrl.navigateRoot(`${Constants.URL_ESDEVENIMENT_EDIT}/${id}`);
  }
  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAIniciarSessio() {
    console.debug("Navegar Inicia Sessio")
    this.navCtrl.navigateRoot(Constants.URL_LOGIN);
  }
  /**
   * Metode per navegar a la pagina de Organitzacio
   * */
  navegarAOrganitzacio() {
    this.navCtrl.navigateRoot(Constants.URL_ORGANITZACIO);
  }
  /**
   * Metode per navegar a la pagina de refresc de la base de dades local
   * */
  navegarARefresc() {
    this.navCtrl.navigateRoot(Constants.URL_INICIALITZAR);
  }
  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAAgenda() {
    this.navCtrl.navigateForward(Constants.URL_AGENDA);
  }
  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAEditarNoticia(id: any) {
    this.navCtrl.navigateForward(`${Constants.URL_NOTICIA_FITXA}/${id}`);
  }
  /**
   * Navegar A editar Casteller
   */
  navegarAEditarCasteller(id: any) {
    this.navCtrl.navigateForward(`${Constants.URL_FITXA_SOCI}/${id}`);
  }
  /**
   * Navegar A editar Casteller
   */
  navegarAEditarDadesTecniques(id: any) {
    this.navCtrl.navigateForward(`${Constants.URL_DADES_TECNIQUES}/${id}`);
  }
  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAEditarAlbum(id: any) {
    this.navCtrl.navigateForward(`${Constants.URL_EDITAR_ALBUM}/${id}`);
  }
  /**
   * Anar a Anuncis
   */
  navegarAAnuncis() {
    this.navCtrl.navigateForward(Constants.URL_NOTICIES);
  }
  /**
   * Anar a Albums
   */
  navegarAAlbums() {
    this.navCtrl.navigateForward(Constants.URL_ALBUMS);
  }
  /**
   * Anar a Albums
   */
  navegarAConfirmacio() {
    this.navCtrl.navigateForward(Constants.URL_EDITAR_ASSISTENCIA);
  }
  /**
   * Anar a Albums
   */
  navegarAPasarLlista(id: string) {
    this.navCtrl.navigateForward(`${Constants.URL_PASAR_LLISTA}/${id}`);
  }
  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAAssistencia(id: string) {
    this.navCtrl.navigateForward(`${Constants.URL_ASSISTENCIA}/${id}`);
  }
  navegarAAssistenciaCasteller(id: string) {
    this.navCtrl.navigateForward(`${Constants.URL_ASSISTENCIA_SOCI}/${id}`);
  }

  /**
   * Metode per navegar cap a enrera
   * @param ruta
   */
  navegarAEnrera(url?: string) {
    if (url) {
      this.navCtrl.navigateBack(url);
    } else this.navCtrl.back();
  }
}
