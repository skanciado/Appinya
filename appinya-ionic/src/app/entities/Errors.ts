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
export class ErrorGeneric {
  missatge: string;
  constructor(missatge: string) {
    this.missatge = missatge;
  }
}

export class ErrorCredencials extends ErrorGeneric {
  constructor(missatge?: string) {
    if (missatge) super(missatge);
    else super("Error Credencials ....");
  }
}
export class ErrorRefrescarCredencials extends ErrorGeneric {
  constructor(missatge?: string) {
    if (missatge) super(missatge);
    else super("Credencials caducades, actualitzant Credencials....");
  }
}

export class ErrorSenseInternet extends ErrorGeneric {
  constructor(missatge?: string) {
    if (missatge) super(missatge);
    else super("No hi ha connexió a internet");
  }
}

export class ErrorServidor extends ErrorGeneric {
  codihttp: number;
  constructor(httpcode: number, missatge: string) {
    super(missatge);
    this.codihttp = httpcode;
  }
}
export class ErrorLocalStore extends ErrorGeneric {
  constructor(detall: string) {
    super(detall);
  }
}
export class ErrorTemporadaBuida extends ErrorGeneric {
  constructor(detall: string) {
    super(detall);
  }
}
