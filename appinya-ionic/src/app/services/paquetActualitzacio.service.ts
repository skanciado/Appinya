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


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map, timeout } from 'rxjs/operators'; 
import { IPaquetActualitzacio, IRespostaServidorAmbRetorn, ITemporadaModel, IUsuariSessio } from '../entities/interfaces';
import { RestService } from './RestBase.service'; 
import { StoreData } from './storage.data'; 
@Injectable({
  providedIn: 'root',
})
export class PaquetActualitzacioService extends RestService {

  constructor(
    http: HttpClient,
    store: StoreData ) {
        super(http, store);
    }
   
    /** 
   * Metode de REST per recollir les actualitzacions del servidor
   */
  obtenirPaquetActualitzacio(data: string, dadesCastellers: boolean, dadesJunta: boolean, dadesTecnica: boolean ,user:IUsuariSessio): Observable<IRespostaServidorAmbRetorn<IPaquetActualitzacio>> {
     
    let public$ = this.http.post<IRespostaServidorAmbRetorn<IPaquetActualitzacio>>(`${this.obtenirURLServidor()}/api/v1.0/paquetActualitzacio`, JSON.stringify({ Data: data, DadesCastellers: dadesCastellers, DadesJunta: dadesJunta, DadesTecnica: dadesTecnica }), this.obtenirHeaders(user)) 
    return public$; 
  }
   /** 
   * Metode de REST per recollir les actualitzacions del servidor
   */
  obtenirDataActualitzacio( user:IUsuariSessio): Observable<any> {
     
    let public$ =  this.http.get(`${this.obtenirURLServidor()}/api/v1.0/paquetActualitzacio/data`, this.obtenirHeaders(user))
     
    return public$; 
  }
}
