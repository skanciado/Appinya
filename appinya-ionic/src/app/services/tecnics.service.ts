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
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap, map, timeout } from "rxjs/operators";
import { StoreData } from "./storage.data";
import { RestService } from "./RestBase.service";
import {
  ICastellerDetallModel,
  ICastellerModel,
  IRespostaServidor,
  IUsuariSessio,
} from "../entities/interfaces";
@Injectable({
  providedIn: "root",
})
export class TecnicsService extends RestService {
  constructor(protected http: HttpClient, protected store: StoreData) {
    super(http, store);
  }

  /**
   * Metode de REST per a obtenir el detall de les dades tecniques del Casteller
   */
  desarDadesTecniques(
    casteller: ICastellerModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let esdeveniments$ = this.http.post<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/tecnics/casteller`,
      JSON.stringify(casteller),
      this.obtenirHeaders(user)
    );

    return esdeveniments$;
  }
  /**
   * Metode de REST per a obtenir el detall de les dades tecniques del Casteller
   */
  cercarDadesTecniques(
    casteller: ICastellerModel,
    user: IUsuariSessio
  ): Observable<ICastellerDetallModel> {
    let esdeveniments$ = this.http.get<ICastellerDetallModel>(
      `${this.obtenirURLServidor()}/api/v1.0/tecnics/casteller/${casteller.Id}`,
      this.obtenirHeaders(user)
    );

    return esdeveniments$;
  }
}
