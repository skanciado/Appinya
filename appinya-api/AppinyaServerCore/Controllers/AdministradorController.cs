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
using Microsoft.AspNetCore.Authorization;

using System.Threading.Tasks;
using AppinyaServerCore.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using AppinyaServerCore.Helpers;
using AppinyaServerCore.Services;
using Microsoft.Extensions.Localization;
using AppinyaServerCore.Api.Entities;
using AppinyaLib.Api.Entities;

namespace AppinyaServerCore.Controllers
{
    [ApiVersion("1.0")]
    /// <summary>
    /// Publicacions Controller
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR)]

    public class AdministradorController : BaseController<AdministradorController>
    {
        #region Variables privades 
        private readonly IUsuariService _usuariService;
        private readonly ICastellerService _castellerService;
        private readonly IAutentificacioService _autentificacioService;
        public AdministradorController(
         ILogger<AdministradorController> logger,
         IUsuariService usuariService,
         ICastellerService castellerService,
         IAutentificacioService autentificacioService,
        IStringLocalizer<AdministradorController> localizer
         ) : base(localizer, logger)
        {
            _usuariService = usuariService;
            _castellerService = castellerService; 
            _autentificacioService = autentificacioService;
        }
        #endregion
        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }


        [HttpPut]
        [Route("usuaris")]
        public async Task<RespostaAmbRetorn<int>> CrearUsuaris([FromBody] IList<UsuariModel> usuaris)
        {
            try
            {
                if (usuaris == null) throw new ArgumentException(nameof(usuaris));
                LogEntra(usuaris.Count);
                String usuari = ObtenirUsuari();
                return await _usuariService.CrearUsuaris(usuaris, this.User);

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

        /// <summary>
        /// Obtenir l'usuari amb l'id indicat (sense vincle de casteller)
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("subplantar/{id}")]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR)]
        public async Task<UsuariSessio> Subplantar(int id)
        {
            try
            {
                LogEntra();
                CastellerModel cas = await _castellerService.ObtenirCasteller(id, this.User);
                return await _autentificacioService.ObtenirUsuariValidacio(cas.Email);
            }
            catch (Exception e)
            {
                LogError(e);
                throw e;
            }
            finally
            {
                LogSurt();
            }
        }

    }
}
