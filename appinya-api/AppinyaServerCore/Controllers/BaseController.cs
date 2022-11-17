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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Web;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using AppinyaServerCore.Helpers;
using AppinyaServerCore.Models;
using Microsoft.Extensions.Localization;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Http;

namespace AppinyaServerCore.Controllers
{

    /**
     * Abstraccion de la capa de servicios
     */
    public abstract class BaseController <T>: ControllerBase
    {
        private readonly ILogger<T> _logger;
        protected readonly IStringLocalizer<T> _localizer;

        public BaseController(IStringLocalizer<T> localizer, ILogger<T> logger )
        {
            
            _localizer = localizer;
            _logger = logger;

        }

#pragma warning disable CA1055 // Los valores devueltos URI no deben ser cadenas
        protected string ObtenirURLServidor()
#pragma warning restore CA1055 // Los valores devueltos URI no deben ser cadenas
        {
            string url = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            return url;
        }
        /*
         * Obtiene el nombre de la session
         */
        protected String ObtenirUsuari()
        {
            var usuari = this.User.Identity.Name;
            return usuari;
        }
        protected Boolean esRolTecnic()
        {
            return SeguretatHelper.esRolTecnic(this.User);
        }
        protected Boolean esRolTecnicNivel2()
        {
            return SeguretatHelper.esRolTecnicNivell2(this.User);
        }
        protected Boolean esRolJunta()
        {
            return SeguretatHelper.esRolJunta(this.User);
        }
        protected Boolean esRolSecretari()
        {
            return SeguretatHelper.esRolSecretari(this.User);
        }
        protected Boolean esRolBar()
        {
            return SeguretatHelper.esRolBar(this.User);
        }
        protected Boolean esRolCasteller()
        {
            return SeguretatHelper.esRolCasteller(this.User);
        }
        protected Boolean esRolMusic()
        {
            return SeguretatHelper.esRolMusic(this.User);
        }

        protected Boolean esRolAdmin()
        {
            return SeguretatHelper.esRolAdmin(this.User);
        }
        public RespostaAmbRetorn<Y> CrearRespotaAmbRetornOK<Y>(Y ret)
        {
            return new RespostaAmbRetorn<Y>()
            {
                Correcte = true,
                Missatge = _localizer["Correcte"],
                Retorn = ret
            };
        }
        public RespostaAmbRetorn<Y> CrearRespotaAmbRetornError<Y>(String msg, Y ret)
        {
            return new RespostaAmbRetorn<Y>()
            {
                Correcte = false,
                Missatge = msg,
                Retorn = ret
            };
        }
        protected Boolean esRolCapMusic()
        {
            return SeguretatHelper.esRolCapMusic(this.User);
        }
        protected Boolean esRolOrganitzador()
        {
            return SeguretatHelper.esRolOrganitzador(this.User);
        }
        protected void LogEntra()
        {
            _logger.LogInformation($"{System.Reflection.MethodBase.GetCurrentMethod().Name} \t Petició de {ObtenirUsuari()},\t >> Entrar ");
        }
        protected void LogEntra(params Object[] entrada)
        {
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < entrada.Length; i++)
            {
                builder.Append(entrada[i]);
                builder.Append(",");
            }

            _logger.LogInformation($"{System.Reflection.MethodBase.GetCurrentMethod().Name} \t Petició de {ObtenirUsuari()},\t >> Entrar (params: { builder.ToString() }) ");
        }
        protected void LogSurt()
        {
            _logger.LogInformation($"{System.Reflection.MethodBase.GetCurrentMethod().Name} \t Petició de {ObtenirUsuari()},\t << Surt ");
        }
        protected void LogInfo(String msg, params object[] parameters)
        {
            _logger.LogInformation($"{System.Reflection.MethodBase.GetCurrentMethod().Name} \t Petició de {ObtenirUsuari()},\t  {msg} ", parameters);
        }
        protected void LogWarning(String msg, params object[] parameters)
        {
            _logger.LogWarning($"{ System.Reflection.MethodBase.GetCurrentMethod().Name} \t Petició de {ObtenirUsuari()},\t   {msg} ", parameters);
        }

        protected void LogError(String msg, params object[] parameters)
        {
            _logger.LogError($"{ System.Reflection.MethodBase.GetCurrentMethod().Name} \t Petició de {ObtenirUsuari()},\t  msg: {msg} ", parameters);
        }
        protected void LogError(Exception ex)
        {
            if (ex == null)
                _logger.LogError($"{ System.Reflection.MethodBase.GetCurrentMethod().Name} \t Petició de {ObtenirUsuari()},\t  msg: no definit ");
            else
                _logger.LogError($"{ System.Reflection.MethodBase.GetCurrentMethod().Name} \t Petició de {ObtenirUsuari()},\t  msg: {ex.Message} ");
        }
        protected void LogDebug(String msg, params object[] parameters)
        {
            _logger.LogDebug($"{ System.Reflection.MethodBase.GetCurrentMethod().Name} \t Petició de {ObtenirUsuari()},\t  msg: {msg} ", parameters);
        }

        // Reference: https://tools.ietf.org/html/rfc7232#section-4.1
        public IActionResult FileOrNotModified(byte[] fileContents, string contentType, DateTimeOffset lastModified)
        {
            var etag = new EntityTagHeaderValue($"\"{lastModified.Ticks:x}\"");

            var reqHeaders = Request.GetTypedHeaders();

            if (reqHeaders.IfNoneMatch.Any(x => x.Compare(etag, false))
                || (reqHeaders.IfModifiedSince.HasValue && lastModified <= reqHeaders.IfModifiedSince.Value))
            {
                var resHeaders = Response.GetTypedHeaders();

                resHeaders.ETag = etag;
                resHeaders.LastModified = lastModified;

                return StatusCode(StatusCodes.Status304NotModified);
            }

            return File(fileContents, contentType, lastModified, etag);
        }
    }

}
