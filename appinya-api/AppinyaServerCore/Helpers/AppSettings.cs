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
using System.Threading.Tasks;

namespace AppinyaServerCore.Helpers
{
    public class AppSettings
    {
        public string JwtKey { get; set; }
        public string JwtIssuer { get; set; }
        public Int32 JwtExpireDays { get; set; }

        public Int32 JwtRefreshDays { get; set; }
        public string JwtFireBase_Id { get; set; }
        public string UrlIcons { get; set; }

        public String UrlGooglePlay { get; set; }
        public String UrlAppleStore { get; set; }
        public String UrlWebApp { get; set; }

        public string UrlAlbums { get; set; }
        public string UrlRetrats { get; set; }

        public string UrlNoticies { get; set; }
        public string UrlConfirmacioEmail { get; set; }
        public String UsuariAdmin { get; set; }
        public String PasswordAdmin { get; set; }

        public String UsuariTest { get; set; }
        public String PasswordTest { get; set; }

    }
}
