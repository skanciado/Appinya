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

namespace AppinyaServerCore.Models
{
    public class JWT
    {
        public String Value { get; set; }

        public String Email { get; set; }

    }
    public class Token
    {
        public String Key { get; set; }

        public DateTime TimeStamp { get; set; }

    }
    public class CanviPasswordModel
    {
        public String Usuari { get; set; }
        public String PasswordNou { get; set; }

        public String PasswordActual { get; set; }

    }
    public class AssignarRolsModel
    {
        public String Email { get; set; }

        public IList<String> Rols { get; set; }

    }
    public class CanviPasswordPerdutModel
    { 
        public string Email { get; set; } 
        public string Tiket { get; set; } 
        public string NewPassword { get; set; } 
        public string ConfirmPassword { get; set; }

    }
   



}
