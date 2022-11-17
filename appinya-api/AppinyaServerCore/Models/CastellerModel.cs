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
using AppinyaServerCore.Utils.JSON.Converters;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using AppinyaServerCore.Database;

namespace AppinyaServerCore.Models
{
    public class CastellerModel
    {
        [JsonConverter(typeof(IntConverter))]
        public int Id { get; set; }
        public String IdUsuari { get; set; }
        public String Nom { get; set; }
        public String Cognom { get; set; }
        public String Alias { get; set; }
        public String Email { get; set; }

        [JsonConverter(typeof(IntNulableConverter))]
        public int? IdTipusDocument { get; set; }
        public String TipusDocument { get; set; }
        public String Document { get; set; }
        [JsonConverter(typeof(StringConverter))]
        public String Telefon1 { get; set; }
        public Boolean VisTelefon1 { get; set; }
        [JsonConverter(typeof(StringConverter))]
        public String Telefon2 { get; set; }
        public Boolean VisTelefon2 { get; set; }
        public String Carrec { get; set; }
        public String Direccio { get; set; }
        public String CodiPostal { get; set; }
        [JsonConverter(typeof(IntConverter))]
        public int IdMunicipi { get; set; }
        [JsonConverter(typeof(IntNulableConverter))]
        public int? IdProvincia { get; set; }
        public String Municipi { get; set; }
        public String Provincia { get; set; }
        public Boolean VisDireccio { get; set; }
        public Boolean Assegurat { get; set; }
        public DateTime? DataNaixement { get; set; }
        public Boolean VisDataNaixement { get; set; }
        public Boolean TeCamisa { get; set; }
        public DateTime? DataEntregaCamisa { get; set; }
        public Boolean EsBaixa { get; set; }
        public DateTime? DataBaixa { get; set; }
        public DateTime? DataAlta { get; set; }
        public String Foto { get; set; }
        public Boolean Sanitari { get; set; }
        public Boolean Habitual { get; set; }
        public Boolean Actiu { get; set; }
        public Boolean RebreCorreuNoticies { get; set; }
        public Boolean RebreCorreuFotos { get; set; }

        public String Observacions { get; set; }
        public bool TeCasc { get; set; }
        public bool EsCascLloguer { get; set; }

        public DadesTecniquesModel DadesTecniques { get; set; }
        public IList<ResponsableLegalModel> ResponsablesLegals { get; set; }

