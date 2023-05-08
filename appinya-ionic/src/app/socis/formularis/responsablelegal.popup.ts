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
import { OverlayEventDetail } from "@ionic/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { DeviceService } from "src/app/services/device.service";
import { CastellersBs } from "src/app/business/casteller.business";
import { PopUpGeneric } from "src/app/compartit/components/PopUpGeneric";
import { CastellersPopUp } from "src/app/compartit/popups/castellers.popup";
import {
  ICastellerModel,
  IEntitatHelper,
  IResponsableLegalModel,
} from "src/app/entities/interfaces";
import { HelperService } from "src/app/services/helper.service";

@Component({
  selector: "responsablelegal-popup",
  templateUrl: "responsablelegal.popup.html",
  styleUrls: ["./responsablelegal.popup.scss"],
})
export class ResponsableLegalPopUp extends PopUpGeneric implements OnInit {
  casteller: ICastellerModel | null = null;
  responsable: IResponsableLegalModel | null = null;
  responsables: IResponsableLegalModel[] = [];
  formulariActiu: boolean = false;
  nou: boolean = false;
  relacions: IEntitatHelper[] = [];
  constructor(
    usuariBs: UsuariBs,
    protected castellerBs: CastellersBs,
    protected HelperService: HelperService,
    protected router: Router,
    protected navParams: NavParams,
    protected activatedRoute: ActivatedRoute,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    protected navCtrl: NavController,
    storeData: StoreData,
    protected device: DeviceService,
    toastCtrl: ToastController,
    modalController: ModalController
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
    this.relacions = await this.storeData.obtenirTipusRelacions();
    this.responsable = this.navParams.get("responsable") || {
      Nom: "",
      Cognoms: "",
      Email: "",
      IdCastellerResponsable: "",
      EsCasteller: false,
      IdCasteller: "",
      Telefon1: "",
      Telefon2: "",
      TipusResponsableId: "0",
      TipusResponsable: "",
    };
    this.nou = this.navParams.get("responsable") ? false : true;
    this.responsables = this.navParams.get("responsables");
    if (!this.nou) this.formulariActiu = true;
    else this.formulariActiu = false;
  }

  /**
   * Despres de incializar la part grafica
   */
  async ngAfterViewInit() {
    this.responsable = this.navParams.get("responsable");
    if (this.responsable?.IdCasteller) {
      this.casteller = await this.castellerBs.obtenirCasteller(
        this.responsable.IdCasteller
      );
    }
  }
  public guardar() {
    if (this.responsable?.TipusResponsableId == "0") {
      this.presentarMissatgeError("El tipus de responsable és obligatori");
    } else if (!this.responsable?.Nom) {
      this.presentarMissatgeError("El nom és obligatori");
    } else if (!this.responsable.Cognoms) {
      this.presentarMissatgeError("El cognom és obligatori");
    } else if (!this.responsable.Email) {
      this.presentarMissatgeError("L'email és obligatori");
    } else if (!this.responsable.Telefon1) {
      this.presentarMissatgeError("El telèfon és obligatori");
    } else if (this.nou) {
      let err: boolean = false;
      this.responsables.forEach((r) => {
        if (r.TipusResponsableId == this.responsable?.TipusResponsableId) {
          err = true;
        }
      });
      if (err) {
        this.presentarMissatgeError(
          "El Tipus de responsable ja està registrat"
        );
      } else {
        this.amagar(this.responsable);
      }
    } else {
      this.amagar(this.responsable);
    }
  }
  /**
   * Cancelar
   */
  public override cancelar() {
    this.modalController.dismiss(null);
  }
  /**
   * Obrir PopUp Castellers
   */
  public async obrirPopUpCastellers() {
    let modal = await this.modalCtrl.create({
      component: CastellersPopUp,
    });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        console.log("The result:", detail.data);
        this.formulariActiu = true;
        this.casteller = detail.data;
        if (this.casteller) {
          this.responsable = {
            Nom: this.casteller.Nom,
            Cognoms: this.casteller.Cognom,
            Email: this.casteller.Email,
            EsCasteller: true,
            IdCasteller: this.casteller.Id,
            IdCastellerResponsable: this.casteller.Id,
            Telefon1: this.casteller.Telefon1,
            Telefon2: this.casteller.Telefon2,
            TipusResponsableId: "0",
            TipusResponsable: "",
          };
        }
      } else {
        console.warn("No existe el casteller assignado")
      }
    });
    modal.present();
  }
  esborrarCasteller() {
    this.casteller = null;
    if (this.responsable) this.responsable.IdCasteller = "";
  }

  /**
   * Obrir Formulari
   */
  public obrirFormulari() {
    this.formulariActiu = true;
  }
}
