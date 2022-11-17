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
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule, CanActivate } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { AccesPage } from "./acces/acces.page";
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { AgendaListPage } from "./agenda/agendalist.page";
import { CompartitModule } from "../compartit/compartit.module";
import { InicialitzarPage } from "./inicialitzacio/inicialitzar.page";
import { AutenticacioGuard } from "../guards/Autenticacio.guard";
import { UsuariBs } from "../business/Usuari.business";
import { DesconectarPage } from "./desconectar/desconectar.page";
import { EsdevenimentPage } from "./esdeveniment/esdeveniment.page";
import { EditorModule } from "primeng/editor";
import { AlbumsPage } from "./albums/albums.page";
import { LoginPage } from "./login/login.page";
import { InfoPage } from "./dispositiu/info.page";
import { BustiaPage } from "./bustia/bustia.page";
import { HomePage } from "./home/home.page";
import { NoticiesPage } from "./noticies/noticies.page";
import { TipusEsdevenimentPopUp } from "../compartit/popups/tipusEsdeveniments.popup";
import { AgendaPage } from "./agenda/agenda.page";
import { OptimitzarPage } from "./inicialitzacio/optimitzar.page";
import { TreballEnProcesGuard } from "../guards/TreballEnProces.guard";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarModule } from "primeng/calendar";
import { OrganitzacioPage } from "./organitzacio/organitzacio.page";
import { OrganizationChartModule } from "primeng/organizationchart";
import { ChartModule } from "primeng/chart";
import { ToggleButtonModule } from "primeng/togglebutton";
import { GoogleMapsModule } from "@angular/google-maps";
import { AssistenciaEsdevenimentComponent } from "./esdeveniment/assistencia.esdeveniment.comp";
import { AssistenciaFormComponent } from "./esdeveniment/assistenciaForm.comp";
import { AssistenciaCastellersPopUp } from "./assistencia/assistenciaCastellers.popup";
import { CastellersListPage } from "./castellers/castellerslist.page";
import { PosicionsPopUp } from "../compartit/popups/posicions.popup";
import { AssistenciaCastellerGrupPopUp } from "./assistencia/assistenciaCastellersGrup.popup";
import { LogComponent } from "./esdeveniment/log.comp";
import { EsdevenimentCastellComponent } from "./esdeveniment/esdeveniment.castell.comp";
import { OpcionsPage } from "./usuari/opcions.page";
import { CastellerPage } from "./casteller/casteller.page";
import { FitxaPage } from "./usuari/fitxa.page";

import { TemporadaPopUp } from "../compartit/popups/temporada.popup";
import { NoticiaEditPage } from "./formularis/noticia.edit.page";
import { AlbumEditPage } from "./formularis/album.edit.page";
import { EsdevenimentEditPage } from "./formularis/esdeveniment.edit";
import { CastellerEditPage } from "./formularis/casteller.edit";
import { ResponsableLegalPopUp } from "./formularis/responsablelegal.popup";
import { CastellerTecEditPage } from "./formularis/casteller.tecnica.edit";
import { IncidenciaPage } from "./incidencia/incidencia.page";
import { CastellPopUp } from "./esdeveniment/castell.popup";
import { PerdrePasswordPage } from "./login/perdrepassword.page";
import { AssistenciaPage } from "./casteller/assistencia.page";
import { AssistenciaListComp } from "./casteller/assistencia.list.comp";
import { AssistenciaPopUp } from "./assistencia/assistencia.popup";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // a plugin!

