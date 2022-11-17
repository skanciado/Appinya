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
using AppinyaServerCore.Entities;

namespace AppinyaServerCore.Controllers
{


    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
    public class TipusBasicsController : BaseController<TipusBasicsController>
    {

        #region Variables privades 
        private readonly ITipusBasicService _tipusBasicService;
        #endregion

        public TipusBasicsController(
         ILogger<TipusBasicsController> logger,
         ITipusBasicService tipusBasicService,
         IStringLocalizer<TipusBasicsController> localizer
         ) : base(localizer, logger)
        {
            _tipusBasicService = tipusBasicService;
        }
        /**
         * GET api/getLlistaMunicipis Recull municipis d'una provincia
         */
        [HttpGet]
        [Route("municipis/{idprovincia}")]
        public IList<EntitatHelper> ObtenirLlistaMunicipis(decimal idProvincia)
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return _tipusBasicService.ObtenirLlistaMunicipis(idProvincia);

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
        /**
         * GET api/getLlistaProvincies Recull provincies
         */
        [HttpGet]
        [Route("provincies")]
        public IList<EntitatHelper> ObtenirLlistaProvincies()
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return _tipusBasicService.ObtenirLlistaProvincies();

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
        /**
         * GET api/getLlistaMunicipis Recull municipis d'una provincia
         */
        [HttpGet]
        [Route("noticies")]
        public IList<EntitatHelper> ObtenirTipusNoticies()
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return _tipusBasicService.ObtenirTipusNoticies();

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
        [Route("esdeveniments")]
        public List<EntitatHelper> ObtenirTipusEsdeveniments()
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return _tipusBasicService.ObtenirTipusEsdeveniments();

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
        [Route("posicions")]
        public List<EntitatHelper> ObtenirTipusPosicions()
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return _tipusBasicService.ObtenirLlistaProvincies();

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
        public TipusBasicsActualitzacioModel ObtenirTipusBasics()
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return _tipusBasicService.ObtenirTipusBasics();

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
