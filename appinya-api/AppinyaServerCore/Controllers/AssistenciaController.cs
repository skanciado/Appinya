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
using Microsoft.Extensions.Options;
using AppinyaServerCore.Helpers;
using AppinyaServerCore.Services;
using Microsoft.Extensions.Localization;

namespace AppinyaServerCore.Controllers
{
    /// <summary>
    ///Servicios para la gestion de esdevenimientos 
    /// </summary>
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class AssistenciaController : BaseController<AssistenciaController>
    {
        #region Variables privades
        private readonly AppSettings _appSettings;
        private readonly IAssistenciaService _assistenciaService;
        #endregion

        public AssistenciaController(
         ILogger<AssistenciaController> logger,
         IOptions<AppSettings> appSettings,
         IAssistenciaService assistenciaService,
         IStringLocalizer<AssistenciaController> localizer
         ) : base(localizer, logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appSettings = appSettings.Value;
            _assistenciaService = assistenciaService;

        }

        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }


        [HttpPut]
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        public async Task<ActionResult<Resposta>> RegistrarAssistencia([FromBody] IList<AssistenciaModel> lstAssitencia)
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();

                LogInfo("AssistenciaModel Confirmarcio" + usuari);
                return await _assistenciaService.ConfirmarAssitencia(lstAssitencia, User);

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
        [AllowAnonymous]
        [Route("confirmar/{idcasteller}/{idEsdeveniment}/{confirmat}")]
        public async Task<RedirectResult> ConfirmarAssistenciaEmail(int idcasteller, int idEsdeveniment, int confirmat, string token)
        {
            try
            {
                LogEntra(idcasteller, idEsdeveniment, confirmat);
                String usuari = ObtenirUsuari();
                String url = ObtenirURLServidor();
                LogInfo("AssistenciaModel mailconfirm id:" + idcasteller + " idEsdeveniment:" + idEsdeveniment);
                Resposta res = await _assistenciaService.ConfirmacioAssistenciaEmail(token, idEsdeveniment, idcasteller, confirmat == 1);
                if (res.Correcte)
                    return Redirect($"{url}/email-flow/ResultatEmail/ConfirmacioEsdeveniment.html");
                else
                    return Redirect($"{url}/email-flow/ResultatEmail/ConfirmacioEsdevenimentKO.html");

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
        /// Obtenir Assitenacia del Usuari i els seus acompanyants
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [Route("{id}")]
        public async Task<IList<AssistenciaModel>> ObtenirAssistenciaUsuari(int id)
        {

            try
            {
                LogEntra(id);
                String usuari = ObtenirUsuari();
                return await _assistenciaService.ObtenirAssistenciaUsuari(id, User);

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
        /// Ofereix detalls de la AssistenciaModel d'un esdeveniment (nomes assitencia positiva)
        /// </summary>
        /// <param name="esdeveniment"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("detall/{idEsdeveniment}")]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_CONFIRMADOR_ASSISTENCIA)]
        public IList<AssistenciaModel> Assistencia(int idEsdeveniment)
        {
            try
            {
                LogEntra(idEsdeveniment);
                String usuari = ObtenirUsuari();

                LogInfo("AssistenciaModel AssitenciaInvitacions" + usuari);
                return _assistenciaService.ObtenirAssistencia(idEsdeveniment);

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
        /// Ofereix detalls de la AssistenciaModel d'un casteller
        /// </summary>
        /// <param name="esdeveniment"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("casteller/{idCasteller}")]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_CONFIRMADOR_ASSISTENCIA)]
        public IList<AssistenciaModel> AssistenciaCasteller(int idCasteller)
        {
            try
            {
                LogEntra(idCasteller);
                String usuari = ObtenirUsuari();

                LogInfo("AssistenciaModel AssitenciaInvitacions" + usuari);
                return _assistenciaService.ObtenirAssistenciaCasteller(idCasteller);

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
        [Route("casteller")]
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        public async Task<IList<AssistenciaModel>> ObtenirAssistenciaCasteller()
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();

                LogInfo("AssistenciaModel AssitenciaInvitacions" + usuari);
                return await _assistenciaService.ObtenirAssistenciaCasteller(User);

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
        /// Exportar AssistenciaModel d'un esdeveniment concret
        /// </summary>
        /// <param name="idEsdeveniment">Identificador del esdeveniment</param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA)]
        [Route("export/{idEsdeveniment}")]
        public Resposta Export(int idEsdeveniment)
        {
            try
            {
                LogEntra(idEsdeveniment);
                String usuari = ObtenirUsuari();
                return _assistenciaService.EnviarExcelAssistencia(idEsdeveniment, usuari);

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
        /// Obtenir la estadistica d'un casteller
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_SECRETARI)]
        [Route("estadistica/{idCasteller}")]
        public async Task<IList<EstadisticaIndividualModel>> EstadisticaUsuari(int idCasteller)
        {
            try
            {
                LogEntra();
                return await _assistenciaService.ObtenirEstadisticaCasteller(idCasteller, User);

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
        /// Exportacio AssistenciaModel global per temporada Versió detallada
        /// </summary>
        /// <param name="idTemporada"> id Temporada </param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_SECRETARI)]
        [Route("export/global/{idTemporada}")]
        public Resposta ExportEstadisticaGlobal(int idTemporada)
        {
            try
            {
                LogEntra(idTemporada);
                String usuari = ObtenirUsuari();

                return _assistenciaService.EnviarExcelAssistenciaGlobal(idTemporada, usuari);

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
        /// Exportacio AssistenciaModel global per temporada Versió detallada
        /// </summary>
        /// <param name="idTemporada"> id Temporada </param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_SECRETARI)]
        [Route("export/resum/{idTemporada}")]
        public Resposta ExportEstadisticaGlobalResum(int idTemporada)
        {
            try
            {
                LogEntra(idTemporada);
                String usuari = ObtenirUsuari();
                return _assistenciaService.EnviarExcelAssistenciaGlobalResum(idTemporada, usuari);

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
        /// Confirmació técnica de la assistencia
        /// </summary>
        /// <param name="lstAssitencia"></param>
        [HttpPost]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ORGANITZADOR + "," + SeguretatHelper.ROL_CAPMUSIC + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_CONFIRMADOR_ASSISTENCIA)]
        [Route("confirmacio")]
        public async Task<Resposta> Confirmacio([FromBody] ConfirmacioAssistenciaModel model)
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();

                if (model == null || model.LstAssistencia == null)
                {
                    throw new ArgumentNullException(nameof(model));
                }
                LogInfo("AssistenciaModel ConfirmacioTecnica" + usuari);
                return await _assistenciaService.ConfirmacioTecnica(model.LstAssistencia, User);

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
        /// Confirmació técnica de la assistencia
        /// </summary>
        /// <param name="lstAssitencia"></param>
        [HttpPost]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_ORGANITZADOR + "," + SeguretatHelper.ROL_CAPMUSIC + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_CONFIRMADOR_ASSISTENCIA)]
        [Route("previsio")]
        public async Task<Resposta> previsioTecnica([FromBody] ConfirmacioAssistenciaModel model)
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();

                if (model == null || model.LstAssistencia == null)
                {
                    throw new ArgumentNullException(nameof(model));
                }
                LogInfo("AssistenciaModel PrevisioAssistencia" + usuari);
                return await _assistenciaService.PrevisioAssistencia(model.LstAssistencia, User);

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
