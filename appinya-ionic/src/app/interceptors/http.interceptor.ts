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
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry, tap } from "rxjs/operators";
import {
  ErrorServidor,
  ErrorRefrescarCredencials,
  ErrorGeneric,
  ErrorLocalStore,
  ErrorSenseInternet,
} from "../entities/Errors";

/**
 * Interceptador de peticions HTTP per validar la comunicació
 */
export class HttpIntercept implements HttpInterceptor {
  constructor() {}
  /**
   * Metode interceptor d'errors
   * @param request
   * @param next
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let err = null;
        if (error.error instanceof ErrorEvent) {
          console.info("Error Event Actiu HttpInterceptor");
        }
        if (error.status == 200) {
          console.warn("Error Intern " + error.message);
          err = new ErrorGeneric(error.message);
        } else if (error.status == 401) {
          // No autoritzat
          console.warn("No té credencials http 401");
          err = new ErrorRefrescarCredencials();
        } else if (error.status >= 400 && error.status <= 499) {
          // Errores de Client HTTP 400
          console.warn("Error a la comunicació http " + error.status);
          err = new ErrorServidor(error.status, error.message);
        } else if (error.status >= 500 && error.status <= 599) {
          // Errores de servidor HTTP 500
          console.warn("Error al servidor http " + error.status);
          err = new ErrorServidor(error.status, error.message);
        } else {
          err = new ErrorSenseInternet("Sense Connexió");
        }

        return throwError(err);
      })
    );
  }
}
