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
using System.Text;
using System.Threading.Tasks;
using System.Globalization;
using System.Text.RegularExpressions;

namespace AppinyaServerCore.Utils
{
    public static class WebApiUtils
    {
        private   const String DATE_FORMAT = "yyyy-MM-dd";
        private  const String HOUR_FORMAT = "HH:mm";
        private const String DATE_HOUR_FORMAT = "yyyy-MM-ddTHH:mm:ss.FFF"; 

        public static DateTime? convertApiDate (String dateStr)
        {
            if (dateStr == null) return null;
            return DateTime.ParseExact(dateStr, DATE_FORMAT, CultureInfo.InvariantCulture);
        }

        public static DateTime? convertApiDateHour(String dateHourStr)
        {

            if (dateHourStr == null) return null;
            if (dateHourStr.Length > DATE_HOUR_FORMAT.Length) dateHourStr = dateHourStr.Substring(0, DATE_HOUR_FORMAT.Length);
            return DateTime.ParseExact(dateHourStr, DATE_HOUR_FORMAT, CultureInfo.InvariantCulture);
        }
        public static String convertApiDate(DateTime date)
        {
            return date.ToString(DATE_FORMAT, CultureInfo.InvariantCulture);
        }
        public static String convertApiDateHour(DateTime date)
        {
            return date.ToString(DATE_HOUR_FORMAT, CultureInfo.InvariantCulture);
        }
        public static String convertApiHour(DateTime hour)
        {
            return hour.ToString(HOUR_FORMAT, CultureInfo.InvariantCulture);
        }

        public static byte[] ParseDataUri(string dataUri, out string contentType)
        {
            var m = Regex.Match(dataUri, "^data:([^;]+);base64,(.*)$");

            contentType = m.Groups[1].Value;
            return Convert.FromBase64String(m.Groups[2].Value);
        }
    }
}
