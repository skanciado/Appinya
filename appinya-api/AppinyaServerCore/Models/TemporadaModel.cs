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
using System.Linq;
using System.Text;
using System.Threading.Tasks; 
namespace AppinyaServerCore.Models
{
    public class TemporadaModel
    {
        public int Id { get; set; }
        public String Descripcio { get; set; }
        public decimal? Puntuacio { get; set; }
        public DateTime DataInici { get; set; }
        public DateTime DataFi { get; set; }

        public static implicit operator TemporadaModel(Temporada temp)
        {
            if (temp == null) return null;
          
            return new TemporadaModel
            {
                Id = temp.Id,
                Descripcio = temp.Descripcio,
                DataFi= temp.DataFin,
                DataInici = temp.DataInici,
                Puntuacio =  temp.Puntuacio

            };
        }
    }
}
