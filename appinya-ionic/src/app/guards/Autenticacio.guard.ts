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
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { StoreData } from "../services/storage.data";
import { UsuariBs } from "../business/Usuari.business";
import { Constants } from "../Constants";
import { EventService } from "../services/event.service";
@Injectable({
  providedIn: "root",
})
/**
 * Control de permisos de les pàgines
 */
export class AutenticacioGuard implements CanActivate {
  constructor(
    protected storeData: StoreData,
    protected usuariBs: UsuariBs,
    protected router: Router,
    protected eventService: EventService
  ) { }

  /**
   * Metode evaluador dels permisos
   * @param next
   * @param state
   */
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const roles: string[] = next.data["roles"];
    console.info("Control Permisos: " + next.url);
    let usr = await this.storeData.obtenirUsuari();
    if (!usr) {
      console.info("No té permisos " + next.url);
      this.router.navigate([Constants.URL_ACCES]);
      this.eventService.enviarEventCredebcials("No te usuari en la sessió")
    }

    if (roles && roles.length > 0) {
      for (const rol of roles) {
        if (this.usuariBs.esRol(rol, usr)) return true;
      }
      console.info("No té permisos " + next.url);
      this.router.navigate([Constants.URL_ACCES]);
      this.eventService.enviarEventCredebcials(`No te permisos per accedir a /${next.url}`)
      return false;
    } else return true;
  }
}
