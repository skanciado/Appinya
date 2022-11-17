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
import { Component, Input, Output, EventEmitter } from "@angular/core";

/** Compoment de carregar una barra 0-100% */
@Component({
  templateUrl: "rating.comp.html",
  selector: "rating-start",
  styleUrls: ["./rating.comp.scss"],
})
export class RatingComponent {
  constructor() {}

  starts: number = 0;
  conversio: number = 1;
  @Input()
  set conversion(c: number) {
    this.conversio = c;
  }
  @Input()
  set value(value: number) {
    this.starts = value / this.conversio;
  }
  get value() {
    return this.starts * this.conversio;
  }
  @Output() onChange = new EventEmitter<number>();

  starSelect(num) {
    if (this.starts == num) {
      num = 0;
    }
    this.starts = num;
    this.onChange.emit(this.value);
  }
}
