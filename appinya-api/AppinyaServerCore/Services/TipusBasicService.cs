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
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using AppinyaServerCore.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Security.Principal;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using AppinyaServerCore.Helpers;
using System.Security.Claims;
using AppinyaServerCore.Database;
using AppinyaServerCore.Database.Identity;
using Microsoft.Extensions.Localization; 
using Microsoft.EntityFrameworkCore;
using AppinyaServerCore.Excepcions; 
using AppinyaServerCore.Api.Entities;
using AppinyaLib.Api.Entities;
using AppinyaServerCore.Entities;

namespace AppinyaServerCore.Services
{
    public interface ITipusBasicService

    {
        /// <summary>
        /// Obtenir Llista de municipis
        /// </summary>
        /// <param name="idProvincia"></param>
        /// <returns></returns>
        public List<EntitatHelper> ObtenirLlistaMunicipis(decimal idProvincia);
        /// <summary>
        /// Obtenir Llistat de provincies
        /// </summary>
        /// <returns></returns>
        public List<EntitatHelper> ObtenirLlistaProvincies();

        /// <summary>
        /// Obtenir Tipus de Noticies
        /// </summary>
        /// <returns></returns>
        public List<EntitatHelper> ObtenirTipusNoticies();

        /// <summary>
        /// Obtenir Tipus de Esdeveniments
        /// </summary>
        /// <returns></returns>
        public List<EntitatHelper> ObtenirTipusEsdeveniments();
        public List<EntitatHelper> ObtenirTipusPosicions();
        public List<EntitatHelper> ObtenirTipusResponsable();

        public TipusBasicsActualitzacioModel ObtenirTipusBasics();

    }
    public class TipusBasicService : BaseService<TipusBasicService>, ITipusBasicService
    {


        private readonly AppinyaDbContext _appinyaDbContext;

        public TipusBasicService(
            AppinyaDbContext appinyaDbContext,
            ILogger<TipusBasicService> logger,
            IStringLocalizer<TipusBasicService> localizer
            ) : base(localizer, logger)
        {
            _appinyaDbContext = appinyaDbContext;
        }
        /// <summary>
        /// Obtenir Llista de municipis
        /// </summary>
        /// <param name="idProvincia"></param>
        /// <returns></returns>
        public List<EntitatHelper> ObtenirLlistaMunicipis(decimal idProvincia)
        {
            try
            {

                List<EntitatHelper> mp = _appinyaDbContext.Municipi.Include(mu => mu.IdProvinciaNavigation).Where(it => it.IdProvincia == idProvincia).Select(t => new EntitatHelper() { Id = t.IdMunicipi, Descripcio = t.Descripcio }).ToList();
                if (mp == null)
                    return new List<EntitatHelper>();
                else
                    return mp;

            }
            catch (Exception e)
            {
                LogError("Error en ObtenirLlistaMunicipis", e);
                throw;
            }

        }
        /// <summary>
        /// Obtenir Llistat de provincies
        /// </summary>
        /// <returns></returns>
        public List<EntitatHelper> ObtenirLlistaProvincies()
        {
            try
            {
                List<EntitatHelper> mp = _appinyaDbContext.Provincia.Select(t => new EntitatHelper() { Id = t.IdProvincia, Descripcio = t.Descripcio }).ToList();
                if (mp == null)
                    return new List<EntitatHelper>();
                else
                    return mp;

            }
            catch (Exception e)
            {
                LogError("Error en ObtenirLlistaMunicipis", e);
                throw;
            }
        }

        /// <summary>
        /// Obtenir Tipus de Noticies
        /// </summary>
        /// <returns></returns>
        public List<EntitatHelper> ObtenirTipusNoticies()
        {
            try
            {
                List<EntitatHelper> mp = _appinyaDbContext.TipusNoticies.Select(t => new EntitatHelper() { Id = t.Id, Descripcio = t.Descripcio, Icona = t.Icona }).ToList();
                if (mp == null)
                    return new List<EntitatHelper>();
                else
                    return mp;
            }
            catch (Exception e)
            {
                LogError("Error en ObtenirLlistaMunicipis", e);
                throw;
            }

        }

