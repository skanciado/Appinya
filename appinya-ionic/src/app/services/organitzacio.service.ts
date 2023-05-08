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
 * Classe responsable de les comunicacions de l organitzacio sobre el seu compte
 */
@Injectable({
  providedIn: "root",
})
export class OrganitzacioService extends RestService {
  constructor(
    http: HttpClient,
    store: StoreData,
    protected platform: Platform
  ) {
    super(http, store);
  }
  /**
   * Metode per a recupera Organitazcio
   */
  obtenirOrganitzacio(user: IUsuariSessio): Observable<IOrganitzacionModel[]> {
    let organitzacio$ = this.http.get<IOrganitzacionModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/organitzacio`,
      this.obtenirHeaders(user)
    );
    return organitzacio$;
  }

  /**
   * Metode per a recupera Organitazcio
   */
  eliminarCastellerOrganitzacio(
    cas: ICastellerModel,
    org: IOrganitzacionModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let organitzacio$ = this.http.delete<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/organitzacio`,
      this.obtenirHeaders(user, { Casteller: cas.Id, Organitzacio: org.Id })
    );
    return organitzacio$;
  }
  /**
   * Metode per a recupera Organitazcio
   */
  crearCastellerOrganitzacio(
    cas: ICastellerModel,
    org: IOrganitzacionModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidorAmbRetorn<IOrganitzacionModel>> {
    let organitzacio$ = this.http.put<
      IRespostaServidorAmbRetorn<IOrganitzacionModel>
    >(
      `${this.obtenirURLServidor()}/api/v1.0/organitzacio`,
      { Casteller: cas.Id, Organitzacio: org.Id },
      this.obtenirHeaders(user)
    );
    return organitzacio$;
  }
}
