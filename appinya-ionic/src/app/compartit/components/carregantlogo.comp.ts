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
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  templateUrl: "carregantlogo.comp.html",
  selector: "carregant-logo",
  styleUrls: ["./carregantlogo.comp.scss"],
})
export class CarregantLogoComponent {
  informacio: String = "";
  percentatgeW: number = 0;
  @Output() onLoad = new EventEmitter<any>();
  tempsInterval: number = 500;
  @Input()
  set temps(temps: number) {
    this.tempsInterval = temps / (200 / 50);
  }
  interval: any;
  objecteResultat: any = null;
  direccio: boolean;
  constructor() {
    this.informacio = "";
    this.percentatgeW = 0;
    this.objecteResultat = null;
    this.direccio = true;
    this.interval = setInterval((t) => {
      if (this.percentatgeW >= 200 && this.objecteResultat != null) {
        clearInterval(this.interval);
        this.informacio = "Finalitzat";
        this.onLoad.emit(this.objecteResultat);
        return;
      }
      if (this.percentatgeW >= 200) {
        this.direccio = true;
      } else if (this.percentatgeW < 0) {
        this.direccio = false;
      }
      if (this.direccio) {
        this.percentatgeW -= 50;
      } else {
        this.percentatgeW += 50;
      }
    }, this.tempsInterval);
  }
  //@Input()
  /**
   * Funcio per carregar informacio de lpa pantalla
   * @param promesa Promesa de carrega de informacio
   * @param onload postfuncio despres de la carrega
   * @returns
   */
  public carregarPromise(promesa: Promise<any>, onload?: (a: any) => void) {
    if (promesa == null) {
      return;
    }
    if (onload) {
      this.onLoad.subscribe(onload);
    }
    this.informacio = "Carregant Informació";
    promesa.then((t) => {
      this.objecteResultat = t || "";
      this.informacio = "Informació Carregada";
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
