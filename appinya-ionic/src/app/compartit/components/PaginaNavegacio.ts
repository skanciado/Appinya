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
    protected loadingCtrl: LoadingController,
    protected storeData: StoreData
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
    this.navCtrl.navigateRoot("/public");
  }

  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAAcces() {
    this.navCtrl.navigateRoot("/public/acces");
  }
  /**
   * Metode per navegar a la pagina fitxa casteller
   * @param id
   */
  navegarAFitxaCasteller(id?: string) {
    if (id) {
      this.navCtrl.navigateForward(`/public/casteller/${id}`);
    } else this.navCtrl.navigateForward(`/public/casteller/0`);
  }
  /**
   * Metode per navegar a la pagina Usuari
   */
  navegarAFitxaUsuari() {
    this.navCtrl.navigateRoot(`/public/fitxa`);
  }

  /**
   * Metode per navegar a la pagina bustia
   */
  navegarACastells() {
    this.navCtrl.navigateRoot(`/public/castellers`);
  }
  /**
   * Metode per navegar a la pagina bustia
   */
  navegarABustia() {
    this.navCtrl.navigateRoot(`/public/bustia`);
  }
  /**
   * Metode per navegar a la pagina incidencies
   */
  navegarAIncidencia() {
    this.navCtrl.navigateRoot(`/public/incidencia`);
  }
  /**
   * Metode per navegar a la pagina esdeveniment
   * @param id
   */
  navegarAEsdeveniment(id: string) {
    this.navCtrl.navigateRoot(`/public/esdeveniment/${id}`);
  }

  navegarAEsdevenimentForm(id: string, clone?: boolean) {
    if (clone) {
      this.navCtrl.navigateRoot(
        `/public/formularis/esdeveniment/${id}?clone=true`
      );
    } else this.navCtrl.navigateRoot(`/public/formularis/esdeveniment/${id}`);
  }
  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAIniciarSessio() {
    this.navCtrl.navigateRoot("/public/login");
  }
  /**
   * Metode per navegar a la pagina de Organitzacio
   * */
  navegarAOrganitzacio() {
    this.navCtrl.navigateRoot("/public/organitzacio");
  }
  /**
   * Metode per navegar a la pagina de refresc de la base de dades local
   * */
  navegarARefresc() {
    this.navCtrl.navigateRoot("/public/inicialitzar");
  }
  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAAgenda() {
    this.navCtrl.navigateForward("/public/agendalist");
  }
  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAEditarNoticia(id) {
    this.navCtrl.navigateForward(`/public/formularis/noticia/${id}`);
  }
  /**
   * Navegar A editar Casteller
   */
  navegarAEditarCasteller(id) {
    this.navCtrl.navigateForward(`/public/formularis/casteller/${id}`);
  }
  /**
   * Navegar A editar Casteller
   */
  navegarAEditarDadesTecniques(id) {
    this.navCtrl.navigateForward(`/public/formularis/castellertecnic/${id}`);
  }
  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAEditarAlbum(id) {
    this.navCtrl.navigateForward(`/public/formularis/album/${id}`);
  }
  /**
   * Anar a Anuncis
   */
  navegarAAnuncis() {
    this.navCtrl.navigateForward("/public/noticies");
  }
  /**
   * Anar a Albums
   */
  navegarAAlbums() {
    this.navCtrl.navigateForward("/public/albums");
  }
  /**
   * Anar a Albums
   */
  navegarAConfirmacio() {
    this.navCtrl.navigateForward("/administracio/assistencia");
  }
  /**
   * Anar a Albums
   */
  navegarAPasarLlista(id: string) {
    this.navCtrl.navigateForward(`/administracio/pasarllista/${id}`);
  }
  /**
   * Metode per navegar a la pagina de login
   * */
  navegarAAssistencia(id: string) {
    this.navCtrl.navigateForward(`/public/assistencia/${id}`);
  }
  navegarAAssistenciaCasteller(id: string) {
    this.navCtrl.navigateForward(`/public/casteller/assistencia/${id}`);
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
