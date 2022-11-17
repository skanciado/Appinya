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
using System.Text.Json.Serialization;

using AppinyaServerCore.Database;
using AppinyaServerCore.Utils.JSON.Converters; 

namespace AppinyaServerCore.Models
{ 
    public class PreguntaModel
    {
        [JsonConverter(typeof(IntConverter))]
        public int IdPregunta { get; set; }
        public String Pregunta { get; set; }
        [JsonConverter(typeof(IntConverter))]
        public int TipusPregunta { get; set; }
        public IList<String> Valores { get; set; }

        [JsonConverter(typeof(StringConverter))]
        public String Resposta { get; set; }


        public static implicit operator PreguntaModel(EsdevenimentPregunta pregunta)
        {
            if (pregunta == null) return null;
            return new PreguntaModel
            {
                IdPregunta = pregunta.Id,
                Pregunta = pregunta.Pregunta,
                Resposta = null,
                TipusPregunta = pregunta.TipusPregunta,
                Valores = (pregunta.Valors!= null ) ? pregunta.Valors.Split(";") : null 
            };
        }
    }
}