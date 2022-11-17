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
import { StoreData } from "../services/storage.data";
import { UsuariService } from "../services/usuari.service";

import { AuthenticateService } from "../services/authenticate.service";
import { ErrorRefrescarCredencials } from "../entities/Errors";
import {
  ICastellerModel,
  IRespostaServidor,
  IRol,
  IUsuariModel,
  IUsuariSessio,
} from "../entities/interfaces";
import { CastellersService } from "../services/castellers.service";

/**
 * Gestor de Negoci de Usuaris
 *
 * */
@Injectable({
  providedIn: "root",
})
export class UsuariBs {
  public static Rol_admin: IRol = {
    Id: "ADMIN",
    Descripcio: "Administrador del Sistema",
    Icon: "prism-outline",
  };

  public static Rol_organitzador: IRol = {
    Id: "ORGANITZADOR",
    Descripcio: "Organitzador d'esdeveniments",
    Icon: "calendar-outline",
  };

  public static Rol_responsable_salud: IRol = {
    Id: "SALUD",
    Descripcio: "Prevenció i Salud",
    Icon: "heart-outline",
  };

  public static Rol_secretari: IRol = {
    Id: "SECRETARI",
    Descripcio: "Secretaria",
    Icon: "book-outline",
  };

  public static Rol_tecnic: IRol = {
    Id: "TECNIC",
    Descripcio: "Tècnic de Primer Nivell",
    Icon: "construct-outline",
  };

  public static Rol_tecnic_nivell_2: IRol = {
    Id: "TECNICN2",
    Descripcio: "Tècnic de Segon Nivell",
    Icon: "construct-outline",
  };

  public static Rol_tresorer: IRol = {
    Id: "TRESORER",
    Descripcio: "Tresoreria",
    Icon: "cash-outline",
  };

  public static Rol_casteller: IRol = {
    Id: "CASTELLER",
    Descripcio: "Casteller",
    Icon: "person-outline",
  };

  public static Rol_bar: IRol = {
    Id: "BAR",
    Descripcio: "Bar",
    Icon: "beer-outline",
  };

  public static Rol_camises: IRol = {
    Id: "CAMISES",
    Descripcio: "Gestor de Camises",
    Icon: "shirt-outline",
  };

  public static Rol_capmusics: IRol = {
    Id: "CAPMUSIC",
    Descripcio: "Cap de Músics",
    Icon: "musical-notes-outline",
  };

  public static Rol_confirmador_assistencia: IRol = {
    Id: "CONFIRMADOR",
    Descripcio: "Confirmador d'assistència",
    Icon: "eye-outline",
  };

  public static Rol_junta: IRol = {
    Id: "JUNTA",
    Descripcio: "Junta de la Colla",
    Icon: "color-filter-outline",
  };

  public static Rol_musics: IRol = {
    Id: "MUSIC",
    Descripcio: "Músic",
    Icon: "musical-notes-outline",
  };

  public static Rol_noticier: IRol = {
    Id: "NOTICIER",
    Descripcio: "Publicador de Notícies",
    Icon: "newspaper-outline",
  };

  constructor(
    protected usuariService: UsuariService,
    protected autentificacioService: AuthenticateService,
    protected castellerService: CastellersService,
    protected storeData: StoreData
  ) {}
  /**
   * Enviar dades equivodades a Secretaria
   * @param casteller
   */
  public async enviarEmailConformacioDades(casteller: ICastellerModel) {
    let user = await this.storeData.obtenirUsuariSession();
    return this.usuariService
      .enviarEmailConformacioDades(casteller, user)
      .toPromise();
  }
  /**
   * Enviar un missatge a la comisio
   * @param qui
   * @param missatge
   */
  public async enviarEmailComisio(qui: string, missatge: string) {
    let user = await this.storeData.obtenirUsuariSession();
    return this.usuariService
      .enviarEmailComisio(qui, missatge, user)
      .toPromise();
  }
  /**
   * Refresca Token
   */
  public async refrescarToken() {
    let user = await this.storeData.obtenirUsuariSession();
    const token = await this.usuariService.refreshToken(user).toPromise();
    this.storeData.desarUsuariSessio(token);
  }
  /**
   * Desar Rols
   * @param email  Usuari
   * @param roles  Rols
   * @returns
   */
  public async desarRols(
    email: string,
    roles: string[]
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return await this.autentificacioService
      .desarRoles(email, roles, user)
      .toPromise();
  }

