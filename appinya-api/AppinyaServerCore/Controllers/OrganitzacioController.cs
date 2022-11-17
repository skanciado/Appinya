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
using System.IO;
using System.Net.Http;
using AppinyaServerCore.Database.Identity; 

namespace AppinyaServerCore.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class OrganitzacioController : BaseController<OrganitzacioController>
    {
        #region Attributes;  
        private readonly AppSettings _appSettings;
        private readonly IOrganitzacioService _organitzacioService;    

        #endregion; 

        public OrganitzacioController(
            ILogger<OrganitzacioController> logger,
            IOptions<AppSettings> appSettings,
            IOrganitzacioService organitzacioService,  
            IStringLocalizer<OrganitzacioController> localizer
            ) : base(localizer, logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings)); 
            _appSettings = appSettings.Value;
            _organitzacioService = organitzacioService; 
        }


        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {

            return "Echo:" + this.GetType();

        }



        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER)] 
        public IList<OrganitzacioModel> ObtenirOrganitzacio()
        {
            try
            {  
                LogEntra();

                return _organitzacioService.ObtenirOrganitzacio(this.User);
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

        [HttpDelete]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ADMINISTRADOR)]
        public  Resposta EsborrarOrganitzacio([FromBody] OrganitzacioAccioModel op)
        {
            try
            {
                LogEntra();
                return this._organitzacioService.EsborrarOrganitzacio(op, this.User);
               
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
        [HttpPut]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ADMINISTRADOR)]
        public  RespostaAmbRetorn<OrganitzacioModel> AgregarOrganitzacio([FromBody] OrganitzacioAccioModel op)
        {
            try
            {
                LogEntra();
                return this._organitzacioService.CrearOrganitzacio(op, this.User);


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
