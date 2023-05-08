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

import { Component, Input } from "@angular/core";
import { IEsdevenimentModel, INoticiaModel } from "../../entities/interfaces";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { NavController } from "@ionic/angular";
import { Constants } from "src/app/Constants";

/** Compoment de carregar una barra 0-100% */
@Component({
  templateUrl: "noticia.comp.html",
  selector: "noticia-detall",
  styleUrls: ["./noticia.comp.scss"],
  animations: [
    trigger("expand", [
      state("active", style({ height: "*" })),
      state("inactive", style({ height: "150px" })),
      transition("active <=> inactive", animate("900ms ease-in-out")),
      /*
 transition('inactive => active', animate(1000, keyframes([
        style({transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)', offset: .15}),
        style({transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)', offset: .30}),
        style({transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)', offset: .45}),
        style({transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)', offset: .60}),
        style({transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)', offset: .75}),
        style({transform: 'none', offset: 1}),
      ]))),
*/
    ]),
  ],
})
export class NoticiaComponent {
  _noticia: INoticiaModel | undefined;
  constructor(protected navCtrl: NavController) { }
  @Input("visioReduida")
  public visioReduida: boolean = false;
  public canExpand: boolean = false;
  public expand: string = "inactive";

  @Input("editar")
  public editar: boolean = false;
  get noticia(): INoticiaModel | undefined {
    // transform value for display
    return this._noticia;
  }

  @Input()
  set noticia(noticia: INoticiaModel | undefined) {
    this._noticia = noticia;
    this.expand = "inactive";
    this.canExpand = noticia?.Descripcio ? (noticia.Descripcio.length > 350) : false;
  }

  editarNoticia() {
    this.navCtrl.navigateForward(
      `${Constants.URL_NOTICIA_FITXA}/${this.noticia?.Id}`
    );
  }
  expandirNoticia() {
    this.expand = this.expand == "active" ? "inactive" : "active";
  }
  anarAUrl() {
    window.open(this.noticia?.Url, "_noticia");
  }
  anarAContacto() {
    window.open(`mailto:${this.noticia?.UsuariReferencia?.Email}`, "_noticia");
  }
}
