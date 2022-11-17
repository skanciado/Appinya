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

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import {
  INoticiaModel,
  IRespostaServidor,
  IRespostaServidorAmbRetorn,
  ITemporadaModel,
  IUsuariSessio,
} from "../entities/interfaces";
import { RestService } from "./RestBase.service";
import { StoreData } from "./storage.data";
@Injectable({
  providedIn: "root",
})
export class NoticiesService extends RestService {
  constructor(protected http: HttpClient, protected store: StoreData) {
    super(http, store);
  }

  /**
   * Obtenir Noticies Historic
   * @param reg
   * @param excludeTypes
   * @param loading
   */
  obtenirHistoric(
    reg: number,
    excludeTypes: string,
    user: IUsuariSessio
  ): Observable<INoticiaModel[]> {
    let public$ = this.http.post<INoticiaModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/noticies/historiques`,
      JSON.stringify({
        RegIni: reg,
        Text: null,
        Opcions: excludeTypes,
      }),
      this.obtenirHeaders(user)
    );

    return public$;
  }

  /**
   * Obtenir Noticies Actuals
   * @param reg
   * @param excludeTypes
   * @param loading
   */
  obtenirActuals(
    reg: number,
    excludeTypes: string,
    user: IUsuariSessio
  ): Observable<INoticiaModel[]> {
    let public$ = this.http.post<INoticiaModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/noticies/actuals`,
      JSON.stringify({
        RegIni: reg,
        Text: null,
        Opcions: excludeTypes,
      }),
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Obtenir Noticia per Id
   * @param id
   * @param user
   * @returns
   */
  obtenirNoticia(id: string, user: IUsuariSessio): Observable<INoticiaModel> {
    let public$ = this.http.get<INoticiaModel>(
      `${this.obtenirURLServidor()}/api/v1.0/noticies/${id}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Obtenir totes les noticies
   * @param user
   * @returns
   */
  obtenirNoticies(user: IUsuariSessio): Observable<INoticiaModel[]> {
    let public$ = this.http.get<INoticiaModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/noticies/cercar`,
      this.obtenirHeaders(user)
    );

    return public$;
  }

  /**
   * Metodo de REST para crear o modificar noticia
   */
  desarNoticia(
    not: INoticiaModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidorAmbRetorn<INoticiaModel>> {
    let public$ = this.http.post<IRespostaServidorAmbRetorn<INoticiaModel>>(
      `${this.obtenirURLServidor()}/api/v1.0/noticies`,
      JSON.stringify(not),
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Metodo de REST para esborrar noticia
   */
  esborrarNoticia(
    not: INoticiaModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let public$ = this.http.delete<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/noticies/${not.Id}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
}
