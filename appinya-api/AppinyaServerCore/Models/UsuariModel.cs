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
using AppinyaServerCore.Database.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace AppinyaServerCore.Models
{
    /// <summary>
    /// Usuari Sencill amb l'informació basica de permisos del sistema d'auteintifació
    /// </summary> 
    public class UsuariSessio
    {
        public string Id { get; set; }
        public string Usuari { get; set; }
        public string Nom { get; set; }
        public string Cognoms { get; set; }
        public string Email { get; set; }
        public string Contrasenya { get; set; }
        public IList<String> Rols { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public Boolean LocalUser { get; set; } = false;
        public Boolean ConfirmatEmail { get; set; }

        public static implicit operator UsuariSessio(Usuari usuari)
        {
            if (usuari == null) return null;
            else return new UsuariSessio()
            {
                Id = usuari.Id,
                Email = usuari.Email,
                Usuari = usuari.UserName,
                ConfirmatEmail = usuari.EmailConfirmed
            };
        }

    }
    /// <summary>
    /// Usuari Model amb integració de informació castellera
    /// </summary>
    public class UsuariModel
    {
        public String Id { get; set; }
        public string Usuari { get; set; }
        public String Nom { get; set; }
        public String Cognom { get; set; }
        public String Email { get; set; }
        public Boolean ConfirmatEmail { get; set; }
        public String Telefon { get; set; }
        public IList<String> Rols { get; set; }
        public int CastellerId { get; set; }


        /// <summary>
        /// Son els Minions que poden confirmar-te l'assistencia
        /// </summary>
        public IList<String> Adjunts { get; set; }
        /// <summary>
        /// Son els castellers que tens delegats per  confirmar l'assistencia
        /// </summary>
        public IList<String> Delegacions { get; set; } 
        /// <summary>
        /// Son els castellers que poden confirmar-te l'assistencia
        /// </summary>
        public IList<String> Delegats { get; set; }
        
        
       
        public IList<String> Referents { get; set; }
        public IList<String> SolicitutsEnviades { get; set; }  
        public IList<String> SolicitutsRebudes { get; set; }
        public Boolean RebreEmailNoticies { get; set; }

        public Boolean RebreEmailFotos { get; set; }

         

        public UsuariModel()
        {

        }
        public UsuariModel(Casteller casteller, UsuariSessio usuari,IList<string>roles,
            IList<int> adjunts = null,
            IList<int> delegats = null , 
            IList<int> delegacions = null,
            IList<int> referents = null,
            IList<int> solicitutsRebudes = null, IList<int> solicitutsEnviades = null)
        {
           
            if (usuari != null)
            {
                Id = usuari.Id;
                Email = usuari.Email;
                Usuari = usuari.Usuari;
                ConfirmatEmail = usuari.ConfirmatEmail;
               
            }
            
            if (casteller != null)
            {
                Cognom = casteller.Cognoms;
                Email = casteller.Email;
                Nom = casteller.Nom;
                Telefon = casteller.Telefon1 ?? casteller.Telefon2;
                CastellerId = casteller.IdCasteller; 
                RebreEmailFotos = casteller.Rebremailfotos;
                RebreEmailNoticies = casteller.Rebremailnot;
            }
      
            Rols = roles;
            Adjunts = (adjunts != null) ? adjunts.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
            Delegats = (delegats != null) ? delegats.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
            Delegacions = (delegacions != null) ? delegacions.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
            Referents = (referents != null) ? referents.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
            SolicitutsEnviades = (solicitutsEnviades != null) ? solicitutsEnviades.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
            SolicitutsRebudes = (solicitutsRebudes != null) ? solicitutsRebudes.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
        }

        public static UsuariModel ConvertTo(Casteller casteller, UsuariSessio usuari, IList<string> roles, 
            IList<int> adjunts = null, 
            IList<int> delegats = null,
            IList<int> delegacions= null,
            IList<int> referents = null,
            IList<int> solicitutsRebudes = null, 
            IList<int> solicitutsEnviades = null)
        {

            if (casteller == null && usuari == null) return null;
            UsuariModel usuariInfoModel = new UsuariModel();
            if (usuari != null)
            {
                usuariInfoModel.Id = usuari.Id;
                usuariInfoModel.Email = usuari.Email;
                usuariInfoModel.Usuari = usuari.Usuari;
                usuariInfoModel.ConfirmatEmail = usuari.ConfirmatEmail;
                
            }
            if (casteller != null)
            {
                usuariInfoModel.Cognom = casteller.Cognoms;
                usuariInfoModel.Nom = casteller.Nom;
                usuariInfoModel.Telefon = casteller.Telefon1 ?? casteller.Telefon2; 
                usuariInfoModel.CastellerId = casteller.IdCasteller;
                usuariInfoModel.RebreEmailFotos = casteller.Rebremailfotos;
                usuariInfoModel.RebreEmailNoticies = casteller.Rebremailnot;

            }
            usuariInfoModel.Rols = roles;
            usuariInfoModel.Adjunts = (adjunts != null ) ? adjunts.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
            usuariInfoModel.Delegats = (delegats != null) ? delegats.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
            usuariInfoModel.Delegacions = (delegacions != null) ? delegacions.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
            usuariInfoModel.Referents = (referents != null) ? referents.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
            usuariInfoModel.SolicitutsEnviades = (solicitutsEnviades != null) ? solicitutsEnviades.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
            usuariInfoModel.SolicitutsRebudes = (solicitutsRebudes != null) ? solicitutsRebudes.Select<int, String>(t => t.ToString()).ToList() : new List<String>();
            return usuariInfoModel;

        }


    }
}
