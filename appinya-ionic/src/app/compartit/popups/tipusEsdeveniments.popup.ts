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
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import {
  NavParams,
  ModalController,
  ToastController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { UsuariBs } from "src/app/business/Usuari.business";

import { StoreData } from "../../services/storage.data";
import { PopUpGeneric } from "../components/PopUpGeneric";

@Component({
  selector: "tipusEsdeveniments-popup",
  templateUrl: "tipusEsdeveniments.popup.html",
  styleUrls: ["./tipusEsdeveniments.popup.scss"],
})
export class TipusEsdevenimentPopUp extends PopUpGeneric implements OnInit {
  tipusEsdeveniment: Array<{
    Id: string;
    name: string;
    isChecked: boolean;
    icon: String;
  }> = [];
  @Input() tipusInclos: Array<any>;
  constructor(
    protected usuariBS: UsuariBs,
    protected toastCtrl: ToastController,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected route: Router,
    protected navParams: NavParams,
    protected storeData: StoreData,
    protected modalController: ModalController
  ) {
    super(
      usuariBS,
      route,
      modalController,
      toastCtrl,
      alertCtrl,
      loadingCtrl,
      storeData
    );
  }
  /**
   * Inicialitzador PopUp
   */
  ngOnInit() {
    this.tipusInclos = this.navParams.get("tipusInclos") || new Array();
    this.carregarTipusEsdeveniments();
  }
  async carregarTipusEsdeveniments() {
    const tipus = await this.storeData.obtenirTipusEsdeveniments();
    tipus.forEach((t) => {
      if (!this.tipusInclos || this.tipusInclos.length == 0)
        this.tipusEsdeveniment.push({
          Id: t.Id,
          name: t.Descripcio,
          isChecked: true,
          icon: t.Icona,
        });
      else {
        var excluded = this.tipusInclos.find((exclude) => {
          if (exclude.name === t.Descripcio) return true;
          else return false;
        });
        this.tipusEsdeveniment.push({
          Id: t.Id,
          name: t.Descripcio,
          isChecked: excluded,
          icon: t.Icona,
        });
      }
    });
  }
  resetFilters() {
    this.tipusEsdeveniment.forEach((track) => {
      track.isChecked = true;
    });
  }

  aplicarFilters() {
    let tipusInclos = this.tipusEsdeveniment.filter((c) => c.isChecked);
    this.modalController.dismiss(tipusInclos);
  }

  cancelar() {
    this.modalController.dismiss(null);
  }
}
