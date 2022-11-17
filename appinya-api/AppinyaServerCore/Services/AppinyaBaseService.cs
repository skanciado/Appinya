using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;  
using AppinyaServerCore.Models; 
using Microsoft.Extensions.Logging;  
using Microsoft.Extensions.Localization;
using System.Security.Principal;
using AppinyaServerCore.Database;

namespace AppinyaServerCore.Services
{
     
    public abstract class AppinyaBaseService <T> : BaseService<T>  where T : BaseService<T> 
    {

         
        private readonly IUsuariService _usuariService;
        public AppinyaBaseService(
            IUsuariService usuariService,
            IStringLocalizer<T> localizer,
            ILogger<T> logger) :base(localizer, logger)
        {
            _usuariService = usuariService;

        }
        public async Task<UsuariSessio> ObtenirUsuari (IPrincipal principal)
        {
            if (principal == null) return null;
            return await _usuariService.ObtenirUsuariSessio(principal);
            
        }
        public async Task<IList<string>> ObtenirRols(String usuari)

        {
            return await _usuariService.ObtenirRols(usuari);
        }

        public async Task<UsuariSessio> ObtenirUsuariPerEmail (IPrincipal principal)
        {
            if (principal == null) return null;
          return await _usuariService.ObtenirUsuariSessioPerEmail(principal.Identity.Name);
        }
        public async Task<Casteller> ObtenirCastellerSessio (IPrincipal principal)
        {
            return await _usuariService.ObtenirCastellerSessio(principal);
        }
    }

     
}
