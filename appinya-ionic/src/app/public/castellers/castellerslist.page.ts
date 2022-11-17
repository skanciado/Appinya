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
} from "@ionic/angular";
import { OverlayEventDetail } from "@ionic/core";
import { StoreData } from "../../services/storage.data";
import {
  IAssistenciaModelList,
  ICastellerModel,
  IEntitatHelper,
  IEsdevenimentDetallModel,
} from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";

import { ActivatedRoute, Router } from "@angular/router";
import { PaginaLlista } from "src/app/compartit/components/PaginaLlista";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { DeviceService } from "src/app/services/device.service";
import { CarregantLogoComponent } from "src/app/compartit/components/carregantlogo.comp";
import { CastellersBs } from "src/app/business/casteller.business";
import { PosicionsPopUp } from "src/app/compartit/popups/posicions.popup";
import { AssistenciaBs } from "src/app/business/assistencia.business";
@Component({
  selector: "castellers-list",
  templateUrl: "castellerslist.page.html",
  styleUrls: ["./castellerslist.page.scss"],
})
export class CastellersListPage extends PaginaLlista implements OnInit {
  @ViewChild("textCerca") textCerca: any;
  @ViewChild("carregant") carregant: CarregantLogoComponent;
  bmostraCerca: boolean = false;
  queryText: string = "";
  posicionsFiltre: string[] = [];
  // grupsCastellers: Array<{ nom: string, icon: string, castellers: Casteller[] }> = [];

  constructor(
    protected usuariBs: UsuariBs,
    protected castellersBs: CastellersBs,
    protected assistenciaBs: AssistenciaBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected router: Router,
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
    //this.canviarCerca();
  }
  /**
   * Despres de incializar la part grafica
   */
  ngAfterViewInit() {
    this.bmostraCerca = false;
    this.carregant.carregarPromise(this.canviarCerca());
  }
  /**
   * Boto per mostar el textbox de cerca
   */
  mostrarCerca() {
    if (!this.bmostraCerca) {
      this.bmostraCerca = true;
      setTimeout(() => {
        this.textCerca.setFocus();
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
  async cercar(event) {
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
   * Obtenir/actualitzar Assistencia segons seleccio de usuari
   */
  private async obtenirElements(): Promise<ICastellerModel[]> {
    return this.castellersBs.obtenirCastellers(
      this.queryText,
      this.posicionsFiltre
    );
  }
  async exportarAssistenciaGlobalResum() {
    let t = await this.storeData.obtenirTemporada();
    this.assistenciaBs.exportarExcelAssistenciaGlobalResum(t.Id).then((t) => {
      this.presentarMissatge("Comprova els teus emails, ja tens l'excel", 3000);
    });
  }
  async exportarAssistenciaGlobalDetall() {
    let t = await this.storeData.obtenirTemporada();
    this.assistenciaBs.exportarExcelAssistenciaGlobalDetall(t.Id).then((t) => {
      this.presentarMissatge("Comprova els teus emails, ja tens l'excel", 3000);
    });
  }
  exportar() {
    this.castellersBs.exportarExcel().then((t) => {
      this.presentarMissatge("Comprova els teus emails, ja tens l'excel", 3000);
    });
  }
  /**
   * Canviar la cerca de Actuals a historics
   * */
  async canviarCerca() {
    this.iniciarLlista(await this.obtenirElements(), this.actualitar, null, 30);
  }
  /**
   * Presentar un PopUp de seleccio de tipus de castellers
   */
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
  /** Amar a detall Casteller */
  anarACastellerDet(casteller: ICastellerModel) {
    // go to the session detail page
    // and pass in the session data
    this.navegarAFitxaCasteller(casteller.Id);
  }
  addCasteller() {
    this.navegarAEditarCasteller("0");
  }
}
