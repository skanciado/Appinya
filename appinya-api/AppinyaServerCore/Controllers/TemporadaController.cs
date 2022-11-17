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
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using AppinyaServerCore.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;
using System.Text;
using System;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using AppinyaServerCore.Helpers;
using System.Security.Claims;
using AppinyaServerCore.Services;
using Microsoft.Extensions.Localization; 
using AppinyaServerCore.Database;

namespace AppinyaServerCore.Controllers
{
    /// <summary>
    /// Clase de gestio de funcions de l Usuari de l aplicacio 
    /// </summary> 
    ///  


    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class TemporadaController : BaseController<TemporadaController>
    {

        #region Variables privades
        private readonly AppSettings _appSettings;
        private readonly ITemporadaService _temporadaService; 
        #endregion

        public TemporadaController(
         ILogger<TemporadaController> logger, 
         ITemporadaService temporadaService,
         IStringLocalizer<TemporadaController> localizer
         ) : base(localizer,logger)
        {  
            _temporadaService = temporadaService; 
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }
        /**
         * GET api/usuari Recull la informacio del usuari
         */
        [AllowAnonymous]
        [HttpGet] 
        public TemporadaModel ObtenirTemporadaActual ()
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return  _temporadaService.ObtenirTemporadaActual();

            }
            catch (Exception e)
            {
                LogError(e);
                throw;
            }
            finally
            {
                LogSurt();
            }

        }

        [AllowAnonymous]
        [HttpGet]
        [Route("cercar")]
        public IList<TemporadaModel> ObtenirTemporadas()
        {

            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return _temporadaService.ObtenirTemporades();

            }
            catch (Exception e)
            {
                LogError(e);
                throw;
            }
            finally
            {
                LogSurt();
            }

        }
    }
}
