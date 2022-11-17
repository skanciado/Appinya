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
using AppinyaServerCore.Models;
using AppinyaServerCore.Utils.JSON.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Web; 
namespace AppinyaServerCore.Models
{
    public class EsdevenimentValoracioModel
    {

        public String IdCasteller { get; set; }

        public String IdEsdeveniment { get; set; }
         
        public DateTime Data { get; set; }
        public int Valoracio { get; set; }



        public static implicit operator EsdevenimentValoracioModel(EsdevenimentValoracio esCas)
        {
            return Convert(esCas);
        }

        public static EsdevenimentValoracioModel Convert(EsdevenimentValoracio esCas)
        {
            if (esCas == null) return null;

            return new EsdevenimentValoracioModel()
            {
                IdCasteller = esCas.IdCasteller.ToString(),
                IdEsdeveniment = esCas.IdEsdeveniment.ToString(),
                Data = esCas.DataAlta,
                Valoracio = esCas.Valoracio

            };
        }
    }
    public class EsdevenimentCastellModel
    {
        public int Id { get; set; }
        public String IdEsdeveniment { get; set; } 
        public String IdTipusCastell { get; set; }
        public String IdEstatCastell { get; set; } 
        public int Ordre { get; set; } 
        public DateTime Data { get; set; }
        public String Observacions { get; set; }
        public Boolean Xarxa { get; set; }




        public static implicit operator EsdevenimentCastellModel(EsdevenimentCastells esCas)
        {
            return Convert(esCas);
        }

        public static EsdevenimentCastellModel Convert(EsdevenimentCastells esCas)
        {
            if (esCas == null) return null; 
 
            return new EsdevenimentCastellModel()
            {  
                Id = esCas.Id,
                IdTipusCastell = esCas.IdCastell.ToString(),
                IdEsdeveniment = esCas.IdEsdeveniment.ToString(),
                Data = esCas.DataMod,
                IdEstatCastell = esCas.IdEstatCastell.ToString(),
                Ordre = esCas.Ordre,
                Observacions = esCas.Observacions,
                Xarxa = esCas.Xarxa

            };
        }
    }
    public class EsdevenimentLogModel
    {

        public String IdLog { get; set; }

        public String IdEsdeveniment { get; set; }

        public String IdCasteller { get; set; }
        public DateTime Data { get; set; }
        public int Accio { get; set; }
        public String IdCastellerCreador { get; set; }

        public static implicit operator EsdevenimentLogModel(EsdevenimentLog log)
        {
            return Convert(log);
        }
        public static EsdevenimentLogModel Convert(EsdevenimentLog log)
        {
            if (log == null) return null;
            DateTime dt = DateTime.Now.AddHours(24);

            return new EsdevenimentLogModel()
            {
                Accio = log.IdAccio,
                Data = log.Data,
                IdCasteller = log.IdCasteller.ToString(),
                IdCastellerCreador = log.IdCastellerCreador.ToString(),
                IdEsdeveniment = log.IdEsdeveniment.ToString(),
                IdLog = log.IdLog.ToString()
            };
        }
    }

    public class EsdevenimentDetallModel : EsdevenimentModel
    {
        /* Assistencia esdeveniment */
        public IList<AssistenciaModel> CastellersAssitiran { get; set; }
        public IList<AssistenciaModel> CastellersNoAssitiran { get; set; }
        /*Assistencia i valoracio personal*/
        public AssistenciaModel AssistenciaPersonal { get; set; }
        public EsdevenimentValoracioModel ValoracioPersonal { get; set; }

        /*Logs del esdeveniment*/
        public IList<EsdevenimentLogModel> EsdevenimentLog { get; set; }

        /*Castells*/
        public IList<EsdevenimentCastellModel> Castells { get; set; }
        public List<PreguntaModel> Preguntes { get; set; }

        public static implicit operator EsdevenimentDetallModel(Esdeveniment Est)
        {
            if (Est == null) return null;
            DateTime dt = DateTime.Now.AddHours(24);

            return new EsdevenimentDetallModel
            {
                Id = Est.IdEsdeveniment,
                DataFi = Est.DataFi,
                DataIni = Est.DataInici,
                Descripcio = Est.Text,
                Longitud = Est.Longitud,
                Latitud = Est.Latitud,
                Titol = Est.Titol,
                TipusEsdeveniment = Est.IdTipus,
                Responsable = "",
                Anulat = Est.Anulat,
                Bloquejat = Est.BloqueixAssistencia,
                OfereixTransport = Est.OfreixTransport,
                Direccio = Est.Direccio,
                Actiu = Est.Activa,
                Temporada = Est.IdTemporada, 
                TransportTornada = Est.TransportTornada.HasValue ? Est.TransportTornada.Value : false,
                TransportAnada = Est.TransportAnada.HasValue ? Est.TransportAnada.Value : false, 
                DataActualitzacio =Est.DataModificacio,
                Preguntes = Est.EsdevenimentPregunta.Select<EsdevenimentPregunta, PreguntaModel> (t=>t).ToList()



            };
        }

    }
    public class EsdevenimentResumModel : EsdevenimentModel
    { 
        public int? Assistencia { get; set; }
        public int? NoAssistencia { get; set; } 
        public Boolean? Assistire { get; set; }

