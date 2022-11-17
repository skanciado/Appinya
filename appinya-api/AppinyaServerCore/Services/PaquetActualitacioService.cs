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
using AppinyaServerCore.Utils;
using System.Security.Principal;

namespace AppinyaServerCore.Services
{

    public interface IPaquetActualitacioService
    {
        DateTime ObtenirDataActualitzacio( IPrincipal principal);
        Task<PaquetActualitzacioModel> ObtenirActualitacions(PeticioActualitzacioModel paquet, IPrincipal principal);
    }

    public class PaquetActualitacioService : BaseService<PaquetActualitacioService>, IPaquetActualitacioService
    {
        private AppinyaDbContext _appinyaDbContext;
        private readonly INoticiaService _noticiaService;
        private readonly ICastellerService _castellerService;
        private readonly ITemporadaService _temporadaService;

        private readonly IAlbumService _albumService;

        private readonly IEsdevenimentsService _esdevenimentsService;
        public PaquetActualitacioService(
            AppinyaDbContext appinyaDbContext, 
             INoticiaService noticiaService,
            ICastellerService castellerService,
            ITemporadaService temporadaService,
             IAlbumService albumService,
            IEsdevenimentsService esdevenimentsService,
            ILogger<PaquetActualitacioService> logger,
            IStringLocalizer<PaquetActualitacioService> localizer) : base( localizer, logger)
        {
            _appinyaDbContext = appinyaDbContext;
            _noticiaService = noticiaService;
            _castellerService = castellerService;
            _temporadaService = temporadaService;
            _esdevenimentsService = esdevenimentsService;
            _albumService = albumService;
        }
        public DateTime ObtenirDataActualitzacio(IPrincipal principal) {
            return _appinyaDbContext.Actualitzacions.Select(t => t.DataModificacio).Max();
        }
        public async Task<PaquetActualitzacioModel> ObtenirActualitacions(PeticioActualitzacioModel paquet, IPrincipal principal)
        {
            if (paquet == null) throw new ArgumentNullException(nameof(paquet));
            DateTime ara = _appinyaDbContext.Actualitzacions.Select(t => t.DataModificacio).Max();
            DateTime? timestamp = WebApiUtils.convertApiDateHour(paquet.Data);
            TemporadaModel temporada = _temporadaService.ObtenirTemporadaActual();
            if (temporada == null )
            {
                return new PaquetActualitzacioModel()
                {
                    DataActualitzacio = ara,
                    Temporada = null,
                    Castellers = null,
                    Noticies = null,
                    Albums = null, 
                    Esdeveniments = null
                };
            }
            PaquetActualitzacioModel paquetM = new PaquetActualitzacioModel()
            {
                DataActualitzacio = ara,
                Temporada = temporada,
                Castellers = await _castellerService.ObtenirCastellers(timestamp, principal),
                Noticies = _noticiaService.ObtenirNoticies(timestamp, principal),
                Albums = await _albumService.ObtenirAlbum(timestamp, temporada.Id, principal),
                Esdeveniments = await _esdevenimentsService.ObtenirLlistaEsdevenimentsActualitzacio(timestamp, temporada.Id, principal), 
            };  
            return paquetM; 
        }
        
    }


}
