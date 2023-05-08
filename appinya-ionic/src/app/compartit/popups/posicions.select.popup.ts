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
import { IPosicioModel } from "src/app/entities/interfaces";

import { StoreData } from "../../services/storage.data";
import { PopUpGeneric } from "../components/PopUpGeneric";

@Component({
  selector: "posicions-select-popup",
  templateUrl: "posicions.select.popup.html",
  styleUrls: ["./posicions.select.popup.scss"],
})
export class PosicionsSelectPopUp extends PopUpGeneric {
  posicions: Array<{
    IdPosicio: string;
    Descripcio: string;
    isChecked: boolean;
    icon: String;
    class: string;
  }> = [];

  constructor(
    usuariBS: UsuariBs,
    toastCtrl: ToastController,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    route: Router,
    protected navParams: NavParams,
    storeData: StoreData,
    modalController: ModalController
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
   * Inicialitzador de PopUp
   */
  async ngOnInit() {
    // passed in array of track names that should be excluded (unchecked)
    let posicionsIncloses: IPosicioModel[] =
      this.navParams.get("posicionsIncloses") || new Array();
    // detectamos si han seleccionado in agrupado

    let tipusPosicions = await this.storeData.obtenirTipusPosicions();
    if (tipusPosicions.length > 0) {
      tipusPosicions.forEach((t) => {
        let checked: boolean = false;

        var include = posicionsIncloses.find((include) => {
          if (include.IdPosicio == t.Id) return true;
          else return false;
        });

        if (include) {
          checked = true;
        }
        this.posicions.push({
          IdPosicio: t.Id,
          Descripcio: t.Descripcio,
          isChecked: checked,
          icon: t.Icona,
          class: "normal",
        });
      });
    }
  }

  resetFilters() {
    this.posicions.forEach((track) => {
      track.isChecked = true;
    });
  }

  aplicarFilters() {
    let includeTrackNames = this.posicions.filter((c) => c.isChecked);
    this.amagar(includeTrackNames.map((t) => t));
  }
}
