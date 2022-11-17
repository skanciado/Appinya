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

import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  ActionSheetController,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Router } from "@angular/router";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { DeviceService } from "src/app/services/device.service";

import { OverlayEventDetail } from "@ionic/core";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";
import {
  ICastellerModel,
  IEntitatHelper,
  IPosicioModel,
} from "src/app/entities/interfaces";

import { Storage } from "@ionic/storage";
import { CastellersBs } from "src/app/business/casteller.business";
import { HelperService } from "src/app/services/helper.service";

import { environment } from "src/environments/environment";
import { PosicionsPopUp } from "src/app/compartit/popups/posicions.popup";
import { PosicionsSelectPopUp } from "src/app/compartit/popups/posicions.select.popup";
import { TecnicsBs } from "src/app/business/tecnics.business";

@Component({
  selector: "casteller-tecnica-edit",
  templateUrl: "casteller.tecnica.edit.html",
  styleUrls: ["./casteller.tecnica.edit.scss"],
})
export class CastellerTecEditPage extends PaginaNavegacio implements OnInit {
  constructor(
    protected usuariBs: UsuariBs,
    protected castellerBs: CastellersBs,
    protected tecnicsBs: TecnicsBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected router: Router,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    protected navCtrl: NavController,
    protected storeData: StoreData,
    protected storage: Storage,
    protected device: DeviceService,
    protected toastCtrl: ToastController,
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute,
    protected helperService: HelperService,
    protected actionSheetController: ActionSheetController
  ) {
    super(
      usuariBs,
      router,
      navCtrl,
      toastCtrl,
      alertCtrl,
      loadingCtrl,
      storeData
    );
  }
  public id: string;
  public esWeb: boolean = false;
  public casteller: ICastellerModel;
  public urlFoto: string =
    environment.UrlServidor + "/api/v1.0/castellers/fotos";
  /**
   *
   */
  async ngOnInit() {
    this.esWeb = this.device.esEntornWeb();
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.casteller = await this.castellerBs.obtenirCasteller(this.id);
    if (this.casteller.Posicions)
      this.casteller.Posicions.sort((a, b) =>
        a.Experiencia != null && a.Experiencia > b.Experiencia ? -1 : 1
      );
    console.info("Id Casteller Tecnic: " + this.casteller.Id);
    if (!this.casteller.DadesTecniques) {
      this.casteller.DadesTecniques = {
        Alcada: 0,
        Bracos: 0,
        Espatlla: 0,
        Pes: 20,
        Observacions: "",
      };
    }
  }
  async ionViewDidEnter() {}

  /**
   * Confirmar Formulari
   * @returns
   */
  async onSubmit() {
    if (!this.device.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    let r = await this.tecnicsBs.desaDadesTecnics(this.casteller);
    if (r.Correcte) {
      await this.sincronitzacioDBBs.actualitzarPaquets();
      this.navegarAEnrera();
    } else {
      this.presentarMissatge(r.Missatge, 3000);
    }
  }
  canviExperiencia(pos: IPosicioModel, event) {
    pos.Experiencia = event;
    console.info(event);
  }
  cancelar() {
    this.navegarAEnrera();
  }
  async obrirPosicions() {
    let modal = await this.modalCtrl.create({
      component: PosicionsSelectPopUp,
      componentProps: {
        posicionsIncloses: this.casteller.Posicions,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        // Esborrar
        this.casteller.Posicions.forEach((p1, index) => {
          let elem = detail.data.find((a) => {
            return a.IdPosicio === p1.IdPosicio;
          });
          if (!elem) {
            delete this.casteller.Posicions[index];
          }
        });
        //Agregar
        detail.data.forEach((p1, index) => {
          let elem = this.casteller.Posicions.find((a) => {
            return a.IdPosicio === p1.IdPosicio;
          });
          if (!elem)
            this.casteller.Posicions.push({
              IdPosicio: p1.IdPosicio,
              Descripcio: p1.Descripcio,
              Experiencia: 100,
            });
        });
      }
    });
    modal.present();
  }
}
