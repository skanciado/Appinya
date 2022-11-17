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
import { Component, ViewChild, OnInit, Input } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";
import {
  IAssistenciaModel,
  ICastellerModel,
  IEsdevenimentModel,
} from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Router } from "@angular/router";
import { EsdevenimentBs } from "src/app/business/Esdeveniments.business";
import { PaginaLlista } from "src/app/compartit/components/PaginaLlista";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { CastellersBs } from "src/app/business/casteller.business";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { Constants } from "src/app/Constants";
@Component({
  selector: "assistencia-list-casteller",
  templateUrl: "assistencia.list.comp.html",
  styleUrls: ["./assistencia.list.comp.scss"],
})
export class AssistenciaListComp extends PaginaLlista implements OnInit {
  @Input()
  casteller: ICastellerModel = null;
  llista: IAssistenciaModel[] = [];
  @Input()
  set llistat(llistat: IAssistenciaModel[]) {
    this.llista = llistat;
    this.carregarLlistat(llistat).then((t) => {
      this.iniciarLlista(this.llistaItems, this.f_actualitzacio, null, 10);
    });
  }
  constructor(
    protected usuariBs: UsuariBs,
    protected esdevenimentBS: EsdevenimentBs,
    protected assistenciaBS: AssistenciaBs,
    protected castellerBs: CastellersBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected router: Router,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    protected navCtrl: NavController,
    protected storeData: StoreData,
    protected toastCtrl: ToastController,
    protected activatedRoute: ActivatedRoute,
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
  }
  /**
   * Metode al entrar al formulari
   * */
  async ngOnInit() {}

  async f_actualitzacio() {
    let casOwn = await this.usuariBs.obtenirCasteller();
    let lst =
      this.casteller.Id != casOwn.Id
        ? await this.assistenciaBS.obtenirAssistenciaCasteller(
            this.casteller.Id
          )
        : await this.assistenciaBS.obtenirAssistenciaUsuari();

    await this.carregarLlistat(lst);
  }

  async carregarLlistat(lst: IAssistenciaModel[]) {
    this.llistaItems = [];

    lst.forEach(async (item) => {
      this.llistaItems.push({
        Casteller: await this.castellerBs.obtenirCasteller(item.Casteller),
        Esdeveniment: await this.esdevenimentBS.obtenirEsdeveniment(
          item.Esdeveniment
        ),
        Assistire: item.Assistire,
        ConfirmacioTecnica: item.ConfirmacioTecnica,
        DataModificacio: item.DataModificacio,
      });
    });
  }
  async veureDetall(id) {
    this.navegarAEsdeveniment(id);
  }

  veureAssistencia() {}
}
