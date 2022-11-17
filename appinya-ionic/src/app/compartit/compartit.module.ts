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
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { TipusEsdevenimentPopUp } from "./popups/tipusEsdeveniments.popup";
import { HoraSenseUTC } from "./pipes/horaSenseUTC.pipe";
import { canviPerBr } from "./pipes/canviPerBr.pipe";
import { CarregantComponent } from "./components/carregant.comp";
import { EsdevenimentComponent } from "./components/esdeveniment.comp";
import { NoticiaComponent } from "./components/noticia.comp";
import { EsdevenimentBuitComponent } from "./components/esdevenimentbuit.comp";
import { CarregantLogoComponent } from "./components/carregantlogo.comp";
import { TemporadaPopUp } from "./popups/temporada.popup";
import { PosicionsPopUp } from "./popups/posicions.popup";
import { NoTrobatComponent } from "./components/notrobat.comp";
import { SenseConexioComponent } from "./components/senseconexio.comp";
import { RolsPopUp } from "./popups/rols.popup";
import { CastellersPopUp } from "./popups/castellers.popup";
import { TipusPreguntaPopUp } from "./popups/tipuspregunta.popup";
import { RatingComponent } from "./components/rating.comp";
import { PosicionsSelectPopUp } from "./popups/posicions.select.popup";
import { PrevisioAssistenciaPopUp } from "./popups/previsioAssistencia.popup";
import { NoticiaPopUp } from "./popups/noticia.popup";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule],
  exports: [
    TipusEsdevenimentPopUp,
    TemporadaPopUp,
    PosicionsPopUp,
    CastellersPopUp,
    TipusPreguntaPopUp,
    PosicionsSelectPopUp,
    NoticiaPopUp,
    RolsPopUp,
    HoraSenseUTC,
    canviPerBr,
    CommonModule,
    FormsModule,
    IonicModule,
    CarregantComponent,
    EsdevenimentComponent,
    PrevisioAssistenciaPopUp,
    NoticiaComponent,
    EsdevenimentBuitComponent,
    CarregantLogoComponent,
    NoTrobatComponent,
    SenseConexioComponent,
    RatingComponent,
  ],
  declarations: [
    TipusEsdevenimentPopUp,
    TipusPreguntaPopUp,
    TemporadaPopUp,
    NoticiaPopUp,
    RolsPopUp,
    PosicionsPopUp,
    CastellersPopUp,
    NoTrobatComponent,
    SenseConexioComponent,
    HoraSenseUTC,
    canviPerBr,
    CarregantComponent,
    EsdevenimentComponent,
    PrevisioAssistenciaPopUp,
    NoticiaComponent,
    EsdevenimentBuitComponent,
    CarregantLogoComponent,
    RatingComponent,
    PosicionsSelectPopUp,
  ],
  providers: [],
})
export class CompartitModule {}
