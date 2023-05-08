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
import { Component, Input } from "@angular/core";
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { EsdevenimentBs } from "src/app/business/esdeveniments.business";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { UsuariBs } from "src/app/business/Usuari.business";
import { Constants } from "src/app/Constants";
import { ErrorSenseInternet } from "src/app/entities/Errors";
import { DeviceService } from "src/app/services/device.service";
import { EventService } from "src/app/services/event.service";
import { StoreData } from "src/app/services/storage.data";
import { IEsdevenimentModel } from "../../entities/interfaces";
import { PaginaGenerica } from "./PaginaGenerica";

@Component({
  templateUrl: "esdeveniment.comp.html",
  selector: "esdeveniment-detall",
  styleUrls: ["./esdeveniment.comp.scss"],
})
export class EsdevenimentComponent extends PaginaGenerica {
  @Input("esdeveniment")
  public esdeveniment: IEsdevenimentModel | undefined;
  @Input("enabled")
  public enabled: boolean = true;
  historic: any;
  constructor(
    protected usuariBS: UsuariBs,
    protected toastCtlr: ToastController,
    protected alertCtlr: AlertController,
    toastCtrl: ToastController,
    loadingCtrl: LoadingController,
    protected navCtrl: NavController,
    protected esdevenimentBs: EsdevenimentBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected assistenciaBs: AssistenciaBs,
    protected eventService: EventService,
    protected deviceService: DeviceService,
    storeData: StoreData
  ) {
    super(usuariBS, toastCtlr, alertCtlr, loadingCtrl, storeData);
  }
  /**
   * Boto Assistiré
   * @param ass
   */
  async assistire(ass: boolean) {
    if (!this.enabled) {
      this.presentarMissatge("Esdeveniment no actiu", 3000);
      return;
    }
    if (!this.esdeveniment) {
      this.presentarMissatge("Esdeveniment no actiu ", 3000);
      return;
    }
    let last = this.esdeveniment?.Assistire;
    if (!this.deviceService.teConexio()) {
      this.presentarMissatgeSenseConexio();
      return;
    }

    this.esdeveniment.Assistire = ass ? true : false;
    this.assistenciaBs
      .confirmarAssistenciaPersonal(
        this.esdeveniment.Id,
        this.esdeveniment.Assistire
      )
      .then(async (t) => {
        if (t.Correcte) {
          if (!this.esdeveniment) {
            console.warn("Esdeveniment no actiu ");
            return;
          }
          // si es correcte actualitzem paquet
          this.esdeveniment.Assistire = ass ? true : false;
          this.sincronitzacioDBBs.actualitzarPaquets().then(async (t) => {
            // canviem el valor de l'assistencia
            if (!this.esdeveniment) {
              console.warn("Esdeveniment no actiu ");
              return;
            }
            this.esdeveniment = await this.esdevenimentBs.obtenirEsdeveniment(
              this.esdeveniment?.Id
            );
          });
        } else {
          if (!this.esdeveniment) {
            this.presentarMissatge("Esdeveniment no actiu ", 3000);
            return;
          }
          this.esdeveniment.Assistire = last;
          let toast = await this.toastCtrl.create({
            message: t.Missatge,
            cssClass: "toastError",
            duration: 2000,
          });
          toast.present();
        }
        console.log("Enviat al servidor " + this.esdeveniment.Assistire);
      })
      .catch(async (er) => {
        if (this.esdeveniment) {
          this.esdeveniment.Assistire = last;
        }
        if (er instanceof ErrorSenseInternet)
          this.eventService.enviarEventSenseConexio();
        else {
          let toast = await this.toastCtrl.create({
            message: "No s'ha actualitzat la informació",
            cssClass: "toastError",
            duration: 2000,
            // showCloseButton: true,
            // closeButtonText: 'Ok'
          });
          toast.present();
        }
      });
  }
  canviPestanya(event: any) {
    console.log("Segment changed", event);
  }
  /**
   * Veure detall del esdeveniment
   */
  async veuredetall() {
    this.navCtrl.navigateForward(`${Constants.URL_ESDEVENIMENT_DET}/${this.esdeveniment?.Id}`);
  }
}
