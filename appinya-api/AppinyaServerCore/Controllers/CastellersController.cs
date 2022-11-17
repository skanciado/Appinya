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
    public class CastellersController : BaseController<CastellersController>
    {
        #region Variables privades
        private readonly AppSettings _appSettings;
        private readonly ICastellerService _castellerService;
        private readonly IAssistenciaService _assistenciaService;
        private readonly IUsuariService _usuariService;
        #endregion
        public CastellersController(
         ILogger<CastellersController> logger,
         IOptions<AppSettings> appSettings,
         ICastellerService castellerService,
         IAssistenciaService assistenciaService,
         IUsuariService usuariService,
         IStringLocalizer<CastellersController> localizer
         ) : base(localizer, logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appSettings = appSettings.Value;
            _castellerService = castellerService;
            _assistenciaService = assistenciaService;
            _usuariService = usuariService;
        }

        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR)]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }

        /// <summary>
        /// Obtenir Assitencia d'un casteller pel seu Id
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <param name="idTemporada"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_ORGANITZADOR + "," + SeguretatHelper.ROL_CAPMUSIC + "," + SeguretatHelper.ROL_SECRETARI)]
        [Route("assistencia/{idCasteller}")]
        public IList<AssistenciaModel> AssistenciaUsuari(int idCasteller, int? idTemporada = null)
        {
            try
            {
                LogEntra();
                if (idTemporada.HasValue)
                    return _assistenciaService.ObtenirAssistenciaCasteller(idCasteller, idTemporada.Value);
                else
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
        /// <summary>
        /// Obtenir la estadistica indivudial d'un casteller
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <param name="idTemporada"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_CAMISES)]
        [Route("estadistica/{idCasteller}")]
        public async Task<IList<EstadisticaIndividualModel>> EstadisticaCasteller(int idCasteller, int? idTemporada = null)
        {
            try
            {
                LogEntra();
                if (idTemporada.HasValue)
                    return await _assistenciaService.ObtenirEstadisticaCasteller(idCasteller, idTemporada.Value, User).ConfigureAwait(false);
                else
                    return await _assistenciaService.ObtenirEstadisticaCasteller(idCasteller, User).ConfigureAwait(false);



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
        /// Esborrar Casteller de la base de dades
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER)]
        [Route("{idCasteller}")]
        public async Task<CastellerModel> ObtenirCasteller(int idCasteller)
        {
            try
            {
                LogEntra();
                return await _castellerService.ObtenirCasteller(idCasteller, this.User);
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
        /// Esborrar Casteller de la base de dades
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <returns></returns>
        [HttpDelete]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_ADMINISTRADOR)]
        [Route("{idCasteller}")]
        public Resposta EsborrarCasteller(int idCasteller)
        {
            try
            {
                LogEntra();
                return _castellerService.EsborrarCasteller(idCasteller, this.User);
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
        /// Modificar casteller
        /// </summary>
        /// <param name="casteller"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]

        public async Task<RespostaAmbRetorn<CastellerModel>> ModificarCasteller([FromBody] CastellerModel casteller)
        {
            try
            {
                LogEntra();
                if (casteller == null) throw new ArgumentNullException(nameof(casteller));
                String usuari = ObtenirUsuari();
                LogInfo("S ha Modificar un Casteller id:" + casteller.Alias ?? casteller.Email ?? casteller.Id + " amb un usuari no autoritzat" + usuari);
                RespostaAmbRetorn<CastellerModel> resp = await _castellerService.DesarCasteller(casteller, this.User);

                return resp;
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
        /// Agregar casteller
        /// </summary>
        /// <param name="casteller"></param>
        /// <returns></returns>
        [HttpPut]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        public async Task<RespostaAmbRetorn<CastellerModel>> CrearCasteller([FromBody] CastellerModel casteller)
        {
            try
            {
                LogEntra();
                if (casteller == null) throw new ArgumentNullException(nameof(casteller));
                String usuari = ObtenirUsuari();
                LogInfo("S ha Inserta un Casteller id:" + casteller.Alias ?? casteller.Email ?? casteller.Id + " amb un usuari no autoritzat" + usuari);
                RespostaAmbRetorn<CastellerModel> resp = await _castellerService.DesarCasteller(casteller, this.User);
                return resp;
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
        /// Obtenir Casteller
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [Route("usuari")]
        public async Task<CastellerDetallModel> ObtenirCasteller()
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                LogInfo("S'accedeix al ObtenirCasteller " + usuari);
                return await _castellerService.ObtenirCastellerDetall(User);
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
        /// Obtenir el detall complet del casteller (usuari inclos)
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [Route("usuari/{idCasteller}")]
        public async Task<CastellerDetallModel> ObtenirCastellerPerId(int idCasteller)
        {
            try
            {
                LogEntra();
                return await _castellerService.ObtenirCastellerDetall(idCasteller, User);

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

        [AllowAnonymous]
        [HttpGet]
        [Route("fotos/{idCasteller}")]
        public async Task<IActionResult> ObtenirFoto(int idCasteller)
        {
            var (foto, dataModificacio) = await _castellerService.ObtenirFoto(idCasteller);

            if (foto == null)
            {
                return NotFound();
            }

            var bytes = Utils.WebApiUtils.ParseDataUri(foto, out var contentType);

            return FileOrNotModified(bytes, contentType, dataModificacio);
        }

        /// <summary>
        /// Resitrar un responsable legal
        /// </summary>
        /// <param name="responsableLegal"></param>
        /// <returns></returns>
        [HttpPut]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_CAPMUSIC)]
        [Route("responsableLegal")]
        public RespostaAmbRetorn<ResponsableLegalModel> RegistrarResponsableLegal([FromBody] ResponsableLegalModel responsableLegal)
        {
            try
            {
                LogEntra();
                return _castellerService.DesarResponsableLegal(responsableLegal, this.User);
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
        /// Esborrar un responsable legal
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <param name="tipusResponsableId"></param>
        /// <returns></returns>
        [HttpDelete]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_CAPMUSIC)]
        [Route("responsableLegal/{idCasteller}/{tipusResponsableId}")]
        public Resposta EsborraResponsableLegal(int idCasteller, int tipusResponsableId)
        {
            try
            {
                LogEntra();
                return _castellerService.EsborrarResponsableLegal(idCasteller, tipusResponsableId, this.User);
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
        /// Modificar responsable Legal
        /// </summary>
        /// <param name="responsableLegal"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_CAPMUSIC)]
        [Route("responsableLegal")]
        public RespostaAmbRetorn<ResponsableLegalModel> ModificarResponsableLegal([FromBody] ResponsableLegalModel responsableLegal)
        {
            try
            {
                LogEntra();
                return _castellerService.DesarResponsableLegal(responsableLegal, this.User);
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
        /// Obtenir llista de castellers completa
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [HttpGet]
        [Route("cercar")]
        public async Task<IList<CastellerModel>> CercarCastellers()
        {
            try
            {
                LogEntra();
                return await _castellerService.ObtenirCastellers(null, User);
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
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA)]
        [Route("solicitud/{idCasteller}")]
        public async Task<Resposta> CrearReferenciatTecnic(int idCasteller)
        {
            try
            {
                LogEntra(idCasteller);
                return await _castellerService.CrearReferenciatTecnic(idCasteller, User);

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
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_TECNICA_v2 + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_CASTELLER)]
        [Route("solicitud/{idCasteller}")]
        public async Task<Resposta> EsborrarReferenciatTecnic(int idCasteller)
        {
            try
            {
                LogEntra(idCasteller);
                return await _castellerService.EsborrarReferenciatTecnic(idCasteller, User);

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
        [Authorize()]
        [Route("delegacio")]
        public async Task<Resposta> EsborrarDelegacio([FromBody] EmisorReceptorModel emisorReceptor)
        {
            try
            {
                LogEntra(emisorReceptor.Emisor, emisorReceptor.Receptor);
                var cas = await this._usuariService.ObtenirCastellerSessio(this.User);
                if (emisorReceptor == null) throw new ArgumentNullException(nameof(emisorReceptor));
                if (!SeguretatHelper.esRolAdmin(this.User) && !SeguretatHelper.esRolSecretari(this.User) && !SeguretatHelper.esRolJunta(this.User) && !(emisorReceptor.Receptor == cas.IdCasteller)) {
                    throw new Exception("error.permisos");
                }
               
                return _castellerService.EsborrarDelegacio(emisorReceptor.Emisor, emisorReceptor.Receptor);
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
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI + "," + SeguretatHelper.ROL_JUNTA)]
        [Route("delegacio")]
        public Resposta CrearDelegacio([FromBody] EmisorReceptorModel emisorReceptor)
        {
            try
            {
                if (emisorReceptor == null) throw new ArgumentNullException(nameof(emisorReceptor));
                LogEntra(emisorReceptor.Emisor, emisorReceptor.Receptor);
                return _castellerService.CrearDelegacio(emisorReceptor.Emisor, emisorReceptor.Receptor);

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
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        [Route("export")]
        public Resposta Export()
        {
            try
            {
                LogEntra();
                return _castellerService.EnviarExcelCastellers(User.Identity.Name, this.User);
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
        [Authorize(Roles = SeguretatHelper.ROL_CAMISES + "," + SeguretatHelper.ROL_ADMINISTRADOR)]
        [Route("teCamisa")]
        public Resposta TeCamisa([FromBody] CastellerModel cas)
        {
            try
            {
                if (cas == null) throw new ArgumentNullException(nameof(cas));
                LogEntra(cas.Email);

                return _castellerService.TeCamisa(cas.Id, cas.TeCamisa, cas.DataEntregaCamisa);
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
