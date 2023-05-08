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
using System.IO;
using System.Net.Http;
using AppinyaServerCore.Database.Identity; 

namespace AppinyaServerCore.Controllers
{ 
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class UsuariController : BaseController<UsuariController>
    {
        #region Attributes;  
        private readonly AppSettings _appSettings;
        private readonly IUsuariService _usuariService;
        private readonly ICastellerService _castellerService;
        private readonly IEmailService _emailService; 
        private readonly IAutentificacioService _autentificacioService;
        private readonly IAssistenciaService _assistenciaService;
         
        #endregion; 

        public UsuariController(
            ILogger<UsuariController> logger,
            IOptions<AppSettings> appSettings, 
            IEmailService emailServices, 
            IAutentificacioService autentificacioService,
            IUsuariService usuariService,
            ICastellerService castellerService,
            IAssistenciaService assistenciaService,
            IStringLocalizer<UsuariController> localizer
            ) : base(localizer,logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _emailService = emailServices;
            _appSettings = appSettings.Value; 
            _usuariService = usuariService;
            _castellerService = castellerService;
            _assistenciaService = assistenciaService; 
            _autentificacioService = autentificacioService;
        }


        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
           
            return "Echo:" + this.GetType();

        }


        /// <summary>
        /// Funcio per retorna els usuaris actius de la app.
        /// </summary>
        /// <param name="cerca">model de les restriccions de la cerca</param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        [Route("cercar")]
        public async Task<List<UsuariModel>> ObtenirUsuaris([FromBody] CercaModel cerca)
        {
            try
            {
                if (cerca == null)
                    throw new ArgumentNullException(nameof(cerca));

                LogEntra(cerca.Text, cerca.RegIni);

                return await _usuariService.ObtenirLlistaUsuari(cerca.Text, cerca.RegIni);
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

        [Authorize]
        [HttpGet]
        [Route("usuariactual")]
        public async Task<ActionResult<UsuariModel>> ObtenirUsuariInfo()
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                if (usuari == null) return null;
                return await _usuariService.ObtenirUsuariPerEmail(usuari);
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
        ///  Funcio que retorna un usuari 
        /// </summary>
        /// <param name="usuari"> els Id del usuari</param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
      
        public async Task<UsuariModel> ObtenirUsuari(String email)
        {
            try
            {
                LogEntra();
                if (String.IsNullOrEmpty (email ) )
                {
                    LogWarning("Se ha realitzat una petició de cercar  usuari amb valor null");
                    return null;
                }

                return await _usuariService.ObtenirUsuariPerEmail(email);

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
        ///  Funcio que retorna un usuari 
        /// </summary>
        /// <param name="usuari"> els Id del usuari</param>
        /// <returns></returns>
        [HttpPut]
        [Authorize(Roles = SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        [Route("{idCasteller}")]
        public async Task<Resposta> CrearUsuari(int idCasteller)
        {
            try
            {
                LogEntra();
                if (idCasteller == 0)
                {
                    LogWarning("Se ha realitzat una petició de cercar  usuari amb valor null");
                    return null;
                }
               
                return await _usuariService.CrearUsuari(idCasteller, this.User);

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
        /// Relaciona l'usuari amb un casteller
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        [Route("relacionar")]
        public async Task<ActionResult<RespostaAmbRetorn<UsuariModel>>> RelacionarAmbCasteller()
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                if (usuari == null) return null;
                LogInfo($"Relacionar l'usuari: {usuari} amb un casteller.");
                return await _usuariService.RelacionarCastellerAmbUsuari(this.User);
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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_TECNICA + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        [Route("desarFoto/{idCasteller}")] 
        public RespostaAmbRetorn<string> DesarFoto(int idCasteller, [FromBody] String foto)
        {
            try
            {
                String usuari = ObtenirUsuari();
                if (usuari == null) return null;
                if (foto == null || foto.Length == 0) return null;
                if (idCasteller <= 0) return null;


                return _castellerService.DesarFoto(idCasteller, foto,this.User); 
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
        [HttpPost]
        [Route("email/confirmar")]
        public async Task<Resposta> EmailConfirmacio(String usuari)
        {
            try
            {
                LogEntra();  
                return await _autentificacioService.ConfirmarCorreuManualment(usuari);
                 
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
         *  GET api/usuari/emailConfirmacio - Link del email de confirmacio
         */
        [AllowAnonymous]
        [HttpGet]
        [Route("email/confirmar")]
        public async Task<RedirectResult> EmailConfirmacio(String token, String usuari)
        {
            try
            {
                LogEntra();
                String usuariApp = ObtenirUsuari();
                String url = ObtenirURLServidor();
                if (usuariApp == null)
                    return Redirect($"{url}/email-flow/ResultatEmail/ErrorEmail.html");

                Resposta resultat = await _autentificacioService.ConfirmacioEmailUsuari(usuariApp, token);
                if (!resultat.Correcte)
                {
                    LogInfo("Error confirmacio email: " + usuariApp);
                    return Redirect($"{url}/email-flow/ResultatEmail/ErrorEmail.html");

                }
                LogInfo("Confirmacio email " + usuari);
                return Redirect($"{url}/email-flow/ResultatEmail/ConfirmacioEmailOK.html");
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
         * POST api/usuari/enviarEmailSuport - Envia un email a suport amb la descripcio de la incidencia
         */
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER)]
        [HttpPost]
        [Route("email/suport")]
        public void EnviarEmailSuport([FromBody] String missatge)
        {
            try
            {
                LogEntra();
                var usuari = ObtenirUsuari() ?? "Anònim";

                LogInfo("Correo se envia correo de soporte : " + usuari);
                _emailService.EnviarIncidenciaEmail(usuari, missatge);
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
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER)]
        [HttpPost]
        [Route("email/comisio/{idComisio}")]
        public Resposta EnviarComisio([FromBody] String missatge, int idComisio)
        {
            try
            {
                LogEntra();
                var usuari = ObtenirUsuari() ?? "Anònim";

                LogInfo("Correo se envia correo de comisio : " + usuari);
                return _emailService.EnviarComisio(usuari, idComisio, missatge);
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
        [Authorize]
        [Route("estadistica/{idTemporada}")]
        public async Task<IList<EstadisticaIndividualModel>> EstadisticaUsuari(int? idTemporada = null)
        {
            try
            {
                LogEntra();
                if (idTemporada.HasValue)
                    return await _assistenciaService.ObtenirEstadisticaUsuari(idTemporada.Value, User).ConfigureAwait(false);
                else
                    return await _assistenciaService.ObtenirEstadisticaUsuari(User).ConfigureAwait(false);
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
        [Authorize]
        [Route("assistencia")]
        public async Task<IList<AssistenciaModel>> AssistenciaUsuari(int? idTemporada = null)
        {
            try
            {
                LogEntra();

                return await _assistenciaService.ObtenirAssistenciaCasteller(User).ConfigureAwait(false);
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

        // 
        [HttpGet]
        [Authorize]
        [Route("rebre/noticies")]
        public Resposta vullRebreCorreusNoticies(Boolean rebre)
        {
            try
            {
                LogEntra();
                return _castellerService.ActivarRebreCorreu(ObtenirUsuari(), rebre, null);
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
        [Authorize]
        [Route("rebre/albums")]
        public Resposta vullRebreCorreusAlbums(Boolean rebre)
        {
            try
            {
                LogEntra();
                return _castellerService.ActivarRebreCorreu(ObtenirUsuari(), null, rebre);

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
        /// Crear una invitacio de delegació
        /// </summary>
        /// <param name="casteller"></param>
        [HttpPut]
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [Route("invitacio/{idCasteller}")]
        public async Task<Resposta> EnviaInvitacio(int idCasteller)
        {
            try
            {
                LogEntra(idCasteller);
                return await _castellerService.EnviaInvitacio(idCasteller, User);
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
        /// Esborrar una invitacio de delegació
        /// </summary>
        /// <param name="casteller"></param>
        [HttpDelete]
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [Route("invitacio/{idCasteller}")]
        public async Task<Resposta> EsborrarInvitacio(int idCasteller)
        {
            try
            {
                //EsborrarDelegacioPropia
                LogEntra(idCasteller);
                return await _castellerService.EsborrarInvitacio(idCasteller, User);
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
        /// Esborrar un casteller referenciat
        /// </summary>
        /// <param name="casteller"></param>
        [HttpDelete]
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [Route("solicitud/{idCasteller}")]
        public async Task<Resposta> EsborrarSolicitud(int idCasteller)
        {
            try
            {
                LogEntra(idCasteller);
                return await _castellerService.EsborrarSolicitud(idCasteller, User);
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
        /// Acceptar Solicitut
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [Route("solicitud/{idCasteller}")]
        public async Task<Resposta> AcceptarSolicitud(int idCasteller)
        {
            try
            {
                LogEntra(idCasteller);
                return await _castellerService.AcceptarSolicitud(idCasteller, User);

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
