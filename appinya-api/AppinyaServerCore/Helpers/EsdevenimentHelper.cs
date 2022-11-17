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
using AppinyaServerCore.Models;
using System;
using System.Security.Principal;
using System.Linq;
using System.Threading.Tasks;
using AppinyaServerCore.Database;

namespace AppinyaServerCore.Helpers
{
    public static class EsdevenimentHelper
    {
        public const int AccioLogCreacio = 1;
        public const int AccioLogEliminacio = 2;
        public const int AccioLogBloqueix = 3;
        public const int AccioLogDesBloqueix = 4;
        public const int AccioLogAssistire = 10;
        public const int AccioLogNoAssistire = 20;
        public const int AccioLogConfirmacio = 30;

        public const int ID_TIPUS_ESDEVENIMENT_MUSICS = 6;
        public const int ID_TIPUS_ESDEVENIMENT_SOCIAL = 5;
        public const int ID_TIPUS_ESDEVENIMENT_TALLER = 4;
        public const int ID_TIPUS_ESDEVENIMENT_COMERCIAL = 3;
        public const int ID_TIPUS_ESDEVENIMENT_ENTRENAMENTS = 2;
        public const int ID_TIPUS_ESDEVENIMENT_DIADES = 1;

        /// <summary>
        /// Funcio per saber si es pot editar o no un esdevemiment
        /// </summary>
        /// <param name="esdeveniment"> Id esdevemient </param>
        /// <param name="principal"> Rol principal </param>
        /// <returns></returns>
        public static bool PotEditarEsdeveniment(Esdeveniment esdeveniment, System.Security.Principal.IPrincipal principal)
        {
            if (esdeveniment == null) return false;
            if (SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolJunta(principal) || SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolSecretari(principal)) return true;
            else if (SeguretatHelper.esRolOrganitzador(principal) &&
                (esdeveniment.IdTipus == EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_COMERCIAL || esdeveniment.IdTipus == ID_TIPUS_ESDEVENIMENT_TALLER || esdeveniment.IdTipus == ID_TIPUS_ESDEVENIMENT_SOCIAL)) return true;
            else if (SeguretatHelper.esRolCapMusic(principal) && esdeveniment.IdTipus == ID_TIPUS_ESDEVENIMENT_MUSICS) return true;
            return false;  
        }
        public static bool PotEditarEsdeveniment(EsdevenimentModel esdeveniment, System.Security.Principal.IPrincipal principal)
        {
            if (esdeveniment == null) return false;
            if (SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolJunta(principal) || SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolSecretari(principal)) return true;
            else if (SeguretatHelper.esRolOrganitzador(principal) &&
                (esdeveniment.TipusEsdeveniment == EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_COMERCIAL || esdeveniment.TipusEsdeveniment == ID_TIPUS_ESDEVENIMENT_TALLER || esdeveniment.TipusEsdeveniment == ID_TIPUS_ESDEVENIMENT_SOCIAL)) return true;
            else if (SeguretatHelper.esRolCapMusic(principal) && esdeveniment.TipusEsdeveniment == ID_TIPUS_ESDEVENIMENT_MUSICS) return true;
            return false;
        }
        /// <summary>
        /// Metode per validar els permisos d edicio
        /// </summary>
        /// <param name="Esdeveniment">Esdeveniment objecte d</param>
        /// <param name="principal"> Usuari del sistema </param>
        /// <returns></returns>
        public static  bool PotConfirmarEsdeveniment(Esdeveniment esdeveniment, IPrincipal principal)
        {
            if (esdeveniment == null) return false;
            if (SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolSecretari(principal) ||  SeguretatHelper.esRolJunta(principal) || SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolConfirmadorAssistencia(principal)) return true;
            else if (SeguretatHelper.esRolOrganitzador(principal) &&
                (esdeveniment.IdTipus == ID_TIPUS_ESDEVENIMENT_COMERCIAL || esdeveniment.IdTipus == ID_TIPUS_ESDEVENIMENT_TALLER || esdeveniment.IdTipus == ID_TIPUS_ESDEVENIMENT_SOCIAL)) return true;
            else if (SeguretatHelper.esRolCapMusic(principal) && esdeveniment.IdTipus == ID_TIPUS_ESDEVENIMENT_MUSICS) return true;
            return false;


        }
        public static EsdevenimentLog CrearRegistreCreacio(int esdeveniment, int castellerCreador)
        {
            return new EsdevenimentLog()
            {
                IdAccio = AccioLogCreacio,
                Data = DateTime.Now,
                IdCasteller = castellerCreador,
                IdEsdeveniment = esdeveniment,
                IdCastellerCreador = castellerCreador

            };
        }
        /// <summary>
        /// Crear un Registre de Log
        /// </summary>
        /// <param name="esdeveniment">Id Esdeveniment</param>
        /// <param name="casteller">Casteller objecte </param>
        /// <param name="assistire">Si assisteix o no </param>
        /// <param name="castellerCreador">Creador del registre d'assistencia</param>
        /// <returns></returns>
        public static EsdevenimentLog CrearRegistre(int esdeveniment, int casteller, Boolean assistire, int castellerCreador )
        {
            return new EsdevenimentLog()
            {
                IdAccio = (assistire) ? AccioLogAssistire : AccioLogNoAssistire,
                Data = DateTime.Now,
                IdCasteller = casteller,
                IdEsdeveniment = esdeveniment,
                IdCastellerCreador = castellerCreador

            };
        }
        public static EsdevenimentLog CrearRegistre(Assistencia ass)
        {
            if (ass == null) throw new ArgumentNullException(nameof(ass));
            return new EsdevenimentLog()
            {
                IdAccio = ass.Assistire? AccioLogAssistire : AccioLogNoAssistire,
                Data = DateTime.Now,
                IdCasteller = ass.IdCasteller,
                IdEsdeveniment = ass.IdEsdeveniment,
                IdCastellerCreador = ass.IdUsuariModifi
            };
        }
        public static EsdevenimentLog CrearRegistreConfirmacio(Assistencia ass)
        {
            if (ass == null) throw new ArgumentNullException(nameof(ass));

            return new EsdevenimentLog()
            {
                IdAccio = AccioLogConfirmacio,
                Data = DateTime.Now,
                IdCasteller = ass.IdCasteller,
                IdEsdeveniment = ass.IdEsdeveniment,
                IdCastellerCreador = ass.IdUsuariModifi
            };
        }
        public static EsdevenimentLog CrearRegistreConfirma(int esdeveniment, int casteller, int castellerCreador)
        {
            return new EsdevenimentLog()
            {
                IdAccio = AccioLogConfirmacio,
                Data = DateTime.Now,
                IdCasteller = casteller,
                IdEsdeveniment = esdeveniment,
                IdCastellerCreador = castellerCreador

            };
        }

    }
}
