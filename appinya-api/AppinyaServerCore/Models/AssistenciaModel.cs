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
using System.Text.Json;
using System.Text.Json.Serialization;

using AppinyaServerCore.Database;
using AppinyaServerCore.Utils.JSON.Converters; 

namespace AppinyaServerCore.Models
{ 
    public class AssistenciaModel
    { 
        [JsonConverter(typeof(StringConverter))]
        public String Casteller { get; set; }
        [JsonConverter(typeof(StringConverter))]
        public String Esdeveniment { get; set; }
        public Boolean? Assistire { get; set; }
        public Boolean? ConfirmacioTecnica { get; set; }
        public Boolean? Transport { get; set; }
        public bool? TransportAnada { get; set; }
        public bool? TransportTornada { get; set; }
        [JsonConverter(typeof(IntNulableConverter))]
        public int? NumAcompanyants { get; set; }
        public String Observacions { get; set; }

        public IList<PreguntaModel> Preguntes { get; set; }

        public DateTime? DataModificacio { get; set; }
        public static implicit operator AssistenciaModel(Assistencia ass)
        {
            if (ass == null) return null;
            List<PreguntaModel> preguntes = new List<PreguntaModel>();

            if (!String.IsNullOrEmpty (ass.Respostes))
            {
                preguntes = JsonSerializer.Deserialize<List<PreguntaModel>>(ass.Respostes);
            }
            return new AssistenciaModel
            {
                Casteller = ass.IdCasteller.ToString(),
                Esdeveniment = ass.IdEsdeveniment.ToString(),
                Transport = ass.Transport,
                TransportAnada = ass.TransportAnada.HasValue ? ass.TransportAnada.Value : false,
                TransportTornada = ass.TransportTornada.HasValue ? ass.TransportTornada.Value : false,
                Assistire = ass.Assistire,
                NumAcompanyants = ass.NumAcompanyants,
                Observacions = ass.Observacions,
                ConfirmacioTecnica = ass.Confirmaciotec,
                DataModificacio = ass.DataAssistencia,
                Preguntes = preguntes

            };
        }


    }
}