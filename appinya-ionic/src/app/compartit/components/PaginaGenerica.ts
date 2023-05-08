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
import {
  ToastController,
  AlertController,
  LoadingController,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";
import { UsuariBs } from "../../business/Usuari.business";
import { environment } from "src/environments/environment";
import { IUsuariModel } from "src/app/entities/interfaces";
/**
 *  Pagina base d una pagina genèrica
 * */
@Injectable()
export abstract class PaginaGenerica {
  logo: string;
  logoComplet: string;
  colla: string;
  usuari: IUsuariModel | null = null;
  treballEnProces: boolean = false;
  constructor(
    protected usuariBs: UsuariBs,
    protected toastCtrl: ToastController,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected storeData: StoreData
  ) {
    usuariBs.obtenirUsuari().then((usr) => {
      this.usuari = usr;
    });
    this.treballEnProces = false;
    this.logo = environment.logo;
    this.logoComplet = environment.logoComplet;
    this.colla = environment.colla;
  }
  /**
   * Presentar una alerta a l usuario
   * @param titol titola de l'alerta
   * @param missatge missatge a presentar
   */
  public async presentarAlerta(titol: string, missatge: string): Promise<void> {
    // create an alert instance
    let alert = await this.alertCtrl.create({
      header: titol,
      message: missatge,
    });
    return alert.present();
  }
  /**
   * Presentar Missatge a l'usuari
   * @param missatge missatge a presentar
   * @param temps temps de durada del missatge
   */
  public async presentarMissatge(missatge: string, temps: number) {
    let toast = await this.toastCtrl.create({
      message: missatge,
      duration: temps,
    });
    toast.present();
  }
  /**
   * Presentar per presentar un error en l'actualització
   * */
  public async presentarMissatgeErrorPaquetActualitzacio() {
    let toast = await this.toastCtrl.create({
      message: "No s'ha actualitzat la informació",
      cssClass: "toastError",
      // showCloseButton: true,
      // closeButtonText: 'Ok'
    });
    toast.present();
  }
  /**
   * Presentar per presentar un error de credencials
   * */
  public async presentarAlertaCredencialsCaducades() {
    this.presentarAlerta(
      "Credencials errònies",
      "Credencials caducades, actualitza-les"
    );
  }
  public async presentarMissatgeSenseConexio() {
    let toast = await this.toastCtrl.create({
      message:
        '<ion-icon class="mitja" color="blanc" name="wifi"></ion-icon>  No hi ha connexió a internet',
      color: "primary",
      position: "middle",
      duration: 1000,
    });
    toast.present();
  }
  public async presentarSenseConexioOpcioBloquejada() {
    let toast = await this.toastCtrl.create({
      message:
        '<ion-icon class="mitja" color="blanc" name="wifi"></ion-icon>  Opció no disponible sense conexió a internet',
      color: "primary",
      position: "middle",
      duration: 1000,
    });
    toast.present();
  }
  public async presentarMissatgeAmbConexio() {
    let toast = await this.toastCtrl.create({
      message:
        '<ion-icon class="mitja" color="blanc" name="wifi"></ion-icon>  Connexió a internet activa',
      color: "verd",
      position: "middle",
      duration: 1000,
    });
    toast.present();
  }
  /**
   * Presentar per presentar un error
   * @param missatge
   */
  public async presentarMissatgeError(missatge: string) {
    const toast = await this.toastCtrl.create({
      message: missatge,
      cssClass: "toastError",
      duration: 2000,
    });
    toast.present();
  }

  /**
   * Presentar per presentar amb un boto acceptar
   * @param missatge
   */
  public async presentarMissatgeAmbBoto(missatge: string) {
    const toast = await this.toastCtrl.create({
      message: missatge,
      // showCloseButton: true,
      // closeButtonText: 'Ok'
    });
    toast.present();
  }

  /**
   * Missatge de confirmació simple
   * @param titol Titol de PopUp
   * @param missatge Missatge del PopUp
   */
  public async presentarConfirmacio(
    titol: string,
    missatge: string
  ): Promise<Boolean> {
    var promise = new Promise<Boolean>((resolve, reject) => {
      const alert = this.alertCtrl
        .create({
          header: titol,
          message: missatge,
          buttons: [
            {
              text: "No",
              role: "cancel",
              handler: () => {
                resolve(false);
              },
            },
            {
              text: "Sí",
              handler: () => {
                resolve(true);
              },
            },
          ],
        })
        .then((c) => {
          c.present();
        });
    });
    return promise;
  }
  /**
   * Presentar un PopUp per confirmar accions
   * @param accio Accio a relaitzar Ex. Esborrar, Anullar ....
   * @param que El que , ex. l'Esdeveniment, Publicació ....
   * @param avis Notes del missatge Ex. Avis: Tota la informació s'esborrara
   */
  public presentarConfirmacioAccio(
    accio: string,
    que: string,
    avis: string | null = null
  ): Promise<Boolean> {
    let message = "Segur que vols " + accio + " " + que + " ? ";
    if (avis) message += "<p class='avis'>Avís:" + avis + "</p>";
    var promise = new Promise<Boolean>((resolve, reject) => {
      const alert = this.alertCtrl
        .create({
          header: "Confirmació d'acció",
          message: message,
          buttons: [
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                resolve(false);
              },
            },
            {
              text: accio,
              handler: () => {
                resolve(true);
              },
            },
          ],
        })
        .then((c) => {
          c.present();
        });
    });
    return promise;
  }
  /**
   *  Metode per desconectar-te
   * */
  public logout() {
    //TODO  this.events.publish("user:logout");
  }
  /**
   * Presentar popup carregant
   * @param missatge
   */
  presentarCarregant(missatge: string): Promise<HTMLIonLoadingElement> {
    const loading = this.loadingCtrl.create({
      message: missatge,
      duration: 7000,
    });
    return loading;
  }
  /**
   * Metode per Preguntar si l'usuari està loginejat
   * */
  public isLogin(): boolean {
    return this.usuari != null;
  }
  /**
   * Metode per Preguntar si l'usuari te rol Junta
   * */
  public isJunta(): boolean {
    if (!this.usuari) return false;
    return (
      this.usuariBs.esRolJunta(this.usuari) ||
      this.usuariBs.esRolAdmin(this.usuari)
    );
  }
  /**
   * Metode per Preguntar si l'usuari te rol Tecnica
   * */
  public isTecnica(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolTecnica(this.usuari);
  }
  /**
   * Metode per Preguntar si l'usuari te rol Tecnic Nivell2
   * */
  public isTecnicaNivell2(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolTecnicaNivell2(this.usuari);
  }
  /**
   * Metode per Preguntar si l'usuari te rol Noticier
   * */
  public isNoticier(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolNoticier(this.usuari);
  }
  /**
   * Metode per Preguntar si l'usuari te rol Bar
   * */
  public isBar(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolBar(this.usuari);
  }
  /**
   * Metode per Preguntar si l'usuari te rol Organitzador
   * */
  public isOrganitzador(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolOrganitzador(this.usuari);
  }
  /**
   * Metode per Preguntar si l'usuari te rol Secretari
   * */
  public isSecretari(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolSecretari(this.usuari);
  }
  /**
   * Metode per Preguntar si l'usuari te rol Casteller
   * */
  public isCasteller(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolCasteller(this.usuari);
  }

  /**
   * Metode per Preguntar si l'usuari te rol Admin
   * */
  public isAdmin(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolAdmin(this.usuari);
  }
  /**
   * Metode per Preguntar si l'usuari te rol Camises
   * */
  public isCamises(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolCamises(this.usuari);
  }
  /**
   * Metode per Preguntar si l'usuari te rol Music
   * */
  public isMusic(): boolean {
    if (!this.usuari) return false;
    return (
      this.usuariBs.esRolCapMusic(this.usuari) ||
      this.usuariBs.esRolMusic(this.usuari)
    );
  }
  /**
   * Metode per Preguntar si l'usuari te rol Cap de musics
   * */
  public isCapMusic(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolCapMusic(this.usuari);
  }

  /**
   * Metode per Preguntar si l'usuari te rol Responsable Salud
   * */
  public isResponsableSalud(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolResponsableSalud(this.usuari);
  }

  /**
   * Metode per Preguntar si l'usuari te rol Tresore
   * */
  public isTresorer(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolTresorer(this.usuari);
  }

  /**
   * Metode per Preguntar si l'usuari te rol Confirmacio assistencia
   * */
  public isConfirmadorAssistencia(): boolean {
    if (!this.usuari) return false;
    return this.usuariBs.esRolConfirmadorAssistencia(this.usuari);
  }

  /**
   * Metode per Preguntar si l'usuari pot veure el modul d'administrador
   * */
  public potVeureAdministracio(): boolean {
    return (
      this.isJunta() ||
      this.isTecnica() ||
      this.isTecnicaNivell2() ||
      this.isSecretari() ||
      this.isResponsableSalud() ||
      this.isCapMusic() ||
      this.isCamises() ||
      this.isOrganitzador() ||
      this.isConfirmadorAssistencia()
    );
  }
  /**
   * Metode per saber si te treball en proces
   * */
  teUnTreballEnProcess(): boolean {
    return this.treballEnProces;
  }
}
