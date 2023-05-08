/**
 *  Appinya Open Source Project
 *  Copyright (C) 2021 Daniel Horta Vidal
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
import { Component, Input } from "@angular/core";

/** Compoment de carregar una barra 0-100% */
@Component({
  templateUrl: "senseconexio.comp.html",
  selector: "senseconexio",
  styleUrls: ["./senseconexio.comp.scss"],
})
export class SenseConexioComponent {
  @Input("descripcio")
  descripcio: String | undefined;
  @Input("iconName")
  iconName: String | undefined;

  constructor() { }
}
