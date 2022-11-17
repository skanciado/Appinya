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
using System.Linq;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic; 
using Microsoft.EntityFrameworkCore;
using AppinyaServerCore.Database;
using AppinyaServerCore.Database.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Localization;
using System.Threading.Tasks;
using AppinyaServerCore.Models; 
using AppinyaServerCore.Helpers;
using System.Security.Principal;
using Microsoft.AspNetCore.Http;
using System.Net;  
namespace AppinyaServerCore.Services
{

    public interface IOrganitzacioService
    {
        IList<OrganitzacioModel> ObtenirOrganitzacio(IPrincipal principal); 
         
        RespostaAmbRetorn<OrganitzacioModel> CrearOrganitzacio(OrganitzacioAccioModel organitzacio, IPrincipal principal);

        Resposta EsborrarOrganitzacio(OrganitzacioAccioModel organitzacio, IPrincipal principal);
         

    }
    /// <summary>
    /// Servei d'usuari 
    /// </summary>
    public class OrganitzacioService : BaseService<OrganitzacioService>, IOrganitzacioService
    {
        private readonly AppinyaDbContext _appinyaDbContext;  
        private readonly IAuditoriaService _auditoriaService; 
        public OrganitzacioService(
            AppinyaDbContext appinyaDbContext,   
            IAuditoriaService auditoriaService,
            ILogger<OrganitzacioService> logger, 
            IStringLocalizer<OrganitzacioService> localizer
            ) : base( localizer, logger)
        {
            _appinyaDbContext = appinyaDbContext;  
            _auditoriaService = auditoriaService;
        }

        public    RespostaAmbRetorn<OrganitzacioModel>  CrearOrganitzacio(OrganitzacioAccioModel organitzacio, IPrincipal principal)
        {
            if (organitzacio == null)
            {
                throw new ArgumentNullException(nameof(organitzacio));
            }

            CastellerOrganitzacio org = _appinyaDbContext.CastellerOrganitzacio.Where(t => t.IdCarrec == organitzacio.Organitzacio && t.IdCasteller == organitzacio.Organitzacio).FirstOrDefault();
            if (org == null)
            {
                org = new CastellerOrganitzacio()
                {
                    IdCarrec = organitzacio.Organitzacio,
                    IdCasteller = organitzacio.Casteller
                };
                _appinyaDbContext.CastellerOrganitzacio.Add(org);
                _appinyaDbContext.SaveChanges(); 
            }

            return CrearRespotaAmbRetornOK<OrganitzacioModel>(_appinyaDbContext.Organitzacio.Where(t => t.Id == organitzacio.Organitzacio).Select<Organitzacio, OrganitzacioModel>(t=>t).FirstOrDefault());
        }

        public   Resposta EsborrarOrganitzacio(OrganitzacioAccioModel organitzacio, IPrincipal principal)
        {
            /*var or =
                    from o in _appinyaDbContext.Organitzacio
                    join co in _appinyaDbContext.CastellerOrganitzacio on o.Id equals co.IdCarrec
                    where co.IdCasteller == organitzacio.Casteller && o.Id == organitzacio.Organitzacio
                    select o;*/
            if (organitzacio == null )
            {
                throw new ArgumentNullException(nameof(organitzacio));
            }

            CastellerOrganitzacio org = _appinyaDbContext.CastellerOrganitzacio.Where(t=>t.IdCarrec == organitzacio.Organitzacio && t.IdCasteller == organitzacio.Casteller  ).FirstOrDefault();
            if (org == null)
            {
                LogWarning($"S\'ha intentat esborrar una CastellerOrganitzacio amb ID: {organitzacio.Casteller} i {organitzacio.Organitzacio} . No existeix el CastellerOrganitzacio amb aquesta ID");
                return CrearRespotaError(_localizer["organitzacioNoTrobada"]); 

            }
            _appinyaDbContext.CastellerOrganitzacio.Remove(org);
            _appinyaDbContext.SaveChanges();
            return CrearRespotaOK();

        }
 

        public IList<OrganitzacioModel> ObtenirOrganitzacio(IPrincipal principal)
        {
           
            var tree = _appinyaDbContext.Organitzacio.Include(t => t.IdPareNavigation).Include(t=>t.CastellerOrganitzacio).ThenInclude(c=>c.IdCastellerNavigation).ToList();
            List<OrganitzacioModel> pares = new List<OrganitzacioModel>();
            foreach (Organitzacio item in tree.Where(t=>t.IdPareNavigation == null).ToList())
            {
                pares.Add(CrearOrganitzacio(ConvertirModel(item), tree.Where(t => t.IdPareNavigation != null).ToList()));
            }
            return pares;
        }
        private OrganitzacioModel CrearOrganitzacio (OrganitzacioModel pare, IList<Organitzacio> tree)
        {

            IList<Organitzacio> lst = tree.Where(it => it.IdPareNavigation.Id == pare.Id).ToList();

            List<OrganitzacioModel> fills = new List<OrganitzacioModel>();
            foreach (Organitzacio item in lst)
            {
                fills.Add(CrearOrganitzacio(ConvertirModel(item), tree));
            }
            if (fills.Count>0)
            {
                pare.SubOrganitzacio = fills;
            }
            return pare;
        }
        private OrganitzacioModel ConvertirModel(Organitzacio organitzacio) 
        {
            if (organitzacio == null) return null;
            List<CastellerModel> lst = organitzacio.CastellerOrganitzacio.Select(t => t.IdCastellerNavigation).ToList().Select<Casteller,CastellerModel>(c=> CastellerModel.Convert(c)).ToList();
            return new OrganitzacioModel()
            {
                Id = organitzacio.Id,
                Descripcio = organitzacio.Descripcio,
                Castellers = lst
            };
        }
    }
}
