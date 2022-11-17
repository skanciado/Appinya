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
import { Observable } from "rxjs";
import { RestService } from "./RestBase.service";
import { StoreData } from "./storage.data";

import {
  IAssistenciaModel,
  IEsdevenimentModel,
  IEstadisticaIndividualModel,
  IRespostaServidor,
  IUsuariSessio,
} from "../entities/interfaces";

/**
 * Classe responsable de les accions de l usuari sobre el seu compte
 */
@Injectable({
  providedIn: "root",
})
export class AssistenciaService extends RestService {
  constructor(protected http: HttpClient, protected store: StoreData) {
    super(http, store);
  }
  /**
   * Confirmarcio d'assistencia
   * @param assis Array d'assistencia
   */
  confirmarAssistencia(
    assis: IAssistenciaModel[],
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let assistencia$ = this.http.put<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/assistencia`,
      assis,
      this.obtenirHeaders(user)
    );
    return assistencia$;
  }
  /**
   * Metode de REST per a obtenir el detall de l esdeveniment
   */
  obtenirAssistenciaEsdevenimentPerUsuari(
    idEsdeveniment: String,
    user: IUsuariSessio
  ): Observable<IAssistenciaModel[]> {
    let assistencia$ = this.http.get<IAssistenciaModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/assistencia/${idEsdeveniment}`,
      this.obtenirHeaders(user)
    );
    return assistencia$;
  }
  /**
   * Obtenir assistencia d'un usuari
   * */
  obtenirAssistenciaEsdeveniment(
    idEsdeveniment: String,
    user: IUsuariSessio
  ): Observable<IAssistenciaModel[]> {
    let assistencia$ = this.http.get<IAssistenciaModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/assistencia/detall/${idEsdeveniment}`,
      this.obtenirHeaders(user)
    );
    return assistencia$;
  }
  /**
   * Obtenir l'assistencia d'un casteller (pensat per tecnics)
   * @param idCasteller idCasteller
   */
  obtenirAssistenciaCasteller(
    user: IUsuariSessio
  ): Observable<IAssistenciaModel[]> {
    let assistencia$ = this.http.get<IAssistenciaModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/assistencia/casteller`,
      this.obtenirHeaders(user)
    );
    return assistencia$;
  }
  /**
   * Obtenir l'assistencia d'un casteller (pensat per tecnics)
   * @param idCasteller idCasteller
   */
  obtenirAssistenciaCastellerPerIdCasteller(
    idCasteller: string,
    user: IUsuariSessio
  ): Observable<IAssistenciaModel[]> {
    let assistencia$ = this.http.get<IAssistenciaModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/assistencia/casteller/${idCasteller}`,
      this.obtenirHeaders(user)
    );
    return assistencia$;
  }
  /**
   * Confirmació tecnica de la assitencia
   * @param esdeve idEsdeveniment
   * @param assis array d'assistencia
   * @param loading
   */
  confirmacioTecnica(
    idEsdeveniment: String,
    assis: IAssistenciaModel[],
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let assistencia$ = this.http.post<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/assistencia/confirmacio`,
      JSON.stringify({ EsdevenimentId: idEsdeveniment, LstAssistencia: assis }),
      this.obtenirHeaders(user)
    );
    return assistencia$;
  }
  /**
   * Previsio tecnica de la assitencia
   * @param esdeve idEsdeveniment
   * @param assis array d'assistencia
   * @param loading
   */
  previsioTecnica(
    idEsdeveniment: String,
    assis: IAssistenciaModel[],
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let assistencia$ = this.http.post<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/assistencia/previsio`,
      JSON.stringify({ EsdevenimentId: idEsdeveniment, LstAssistencia: assis }),
      this.obtenirHeaders(user)
    );
    return assistencia$;
  }
  /**
   * Obtenir estadistica del casteller (per tecnics)
   * @param idCasteller idCasteller
   * @param loading
   */
  obtenirEstadistica(
    idCasteller: String,
    user: IUsuariSessio
  ): Observable<IEstadisticaIndividualModel[]> {
    let assistencia$ = this.http.get<IEstadisticaIndividualModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/assistencia/estadistica/${idCasteller}`,
      this.obtenirHeaders(user)
    );
    return assistencia$;
  }

  /**
   * Enviar la exportacio global de l assistencia Detall
   * @param idTemporada idTemporada
   */
  enviarCorreuExportacioAssistenciaGlobalDetall(
    idTemporada: number,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let r$ = this.http.get<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/assistencia/export/global/${idTemporada}`,
      this.obtenirHeaders(user)
    );
    return r$;
  }
  /**
   * Enviar la exportacio global de l assistencia Resum
   * @param idTemporada idTemporada
   */
  enviarCorreuExportacioAssistenciaGlobalResum(
    idTemporada: number,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let r$ = this.http.get<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/assistencia/export/resum/${idTemporada}`,
      this.obtenirHeaders(user)
    );
    return r$;
  }
  /**
   * Enviar la exportació de la assitencia per esdeveniment
   * @param idEsdeveniment
   */
  enviarCorreuExportacio(
    idEsdeveniment: string,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let r$ = this.http.get<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/assistencia/export/${idEsdeveniment}`,
      this.obtenirHeaders(user)
    );
    return r$;
  }
}
