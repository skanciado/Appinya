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

import { Injectable } from "@angular/core";
import {
  ToastController,
  AlertController,
  LoadingController,
  ModalController,
} from "@ionic/angular";

import { PaginaGenerica } from "./PaginaGenerica";
import { Router } from "@angular/router";
import { UsuariBs } from "src/app/business/Usuari.business";
import { StoreData } from "src/app/services/storage.data";

@Injectable()
export class PopUpGeneric extends PaginaGenerica {
  constructor(
    protected usuariBS: UsuariBs,
    protected route: Router,
    protected modalController: ModalController,
    toastCtrl: ToastController,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    storeData: StoreData
  ) {
    super(usuariBS, toastCtrl, alertCtrl, loadingCtrl, storeData);
  }
  /**
   * Amagar PopUp
   */
  public amagar(valors?: any) {
    this.modalController.dismiss(valors);
  }
  /**
   * Amagar PopUp
   */
  public cancelar() {
    this.modalController.dismiss(null);
  }
}
