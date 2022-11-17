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
import { Observable } from "rxjs";
import { StoreData } from "./storage.data";
import { Platform } from "@ionic/angular";
import { RestService } from "./RestBase.service";
import { HttpClient } from "@angular/common/http";
import {
  ICastellerModel,
  IEstadisticaIndividualModel,
  IOrganitzacionModel,
  IRespostaServidor,
  IRespostaServidorAmbRetorn,
  ITemporadaModel,
  IUsuariModel,
  IUsuariSessio,
} from "../entities/interfaces";

/**
 * Classe responsable de les comunicacions d'administracio
 */
@Injectable({
  providedIn: "root",
})
export class AdministradorService extends RestService {
  constructor(
    protected http: HttpClient,
    protected store: StoreData,
    protected platform: Platform
  ) {
    super(http, store);
  }

  /**
   * Metode per a subplantar identitad
   */
  subplantarIdentidat(
    cas: ICastellerModel,
    user: IUsuariSessio
  ): Observable<IUsuariSessio> {
    let suplantar$ = this.http.get<IUsuariSessio>(
      `${this.obtenirURLServidor()}/api/v1.0/administrador/subplantar/${
        cas.Id
      }`,
      this.obtenirHeaders(user)
    );
    return suplantar$;
  }
}
