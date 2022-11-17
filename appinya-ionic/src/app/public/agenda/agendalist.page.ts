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
import { StoreData } from "../../services/storage.data";
import { IEsdevenimentModel } from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";
import { TipusEsdevenimentPopUp } from "src/app/compartit/popups/tipusEsdeveniments.popup";
import { OverlayEventDetail } from "@ionic/core";
import { Data, Route, Router } from "@angular/router";
import { EsdevenimentBs } from "src/app/business/Esdeveniments.business";
import { PaginaLlista } from "src/app/compartit/components/PaginaLlista";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { DeviceService } from "src/app/services/device.service";
@Component({
  selector: "agendalist",
  templateUrl: "agendalist.page.html",
  styleUrls: ["./agendalist.page.scss"],
})
export class AgendaListPage extends PaginaLlista implements OnInit {
  @ViewChild("textCerca") textCerca: any;
  bmostraCerca: boolean = false;
  dayIndex: number = 0;
  queryText: string = "";
  tipusCerca: string = "actual";
  tipusInclos: any[] = [];
  confDate: string;
  tipusVista: string = "perDia";
  historic: boolean = false;
  constructor(
    protected usuariBs: UsuariBs,
    protected esdevenimentBS: EsdevenimentBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected router: Router,
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
    console.info("Entrar en Agenda List");
  }

  ionViewDidEnter() {
    this.sincronitzacioDBBs
      .actualitzarPaquets()
      .then((t) => {
        this.canviarCerca();
      })
      .catch((e) => {
        console.error("Error" + e);
        this.canviarCerca();
      });
  }
  /**
   * Metode actualitzacio
   * */
  async actualitarPaquets() {
    const r1 = await this.sincronitzacioDBBs.actualitzarPaquets();
    await this.esdevenimentBS.actualitzarEsdevenimentsActuals();
    this.canviarCerca();
    /*
    if (this.tipusCerca != "historic") {
      let lst = await await this.esdevenimentBS.obtenirEsdevenimentsActuals(
        this.queryText,
        this.tipusInclos,
        0
      );
      this.actualitzarLlistaAdvanced(lst);
    } else {
      let lst = await this.esdevenimentBS.obtenirEsdevenimentsHistorics(
        this.queryText,
        this.tipusInclos,
        0
      );
      this.actualitzarLlistaAdvanced(lst);
    }*/
  }
  /**
   * Per actualitzar la vista amb les noves dades
   * @param llista
   */
  public actualitzarLlistaAdvanced(llista: IEsdevenimentModel[]) {
    this.llistaTreball = llista;
    for (var i = 0; i < this.llistaItems.length; i++) {
      if (llista.length > i) {
        this.llistaItems[i] = llista[i];
      } else {
        this.llistaItems.splice(i, 1);
      }
    }
    if (
      this.llistaItems.length < 10 &&
      this.llistaTreball.length > this.llistaItems.length
    ) {
      for (var i = this.llistaItems.length; i < llista.length; i++) {
        this.llistaItems.push(llista[i]);
      }
    }
  }
  /**
   * Paginacio nomes si es OnLine
   * @param regIni
   */
  async paginacioHistoricFuncio(regIni: number) {
    return this.esdevenimentBS.obtenirEsdevenimentsHistorics(
      this.queryText,
      this.tipusInclos,
      regIni
    );
  }
  /**
   * Paginacio nomes si es OnLine
   * @param regIni
   */
  async paginacioActualFuncio(regIni: number) {
    let online = await this.storeData.esOnline();
    if (online || this.llistaItems.length == 0)
      // Si es online o esta buit
      return await this.esdevenimentBS.obtenirEsdevenimentsActuals(
        this.queryText,
        this.tipusInclos,
        regIni
      );
  }
  /**
   * Canviar la cerca de Actuals a historics
   * */
  async canviarCerca() {
    this.llistaItems = [];
    if (this.tipusCerca != "historic") {
      this.historic = false;
      this.iniciarLlista(
        [],
        this.actualitarPaquets,
        this.paginacioActualFuncio,
        10
      );
    } else {
      this.historic = true;
      let date: Date = new Date();
      this.iniciarLlista(
        [],
        this.actualitarPaquets,
        this.paginacioHistoricFuncio,
        10
      );
    }
  }

  /**
   * Esdeveniment de cerca
   * @param ev
   */
  async cercarEsdeveniments(ev: any) {
    let onLine = await this.storeData.esOnline();
    if (this.queryText.length != 0 && this.queryText.length < 5) return;
    this.canviarCerca();
  }

  /**
   * Metode de Presentacio de PopUp de filtres
   * */
  async presentFilter() {
    let modal = await this.modalCtrl.create({
      component: TipusEsdevenimentPopUp,
      componentProps: { tipusInclos: this.tipusInclos },
    });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        console.log("The result:", detail.data);
        this.tipusInclos = detail.data;
        this.canviarCerca();
      }
    });
    modal.present();
  }

  /**
   * Metode per mostrar Cercar
   * */
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
   * Si el text es buit amargar cercar en la ToolBar
   * */
  amagarCerca() {
    if (this.queryText == "") this.bmostraCerca = false;
    this.canviarCerca();
  }
  /**
   * Pot Crear esdeveniments
   */
  potCrear(): boolean {
    return true; // this.esdevenimentBS.potEditar(null);
  }
  /**
   * Anar calendari
   */
  canviVista() {
    this.navCtrl.navigateRoot(`public/agenda`);
  }
  nouEsdeveniment(): void {
    this.navCtrl.navigateRoot(`public/formularis/esdeveniment/0`);
  }
}
