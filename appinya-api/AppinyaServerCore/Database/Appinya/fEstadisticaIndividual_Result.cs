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


namespace AppinyaServerCore.Database.Appinya
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public partial class fEstadisticaIndividual_Result
    {
        [Key]
        public long Id { get; set; }
        public int idTipus { get; set; }
        public Nullable<int> dia { get; set; }
        public Nullable<int> mes { get; set; }
        public Nullable<int> anys { get; set; }
        public Nullable<int> assitire { get; set; }
        public Nullable<int> confirmacio { get; set; }
        public Nullable<int> idCasteller { get; set; }
        public Nullable<int> idEsdeveniment { get; set; }
        public int idTemporada { get; set; }
    }
}
