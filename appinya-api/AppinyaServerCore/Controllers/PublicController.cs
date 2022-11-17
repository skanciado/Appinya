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
    [ApiVersion("1.0")]
    [AllowAnonymous] 
    [Route("api/v{version:apiVersion}/[controller]")]
    public class PublicController : BaseController<ControlDeVersioController>
    {

        #region Variables privades
        private readonly AppSettings _appSettings;
        public readonly IEmailService _emailService;
        #endregion

        public PublicController(
         ILogger<ControlDeVersioController> logger,
         IOptions<AppSettings> appSettings,
         IEmailService emailService,
         IControlVersioService controlVersioService,
         IStringLocalizer<ControlDeVersioController> localizer
         ) : base(localizer,logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appSettings = appSettings.Value;
            _emailService = emailService;
        } 
        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }
        [HttpGet]
        [Route("store/{Store}")]
        public RedirectResult AnarAlStore(Int32 Store)
        {
            try
            {
                LogEntra();
                switch(Store)
                {
                    case 1:
                        return Redirect($"{_appSettings.UrlGooglePlay}");
                    case 2:
                        return Redirect($"{_appSettings.UrlAppleStore}");
                    default:
                        return Redirect($"{_appSettings.UrlWebApp}");
                }
                
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
        [HttpPost]
        [Route("contactar")]
        public RedirectResult Contactar([FromForm]ContactarModel contactar)
        {
            try
            {
                LogEntra();
                 
                _emailService.EnviarParticiparEmail(contactar.Email, contactar.Comentari + ", nom:" + contactar.Nom, contactar.TipusContacte);
                return (Redirect($"../../../index.html?reload=true"));

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
