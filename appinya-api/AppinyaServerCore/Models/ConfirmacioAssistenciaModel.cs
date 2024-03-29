﻿/**
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

using System.Collections.Generic;
using System.Text.Json.Serialization;
using AppinyaServerCore.Utils.JSON.Converters;
namespace AppinyaServerCore.Models
{
    public class ConfirmacioAssistenciaModel
    {
        [JsonConverter(typeof(IntConverter))]
        public int EsdevenimentId { get; set; }


#pragma warning disable CA2227 // Las propiedades de colección deben ser de solo lectura
        public IList<AssistenciaModel> LstAssistencia { get; set; }
#pragma warning restore CA2227 // Las propiedades de colección deben ser de solo lectura

    }

}