        public IList<PosicioModel> Posicions { get; set; }
        public static CastellerModel Convert(Casteller cas, Boolean potVeureDadesPersonals = false, Boolean potVeureTelefons = false, Boolean potVeureDadesTecniques = false, Boolean esPropietari = false)
        {
            if (cas == null) return null;
            CastellerModel cr = new CastellerModel
            {
                Id = cas.IdCasteller,
                IdUsuari = cas.UserId,
                Nom = cas.Nom,
                Carrec = (cas.CastellerOrganitzacio == null) ? null : String.Join(",", cas.CastellerOrganitzacio.Select(t => t.IdCarrecNavigation.Descripcio).ToList()),
                Assegurat = cas.Assegurat,
                Cognom = cas.Cognoms,
                Alias = cas.Alias,
                Email = cas.Email,
                Telefon1 = cas.Telefon1,
                VisTelefon1 = cas.VisTelefon1,
                Telefon2 = cas.Telefon2,
                VisTelefon2 = cas.VisTelefon2,
                CodiPostal = cas.Cp,
                Direccio = cas.Direccio,
                IdTipusDocument = cas.TipusDocument,
                TipusDocument = (cas.TipusDocumentNavigation == null) ? null : cas.TipusDocumentNavigation.Document,
                Document = cas.DocumentId,
                Municipi = (cas.IdMunicipiNavigation == null) ? null : cas.IdMunicipiNavigation.Descripcio,
                IdMunicipi = Decimal.ToInt32(cas.IdMunicipi),
                Provincia = (cas.IdMunicipiNavigation == null || cas.IdMunicipiNavigation.IdProvinciaNavigation == null) ? null : cas.IdMunicipiNavigation.IdProvinciaNavigation.Descripcio,
                IdProvincia = (cas.IdMunicipiNavigation == null || cas.IdMunicipiNavigation.IdProvinciaNavigation == null) ? null : Decimal.ToInt32(cas.IdMunicipiNavigation.IdProvincia),
                VisDireccio = cas.VisDireccio,
                DataNaixement = cas.DataNaixement,
                VisDataNaixement = cas.VisDatanaix,
                DataAlta = cas.DataAlta,
                TeCamisa = cas.TeCamisa,
                EsBaixa = cas.EsBaixa,
                DataBaixa = cas.DataBaixa,
                DataEntregaCamisa = cas.DataLliureament,
                Foto = cas.Foto,
                Habitual = cas.Habitual,
                Actiu = !cas.IndEsborrat,
                Sanitari = cas.Sanitari,
                RebreCorreuNoticies = cas.Rebremailnot,
                RebreCorreuFotos = cas.Rebremailfotos,
                TeCasc = cas.TeCasc,
                EsCascLloguer = cas.CascLloguer
            };
            // En el cas de no ser l'usuario o de no poder veure Dades personals o dades tecniques, s'esborren les dades
            if (!esPropietari && (!potVeureDadesPersonals))
            {
                /*Dades que no es transporten a la capa client*/
                cr.TipusDocument = null;
                cr.IdTipusDocument = null;
                if (!cr.VisDireccio)
                {
                    cr.CodiPostal = null;
                    cr.Direccio = null;
                    cr.Provincia = null;
                    cr.Municipi = null;
                }
                if (!cr.VisDataNaixement) cr.DataNaixement = null;

                // Si es tecnic pot veure telefon
                if (!potVeureTelefons)
                {
                    if (!cr.VisTelefon1) cr.Telefon1 = null;
                    if (!cr.VisTelefon2) cr.Telefon2 = null;
                }
            }
            if (potVeureDadesPersonals || potVeureDadesTecniques)
            {
                if (cas.ResponsableLegal != null)
                    cr.ResponsablesLegals = cas.ResponsableLegal.Select<ResponsableLegal, ResponsableLegalModel>(res => res).ToList();
            }
            // Si a part pot veure dades tecniques s'assigna el valors de tecniques       
            if (potVeureDadesTecniques)
            {
                cr.Posicions = cas.CastellerPosicio.Select<CastellerPosicio, PosicioModel>(t => t).ToList();

                cr.DadesTecniques = cas.DadesTecniques; // (from dades in _appinyaDbContext.DadesTecniques where dades.IdCasteller == cas.IdCasteller select dades).ToList().FirstOrDefault();


            }
            return cr;
        }


    }
    public class DadesTecniquesModel
    {
        public int? Alcada { get; set; }
        public int? Bracos { get; set; }
        public int? Espatlla { get; set; }
        public int? Pes { get; set; }
        public string Observacions { get; set; }

        public static implicit operator DadesTecniquesModel(DadesTecniques dadestec)
        {
            if (dadestec == null) return null;
            return new DadesTecniquesModel
            {
                Alcada = dadestec.Alcada,
                Bracos = dadestec.Bracos,
                Espatlla = dadestec.Espatlla,
                Pes = dadestec.Pes,
                Observacions = dadestec.Observacions
            };
        }

    }
    public class ResponsableLegalModel
    {
        [JsonConverter(typeof(IntNulableConverter))]
        public int? IdCasteller { get; set; }
        [JsonConverter(typeof(IntConverter))]
        public int TipusResponsableId { get; set; }
        public String Nom { get; set; }
        public String TipusResponsable { get; set; }
        public String Cognoms { get; set; }
        [JsonConverter(typeof(StringConverter))]
        public String Telefon1 { get; set; }
        [JsonConverter(typeof(StringConverter))]
        public String Telefon2 { get; set; }
        public String Email { get; set; }
        public bool EsCasteller { get; set; }
        [JsonConverter(typeof(IntNulableConverter))]
        public int? IdCastellerResponsable { get; set; }



        public static implicit operator ResponsableLegalModel(ResponsableLegal responsable)
        {
            if (responsable == null) return null;
            return new ResponsableLegalModel
            {
                IdCasteller = responsable.IdCasteller,
                IdCastellerResponsable = responsable.IdCastellerResponsable,
                Cognoms = responsable.Cognoms,
                Email = responsable.Email,
                EsCasteller = responsable.Escasteller,
                Nom = responsable.Nom,
                Telefon1 = responsable.Telefon1,
                Telefon2 = responsable.Telefon2,
                TipusResponsable = (responsable.IdTipusResponsableNavigation == null) ? null : responsable.IdTipusResponsableNavigation.Descripcio,
                TipusResponsableId = responsable.IdTipusResponsable
            };
        }
    }
}
