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

    /// <summary>
    ///  Control de Versio
    /// </summary>
    public class ControlDeVersioModel
    {

        /// <summary>
        /// Es la ultima versio disponible
        /// </summary>
        public bool EsUltimaVersio { get; set; }
        /// <summary>
        /// La versio actual requereix refresc de dades
        /// </summary>
        public bool RequereixRefresc { get; set; }
        /// <summary>
        /// La versio actual requereix actualitzar-se
        /// </summary>
        public bool RequereixActualitzacio { get; set; }

        /// <summary>
        /// Versio actual
        /// </summary>
        public String Versio { get; set; }
        /// <summary>
        /// Descripcio versio actual
        /// </summary>
        public String Descripcio { get; set; }
        /// <summary>
        /// Id Versio Actual
        /// </summary>
        public int Id { get; set; }
    }

}
