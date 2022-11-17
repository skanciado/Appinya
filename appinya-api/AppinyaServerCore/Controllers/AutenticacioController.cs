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

namespace AppinyaServerCore.Controllers
{
    /// <summary>
    /// Controlador pel mateniment de les funcions d'usuari
    /// </summary>
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class AutenticacioController : BaseController<AutenticacioController>
    {
        #region Variables privades
        private readonly AppSettings _appSettings;
        private readonly IAutentificacioService _iAutentificacioService;
        private readonly ICastellerService _castellerService; 
        private readonly IUsuariService _usuariService;
        #endregion



        public AutenticacioController(
            ILogger<AutenticacioController> logger,
            IOptions<AppSettings> appSettings,
            IAutentificacioService autentificacioService,
            ICastellerService castellerService, IUsuariService usuariService,
            IStringLocalizer<AutenticacioController> localizer
            ) : base(localizer, logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appSettings = appSettings.Value;
            _iAutentificacioService = autentificacioService;
            _castellerService = castellerService;
            _usuariService = usuariService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }
        [AllowAnonymous]
        [HttpPost]
        [Route("jwt")]
        public async Task<RespostaAmbRetorn<UsuariSessio>> tokenValidardor([FromBody] JWT jwt)
        { 

            try
            {
                var r = await _iAutentificacioService.ValidarGoogleJWT(jwt.Value);
                if (r == null || !r.Correcte)
                {
                    return CrearRespotaAmbRetornError<UsuariSessio>("token.novalid", null);
                }
                UsuariModel user = await _usuariService.ObtenirUsuariPerEmail(r.Retorn);
                if (user == null)
                {
                    return CrearRespotaAmbRetornError<UsuariSessio>("casteller.noexisteix", null);
                }

               if (user.CastellerId == 0 && String.IsNullOrEmpty(user.Usuari))
                {
                    return CrearRespotaAmbRetornError<UsuariSessio>("casteller.noexisteix", null);
                }else if (user.CastellerId != 0 && String.IsNullOrEmpty(user.Usuari))
                {
                   var r1 = await _iAutentificacioService.CrearUsuari(new UsuariSessio()
                    {
                        Usuari = r.Retorn,
                        Cognoms = user.Cognom,
                        Email = r.Retorn,
                        ConfirmatEmail = true,
                        Nom = user.Nom
                    });
                    if (!r1.Correcte) return CrearRespotaAmbRetornError<UsuariSessio>("casteller.nocreat", null);
                    
                }
               var usrSession = await _iAutentificacioService.ObtenirUsuariValidacio(r.Retorn);
                return CrearRespotaAmbRetornOK<UsuariSessio>(usrSession); 
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
        /// Funcio per autentificar l'usuari en base de dades local
        /// </summary>
        /// <param name="userParam"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("validar")]
        public async Task<ActionResult<UsuariSessio>> ValidarAcces([FromBody] UsuariSessio userParam)
        {
            try
            {
                LogEntra();
                if (userParam == null) throw new ArgumentNullException(nameof(userParam));

                ModelStateDictionary d = new ModelStateDictionary();
                var signInResult = await _iAutentificacioService.Validar(userParam.Usuari, userParam.Contrasenya);
                if (signInResult == null)
                {
                    d.AddModelError("null", "Error null");
                    return ValidationProblem(d);
                }
                if (signInResult.Succeeded)
                {
                    return await _iAutentificacioService.ObtenirUsuariValidacio(userParam.Usuari);
                }
                else
                {
                    if (signInResult.IsNotAllowed)
                        d.AddModelError("IsNotAllowed", "Error IsNotAllowed");
                    if (signInResult.IsLockedOut)
                        d.AddModelError("IsLockedOut", "Error IsLockedOut");
                    if (signInResult.RequiresTwoFactor)
                        d.AddModelError("RequiresTwoFactor", "Error RequiresTwoFactor");
                    return ValidationProblem(d);
                }
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
        /// Canviar Password de l'usuari
        /// </summary>
        /// <param name="canviPasswordModel"></param>
        /// <returns></returns>
        [HttpPost("password")]
        [Authorize()]
        public async Task<ActionResult<Resposta>> CanviarPassword([FromBody] CanviPasswordModel canviPasswordModel)
        {

            try
            {
                LogEntra();
                if (canviPasswordModel == null) throw new ArgumentNullException(nameof(canviPasswordModel));
                ModelStateDictionary d = new ModelStateDictionary();
                return await _iAutentificacioService.CanviarPassword(this.ObtenirUsuari(), canviPasswordModel.PasswordActual, canviPasswordModel.PasswordNou);

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
        /// Confirmació del correo canviar contrasenya envia a una pagina web on  canvies la nova contraseña
        /// </summary>
        /// <param name="model"> model del formulari canvi de contrasenya</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("contrasenya/confirmar")]
        public async Task<ActionResult<Resposta>> ConfirmarOblidarContrasenya([FromBody] CanviPasswordPerdutModel model)
        {
            try
            {
                LogEntra();

                return await _iAutentificacioService.CanviarPasswordOblidat(model);
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
        /// Metode que envia un correo per resetejar la contrasenya de la teva compte
        /// </summary>
        /// <param name="email"> email del casteller</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("contrasenya/oblidar")]
        public async Task<ActionResult<Resposta>> OblidarContrasenya(String email)
        {
            try
            {
                LogEntra();
                var usuari = ObtenirUsuari();
                if (email == null)
                {
                    LogError("Error en la peticio de OblidarConstrasenya  usuari=null");
                    throw new ArgumentException("Error en la peticio de OblidarConstrasenya  usuari=null");
                }
                return await _iAutentificacioService.EnviaOblidarContrasenya(email, ObtenirURLServidor());

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
        ///  Confirmació del correu del usuari, s'envia per correu un link amb un token d'autentificació
        /// </summary>
        /// <param name="usuari"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        [Route("confirmarCorreu")]
        public ActionResult<Boolean> ConfirmarCorreu(String email)
        {
            try
            {
                LogEntra();
                if (email == null)
                {
                    LogWarning("Se ha realitzat una petició de confirmar correu amb usuari null");
                    throw new ArgumentException("Se ha realitzat una petició de confirmar correu amb usuari null");
                }
                _iAutentificacioService.ConfirmarCorreuManualment(email);
                return true;
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
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR)]
        [Route("canviarUsuari/{idCasteller}")]
        public async Task<UsuariSessio> CanviarUsuariSessio(int idCasteller)
        {
            try
            {
                LogEntra();
                if (idCasteller == 0)
                {
                    LogWarning("No s'ha enviat el IdCasteller");
                    throw new ArgumentException("No s'ha enviat el IdCasteller");
                }
                CastellerModel cas = await _castellerService.ObtenirCasteller(idCasteller, this.User);

                return await _iAutentificacioService.ObtenirUsuariValidacio(cas.Email);
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


        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        [HttpPut("usuari")]
        public async Task<ActionResult<RespostaAmbRetorn<UsuariSessio>>> Crear([FromBody] UsuariSessio userParam)
        {
            try
            {
                LogEntra();

                if (userParam == null) throw new ArgumentNullException(nameof(userParam));

                ModelStateDictionary d = new ModelStateDictionary();
                userParam.Email = userParam.Usuari; // Al crear el usuari es igual al email
                
                var result = await _iAutentificacioService.CrearUsuari(userParam);

                return new RespostaAmbRetorn<UsuariSessio>()
                {
                    Correcte = result.Correcte,
                    Missatge = result.Missatge,
                    Retorn = (result.Correcte) ? await _iAutentificacioService.ObtenirUsuariPerEmail(userParam.Email) : null
                };

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
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        [HttpDelete("usuari")]
        public async Task<ActionResult<Resposta>> EsborrarUsuari([FromBody] UsuariSessio userParam)
        {
            try
            {
                LogEntra();

                if (userParam == null) throw new ArgumentNullException(nameof(userParam));

                ModelStateDictionary d = new ModelStateDictionary();
                userParam.Email = userParam.Usuari; // Al crear el usuari es igual al email
                var result = await _iAutentificacioService.EsborrarUsuari(userParam, this.User);
                return result;

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
        /// Assignar Rols d'ususari
        /// </summary>
        /// <param name="assignarRolsModel"></param>
        /// <returns></returns>
        [HttpPost("rols/assignar")]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        public async Task<ActionResult<Resposta>> AssignarRols([FromBody] AssignarRolsModel assignarRolsModel)
        {
            try
            {
                LogEntra();
                if (assignarRolsModel == null) throw new ArgumentNullException(nameof(assignarRolsModel));
                var usuari = ObtenirUsuari() ?? "Anònim";
                LogEntra();

                return await _iAutentificacioService.AssignarRolsaUsuari(assignarRolsModel.Email, assignarRolsModel.Rols);
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
        /// Refrescar Token de l'usuari
        /// </summary>
        /// <returns></returns>
        [HttpGet("token/refrescar")]
        [Authorize()]
        public async Task<ActionResult<UsuariSessio>> RefrescarToken()
        {
            try
            {
                LogEntra();
                return await _iAutentificacioService.RefrescarToken(ObtenirUsuari());
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
        /// Obtenir llista d'usuaris completa sense paginació (sense vincle de casteller)
        /// </summary>
        /// <returns></returns>
        [HttpGet("usuaris")]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR)]
        public async Task<IList<UsuariSessio>> ObtenirUsuaris()
        {
            try
            {
                LogEntra();
                return await _iAutentificacioService.ObtenirUsuaris();
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
        [HttpGet("usuaris/{id}")]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR)]
        public async Task<ActionResult<UsuariSessio>> ObtenirPerId(string id)
        {
            try
            {
                LogEntra();
                return await _iAutentificacioService.ObtenirUsuariPerId(id);
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