        public static implicit operator EsdevenimentResumModel(fEsdeveniments_Result Est)
        {
            if (Est == null) return null;
            DateTime dt = DateTime.Now.AddHours(24);

            return new EsdevenimentResumModel
            {
                Id = Est.ID_ESDEVENIMENT,
                DataFi = Est.DATA_FI,
                DataIni = Est.DATA_INICI,
                Descripcio = Est.TEXT,
                Longitud = Est.LONGITUD,
                Latitud = Est.LATITUD,
                Titol = Est.TITOL,
                TipusEsdeveniment = Est.ID_TIPUS,
                Responsable = "",
                Assistire = Est.Assistire,
                Assistencia = Est.Assistencia,
                NoAssistencia = Est.NoAssistencia,
                Confirmats = Est.ConfirmTecnics,
                Anulat = Est.ANULAT,
                Bloquejat = Est.BLOQUEIX_ASSISTENCIA,
                OfereixTransport = Est.OFREIX_TRANSPORT,
                Direccio = Est.DIRECCIO,
                Actiu = Est.ACTIVA, 
                TransportTornada = Est.TRANSPORT_TORNADA.HasValue ? Est.TRANSPORT_TORNADA.Value : false,
                TransportAnada = Est.TRANSPORT_ANADA.HasValue ? Est.TRANSPORT_ANADA.Value : false,
                DataActualitzacio = Est.DATA_MODIFICACIO
            };
        }
    }
}
    public class EsdevenimentModel
    {
        [JsonConverter(typeof( IntConverter))] 
        public int Id { get; set; }
        public String Titol { get; set; }
        public String Descripcio { get; set; }
        public DateTime DataIni { get; set; }        
        public DateTime DataFi { get; set; } 
        public String Responsable { get; set; }
        [JsonConverter(typeof(IntConverter))]
        public int TipusEsdeveniment { get; set; }
        [JsonConverter(typeof(DecimalNulableConverter))]
        public decimal? Latitud { get; set; } 
        [JsonConverter(typeof(DecimalNulableConverter))] 
        public decimal? Longitud { get; set; }  
        public Boolean OfereixTransport { get; set; }
        public Boolean Anulat { get; set; }
        public Boolean Actiu { get; set; }
        public Boolean Bloquejat { get; set; }
        public int? Temporada { get; set; } 
        public int? Confirmats { get; set; }
        public String Direccio { get; set; } 
        public bool TransportAnada { get; set; }
        public bool TransportTornada { get; set; }   
        public DateTime? DataAssistencia { get; set; }
        public DateTime DataActualitzacio { get; set; }

        public List<PreguntaModel> Preguntes { get; set; }

    public static implicit operator EsdevenimentModel(Esdeveniment Est)
        {
            if (Est == null) return null;
            DateTime dt = DateTime.Now.AddHours(24);
             
            return new EsdevenimentModel
            {
                Id = Est.IdEsdeveniment,
                DataFi = Est.DataFi,
                DataIni = Est.DataInici,
                Descripcio = Est.Text,
                Longitud = Est.Longitud,
                Latitud = Est.Latitud,
                Titol = Est.Titol,
                TipusEsdeveniment = Est.IdTipus,
                Responsable = "", 
                Anulat= Est.Anulat,
                Bloquejat = Est.BloqueixAssistencia,
                OfereixTransport = Est.OfreixTransport,
                Direccio = Est.Direccio,
                Actiu  =Est.Activa,
                Temporada = Est.IdTemporada,   
                TransportTornada = Est.TransportTornada.HasValue ? Est.TransportTornada.Value : false, 
                TransportAnada = Est.TransportAnada.HasValue ? Est.TransportAnada.Value : false,
                Preguntes = Est.EsdevenimentPregunta.Select<EsdevenimentPregunta, PreguntaModel>(t=>t).ToList(),
                DataActualitzacio = Est.DataModificacio


            };
        }
        
       
}