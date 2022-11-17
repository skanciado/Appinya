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

    public partial class fEsdeveniments_Result
    {
        [Key]
        public int ID_ESDEVENIMENT { get; set; }
        public string TITOL { get; set; }
        public string TEXT { get; set; }
        public int ID_TIPUS { get; set; }
        public string TIPUS { get; set; }
        public string ICONA { get; set; }
        public string ICONASRC { get; set; }
        public System.DateTime DATA_INICI { get; set; }
        public System.DateTime DATA_FI { get; set; }
        public string IMATGE { get; set; }
        public string IMATGE_MINI { get; set; }
        public int ID_USUARI_CREADOR { get; set; }
        public Nullable<decimal> LATITUD { get; set; }
        public Nullable<decimal> LONGITUD { get; set; }
        public bool IND_ESBORRAT { get; set; }
        public System.DateTime DATA_CREACIO { get; set; }
        public System.DateTime DATA_MODIFICACIO { get; set; }
        public bool OFREIX_TRANSPORT { get; set; }
        public bool ACTIVA { get; set; }
        public bool ANULAT { get; set; }
        public string DIRECCIO { get; set; }
        public bool BLOQUEIX_ASSISTENCIA { get; set; }
        public int ID_USUARI_MODIFI { get; set; }
        public Nullable<bool> TRANSPORT_ANADA { get; set; }
        public Nullable<bool> TRANSPORT_TORNADA { get; set; } 
        public Nullable<int> Assistencia { get; set; }
        public Nullable<int> NoAssistencia { get; set; }
        public Nullable<int> ConfirmTecnics { get; set; }
        public Nullable<bool> Assistire { get; set; }
        public int ID_TEMPORADA { get; set; }
    }
}
