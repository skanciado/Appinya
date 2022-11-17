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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;

namespace AppinyaServerCore.Helpers
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Naming", "CA1707:Los identificadores no deben contener caracteres de subrayado", Justification = "<pendiente>")]
    public static class SeguretatHelper
    {
        #region Attributes;
        public const string ROL_ADMINISTRADOR = "ADMIN";
        public const string ROL_JUNTA = "JUNTA";
        public const string ROL_CAMISES = "CAMISES";
        public const string ROL_SECRETARI = "SECRETARI"; 
        public const string ROL_TECNICA = "TECNIC";
        public const string ROL_TECNICA_v2 = "TECNICN2"; 
        public const string ROL_BAR = "BAR";
        public const string ROL_ORGANITZADOR = "ORGANITZADOR";
        public const string ROL_MUSIC = "MUSIC";
        public const string ROL_CAPMUSIC = "CAPMUSIC";
        public const string ROL_RESPONSABLE_SALUD = "SALUD";
        public const string ROL_CONFIRMADOR_ASSISTENCIA = "CONFIRMADOR";
        public const string ROL_TRESORER = "TRESORER";
        public const string ROL_NOTICIER = "NOTICIER";
        public const string ROL_CASTELLER = "CASTELLER";
        public const string REFRESH_TOKEN = "REFRESH_TOKEN";
        #endregion;
        public static String ObtenirUsuari(IIdentity identity)
        {
            if (identity == null) throw new ArgumentNullException(nameof(identity));
            var usuari = identity.Name;
            return usuari;
        }
        public static Boolean esRolJunta(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_JUNTA);
        }
        public static Boolean esRolSecretari(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_SECRETARI);
        }
        public static Boolean esRolBar(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_BAR);
        } 
        public static Boolean esRolAdmin(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_ADMINISTRADOR);
        }
        public static Boolean esRolMusic(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_MUSIC) || principal.IsInRole(ROL_CAPMUSIC);
        }
        public static Boolean esRolCapMusic(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_CAPMUSIC);
        }
        public static Boolean esRolOrganitzador(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_ORGANITZADOR);
        }
        public static Boolean esRolTecnic(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_TECNICA);

        }
        public static Boolean esRolTecnicNivell2(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_TECNICA_v2);
        }
        public static Boolean esRolConfirmadorAssistencia(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_CONFIRMADOR_ASSISTENCIA);
        }
        public static Boolean esRolResponsableSalud(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_RESPONSABLE_SALUD);
        }
        public static Boolean esRolCasteller(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_CASTELLER);
        }
        public static Boolean esRolCamises(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_CAMISES);
        }
        public static Boolean esRolNoticier(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_NOTICIER);
        }
        public static Boolean esRolTresorer(IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.IsInRole(ROL_TRESORER);
        }
    }
}
