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
import { catchError, tap, map, timeout } from 'rxjs/operators';
import { StoreData } from './storage.data';
import { environment } from 'src/environments/environment';
import { ErrorServidor, ErrorSenseInternet, ErrorRefrescarCredencials } from '../entities/Errors'; 
import { IRespostaServidorAmbRetorn, IUsuariSessio } from '../entities/interfaces';


/** 
 * Abstraccion del servicio para gestionar metodo comunmente llamados
 */
@Injectable({
    providedIn: 'root',
})
export class RestService {

    constructor(
        protected http: HttpClient,
        protected store: StoreData) {

    }

    /**
    * Obtenir caçalera per HTTP 
    * @param body 
    */
    protected obtenirHeaders(user?:IUsuariSessio, body?: any, contextType?: string ) {
        let headers = new HttpHeaders();
        headers=headers.append('Accept-Language', "ca");
        headers=headers.append("Content-Type", (contextType) ? contextType : 'application/json');
         
        if (user)
        headers=headers.append('Authorization', 'Bearer ' + user.Token);

        let options = (body) ? { headers: headers, body: body } : { headers: headers };
        return options;

    }

    /**
     * Carga las cabeceras sin la variable Authenication
     */
    protected obtenirHeaderSenseAutentificacio() {

        let headers = new HttpHeaders();
        headers=headers.append('Accept-Language', "ca");
        headers=headers.append("Content-Type", 'application/json');
        let options = { headers: headers };
        return options;
    }

    /**
     * Obtenir Capçaleras de Refresh
     */
    protected obtenirHeaderRefresh(user:IUsuariSessio) {
        let headers = new HttpHeaders();
        headers=headers.append('Accept-Language', "ca");
        headers=headers.append("Content-Type", 'application/json');
        if (user)
        headers=headers.append('Authorization', 'Bearer ' + user.RefreshToken);

        let options = { headers: headers };
        return options;

    }

    /**
    * Metodo Login
    * @param user
    * @param pass
    */
    public login(user: String, pass: String): Observable<IUsuariSessio> {

        return this.http.post<IUsuariSessio>(`${this.obtenirURLServidor()}/api/v1.0/autenticacio/validar`, { "Usuari": user, "Contrasenya": pass } as IUsuariSessio, this.obtenirHeaderSenseAutentificacio())
            ;
    }
    /**
    * Metodo Login
    * @param user
    * @param pass
    */
    public jwt(jwt: String): Observable< IRespostaServidorAmbRetorn <IUsuariSessio>> {

        return this.http.post<IRespostaServidorAmbRetorn<IUsuariSessio>>(`${this.obtenirURLServidor()}/api/v1.0/autenticacio/jwt`, { "value": jwt} , this.obtenirHeaderSenseAutentificacio())
            ;
    }
    /** 
     Metodo Refresh Token
     */
    public refreshToken(usr:IUsuariSessio): Observable<IUsuariSessio> { 
        return this.http.get<IUsuariSessio>(`${this.obtenirURLServidorAutentificacio()}/api/v1.0/autenticacio/token/refrescar`, this.obtenirHeaderRefresh(usr));
    }
    echo() {
        let echo$ = this.http.get(`${this.obtenirURLServidor()}/api/v1.0/autenticacio/echo`, { responseType: 'text' })

        return echo$;
    }
    /**
     * Obtenir la URL del servidor que es conecta el client
     */
    public obtenirURLServidor(): string {
        return environment.UrlServidor
    }
    /**
     * Obtenir URL del servidor
     */
    public obtenirURLServidorAutentificacio(): string {
        return environment.UrlServidorAutentificacion;
    }
} 
