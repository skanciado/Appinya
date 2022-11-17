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
import { CanDeactivate } from '@angular/router';
import { PaginaGenerica } from 'src/app/compartit/components/PaginaGenerica';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';



@Injectable({
    providedIn: 'root'
})
export class TreballEnProcesGuard implements CanDeactivate<PaginaGenerica> {
    component: PaginaGenerica;
    route: ActivatedRouteSnapshot;
    constructor(private _router: Router) {

    }

    canDeactivate(
        component: PaginaGenerica,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {

        let url: string = state.url;
        console.log('Url: ' + url);
        return !component.teUnTreballEnProcess();
    }
} 