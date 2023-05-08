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

import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { CompartitModule } from "../compartit/compartit.module";
import { EditorModule } from "primeng/editor";
import { CalendarModule } from "primeng/calendar";
import { ConfirmacioListPage } from "./assistencia/confirmaciolist.page";
import { OrganizationChartModule } from "primeng/organizationchart";
import { ChartModule } from "primeng/chart";
import { ToggleButtonModule } from "primeng/togglebutton";
import { PasarLlistaPage } from "./assistencia/pasarllista.page";

import { AutenticacioGuard } from "../guards/Autenticacio.guard";
import { UsuariBs } from "../business/Usuari.business";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "assistencia",
  },
  {
    path: "assistencia",
    component: ConfirmacioListPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [
        UsuariBs.Rol_junta.Id,
        UsuariBs.Rol_admin.Id,
        UsuariBs.Rol_capmusics.Id,
        UsuariBs.Rol_organitzador.Id,
        UsuariBs.Rol_confirmador_assistencia.Id,
      ],
    },
  },
  {
    path: "pasarllista/:id",
    component: PasarLlistaPage,
    canActivate: [AutenticacioGuard],
    data: {
      roles: [
        UsuariBs.Rol_junta.Id,
        UsuariBs.Rol_admin.Id,
        UsuariBs.Rol_capmusics.Id,
        UsuariBs.Rol_organitzador.Id,
        UsuariBs.Rol_confirmador_assistencia.Id,
      ],
    },
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
    ChartModule,
    ChartModule,
    RouterModule.forChild(routes),
    CompartitModule,
    OrganizationChartModule,
    EditorModule,
    ToggleButtonModule,
  ],
  exports: [RouterModule],
  declarations: [ConfirmacioListPage, PasarLlistaPage],
})
export class AdministracioModule { }
