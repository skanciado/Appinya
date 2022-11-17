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
using AppinyaServerCore.Database;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppinyaServerCore.Models
{
    public class PosicioModel
    {
        public int IdPosicio { get; set; }
        public String Descripcio { get; set; }
        public String Icona { get; set; }
        public int Experiencia { get; set; }

        public static implicit operator PosicioModel(Posicio pos)
        {
            if (pos == null) return null;
            return new PosicioModel
            {
                IdPosicio = pos.IdPosicio,
                Descripcio = pos.Descripcio,
                Icona = pos.Icona,
                Experiencia = 0
            };
        }
        public static implicit operator PosicioModel(CastellerPosicio pos)
        {
            if (pos == null) return null; 
            return new PosicioModel
            {
                IdPosicio = pos.IdPosicio,
                Descripcio = pos.IdPosicioNavigation.Descripcio,
                Icona = pos.IdPosicioNavigation.Icona,
                Experiencia = pos.Qualitat
            };
        }


    }
    
}
