/**
 *  Appinya Open Source Project
 *  Copyright (C) 2021  Daniel Horta Vidal
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
    /**
     * Servicios para la gestion de esdevenimientos 
     */
    [ApiVersion("1.0")] 
    [Route("api/v{version:apiVersion}/[controller]")]
    public class EsdevenimentsController : BaseController<EsdevenimentsController>
    {
        #region Variables privades
        private readonly AppSettings _appSettings;
        private readonly IEsdevenimentsService _esdevenimentsService; 
        #endregion

        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }

        public EsdevenimentsController(
        ILogger<EsdevenimentsController> logger,
        IOptions<AppSettings> appSettings,
        IEsdevenimentsService esdevenimentsService,
        IStringLocalizer<EsdevenimentsController> localizer
        ) : base(localizer,logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appSettings = appSettings.Value;
            _esdevenimentsService = esdevenimentsService; 
        }
 
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [HttpPost]
        [Route("cercar")]
        public async Task<IList<EsdevenimentResumModel>> CercarEsdeveniments([FromBody]CercaModel cerca)
        {

            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                if (cerca == null)
                    return  await  _esdevenimentsService.ObtenirLlistaEsdeveniments(null, this.User);
                else
                    return await _esdevenimentsService.ObtenirLlistaEsdeveniments(cerca, this.User);

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
        public async Task<IList<EsdevenimentResumModel>> CercarEsdeveniments()
        {

            try
            {
                LogEntra();
                String usuari = ObtenirUsuari(); 
                return await _esdevenimentsService.ObtenirLlistaEsdeveniments(this.User);

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
        public async Task<IList<EsdevenimentResumModel>> CercarEsdevenimentsActuals([FromBody]CercaModel cerca)
        {

            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.ObtenirLlistaEsdevenimentsActuals(cerca, this.User);

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
        [Route("historic")]
        public async Task<IList<EsdevenimentResumModel>> CercarEsdevenimentsHistoric([FromBody]CercaModel cerca)
        {

            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.ObtenirLlistaEsdevenimentsHistoric(cerca,this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [Route("{id}")]
        public async Task<EsdevenimentDetallModel> ObtenirEsdeveniment(int id)
        {
            try
            {
                LogEntra(id);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.ObtenirDetall(id, this.User);
              
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
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [Route("actualitzacio")]
        public async Task<EsdevenimentDetallModel> ObtenirEsdeveniment([FromBody]PeticioActualitzacioIdModel peticio)
        {
            try
            {
                if (peticio == null) throw new ArgumentNullException(nameof(peticio));
                LogEntra(peticio.Id);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.ObtenirDetall(peticio, this.User);

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

        // HttpGet: api/Esdeveniment/backoffice/esborrar
        [HttpDelete]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ORGANITZADOR + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_CAPMUSIC)]
        [Route("{id}")]
        public async Task<Resposta> Esborrar(int id)
        {
            try
            {
                LogEntra(id);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.Esborrar(id, this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ORGANITZADOR + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_CAPMUSIC)]
      
        public async Task<RespostaAmbRetorn<EsdevenimentModel>> ModificarEsdeveniment([FromBody]EsdevenimentModel esdeveniment)
        {
            try
            {
                if (esdeveniment == null) throw new ArgumentNullException(nameof(esdeveniment));
                LogEntra(esdeveniment.Id);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.Desar(esdeveniment, this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ORGANITZADOR + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_CAPMUSIC)]
         public async Task<RespostaAmbRetorn<EsdevenimentModel>> RegistrarEsdeveniment([FromBody]EsdevenimentModel esdeveniment)
        {
            try
            {
                if (esdeveniment == null) throw new ArgumentNullException(nameof(esdeveniment));
                LogEntra(esdeveniment.Id);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.Desar(esdeveniment, this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_TECNICA_v2)]
        [Route("castell/{idEsdevemiment}")]
        public async Task<Resposta> EstatCastell(int idEsdevemiment, int idTipusCastell,int idEstat)
        {
            try
            {
                LogEntra(idEsdevemiment);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.EstatCastell(idEsdevemiment, idTipusCastell, idEstat, this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_TECNICA_v2)]
        [Route("castell")]
        public async Task<RespostaAmbRetorn<EsdevenimentCastellModel>> ModificarCastell([FromBody] EsdevenimentCastellModel castell)
        {
            try
            {
                if (castell == null) throw new ArgumentNullException(nameof(castell));
                LogEntra(castell.Id);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.ModificarCastell(castell, this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_TECNICA_v2)]
        [Route("castell/{idcastell}")]
        public async Task<Resposta> EsborrarCastell( int idcastell)
        {
            try
            {
                if (idcastell == 0) throw new ArgumentNullException(nameof(idcastell));
                LogEntra(idcastell);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.EsborrarCastell(idcastell, this.User); 
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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ORGANITZADOR + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_CAPMUSIC)]
        [Route("desbloquejar/{id}")]
        public async Task<Resposta> DesBloquejar(int id)
        { 
            try
            {
                 LogEntra(id);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.DesBloquejar(id, this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [Route("valorar/{idEsdeveniment}")]
        public async Task<Resposta> Bloquejar(int idEsdeveniment,int valor)
        {
            try
            {
                LogEntra(idEsdeveniment);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.Valorar(idEsdeveniment, valor, this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ORGANITZADOR + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_CAPMUSIC)]
        [Route("bloquejar/{id}")]
        public async Task<Resposta> Bloquejar(int id)
        {
            try
            {
                LogEntra(id);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.Bloquejar(id, this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ORGANITZADOR + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_CAPMUSIC)]
        [Route("anular/{id}")]
        public async Task<Resposta> Anular(int id)
        {

            try
            {
                LogEntra(id);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.Anular(id, this.User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ORGANITZADOR + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_CAPMUSIC)]
        [Route("activar/{id}")]
        public async Task<Resposta> Activar(int id)
        {
            try
            {
                LogEntra(id);
                String usuari = ObtenirUsuari();
                return await _esdevenimentsService.Activar(id, this.User);

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
