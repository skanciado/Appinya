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
using AppinyaServerCore.Database.Appinya;
using AppinyaServerCore.Database;
namespace AppinyaServerCore.Controllers
{
    [ApiVersion("1.0")]
    [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_CAPMUSIC)]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class TecnicsController : BaseController<TecnicsController>
    {

        #region Variables privades 
        private readonly ICastellerService _castellerService; private readonly IEsdevenimentsService _esdevenimentService;
        #endregion

        public TecnicsController(
        ILogger<TecnicsController> logger,
        ICastellerService castellerService, IEsdevenimentsService esdevenimentService,
        IStringLocalizer<TecnicsController> localizer
        ) : base(localizer,logger)
        {
            _castellerService = castellerService;
            _esdevenimentService = esdevenimentService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }
        [HttpGet]
        [Route("casteller/{id}")]
        public async Task<CastellerDetallModel> Cercar(int id)
        {

            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return await _castellerService.ObtenirCastellerDetall(id,User);

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
        // Modify: api/Esdeveniment/backoffice
        [HttpPost]
        [Route("casteller")]
        public Resposta Modificar([FromBody]CastellerModel dadesTecniques)
        {

            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return _castellerService.DesarDadesTecniques(dadesTecniques,this.User);

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
