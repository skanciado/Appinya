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
   [Route("api/v{version:apiVersion}/[controller]")]
    public class DeutesController : BaseController<DeutesController>
    {
        #region Variables privades
        private readonly AppSettings _appSettings;
        private readonly ICastellerService _castellerService; 
        #endregion

        public DeutesController(
         ILogger<DeutesController> logger,
         IOptions<AppSettings> appSettings,
         ICastellerService castellerService,
         IStringLocalizer<DeutesController> localizer
         ) : base(localizer,logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appSettings = appSettings.Value;
            _castellerService = castellerService; 
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }


        [HttpPut]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TRESORER)]

        public async Task<RespostaAmbRetorn<DeuteModel>> RegistrarDeute([FromBody]DeuteModel deute)
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return await _castellerService.DesarDeute(deute, this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TRESORER)]

        [Route("{idDeute}")]
        public async Task<Resposta> EsborrarDeute(int idDeute)
        {

            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return await _castellerService.EsborrarDeute(idDeute, this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TRESORER)]

        public async Task<RespostaAmbRetorn<DeuteModel>> ModificarDeute([FromBody]DeuteModel deute)
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return await _castellerService.DesarDeute(deute, this.User);

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

        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [HttpGet]
        [Route("usuariactual")]
        public async Task<IList<DeuteModel>> ObtenirDeutesCasteller()
        { 
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return await  _castellerService.ObtenirDeuteCasteller(this.User);

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

        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TRESORER)]
        [HttpGet]
        [Route("casteller/{idCasteller}")]
        public IList<DeuteModel> ObtenirDeutes(int idCasteller, int regIni=0)
        {
            try
            {
                LogEntra();

                String usuari = ObtenirUsuari();
                return _castellerService.ObtenirDeutePaginat(null, idCasteller, false, regIni);

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

        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TRESORER)]
        [HttpPost]
        [Route("cerca")]
        public IList<DeuteModel> ObtenirDeutes([FromBody]CercaModel cerca)
        {
            try
            {
                LogEntra();
                if (cerca == null) throw new  ArgumentNullException(nameof(cerca));
                String usuari = ObtenirUsuari();
                String[] arrs = cerca.Opcions.Split(';'); 
                return _castellerService.ObtenirDeutePaginat(cerca.Text, (String.IsNullOrEmpty(arrs[0])) ? 0 : int.Parse(arrs[0]), Boolean.Parse(arrs[1]), cerca.RegIni);

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
