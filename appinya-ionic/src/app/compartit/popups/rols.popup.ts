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
  selector: "rols-popup",
  templateUrl: "rols.popup.html",
  styleUrls: ["./rols.popup.scss"],
})
export class RolsPopUp extends PopUpGeneric implements OnInit {
  rols: Array<{
    Id: string;
    Descripcio: string;
    Checked: boolean;
    Icon: String;
  }> = [];
  @Input() rolsSeleccionats: Array<any>;
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
    this.rolsSeleccionats = this.navParams.get("rols") || new Array();
    this.rols = [];
    this.usuariBs.obtenirRols().forEach((rol) => {
      this.rols.push({
        Id: rol.Id,
        Checked: false,
        Descripcio: rol.Descripcio,
        Icon: rol.Icon,
      });
    });
    this.rols.forEach((rol) => {
      rol.Checked = this.rolsSeleccionats.find((x) => {
        if (x === rol.Id) return true;
        else return false;
      });
    });
  }

  resetFilters() {
    this.rols.forEach((track) => {
      track.Checked = true;
    });
  }

  aplicarFilters() {
    let rols = this.rols.filter((c) => c.Checked);
    let rolsStr: string[] = [];
    rols.forEach((rol) => rolsStr.push(rol.Id));
    this.modalController.dismiss(rolsStr);
  }

  cancelar() {
    this.modalController.dismiss(null);
  }
}
