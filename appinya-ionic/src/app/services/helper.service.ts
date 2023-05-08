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
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs'; 
import { RestService } from './RestBase.service'; 
import { StoreData } from './storage.data';
import { IEntitatHelper, ITipusBasicsActualitzacio, IUsuariSessio } from '../entities/interfaces'; 
@Injectable({
  providedIn: 'root',
})
export class HelperService extends RestService{
    
  constructor(
    http: HttpClient,
    store: StoreData ) {
        super(http, store);
    }
   
    /**
    * Metode de REST per a obtenir llista de Municipis
    */
    obtenirLlistaMunicipis(id: String,user:IUsuariSessio): Observable<IEntitatHelper[]> {
        
      let municipis$ = this.http.get<IEntitatHelper[]>(`${this.obtenirURLServidor()}/api/v1.0/tipusBasics/municipis/${id}`, this.obtenirHeaders(user))
      
      return municipis$; 
    } 
    /**
    * Metode de REST per a obtenir llista de Provincies 
    */
    obtenirLlistaProvincies(user:IUsuariSessio): Observable<IEntitatHelper[]> {
       
      let municipis$ = this.http.get<IEntitatHelper[]>(`${this.obtenirURLServidor()}/api/v1.0/tipusBasics/provincies` , this.obtenirHeaders(user))
        
      return municipis$;
        
    }
    /**
     * Obtenir els tipus basics de la app.
     */
    obtenirTipusBasics(user:IUsuariSessio): Observable<ITipusBasicsActualitzacio> {
      
      let municipis$ = this.http.get<ITipusBasicsActualitzacio>(`${this.obtenirURLServidor()}/api/v1.0/tipusBasics`, this.obtenirHeaders(user))
    
      return municipis$;
     
    }
    
}


 
