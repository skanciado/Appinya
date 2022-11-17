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

using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

using AppinyaServerCore.Database;
using AppinyaServerCore.Database.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Localization;
using System.Threading.Tasks;
using AppinyaServerCore.Models; 
using AppinyaServerCore.Helpers;
namespace AppinyaServerCore.Services
{
    public interface ITemporadaService
    {
        public Temporada ObtenirTemporadaActual();

        public List<TemporadaModel> ObtenirTemporades();
        
        public Temporada ObtenirTemporadaPerData(DateTime dt);

         
        public Temporada ObtenirTemporada(int idTemporada);
    }

    public class TemporadaService : AppinyaBaseService<TemporadaService>, ITemporadaService
    {


        private readonly AppinyaDbContext _appinyaDbContext;
        private readonly IAutentificacioService _autenticacioService;

        public TemporadaService(
            AppinyaDbContext appinyaDbContext,
            IUsuariService usuariService,
            ILogger<TemporadaService> logger,
            IStringLocalizer<TemporadaService> localizer
            ) : base(usuariService, localizer, logger)
        {
            _appinyaDbContext = appinyaDbContext;
        }
        /// <summary>
        /// Obtenir la temporada actual
        /// </summary>
        /// <returns></returns>
        public Temporada ObtenirTemporadaActual()
        {
            DateTime dt = DateTime.Now;
            var temp = _appinyaDbContext.Temporada.Where(it => it.DataInici <= dt && it.DataFin >= dt).FirstOrDefault();
            return temp;
        }

        /// <summary>
        /// Obtenir la llista de temporades
        /// </summary>
        /// <returns></returns>
        public List<TemporadaModel> ObtenirTemporades()
        {

            DateTime dt = DateTime.Now;
            return _appinyaDbContext.Temporada.Select<Temporada,TemporadaModel> ( t=>t).ToList();

        }
        /// <summary>
        /// Obtenir la temporada de la data objectiu
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public Temporada ObtenirTemporadaPerData(DateTime dt)
        {

            return _appinyaDbContext.Temporada.Where(it => it.DataInici <= dt && it.DataFin >= dt).First();

        }

       
        /// <summary>
        /// Obtenir la temporada del identificador
        /// </summary>
        /// <param name="idTemporada">id temporada</param>
        /// <returns></returns>
        public Temporada ObtenirTemporada(int idTemporada)
        {

            return _appinyaDbContext.Temporada.Where(it => it.Id == idTemporada).First();

        }
    }
}
