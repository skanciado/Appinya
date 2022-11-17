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
import { Observable } from "rxjs";
import {
  ICastellerModel,
  IDeuteModel,
  IRespostaServidor,
  IRespostaServidorAmbRetorn,
  IUsuariInfo,
  IUsuariModel,
  IUsuariSessio,
} from "../entities/interfaces";
import { DeuteService } from "../services/deute.service";
import { StoreData } from "../services/storage.data";
import { UsuariService } from "../services/usuari.service";

@Injectable({
  providedIn: "root",
})
export class DeutesBs {
  constructor(
    protected deuteService: DeuteService,
    protected usuariService: UsuariService,
    protected storeData: StoreData
  ) {}

  /**
   * Desar Deuta
   * @param deute
   * @param loading
   */
  public async desaDeute(
    deute: IDeuteModel
  ): Promise<IRespostaServidorAmbRetorn<IDeuteModel>> {
    let user: IUsuariSessio = await this.storeData.obtenirUsuariSession();
    return this.deuteService.desar(deute, user).toPromise();
  }
  /**
   * Esborrar Deuta
   * @param deute
   * @param loading
   */
  public async esborrarDeute(deute: IDeuteModel): Promise<IRespostaServidor> {
    let user: IUsuariSessio = await this.storeData.obtenirUsuariSession();
    return this.deuteService.esborrar(deute, user).toPromise();
  }
  /**
   * Obtenir les Deutes
   * @param deute
   * @param loading
   */
  public async obtenirDeutesPerCasteller(
    cas: ICastellerModel
  ): Promise<IDeuteModel[]> {
    let user: IUsuariSessio = await this.storeData.obtenirUsuariSession();
    return this.deuteService.obtenirDeutes(cas.Id, user).toPromise();
  }

  /**
   * Obtenir les Deutes
   * @param deute
   * @param loading
   */
  public async obtenirDeutes(
    concepte: string,
    cas: ICastellerModel,
    pagats: boolean,
    regIni: number
  ): Promise<IDeuteModel[]> {
    let user: IUsuariSessio = await this.storeData.obtenirUsuariSession();
    return this.deuteService
      .obtenirDeutesPaginades(concepte, cas ? cas.Id : "", pagats, regIni, user)
      .toPromise();
  }
  /**
   * Obtenir les Deutes Casteller
   */
  public async obtenirDeutesUsuari(): Promise<IDeuteModel[]> {
    let user: IUsuariSessio = await this.storeData.obtenirUsuariSession();
    return this.deuteService.obtenirDeutesUsuari(user).toPromise();
  }
}