        /// <summary>
        /// Obtenir Tipus de Esdeveniments
        /// </summary>
        /// <returns></returns>
        public List<EntitatHelper> ObtenirTipusEsdeveniments()
        {
            try
            {

                List<EntitatHelper> mp = _appinyaDbContext.TipusEsdeveniment.Select(t => new EntitatHelper() { Id = t.IdTipusEsdeveniment, Descripcio = t.Titol, Icona = t.Icona }).ToList();
                if (mp == null)
                    return new List<EntitatHelper>();
                else
                    return mp;

            }
            catch (Exception e)
            {
                LogError("Error en ObtenirLlistaMunicipis", e);
                throw;
            }
            // Els tipus de Esdeveniments.  
        }
        /// <summary>
        /// Obtenir Llista de posicions
        /// </summary>
        /// <returns></returns>
        public List<EntitatHelper> ObtenirTipusPosicions()
        {
            try
            {
                List<EntitatHelper> mp = _appinyaDbContext.Posicio.Select(t => new EntitatHelper() { Id = t.IdPosicio, Descripcio = t.Descripcio, Icona = t.Icona }).ToList();
                if (mp == null)
                    return new List<EntitatHelper>();
                else
                    return mp;

            }
            catch (Exception e)
            {
                LogError("Error en ObtenirLlistaMunicipis", e);
                throw;
            }
            // Els tipus de Esdeveniments.  
        }
        /// <summary>
        /// Obtenir Tipus de Responsables
        /// </summary>
        /// <returns></returns>
        public List<EntitatHelper> ObtenirTipusResponsable()
        {
            try
            {
                List<EntitatHelper> mp = _appinyaDbContext.TipusResponsable.Select(t => new EntitatHelper() { Id = t.IdTipusResponsable, Descripcio = t.Descripcio }).ToList();
                if (mp == null)
                    return new List<EntitatHelper>();
                else
                    return mp;

            }
            catch (Exception e)
            {
                LogError("Error en ObtenirLlistaMunicipis", e);
                throw;
            }
            // Els tipus de Esdeveniments.  
        }
        /// <summary>
        /// Obtenir Tipus de Responsables
        /// </summary>
        /// <returns></returns>
        public List<EntitatHelper> ObtenirTipusCastell()
        {
            try
            {
                List<EntitatHelper> mp = _appinyaDbContext.TipusCastells.Where(t => t.Prova == false).Select(t => new EntitatHelper() { Id = t.Id, Descripcio = t.Castell }).ToList();
                if (mp == null)
                    return new List<EntitatHelper>();
                else
                    return mp;

            }
            catch (Exception e)
            {
                LogError("Error en ObtenirTipusCastell", e);
                throw;
            }

        }
        public List<EntitatHelper> ObtenirTipusProves()
        {
            try
            {
                List<EntitatHelper> mp = _appinyaDbContext.TipusCastells.Where(t => t.Prova == true).Select(t => new EntitatHelper() { Id = t.Id, Descripcio = t.Castell }).ToList();
                if (mp == null)
                    return new List<EntitatHelper>();
                else
                    return mp;

            }
            catch (Exception e)
            {
                LogError("Error en ObtenirTipusCastell", e);
                throw;
            }

        }
        public List<EntitatHelper> ObtenirTipusEstatCastell()
        {
            try
            {
                List<EntitatHelper> mp = _appinyaDbContext.TipusEstatCastell.Select(t => new EntitatHelper() { Id = t.Id, Descripcio = t.Estat }).ToList();
                if (mp == null)
                    return new List<EntitatHelper>();
                else
                    return mp;

            }
            catch (Exception e)
            {
                LogError("Error en ObtenirTipusCastell", e);
                throw;
            }

        }
        public List<EntitatHelper> ObtenirTipusDocuments()
        {
            try
            {
                List<EntitatHelper> mp = _appinyaDbContext.TipusDocument.Select(t => new EntitatHelper() { Id = t.Id, Descripcio = t.Document }).ToList();
                if (mp == null)
                    return new List<EntitatHelper>();
                else
                    return mp;

            }
            catch (Exception e)
            {
                LogError("Error en ObtenirTipusCastell", e);
                throw;
            }

        }
        /// <summary>
        /// Obtenir tots els tipus basics
        /// </summary>
        /// <returns></returns>
        public TipusBasicsActualitzacioModel ObtenirTipusBasics()
        {
            try
            {


                DateTime ara = _appinyaDbContext.Actualitzacions.Select(t => t.DataModificacio).Max();
                return new TipusBasicsActualitzacioModel()
                {
                    DataActualitzacio = ara,
                    TipusPosicio = ObtenirTipusPosicions(),
                    TipusEsdeveniments = ObtenirTipusEsdeveniments(),
                    TipusNoticies = ObtenirTipusNoticies(),
                    TipusRelacio = ObtenirTipusResponsable(),
                    TipusCastells = ObtenirTipusCastell(),
                    TipusProves = ObtenirTipusProves(),
                    TipusEstatCastells = ObtenirTipusEstatCastell(),
                    TipusDocuments = ObtenirTipusDocuments()
                };

            }
            catch (Exception e)
            {
                LogError("Error en ObtenirLlistaMunicipis", e);
                throw;
            }
            // Els tipus de Esdeveniments.  
        }
    }
}
