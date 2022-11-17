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
using AppinyaServerCore.Utils.JSON.Converters;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks; 
namespace AppinyaServerCore.Models
{
    public class NoticiaModel
    {
        public String Id { get; set; }
        public String Titol { get; set; }
       
        public DateTime? Data { get; set; }
        public String Descripcio { get; set; }
        [JsonConverter(typeof(IntConverter))] 
        public int IdTipusNoticia { get; set; }
        public String Icona { get; set; }
        public String Url { get; set; }
        public CastellerModel UsuariReferencia { get; set; }
        public Boolean Indefinida { get; set; }
        public Boolean Activa { get; set; }
        public String Foto { get; set; }

        public static implicit operator NoticiaModel(Noticies not)
        {
            if (not == null) return null;
            return new NoticiaModel
            {
                Id = ""+ not.IdNoticies,
                Titol = not.Titulo,
                Data = not.Data,
                Descripcio = not.Descripcio,
                Url = not.Url,
                IdTipusNoticia = not.IdTipusNoticies,
                Icona = (not.IdTipusNoticiesNavigation == null) ? null : not.IdTipusNoticiesNavigation.Icona,
                Indefinida = not.Indefinida,
                Activa = not.Activa,
                Foto = not.Foto,
                UsuariReferencia = (not.IdCastellerNavigation== null) ?null : new CastellerModel() {
                    Id= not.IdCastellerNavigation.IdCasteller,
                    Alias = not.IdCastellerNavigation.Alias,
                    Nom = not.IdCastellerNavigation.Nom,
                    Cognom = not.IdCastellerNavigation.Cognoms,
                    Email = not.IdCastellerNavigation.Email

                    }
                 
            };
        }
       
    }
}
