/**
 *  Appinya Open Source Project
 *  Copyright (C) 2023  Daniel Horta Vidal
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

import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { CompartitModule } from "../compartit/compartit.module";
import { AutenticacioGuard } from "../guards/Autenticacio.guard";
import { UsuariBs } from "../business/Usuari.business";
import { EditorModule } from "primeng/editor";
import { TipusEsdevenimentPopUp } from "../compartit/popups/tipusEsdeveniments.popup";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarModule } from "primeng/calendar";
import { OrganizationChartModule } from "primeng/organizationchart";
import { ChartModule } from "primeng/chart";
import { ToggleButtonModule } from "primeng/togglebutton";
import { GoogleMapsModule } from "@angular/google-maps";
import { ResponsableLegalPopUp } from "./formularis/responsablelegal.popup";
import { TemporadaPopUp } from "../compartit/popups/temporada.popup";
import { HomePage } from "./home/home.page";
import { Camera } from "@awesome-cordova-plugins/camera/ngx";
import { AppVersion } from "@awesome-cordova-plugins/app-version/ngx";
import { LoginPage } from "./login/login.page";
import { IncidenciaPage } from "./incidencia/incidencia.page";
import { PerdrePasswordPage } from "./login/perdrepassword.page";
import { DesconectarPage } from "./desconectar/desconectar.page";
import { InicialitzarPage } from "./inicialitzacio/inicialitzar.page";
import { AccesPage } from "./acces/acces.page";
import { OpcionsPage } from "./usuari/opcions.page";
import { BustiaPage } from "./bustia/bustia.page";
import { InfoPage } from "./dispositiu/info.page";
import { AgendaListPage } from "./agenda/agendalist.page";
import { AlbumsPage } from "./albums/albums.page";
import { NoticiesPage } from "./noticies/noticies.page";
import { CastellersListPage } from "./castellers/castellerslist.page";
import { CastellerPage } from "./casteller/casteller.page";
import { CastellerTecEditPage } from "./formularis/casteller.tecnica.edit";
import { CastellerEditPage } from "./formularis/casteller.edit";
import { NoticiaEditPage } from "./formularis/noticia.edit.page";
import { FitxaPage } from "./usuari/fitxa.page";
import { OptimitzarPage } from "./inicialitzacio/optimitzar.page";
import { AgendaPage } from "./agenda/agenda.page";
import { AlbumEditPage } from "./formularis/album.edit.page";

/*import { AssistenciaPage } from "./casteller/assistencia.page";*/
import { AssistenciaListComp } from "./casteller/assistencia.list.comp";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EsdevenimentEditPage } from "./formularis/esdeveniment.edit";
import { EsdevenimentPage } from "./esdeveniment/esdeveniment.page";
import { AssistenciaPage } from "./casteller/assistencia.page";
import { AssistenciaFormComponent } from "./esdeveniment/assistenciaForm.comp";
import { AssistenciaEsdevenimentComponent } from "./esdeveniment/assistencia.esdeveniment.comp";
import { LogComponent } from "./esdeveniment/log.comp";
import { AssistenciaCastellersPopUp } from "./assistencia/assistenciaCastellers.popup";
import { AssistenciaCastellerGrupPopUp } from "./assistencia/assistenciaCastellersGrup.popup";
import { EsdevenimentCastellComponent } from "./esdeveniment/esdeveniment.castell.comp";
import { CastellPopUp } from "./esdeveniment/castell.popup";
import { OrganitzacioPage } from "./organitzacio/organitzacio.page";
import { AssistenciaPopUp } from "./assistencia/assistencia.popup";
import { TreballEnProcesGuard } from "../guards/TreballEnProces.guard";
;
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
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "opcions",
    component: OpcionsPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "fitxa",
    component: FitxaPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "incidencia",
    component: IncidenciaPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "albums",
    component: AlbumsPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "noticies",
    component: NoticiesPage,
    canActivate: [AutenticacioGuard],
  },
  {
    path: "agendalist",
    component: AgendaListPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "agenda",
    component: AgendaPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "optimitzar",
    component: OptimitzarPage,
    canActivate: [AutenticacioGuard],
    canDeactivate: [TreballEnProcesGuard],
    data: { roles: [UsuariBs.Rol_casteller] },
  },
  {
    path: "soci/:id",
    component: CastellerPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "socis",
    component: CastellersListPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "bustia",
    component: BustiaPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "dispositiu",
    component: InfoPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "formularis/noticia/:id",
    component: NoticiaEditPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [
        UsuariBs.Rol_junta.Id,
        UsuariBs.Rol_noticier.Id,
        UsuariBs.Rol_admin.Id,
        UsuariBs.Rol_secretari.Id,
        UsuariBs.Rol_bar.Id,
        UsuariBs.Rol_organitzador.Id,
      ],
    },
  },
  {
    path: "formularis/soci/:id",
    component: CastellerEditPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [
        UsuariBs.Rol_junta.Id,
        UsuariBs.Rol_admin.Id,
        UsuariBs.Rol_secretari.Id
      ],
    },
  },
  {
    path: "formularis/socitecnic/:id",
    component: CastellerTecEditPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [
        UsuariBs.Rol_junta.Id,
        UsuariBs.Rol_admin.Id,
        UsuariBs.Rol_secretari.Id,
        UsuariBs.Rol_tecnic.Id,
        UsuariBs.Rol_tecnic_nivell_2.Id,
      ],
    },
  },
  {
    path: "soci/assistencia/:id",
    component: AssistenciaPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "organitzacio",
    component: OrganitzacioPage,
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "esdeveniment/:id",
    component: EsdevenimentPage,
    canActivate: [AutenticacioGuard],
    data: { roles: [UsuariBs.Rol_casteller.Id] },
  },
  {
    path: "formularis/esdeveniment/:id",
    component: EsdevenimentEditPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [
        UsuariBs.Rol_junta.Id,
        UsuariBs.Rol_admin.Id,
        UsuariBs.Rol_secretari.Id,
        UsuariBs.Rol_noticier.Id,
        UsuariBs.Rol_bar.Id,
        UsuariBs.Rol_organitzador.Id,
        UsuariBs.Rol_capmusics.Id,
      ],
    },
  },
  {
    path: "formularis/album/:id",
    component: AlbumEditPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [
        UsuariBs.Rol_junta.Id,
        UsuariBs.Rol_noticier.Id,
        UsuariBs.Rol_admin.Id
      ],
    },
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
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    HttpClientModule,
    EditorModule,
    RouterModule.forChild(routes),
    CompartitModule,
    GoogleMapsModule,
    FullCalendarModule,
    OrganizationChartModule,
    ToggleButtonModule,
    ChartModule,

  ], providers: [
    Camera,
    AppVersion
  ],
  exports: [RouterModule],
  declarations: [
    HomePage,
    AccesPage,
    InicialitzarPage,
    DesconectarPage,
    LoginPage,
    FitxaPage,
    OpcionsPage,
    IncidenciaPage,
    ResponsableLegalPopUp,
    EsdevenimentPage,
    AssistenciaPage,
    AssistenciaFormComponent,
    AssistenciaEsdevenimentComponent,
    LogComponent,
    AssistenciaCastellersPopUp,
    AssistenciaCastellerGrupPopUp,
    EsdevenimentCastellComponent,
    CastellPopUp,
    OrganitzacioPage,
    AssistenciaPopUp,
    NoticiesPage,
    OptimitzarPage,
    BustiaPage,
    InfoPage,
    AgendaPage,
    AgendaListPage,
    AlbumsPage,
    CastellersListPage,
    NoticiaEditPage,
    CastellerEditPage,
    EsdevenimentEditPage,
    AlbumEditPage,
    CastellerPage,
    CastellerTecEditPage,
    PerdrePasswordPage,
    AssistenciaPage,
    //AssistenciaPage,
    AssistenciaListComp,
  ],
  entryComponents: [
    TipusEsdevenimentPopUp,
    TemporadaPopUp,
  ],
})
export class SocisModule { }
