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
import { ICastellerModel } from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";
import { OverlayEventDetail } from "@ionic/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PaginaLlista } from "src/app/compartit/components/PaginaLlista";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { DeviceService } from "src/app/services/device.service";
import { CarregantLogoComponent } from "src/app/compartit/components/carregantlogo.comp";
import { PosicionsPopUp } from "src/app/compartit/popups/posicions.popup";
import { CastellersBs } from "src/app/business/casteller.business";

@Component({
  selector: "castellers-popup",
  templateUrl: "castellers.popup.html",
  styleUrls: ["./castellers.popup.scss"],
})
export class CastellersPopUp extends PaginaLlista implements OnInit {
  @ViewChild("textCerca") textCercaComponent: any;
  @ViewChild("carregant") carregant: CarregantLogoComponent;
  bmostraCerca: boolean = false;
  queryText: string = "";
  posicionsFiltre: string[] = [];
  idCasteller: string;

  constructor(
    protected usuariBs: UsuariBs,
    protected castellerBs: CastellersBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
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
      navCtrl,
      toastCtrl,
      alertCtrl,
      loadingCtrl,
      storeData
    );
    this.bmostraCerca = false;
  }

  /**
   * Metode al entrar al formulari
   * */
  async ngOnInit() {
    this.bmostraCerca = false;
    this.idCasteller = this.navParams.get("idCasteller");
  }

  /**
   * Despres de incializar la part grafica
   */
  ngAfterViewInit() {
    this.bmostraCerca = false;
    this.idCasteller = this.navParams.get("idCasteller");
    //this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.carregant.carregarPromise(this.canviarCerca());
  }

  /**
   * Boto per mostar el textbox de cerca
   */
  mostrarCerca() {
    if (!this.bmostraCerca) {
      this.bmostraCerca = true;
      setTimeout(() => {
        this.textCercaComponent.setFocus();
      }, 150);
    } else {
      if (this.queryText != "") {
        this.queryText = "";
        this.canviarCerca();
        this.bmostraCerca = false;
      }
    }
  }

  /**
   * Amagar la cerca
   */
  amagarCerca() {
    if (this.queryText == "") this.bmostraCerca = false;
  }

  /**
   * Cerca de text
   * @param event
   */
  async cercarText(event) {
    if (this.queryText.length != 0 && this.queryText.length < 3) return;
    this.actualitzarLlista(await this.obtenirElements());
  }

  /**
   * Metode actualitzacio
   * */
  async actualitar() {
    const r1 = await this.sincronitzacioDBBs.actualitzarPaquets();
    this.actualitzarLlista(await this.obtenirElements());
  }

  /**
   *
   */
  public async canviarTipusParticipants() {
    this.actualitzarLlista(await this.obtenirElements());
  }

  /**
   * Obtenir/actualitzar Assistencia segons seleccio de usuari
   */
  private async obtenirElements(): Promise<ICastellerModel[]> {
    return this.castellerBs.obtenirCastellers(
      this.queryText,
      this.posicionsFiltre
    );
  }

  /**
   * Canviar la cerca de Actuals a historics
   * */
  async canviarCerca() {
    this.iniciarLlista(await this.obtenirElements(), this.actualitar, null, 20);
  }
  /**
   * Metode de Presentacio de PopUp de filtres
   * */
  async presentFilter() {
    let modal = await this.modalCtrl.create({
      component: PosicionsPopUp,
      componentProps: { tipusInclos: this.posicionsFiltre },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        console.log("The result:", detail.data);
        this.posicionsFiltre = detail.data;
        this.actualitzarLlista(await this.obtenirElements());
      }
    });
    modal.present();
  }

  /**
   * Amar a detall Casteller
   * @param casteller
   */
  anarACastellerDet(casteller: ICastellerModel) {
    // go to the session detail page
    // and pass in the session data
    this.modalController.dismiss(casteller);
  }
  /**
   * Cancelar
   */
  public cancelar() {
    this.modalController.dismiss(null);
  }
}
