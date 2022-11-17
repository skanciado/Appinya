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
using AppinyaServerCore.Database.Appinya;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppinyaServerCore.Models
{
    public class EstadisticaIndividualModel
    {
        public long Id { get; set; }
        public int IdTipus { get; set; }
        public int Dia { get; set; }
        public int Mes { get; set; }
        public int Anys { get; set; }
        public bool? Assitire { get; set; }
        public bool? Confirmacio { get; set; }
        public int? IdCasteller { get; set; }
        public int IdEsdeveniment { get; set; }
        public int idTemporada { get; set; }


        public static implicit operator EstadisticaIndividualModel(fEstadisticaIndividual_Result fresult)
        {

            if (fresult == null) return null;
            return new EstadisticaIndividualModel
            {
                Id = fresult.Id,
                Anys = fresult.anys.HasValue ? fresult.anys.Value : 0,
                Assitire = fresult.assitire.HasValue ? fresult.assitire.Value == 1 : (bool?)null,
                Confirmacio = fresult.confirmacio.HasValue ? fresult.confirmacio.Value == 1 : (bool?)null,
                Dia = fresult.dia.HasValue ? fresult.dia.Value : 0,
                Mes = fresult.mes.HasValue ? fresult.mes.Value : 0,
                IdCasteller = fresult.idCasteller.HasValue ? fresult.idCasteller.Value : 0,
                IdEsdeveniment = fresult.idEsdeveniment.HasValue ? fresult.idEsdeveniment.Value : 0,
                idTemporada = fresult.idTemporada,
                IdTipus = fresult.idTipus
            };
        }
    }
}
