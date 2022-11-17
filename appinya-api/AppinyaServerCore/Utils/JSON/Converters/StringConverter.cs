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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace AppinyaServerCore.Utils.JSON.Converters
{
    public class StringConverter : System.Text.Json.Serialization.JsonConverter<String>
    {
        public override String Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Number)
            {

                string stringValue = reader.GetDecimal().ToString();
                return stringValue;

            }
            if (reader.TokenType == JsonTokenType.True)
            {
                return "True";

            }
            if (reader.TokenType == JsonTokenType.False)
            {
                return "False";

            }
            if (reader.TokenType == JsonTokenType.String)
            {
                return reader.GetString();

            }
            throw new System.Text.Json.JsonException();
        }



        public override void Write(Utf8JsonWriter writer, String value, JsonSerializerOptions options)
        {

            writer.WriteStringValue(value);
        }


    }
}
