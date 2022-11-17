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

import { Component, ViewChild, OnInit } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  NavParams,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceService } from "src/app/services/device.service";
import { CastellersBs } from "src/app/business/casteller.business";
import { PopUpGeneric } from "src/app/compartit/components/PopUpGeneric";
import {
  IEntitatHelper,
  IEsdevenimentCastellModel,
} from "src/app/entities/interfaces";
import { HelperService } from "src/app/services/helper.service";
import { EsdevenimentBs } from "src/app/business/Esdeveniments.business";

@Component({
  selector: "castell-popup",
  templateUrl: "castell.popup.html",
  styleUrls: ["./castell.popup.scss"],
})
export class CastellPopUp extends PopUpGeneric implements OnInit {
  castell: IEsdevenimentCastellModel;
  idEsdeveniment: string;
  nou: boolean = false;
  tipuscastell: IEntitatHelper[] = [];
  tipusestat: IEntitatHelper[] = [];
  constructor(
    protected usuariBs: UsuariBs,
    protected esdevenimentBs: EsdevenimentBs,
    protected HelperService: HelperService,
    protected router: Router,
    protected navParams: NavParams,
    protected activatedRoute: ActivatedRoute,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    protected navCtrl: NavController,
    protected storeData: StoreData,
    protected device: DeviceService,
    protected toastCtrl: ToastController,
    protected modalController: ModalController
  ) {
    super(
      usuariBs,
      router,
      modalController,
      toastCtrl,
      alertCtrl,
      loadingCtrl,
      storeData
    );
  }

  /**
   * Metode al entrar al formulari
   * */
  async ngOnInit() {
    this.tipuscastell = await this.storeData.obtenirTipusCastell();
    this.tipusestat = await this.storeData.obtenirTipusEstatCastell();
    this.idEsdeveniment = this.navParams.get("idEsdeveniment");
    this.castell = this.navParams.get("castell") || {
      Id: 0,
      Data: new Date(),
      IdEsdeveniment: this.idEsdeveniment,
      IdEstatCastell: "0",
      IdTipusCastell: "0",
      Ordre: 1,
      Prova: false,
      Xarxa: false,
      Observacions: "",
    };
    if (this.castell != null) {
      let tipus = this.tipuscastell.findIndex(
        (t) => t.Id == this.castell.IdTipusCastell
      );
      if (tipus >= 0) {
        this.castell.Prova = false;
      } else {
        this.castell.Prova = true;
        this.tipuscastell = await this.storeData.obtenirTipusProves();
      }
    }
  }
  async canviarTipusCastell() {
    this.castell.IdTipusCastell = "0";
    if (this.castell.Prova === true) {
      this.tipuscastell = await this.storeData.obtenirTipusProves();
    } else {
      this.tipuscastell = await this.storeData.obtenirTipusCastell();
      this.castell.Xarxa = false;
    }
  }
  /**
   * Despres de incializar la part grafica
   */
  async ngAfterViewInit() {}
  public async guardar() {
    if (this.castell.IdTipusCastell == "0") {
      this.presentarMissatgeError("El tipus de castell és obligatori");
    } else if (!this.castell.IdEstatCastell) {
      this.presentarMissatgeError("L'estat del castell és obligatori");
    } else {
      const loading = await this.loadingCtrl.create({
        message: "Guardant castell ",
        duration: 10000,
      });
      await loading.present();
      let p1 = await this.esdevenimentBs.DesarCastell(this.castell);

      if (!p1.Correcte) {
        this.presentarMissatgeError(p1.Missatge);
        loading.dismiss();
        return;
      } else {
        this.amagar(p1.Retorn);
      }
      loading.dismiss();
    }
  }
  /**
   * Cancelar
   */
  public cancelar() {
    this.modalController.dismiss(null);
  }
}
