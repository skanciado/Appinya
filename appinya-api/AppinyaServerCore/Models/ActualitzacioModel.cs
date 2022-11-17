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
using AppinyaServerCore.Api.Entities; 
using AppinyaServerCore.Entities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppinyaServerCore.Models
{

    public class PeticioActualitzacioIdModel
    {
        public String Id { get; set; }
        public String DataActualitzacio { get; set; }
    }

    /// <summary>
    /// Peticio de dades pendents de sincronitzar
    /// </summary>
    public class PeticioActualitzacioModel
    {
        /// <summary>
        /// Marca temporal
        /// </summary>
        public String Data { get; set; }
        /// <summary>
        /// L'usuari requereix Dades de castellers
        /// </summary>
        public bool DadesCastellers { get; set; }
        /// <summary>
        /// L'usuari requereix dades de junta
        /// </summary>
        public bool DadesJunta { get; set; }
        /// <summary>
        /// L'Uusuari requereix dades de tecnica
        /// </summary>
        public bool DadesTecnica { get; set; }
    }
    public class PaquetActualitzacioModel
    {
        public DateTime DataActualitzacio { get; set; }
        public TemporadaModel Temporada { get; set; }
        public IList<CastellerModel> Castellers { get; set; }
        public IList<NoticiaModel> Noticies { get; set; }
        public IList<AlbumModel> Albums { get; set; }
        public IList<EsdevenimentResumModel> Esdeveniments { get; set; }

    }
    public class TipusBasicsActualitzacioModel
    {
        public IList<EntitatHelper> TipusPosicio { get; set; }
        public IList<EntitatHelper> TipusNoticies { get; set; }
        public IList<EntitatHelper> TipusEsdeveniments { get; set; }
        public IList<EntitatHelper> TipusRelacio { get; set; }
        public IList<EntitatHelper> TipusCastells { get; set; }
        public IList<EntitatHelper> TipusProves { get; set; }

        public IList<EntitatHelper> TipusDocuments { get; set; }
        public IList<EntitatHelper> TipusEstatCastells { get; set; }
        public DateTime DataActualitzacio { get; set; }
    }

}
