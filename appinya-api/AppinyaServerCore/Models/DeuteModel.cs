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
using AppinyaServerCore.Utils.JSON.Converters;
using System;
using System.Text.Json.Serialization;

namespace AppinyaServerCore.Models

{
    public class DeuteModel
    {
        [JsonConverter(typeof(IntConverter))]
        public int IdDeute { get; set; }
        public int IdCasteller { get; set; }
        public DateTime Data { get; set; }
        public string Concepte { get; set; }
        [JsonConverter(typeof(DecimalConverter))]
        public decimal Valor { get; set; }
        public bool Pagat { get; set; }
        public DateTime? DataPagament { get; set; }
        public string Observacions { get; set; }
        public int Creador { get; set; }
        public int Modificador { get; set; }
        public DateTime DataCreador { get; set; }
        public DateTime DataModificador { get; set; }

        public static implicit operator DeuteModel(Deutes deu)
        {
            if (deu == null) return null;
            return new DeuteModel
            {
                IdDeute = deu.IdDeute,
                Concepte = deu.Concepte,
                Data = deu.Data,
                DataPagament = deu.DataPagament,
                IdCasteller = deu.IdCasteller,
                Observacions = deu.Observacions,
                Pagat = deu.Pagat,
                Valor = deu.Valor,
                Creador = deu.UsuariCreador,
                Modificador = deu.UsuariModific ,
                DataCreador = deu.DataCreacio,
                DataModificador = deu.DataModific 
            };
        }
    }
}
