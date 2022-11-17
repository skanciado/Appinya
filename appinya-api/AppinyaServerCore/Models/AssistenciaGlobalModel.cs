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

using System; 
namespace AppinyaServerCore.Models
{
    public class AssistenciaGlobalModel
    {
        public int Casteller { get; set; }
        public String Alias { get; set; }
        public String Nom { get; set; }
        public int Esdeveniment { get; set; }
        public String NomEsdeveniment { get; set; }
        public int idTipus { get; set; }
        public String NomTipus { get; set; }
        public DateTime DataInici { get; set; }
        public DateTime DataFi { get; set; }
        public Boolean? Assistire { get; set; }
        public Boolean ConfirmacioTecnica { get; set; }
        public Boolean? Transport { get; set; }
        public int? NumAcompanyants { get; set; }
        public String Observacions { get; set; }
        public DateTime DataModificacio { get; set; }
        public static implicit operator AssistenciaGlobalModel(Assistencia ass)
        {
            if (ass == null) return null;
            return new AssistenciaGlobalModel
            {
                Casteller = ass.IdCastellerNavigation.IdCasteller,
                Alias = ass.IdCastellerNavigation.Alias,
                Nom = ass.IdCastellerNavigation.Nom + " " + ass.IdCastellerNavigation.Cognoms ,
                Esdeveniment = ass.IdEsdevenimentNavigation.IdEsdeveniment,
                NomEsdeveniment = ass.IdEsdevenimentNavigation.Titol,
                idTipus = ass.IdEsdevenimentNavigation.IdTipus,
                NomTipus = ass.IdEsdevenimentNavigation.IdTipusNavigation.Titol,
                DataInici = ass.IdEsdevenimentNavigation.DataInici,
                DataFi = ass.IdEsdevenimentNavigation.DataFi,
                Transport = ass.Transport,
                Assistire = ass.Assistire,
                NumAcompanyants = ass.NumAcompanyants,
                Observacions = ass.Observacions,
                ConfirmacioTecnica = ass.Confirmaciotec,
                DataModificacio = ass.DataAssistencia

            };
        }


    }
}