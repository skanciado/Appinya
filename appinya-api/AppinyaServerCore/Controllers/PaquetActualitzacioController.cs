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
    [Authorize]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class PaquetActualitzacioController : BaseController<PaquetActualitzacioController>
    {
        #region Variables privades
        private readonly AppSettings _appSettings;
        private readonly IPaquetActualitacioService _paquetActualitacioService; 
        #endregion

        public PaquetActualitzacioController(
        ILogger<PaquetActualitzacioController> logger,
        IOptions<AppSettings> appSettings,
        IPaquetActualitacioService paquetActualitacioService,
        IStringLocalizer<PaquetActualitzacioController> localizer
        ) : base(localizer,logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appSettings = appSettings.Value;
            _paquetActualitacioService = paquetActualitacioService; 
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }
        [HttpGet]
        [Route("data")]
        public DateTime ObtenirDataActualitzacio()
        {

            try
            {
                LogEntra( ObtenirUsuari()); 
                return _paquetActualitacioService.ObtenirDataActualitzacio(this.User);

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
        public async Task<RespostaAmbRetorn<PaquetActualitzacioModel>> Public([FromBody] PeticioActualitzacioModel paquetModel)
        {

            try
            {
                if (paquetModel == null) throw new ArgumentNullException(nameof(paquetModel));
                LogEntra(paquetModel.DadesCastellers, paquetModel.DadesJunta, paquetModel.DadesTecnica,ObtenirUsuari());
                String error = "";
                if (paquetModel.DadesCastellers == true && !(esRolCasteller() || esRolMusic()))
                {
                    error = String.Format(_localizer["noautoritzatCastellers"], ObtenirUsuari());
                    LogError(error);
                    return CrearRespotaAmbRetornError<PaquetActualitzacioModel>(error, null);
                }

                if (paquetModel.DadesJunta == true && !(esRolAdmin() || esRolJunta() || esRolSecretari()))
                {
                    error = String.Format(_localizer["noautoritzatJunta"], ObtenirUsuari());
                    LogError(error);
                    return CrearRespotaAmbRetornError<PaquetActualitzacioModel>(error, null);

                }

                if (paquetModel.DadesTecnica == true && !(esRolTecnicNivel2() || esRolTecnic() || esRolAdmin()))
                {
                    error = String.Format(_localizer["noautoritzatTecnic"], ObtenirUsuari());
                    LogError(error);
                    return CrearRespotaAmbRetornError<PaquetActualitzacioModel>(error, null);
                }
                return CrearRespotaAmbRetornOK<PaquetActualitzacioModel>(await _paquetActualitacioService.ObtenirActualitacions(paquetModel,this.User));

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