import timeGridPlugin from "@fullcalendar/timegrid";
FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
]);
const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home",
  },
  {
    path: "home",
    component: HomePage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "noticies",
    component: NoticiesPage,
    canActivate: [AutenticacioGuard],
  },
  {
    path: "opcions",
    component: OpcionsPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "casteller/:id",
    component: CastellerPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },

  {
    path: "casteller/assistencia/:id",
    component: AssistenciaPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "organitzacio",
    component: OrganitzacioPage,
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "acces",
    component: AccesPage,
  },
  {
    path: "login",
    component: LoginPage,
  },
  {
    path: "perdrepassword",
    component: PerdrePasswordPage,
  },
  {
    path: "desconectar",
    component: DesconectarPage,
  },
  {
    path: "inicialitzar",
    component: InicialitzarPage,
  },
  {
    path: "agendalist",
    component: AgendaListPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "fitxa",
    component: FitxaPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "agenda",
    component: AgendaPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },

  {
    path: "albums",
    component: AlbumsPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "optimitzar",
    component: OptimitzarPage,
    canActivate: [AutenticacioGuard],
    canDeactivate: [TreballEnProcesGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "bustia",
    component: BustiaPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "incidencia",
    component: IncidenciaPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "dispositiu",
    component: InfoPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "esdeveniment/:id",
    component: EsdevenimentPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "formularis/noticia/:id",
    component: NoticiaEditPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [
        UsuariBs.Rol_junta,
        UsuariBs.Rol_noticier,
        UsuariBs.Rol_admin,
        UsuariBs.Rol_secretari,
        UsuariBs.Rol_bar,
        UsuariBs.Rol_organitzador,
      ],
    },
  },
  {
    path: "formularis/casteller/:id",
    component: CastellerEditPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [UsuariBs.Rol_junta, UsuariBs.Rol_admin, UsuariBs.Rol_secretari],
    },
  },
  {
    path: "formularis/castellertecnic/:id",
    component: CastellerTecEditPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [
        UsuariBs.Rol_junta,
        UsuariBs.Rol_admin,
        UsuariBs.Rol_secretari,
        UsuariBs.Rol_tecnic,
        ,
        UsuariBs.Rol_tecnic_nivell_2,
      ],
    },
  },

  {
    path: "formularis/esdeveniment/:id",
    component: EsdevenimentEditPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [
        UsuariBs.Rol_junta,
        UsuariBs.Rol_admin,
        UsuariBs.Rol_secretari,
        UsuariBs.Rol_noticier,
        UsuariBs.Rol_bar,
        UsuariBs.Rol_organitzador,
        UsuariBs.Rol_capmusics,
      ],
    },
  },
  {
    path: "formularis/album/:id",
    component: AlbumEditPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [UsuariBs.Rol_junta, UsuariBs.Rol_noticier, UsuariBs.Rol_admin],
    },
  },
  {
    path: "castellers",
    component: CastellersListPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    HttpClientModule,
    CalendarModule,
    FullCalendarModule,
    ChartModule,
    RouterModule.forChild(routes),
    CompartitModule,
    GoogleMapsModule,
    OrganizationChartModule,
    EditorModule,
    ToggleButtonModule,
  ],
  exports: [RouterModule],
  declarations: [
    OpcionsPage,
    AssistenciaPopUp,
    NoticiesPage,
    OptimitzarPage,
    LogComponent,
    AssistenciaEsdevenimentComponent,
    AssistenciaFormComponent,
    EsdevenimentCastellComponent,
    FitxaPage,
    HomePage,
    BustiaPage,
    LoginPage,
    InfoPage,
    AccesPage,
    AgendaPage,
    AgendaListPage,
    InicialitzarPage,
    DesconectarPage,
    EsdevenimentPage,
    AlbumsPage,
    OrganitzacioPage,
    AssistenciaCastellersPopUp,
    ResponsableLegalPopUp,
    AssistenciaCastellerGrupPopUp,
    CastellPopUp,
    CastellersListPage,
    NoticiaEditPage,
    CastellerEditPage,
    EsdevenimentEditPage,
    AlbumEditPage,
    CastellerPage,
    CastellerTecEditPage,
    IncidenciaPage,
    PerdrePasswordPage,
    AssistenciaPage,
    AssistenciaListComp,
  ],
  entryComponents: [
    TipusEsdevenimentPopUp,
    CastellPopUp,
    PosicionsPopUp,
    TemporadaPopUp,
    AssistenciaCastellerGrupPopUp,
    ResponsableLegalPopUp,
    AssistenciaCastellersPopUp,
  ],
})
export class PublicModule {}
