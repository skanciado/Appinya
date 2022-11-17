/**
 *  Appinya Open Source Project
 *  Copyright (C) 2021  Daniel Horta Vidal
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
import { Diccionari } from "../entities/Diccionari";
import {
  ICastellerModel,
  ICastellerDetallModel,
  IResponsableLegalModel,
  IRespostaServidorAmbRetorn,
  IRespostaServidor,
  IEntitatHelper,
} from "../entities/interfaces";
import { CastellersService } from "../services/castellers.service";
import { StoreData } from "../services/storage.data";
import { TecnicsService } from "../services/tecnics.service";
import { UsuariService } from "../services/usuari.service";

@Injectable({
  providedIn: "root",
})
export class TecnicsBs {
  constructor(
    protected tecnicService: TecnicsService,
    protected storeData: StoreData
  ) {}
  /**
   * Desar Casteller
   * @param casteller
   * @param loading
   */
  public async desaDadesTecnics(
    casteller: ICastellerModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    var promise = new Promise<IRespostaServidor>((resolve, reject) => {
      this.tecnicService.desarDadesTecniques(casteller, user).subscribe(
        (result) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    });
    return promise;
  }
}
