using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks; 
using Microsoft.AspNetCore.Identity;
using AppinyaServerCore.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;
using System.Text; 
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using AppinyaServerCore.Helpers;
using System.Security.Claims;
using AppinyaServerCore.Database.Identity;
using AppinyaServerCore.Database;
using Microsoft.Extensions.Localization;
using System.Security.Principal;

namespace AppinyaServerCore.Services
{
     
    public abstract class BaseService <T> where T : BaseService<T>
    {

        protected readonly ILogger<T> _logger;
        protected readonly IStringLocalizer<T> _localizer; 
        public BaseService ( 
            IStringLocalizer<T> localizer,
            ILogger<T> logger)
        { 
            _logger = logger;
            _localizer = localizer; 

        } 
        protected void LogEntra()
        {
            _logger.LogInformation($"{System.Reflection.MethodBase.GetCurrentMethod().Name} \t \t >> Entrar ");
        }
        protected void LogSurt()
        {
            _logger.LogInformation($"{System.Reflection.MethodBase.GetCurrentMethod().Name} \t \t << Surt ");
        }
        protected void LogInfo(String msg, params object[] parameters)
        {
            _logger.LogInformation($"{System.Reflection.MethodBase.GetCurrentMethod().Name} \t \t  {msg} ", parameters);
        }
        protected void LogWarning(String msg, params object[] parameters)
        {
            _logger.LogWarning($"{ System.Reflection.MethodBase.GetCurrentMethod().Name} \t \t   {msg} ", parameters);
        }

        protected void LogError(String msg, params object[] parameters)
        {
            _logger.LogError($"{ System.Reflection.MethodBase.GetCurrentMethod().Name} \t \t  msg: {msg} ", parameters);
        }
        protected void LogError(Exception ex)
        {
            _logger.LogError($"{ System.Reflection.MethodBase.GetCurrentMethod().Name} \t \t  msg: {ex.Message} ");
        }
        protected void LogDebug(String msg, params object[] parameters)
        {

            _logger.LogDebug($"{ System.Reflection.MethodBase.GetCurrentMethod().Name} \t \t  msg: {msg} ", parameters);
        }

        public Resposta CrearRespotaOK(String result = null)
        {
            return new Resposta()
            {
                Correcte = true,
                Missatge = result ?? _localizer["Correcte"]
            };
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
        public RespostaAmbRetorn<Y> CrearRespotaAmbRetornError<Y> (String msg, Y ret )
        {
            return new RespostaAmbRetorn<Y>()
            {
                Correcte = false,
                Missatge = msg,
                Retorn = ret
            };
        }
        public RespostaAmbRetorn<Y> CrearRespotaAmbRetornError<Y>(String msg)
        {
            return new RespostaAmbRetorn<Y>()
            {
                Correcte = false,
                Missatge = msg,
                Retorn =   default(Y)
            };
        }
        public RespostaAmbRetorn<Y> CrearRespotaAmbRetornError<Y>(String msg, Y ret, params Object[] parameters)
        {
            return new RespostaAmbRetorn<Y>()
            {
                Correcte = false,
                Missatge = String.Format(msg, parameters),
                Retorn = ret
            };
        }
        public Resposta CrearRespotaError(String msg)
        {
            return new Resposta()
            {
                Correcte = false,
                Missatge = msg
            };
        }

        public Resposta CrearRespotaError(String msg, params Object[] parameters )
        {
            return new Resposta()
            {
                Correcte = false,
                Missatge = String.Format(msg, parameters)
            };
        }
    }

     
}
