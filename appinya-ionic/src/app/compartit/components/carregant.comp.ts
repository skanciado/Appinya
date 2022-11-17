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
import { Component, Input } from '@angular/core';

/** Compoment de carregar una barra 0-100% */
@Component({
    templateUrl: 'carregant.comp.html',
    selector: 'carregant-barra',
    styleUrls: ['./carregant.comp.scss'],
})
export class CarregantComponent {

    @Input('informacio')
    public informacio: String = "";
    @Input('percentatge')
    public percentatge: number = 0;

    @Input('percentatgeW')
    public percentatgeW: number = 0;

    constructor() {
        this.percentatge = 0;
        this.percentatgeW = 30;
        this.informacio = "";

    }



}
