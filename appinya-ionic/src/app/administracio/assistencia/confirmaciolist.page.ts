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
import { Router } from "@angular/router";
import { EsdevenimentBs } from "src/app/business/esdeveniments.business";
import { PaginaLlista } from "src/app/compartit/components/PaginaLlista";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { DeviceService } from "src/app/services/device.service";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { Constants } from "src/app/Constants";
@Component({
  selector: "confirmaciolist",
  templateUrl: "confirmaciolist.page.html",
  styleUrls: ["./confirmaciolist.page.scss"],
})
export class ConfirmacioListPage extends PaginaLlista implements OnInit {
  @ViewChild("textCerca") textCerca: any;
  bmostraCerca: boolean = false;
  dayIndex: number = 0;
  queryText: string = "";
  tipusCerca: string = "actual";
  tipusInclos: any[] = [];
  constructor(
    usuariBs: UsuariBs,
    protected esdevenimentBS: EsdevenimentBs,
    protected assistenciaBS: AssistenciaBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected router: Router,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    navCtrl: NavController,
    storeData: StoreData,
    protected device: DeviceService,
    toastCtrl: ToastController,
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
    this.tipusInclos = (
      await this.storeData.obtenirTipusEsdeveniments()
    ).filter((it) => {
      return this.assistenciaBS.potVisualitzarLlistaAssistenciaCompleta(it.Id);
    });
  }
  /**
   * Al entrar a la vista
   */
  ionViewDidEnter() {
    this.canviarCerca();
    this.actualitarPaquets();
  }
  /**
   * Metode actualitzacio
   * */
  async actualitarPaquets() {
    const r1 = await this.sincronitzacioDBBs.actualitzarPaquets();

    if (this.tipusCerca != "historic") {
      let lst = await await this.esdevenimentBS.obtenirEsdevenimentsActuals(
        this.queryText,
        this.tipusInclos
      );
      this.actualitzarLlistaAdvanced(lst);
    } else {
      let lst = await this.esdevenimentBS.obtenirEsdevenimentsHistorics(
        this.queryText,
        this.tipusInclos,
        0
      );
      this.actualitzarLlistaAdvanced(lst);
    }
  }
  public actualitzarLlistaAdvanced(llista: IEsdevenimentModel[]) {
    this.llistaTreball = llista;
    for (var i = 0; i < this.llistaItems.length; i++) {
      for (var x = 0; x < llista.length; x++) {
        if (this.llistaItems[i].Id == llista[x].Id) {
          this.llistaItems[i] = llista[x];
          break;
        }
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
  async paginacioActualFuncio(regIni: number): Promise<IEsdevenimentModel[]> {
    let online = await this.storeData.esOnline();
    if (online || this.llistaItems.length == 0)
      // Si es online o esta buit
      return await this.esdevenimentBS.obtenirEsdevenimentsActuals(
        this.queryText,
        this.tipusInclos
      );
    else return [];
  }
  /**
   * Canviar la cerca de Actuals a historics
   * */
  async canviarCerca() {
    this.llistaItems = [];
    if (this.tipusCerca != "historic") {
      this.iniciarLlista(
        await this.esdevenimentBS.obtenirEsdevenimentsActuals(
          this.queryText,
          this.tipusInclos
        ),
        this.actualitarPaquets,
        this.paginacioActualFuncio,
        Constants.PAGINACIO
      );
    } else {
      let date: Date = new Date();
      this.iniciarLlista(
        await this.esdevenimentBS.obtenirEsdevenimentsHistorics(
          this.queryText,
          this.tipusInclos,
          0
        ),
        this.actualitarPaquets,
        this.paginacioHistoricFuncio,
        Constants.PAGINACIO
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
}