  /**
   * Desar Rols
   * @param email  Usuari
   * @param roles  Rols
   * @returns
   */
  public async crearUsuari(
    casteller: ICastellerModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return await this.usuariService.crearUsuari(casteller, user).toPromise();
  }
  /**
   * Obtenir Rols disponibles
   * @returns
   */
  public obtenirRols(): IRol[] {
    let roles: IRol[] = [];
    roles.push(UsuariBs.Rol_admin);
    roles.push(UsuariBs.Rol_organitzador);
    roles.push(UsuariBs.Rol_responsable_salud);
    roles.push(UsuariBs.Rol_secretari);
    roles.push(UsuariBs.Rol_tecnic);
    roles.push(UsuariBs.Rol_tecnic_nivell_2);
    roles.push(UsuariBs.Rol_tresorer);
    roles.push(UsuariBs.Rol_casteller);
    roles.push(UsuariBs.Rol_bar);
    roles.push(UsuariBs.Rol_camises);
    roles.push(UsuariBs.Rol_capmusics);
    roles.push(UsuariBs.Rol_confirmador_assistencia);
    roles.push(UsuariBs.Rol_junta);
    roles.push(UsuariBs.Rol_musics);
    roles.push(UsuariBs.Rol_noticier);

    return roles;
  }
  /**
   * Obter l'usuari de la base de dades del mòbil
   */
  public async obtenirUsuariActual(): Promise<IUsuariModel> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.usuariService.obtenirUsuariActual(user).toPromise();
  }
  /**
   * Obter l'usuari de la base de dades del mòbil
   */
  public obtenirUsuari(): Promise<IUsuariModel> {
    return this.storeData.obtenirUsuari();
  }
  /**
   * Obter l'usuari de la base de dades del mòbil
   */
  public async obtenirUsuariPerEmail(email: string): Promise<IUsuariModel> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.usuariService.obtenirUsuari(email, user).toPromise();
  }
  /**
   * Obter l'usuari de la base de dades del mòbil
   */
  public obtenirUsuariSession(): Promise<IUsuariSessio> {
    return this.storeData.obtenirUsuariSession();
  }
  /**
   * Obter l'usuari de la base de dades del mòbil
   */
  public async obtenirCasteller(): Promise<ICastellerModel> {
    let online = await this.storeData.esOnline();
    let usuari = await this.storeData.obtenirUsuari();
    if (online) {
      let user = await this.storeData.obtenirUsuariSession();
      return this.castellerService
        .obtenirCasteller(usuari.CastellerId, user)
        .toPromise();
    } else {
      return this.storeData.obtenirCasteller(usuari.CastellerId);
    }
  }
  /**
   * Refresca les credencials de l'usuari en cas d error llença una excepció
   */
  public async refrescarUsuari(): Promise<IUsuariSessio> {
    let userLocal = await this.storeData.obtenirUsuariSession();
    if (!userLocal) return null;
    let user = await this.usuariService
      .obtenirUsuariInfo(userLocal)
      .toPromise();
    if (user) {
      if (user.Rols != userLocal.Rols) {
        throw new ErrorRefrescarCredencials();
      } else {
        return userLocal;
      }
    } else {
      return null;
    }
  }
  /**
   * Valida si el rol de l'usuari actual es aquest
   * @param rol nom del rol
   */
  public async esRol(rol: string): Promise<boolean> {
    let usuari = await this.storeData.obtenirUsuari();
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(rol) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Es un usuari amb rol Casteller
   * @param usuari
   */
  public esRolCasteller(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (usuari.CastellerId) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Junta
   * @param usuari
   */
  public esRolJunta(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_junta.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Tecnic
   * @param usuari
   */
  public esRolTecnica(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_tecnic.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Tecnic Nivell 2
   * @param usuari
   */
  public esRolTecnicaNivell2(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_tecnic_nivell_2.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Responsable Salud
   * @param usuari
   */
  public esRolResponsableSalud(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_responsable_salud.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Tresore
   * @param usuari
   */
  public esRolTresorer(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_responsable_salud.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Noticier
   * @param usuari
   */
  public esRolNoticier(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_noticier.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Confirmador d'Assistencia
   * @param usuari
   */
  public esRolConfirmadorAssistencia(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_confirmador_assistencia.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Admin
   * @param usuari
   */
  public esRolAdmin(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_admin.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Secretari
   * @param usuari
   */
  public esRolSecretari(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_secretari.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Music
   * @param usuari
   */
  public esRolMusic(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_musics.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Camises
   * @param usuari
   */
  public esRolCamises(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_camises.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Cap de Musics
   * @param usuari
   */
  public esRolCapMusic(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_capmusics.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Bar
   * @param usuari
   */
  public esRolBar(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_bar.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Es un usuari amb rol Organitzador
   * @param usuari
   */
  public esRolOrganitzador(usuari: IUsuariModel): boolean {
    if (!usuari) return false;
    else if (
      usuari.CastellerId &&
      usuari.Rols &&
      usuari.Rols.indexOf(UsuariBs.Rol_organitzador.Id) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
}
