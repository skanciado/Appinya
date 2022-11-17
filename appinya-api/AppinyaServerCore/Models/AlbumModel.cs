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
using AppinyaServerCore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks; 
namespace AppinyaServerCore.Api.Entities
{
    public class AlbumModel
    {
        public String Id { get; set; }
        public String Album { get; set; }
        public DateTime Data { get; set; }
        public String Descripcio { get; set; }  
        public String Url { get; set; }
        public CastellerModel Fotograf { get; set; } 
        public Boolean Activa { get; set; }
        public String Portada { get; set; }
        public int Likes { get; set; } 
        public Boolean JoLike { get; set; }
        public IList<int> Castellers { get; set; }

        public static implicit operator AlbumModel(Fotos fot)
        {
            if (fot == null) return null;
            return new AlbumModel
            {
                Id = fot.IdFotos.ToString(),
                Album = fot.Album,
                Data = fot.Data,
                Descripcio = fot.Descripcio,
                Url = fot.Url, 
                Activa = fot.Activa,
                Portada = fot.Portada,
                Fotograf = (fot.IdFotografNavigation== null) ?null : new CastellerModel() {
                    Id= fot.IdFotografNavigation.IdCasteller,
                    Alias = fot.IdFotografNavigation.Alias,
                    Nom = fot.IdFotografNavigation.Nom,
                    Cognom = fot.IdFotografNavigation.Cognoms,
                    Email = fot.IdFotografNavigation.Email 
                 }
                 
            };
        }
       
    }
}
