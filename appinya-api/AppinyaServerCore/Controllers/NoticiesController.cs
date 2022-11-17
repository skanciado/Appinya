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
    /// Publicacions Controller
    /// </summary>
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class NoticiesController : BaseController<NoticiesController>
    {
        #region Variables privades
        private readonly AppSettings _appSettings;
        private readonly INoticiaService _noticiaService; 
        #endregion
        public NoticiesController(
        ILogger<NoticiesController> logger,
        IOptions<AppSettings> appSettings,
        INoticiaService noticiaService,
        IStringLocalizer<NoticiesController> localizer
        ) : base(localizer,logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appSettings = appSettings.Value;
            _noticiaService = noticiaService; 
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }

        [AllowAnonymous]
        [HttpGet]
        [Route("fotos/{idNoticies}")]
        public async Task<IActionResult> ObtenirFoto(int idNoticies)
        {
            var (foto, dataModificacio) = await _noticiaService.ObtenirFoto(idNoticies);

            if (foto == null)
            {
                return NotFound();
            }

            var bytes = Utils.WebApiUtils.ParseDataUri(foto, out var contentType);

            return FileOrNotModified(bytes, contentType, dataModificacio);
        }
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [HttpGet]
        [Route("{id}")]
        public  NoticiaModel ObtenirNoticiaPerId(int id)
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return _noticiaService.ObtenirNoticia(id);

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
        [Route("cercar")]
        public IList<NoticiaModel> ObtenirNoticies()
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return  _noticiaService.ObtenirNoticies(null, User);

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
        [HttpPost]
        [Route("actuals")]
        public IList<NoticiaModel> ObtenirActuals([FromBody]CercaModel cerca)
        {
            try
            {
                if (cerca == null) throw new ArgumentNullException(nameof(cerca));
                LogEntra(cerca.RegIni, cerca.Text);
                String usuari = ObtenirUsuari();
                return _noticiaService.ObtenirNoticiesActuals(cerca.RegIni, User); 
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
        [HttpPost]
        [Route("historiques")]
        public IList<NoticiaModel> ObtenirHistoric([FromBody]CercaModel cerca)
        {
            try
            {
                if (cerca == null) throw new ArgumentNullException(nameof(cerca));
                LogEntra(cerca.RegIni,cerca.Text);
                String usuari = ObtenirUsuari();
                return _noticiaService.ObtenirNoticiesHistoriques(cerca.RegIni, User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_NOTICIER + "," + SeguretatHelper.ROL_BAR + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_ORGANITZADOR)]
       
        public async  Task<RespostaAmbRetorn<NoticiaModel>> EditarNoticia([FromBody]NoticiaModel not)
        {
            try
            {

                if (not == null) throw new ArgumentNullException(nameof(not));
                LogEntra(not.Id);
                String usuari = ObtenirUsuari();
                return await _noticiaService.EditarNoticia(not, this.User); 
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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_NOTICIER + "," + SeguretatHelper.ROL_BAR + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_ORGANITZADOR)]
        public async Task<RespostaAmbRetorn<NoticiaModel>> RegistrarNoticia([FromBody]NoticiaModel not)
        {
            try
            {
                if (not == null) throw new ArgumentNullException(nameof(not));

                LogEntra(not.Id);
                String usuari = ObtenirUsuari();
                return await _noticiaService.EditarNoticia(not, this.User);

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
        [HttpDelete ]
        [Route("{id}")]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_NOTICIER + "," + SeguretatHelper.ROL_BAR + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_ORGANITZADOR)]
        public Resposta EsborrarNoticia(int id)
        {
            try
            {
                LogEntra(id);
                String usuari = ObtenirUsuari();
                return _noticiaService.EsborrarNoticia(id, User);

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
