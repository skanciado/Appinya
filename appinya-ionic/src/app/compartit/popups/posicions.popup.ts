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
  selector: "posicions-popup",
  templateUrl: "posicions.popup.html",
  styleUrls: ["./posicions.popup.scss"],
})
export class PosicionsPopUp extends PopUpGeneric {
  posicions: Array<{
    IdPosicio: string;
    name: string;
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
    let pinya: boolean = false;
    let canalla: boolean = false;
    let tronc: boolean = false;
    let musics: boolean = false;
    // passed in array of track names that should be excluded (unchecked)
    let posicionsIncloses: string[] =
      this.navParams.get("tipusInclos") || new Array();
    // detectamos si han seleccionado in agrupado
    posicionsIncloses.forEach((include) => {
      if (include == "991") canalla = true;
      if (include == "992") pinya = true;
      if (include == "993") tronc = true;
      if (include == "994") musics = true;
    });
    let tipusPosicions = await this.storeData.obtenirTipusPosicions();
    if (tipusPosicions.length > 0) {
      tipusPosicions.forEach((t) => {
        let idNum: number = Number(t.Id);
        let checked: boolean = false;
        if (t.Id == "0")
          this.posicions.push({
            IdPosicio: "991",
            name: "Canalla",
            isChecked: canalla,
            icon: "",
            class: "grup",
          });
        if (t.Id == "30")
          this.posicions.push({
            IdPosicio: "992",
            name: "Pinyes",
            isChecked: pinya,
            icon: "",
            class: "grup",
          });
        if (t.Id == "100")
          this.posicions.push({
            IdPosicio: "993",
            name: "Troncs",
            isChecked: tronc,
            icon: "",
            class: "grup",
          });
        if (t.Id == "400")
          this.posicions.push({
            IdPosicio: "994",
            name: "Músics",
            isChecked: musics,
            icon: "",
            class: "grup",
          });
        var include = posicionsIncloses.find((include) => {
          if (include == t.Id) return true;
          else return false;
        });
        checked = include != null;
        if (canalla && idNum <= 10) checked = true;
        if (pinya && idNum > 10 && idNum < 100) checked = true;
        if (tronc && idNum >= 100 && idNum < 300) checked = true;
        if (musics && idNum >= 400 && idNum < 500) checked = true;
        this.posicions.push({
          IdPosicio: t.Id,
          name: t.Descripcio,
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
  canviPosicio(posicio: any) {
    let pinya: boolean = false;
    let canalla: boolean = false;
    let tronc: boolean = false;
    let musics: boolean = false;
    if (posicio.IdPosicio == 991) canalla = true;
    if (posicio.IdPosicio == 992) pinya = true;
    if (posicio.IdPosicio == 993) tronc = true;
    if (posicio.IdPosicio == 994) musics = true;
    this.posicions.forEach((t) => {
      let idNum: number = Number(t.IdPosicio);
      let checked: boolean = false;
      if (canalla && idNum <= 10) t.isChecked = posicio.isChecked;
      if (pinya && idNum > 10 && idNum < 100) t.isChecked = posicio.isChecked;
      if (tronc && idNum >= 100 && idNum < 300) t.isChecked = posicio.isChecked;
      if (musics && idNum >= 400 && idNum < 500)
        t.isChecked = posicio.isChecked;
    });
  }
  aplicarFilters() {
    let includeTrackNames = this.posicions.filter((c) => c.isChecked);
    this.amagar(includeTrackNames.map((t) => t.IdPosicio));
  }
}
