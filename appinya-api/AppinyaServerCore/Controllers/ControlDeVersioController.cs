﻿/**
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
using AppinyaServerCore.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;  
using System; 
using Microsoft.Extensions.Options;
using AppinyaServerCore.Helpers;
using System.Security.Claims;
using AppinyaServerCore.Services;
using Microsoft.Extensions.Localization; 

namespace AppinyaServerCore.Controllers
{
    [ApiVersion("1.0")]
    [AllowAnonymous] 
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ControlDeVersioController : BaseController<ControlDeVersioController>
    {

        #region Variables privades
        private readonly AppSettings _appSettings;
        private readonly IControlVersioService _controlVersioService; 
        #endregion

        public ControlDeVersioController(
         ILogger<ControlDeVersioController> logger,
         IOptions<AppSettings> appSettings,
         IControlVersioService controlVersioService,
         IStringLocalizer<ControlDeVersioController> localizer
         ) : base(localizer,logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appSettings = appSettings.Value;
            _controlVersioService = controlVersioService; 
        } 
        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }
        [HttpGet]
        [Route("validar")]
        public ControlDeVersioModel Validar(Int32 versioDB, Int32 versioApp)
        {
            try
            {
                LogEntra(); 
                return _controlVersioService.ValidarVersio(versioDB, versioApp);

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
        [HttpGet] 
        public ControlDeVersioModel ObtenirVersio()
        {
            try
            {
                LogEntra(); 
                return _controlVersioService.ObtenirUltimaVersio();

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
