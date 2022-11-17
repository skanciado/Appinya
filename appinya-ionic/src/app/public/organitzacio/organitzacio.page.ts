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

import { Component, ViewChild, OnInit } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";

import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Router } from "@angular/router";
import { NoticiesBs } from "src/app/business/Noticies.business";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";

import { OverlayEventDetail } from "@ionic/core";
import { OrganitzacioService } from "src/app/services/organitzacio.service";
import { TreeNode } from "primeng/api";
import {
  ICastellerModel,
  IOrganitzacionModel,
} from "src/app/entities/interfaces";
import { environment } from "src/environments/environment";
import { CastellersPopUp } from "src/app/compartit/popups/castellers.popup";

@Component({
  selector: "organitzacio-page",
  templateUrl: "organitzacio.page.html",
  styleUrls: ["./organitzacio.page.scss"],
})
export class OrganitzacioPage extends PaginaNavegacio implements OnInit {
  constructor(
    protected usuariBs: UsuariBs,
    protected organitzacioService: OrganitzacioService,
    protected router: Router,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    protected navCtrl: NavController,
    protected storeData: StoreData,
    protected activatedRoute: ActivatedRoute,
    protected toastCtrl: ToastController
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
  data: TreeNode[];
  selectedNode: TreeNode;
  /**
   *
   * @param o
   * @returns
   */
  construirArbre(o: IOrganitzacionModel): TreeNode {
    let root: TreeNode = {
      label: o.Descripcio,
      type: o.Castellers.length > 0 ? "person" : "empty",
      styleClass: "p-person",
      expanded: o.Castellers.length > 0,
      data: { Castellers: o.Castellers, Organitzacio: o },
    };

    if (o.SubOrganitzacio && o.SubOrganitzacio.length > 0) {
      o.SubOrganitzacio.forEach((c) => {
        if (!root.children) root.children = [];
        if (this.isAdmin() || this.isJunta() || c.Castellers.length > 0) {
          root.children.push(this.construirArbre(c));
        }
      });
    }
    return root;
  }
  /**
   *
   */
  async ngOnInit() {
    let user = await this.storeData.obtenirUsuariSession();
    this.organitzacioService.obtenirOrganitzacio(user).subscribe((org) => {
      this.data = [];
      org.forEach((or) => this.data.push(this.construirArbre(or)));
    });
  }
  async seleccion(cas: ICastellerModel, org: IOrganitzacionModel) {
    if (this.isAdmin() || this.isJunta()) {
      let modal = await this.modalCtrl.create({
        component: CastellersPopUp,
        componentProps: {
          rols: this.usuari.Rols,
        },
      });
      await modal.present();
      modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
        let user = await this.storeData.obtenirUsuariSession();
        if (detail && detail.data) {
          const loading = await this.loadingCtrl.create({
            message: "Enviant canvi ",
            duration: 10000,
          });
          await loading.present();

          if (cas != null) {
            let p1 = await this.organitzacioService
              .eliminarCastellerOrganitzacio(cas, org, user)
              .toPromise();
            if (!p1.Correcte) {
              this.presentarMissatgeError(p1.Missatge);
              loading.dismiss();
              return;
            }
          }
          let p2 = await this.organitzacioService
            .crearCastellerOrganitzacio(detail.data, org, user)
            .toPromise();
          if (p2.Correcte) {
            this.ngOnInit();
          } else {
            this.presentarMissatgeError(p2.Missatge);
          }
          loading.dismiss();
        }
      });
    }
  }
}
