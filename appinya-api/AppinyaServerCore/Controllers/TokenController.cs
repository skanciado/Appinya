using AppinyaServerCore.Helpers;
using AppinyaServerCore.Models;
using AppinyaServerCore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AppinyaServerCore.Controllers
{

    [ApiVersion("1.0")]
    /// <summary>
    /// Publicacions Controller
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [AllowAnonymous]
    public class TokenController : BaseController<TokenController>
    { 
        private readonly IAutentificacioService _autentificacioService;
        public TokenController(
         ILogger<TokenController> logger, 
         IAutentificacioService autentificacioService,
        IStringLocalizer<TokenController> localizer
         ) : base(localizer, logger)
        { 
            _autentificacioService = autentificacioService;
        }
        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public string echo()
        {
            return "Echo:" + this.GetType();

        }

        [AllowAnonymous]
        [HttpPost] 
        public async Task<RespostaAmbRetorn<String>> tokenParser([FromBody] JWT jwt)
        {
           
             
            try
            {
                return await _autentificacioService.ValidarGoogleJWT(jwt.Value);

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
