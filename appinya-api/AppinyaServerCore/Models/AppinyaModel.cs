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
using System.ComponentModel.DataAnnotations; 
using System.Collections.Generic;

using AppinyaServerCore.Database.Identity;
using AppinyaServerCore.Utils.JSON.Converters;
using System.Text.Json.Serialization;

namespace AppinyaServerCore.Models
{

    /// <summary>
    /// Model de cerca amb paginacio
    /// </summary>
    public class CercaModel
    {
        /// <summary>
        /// Registre inicial
        /// </summary>
        public int RegIni { get; set; }
        /// <summary>
        /// Text de la cerca
        /// </summary>
        public String Text { get; set; }
        /// <summary>
        /// Opciones que canvien depement la cerca
        /// </summary>
        public String Opcions { get; set; }
    }
    public class ContactarModel
    {
        public int TipusContacte { get; set; }
        public string Email { get; set; }
        public string Nom { get; set; }
        public string Comentari { get; set; }

    }
    public class Resposta
    {
        public Boolean Correcte { get; set; }
        public String Missatge { get; set; }


    }
    public class RespostaAmbRetorn<T>
    {
        public Boolean Correcte { get; set; }
        public String Missatge { get; set; }
        public T Retorn { get; set; }
    }
    public class EmisorReceptorModel
    {
        [JsonConverter(typeof(IntConverter))]
        public int Emisor { get; set; }
        [JsonConverter(typeof(IntConverter))]
        public int Receptor { get; set; }
    }




}
