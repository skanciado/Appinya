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
using System.Configuration;
using System.IO;
using System.Linq;
using System.Security.Principal;
using System.Text;

using AppinyaServerCore.Database;
using AppinyaServerCore.Database.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Localization;
using System.Threading.Tasks;
using AppinyaServerCore.Models;
using AppinyaServerCore.Helpers;

using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using AppinyaServerCore.Utils;

namespace AppinyaServerCore.Services
{

    public interface ICastellerService
    {
        Task<(string foto, DateTime dataModificacio)> ObtenirFoto(int idCasteller);
        public Task<CastellerDetallModel> ObtenirCastellerDetall(int idCasteller, IPrincipal usuari);
        public Task<CastellerDetallModel> ObtenirCastellerDetall(IPrincipal usuari);
        IList<DeuteModel> ObtenirDeutePaginat(String concepte, int IdCasteller, Boolean pagats, int numreg);
        public Task<Resposta> EsborrarDeute(int idDeute, IPrincipal principal);
        public Task<RespostaAmbRetorn<DeuteModel>> DesarDeute(DeuteModel pdeute, IPrincipal principal);
        public Resposta EsborrarResponsableLegal(int idCasteller, int idTipusResponsable, IPrincipal principal);
        public RespostaAmbRetorn<ResponsableLegalModel> DesarResponsableLegal(ResponsableLegalModel responsable, IPrincipal principal);
        public Task<IList<DeuteModel>> ObtenirDeuteCasteller(IPrincipal principal);
        public IList<Casteller> ObtenirCastellersHabituals();
        public Task<IList<CastellerModel>> ObtenirCastellers(DateTime? data, IPrincipal principal);

        public Task<CastellerModel> ObtenirCasteller(int idCasteller, IPrincipal principal);

        public Resposta ActivarRebreCorreu(String email, Boolean? noticies, Boolean? fotos);
        public RespostaAmbRetorn<string> DesarFoto(int idCasteller, String Foto, IPrincipal principal);
        public Task<Resposta> EnviaInvitacio(int idCastellerRebre, IPrincipal principal);
        public Task<Resposta> EsborrarInvitacio(int idCastellerRebre, IPrincipal principal);
        public Task<Resposta> AcceptarSolicitud(int idCastellerReferenciat, IPrincipal principal);
        public Task<Resposta> EsborrarSolicitud(int idCastellerRebre, IPrincipal principal);

        public Task<Resposta> CrearReferenciatTecnic(int idCastellerReferenciat, IPrincipal principal);

        public Task<Resposta> EsborrarReferenciatTecnic(int idCastellerReferenciat, IPrincipal principal);

        public Resposta EsborrarDelegacio(int emisor, int receptor);
        public Resposta CrearDelegacio(int emisor, int receptor);
        public Resposta EsborrarCasteller(int idCasteller, IPrincipal principal);
        public Task<RespostaAmbRetorn<CastellerModel>> DesarCasteller(CastellerModel casteller, IPrincipal principal);
        public Resposta CalcularEdadCasteller();
        public Resposta TeCamisa(int idCasteller, Boolean teCamisa, DateTime? dataAlta);
        public Resposta EnviarExcelCastellers(String email, IPrincipal principal);
        public Resposta DesarDadesTecniques(CastellerModel casteller, IPrincipal principal);
    }
    public class CastellerService : AppinyaBaseService<CastellerService>, ICastellerService
    {
        private readonly AppinyaDbContext _appinyaDbContext;
        private readonly IdentityDbContext _identityDbContext;
        private readonly IEmailService _emailService;
        private readonly IUsuariService _usuariService;
        private readonly ITemporadaService _temporadaService;
        private readonly IAssistenciaService _assistenciaService;
        private readonly IAuditoriaService _auditoriaService;
        private readonly AppSettings _appSettings;
        public CastellerService(
           AppinyaDbContext appinyaDbContext,
           IdentityDbContext identityDbContext,
           IEmailService emailService,
           ITemporadaService temporadaService,
           IUsuariService usuariService,
           IAssistenciaService assistenciaService,
           IAuditoriaService auditoriaService,
            IOptions<AppSettings> appSettings,
           ILogger<CastellerService> logger,
           IStringLocalizer<CastellerService> localizer
           ) : base(usuariService, localizer, logger)
        {

            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appSettings = appSettings.Value;
            _appinyaDbContext = appinyaDbContext;
            _identityDbContext = identityDbContext;
            _emailService = emailService;
            _usuariService = usuariService;
            _temporadaService = temporadaService;
            _assistenciaService = assistenciaService;
            _auditoriaService = auditoriaService;
        }

        public async Task<(string foto, DateTime dataModificacio)> ObtenirFoto(int idCasteller)
        {

            var fot = await (from f in _appinyaDbContext.Casteller
                             where f.IdCasteller == idCasteller
                             select new
                             {
                                 f.Foto,
                                 f.DataModificacio
                             }).SingleOrDefaultAsync();

            return fot != null ? (fot.Foto, fot.DataModificacio) : default;
        }

        /// <summary>
        /// Retorna la informació detallada d'un casteller assistencia detallad informació d'usuari
        /// </summary>
        /// <param name="IdCasteller"></param>
        /// <returns></returns> 
        public async Task<CastellerDetallModel> ObtenirCastellerDetall(int idCasteller, IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));

            bool assistencia = true; // PotVeureDadesAssistencia(principal);
            bool deutes = PotVeureDadesDeute(principal);
            int idTemporada = _temporadaService.ObtenirTemporadaActual().Id;
            UsuariSessio user1 = await ObtenirUsuariPerEmail(principal);
            CastellerModel casteller = ObtenirCasteller(idCasteller, PotVeureDadesPersonals(principal), PotVeureDadesTelefons(principal), PotVeureDadesTecniques(principal), user1.Id);
            UsuariModel user = await _usuariService.ObtenirUsuariPerEmail(casteller.Email);

            return new CastellerDetallModel()
            {
                Casteller = casteller,
                UsuariInfo = user,
                Assistencia = (assistencia) ? _assistenciaService.ObtenirAssistenciaCasteller(casteller.Id, idTemporada) : null,
                EstadisticaIndividual = (assistencia) ? await _assistenciaService.ObtenirEstadisticaCasteller(casteller.Id, idTemporada, principal) : null,
                Deutes = (deutes) ? ObtenirDeuteCasteller(casteller.Id) : null,
            };
        }

        /// <summary>
        /// Recollir la entitat Casteller completa
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <param name="potVeureDadesPersonals"></param>
        /// <param name="potVeureTelefons"></param>
        /// <param name="potVeureDadesTecniques"></param>
        /// <param name="esPropietari"></param>
        /// <param name="principal"></param>
        /// <returns></returns>
        private CastellerModel ObtenirCasteller(int idCasteller, Boolean potVeureDadesPersonals, Boolean potVeureTelefons, Boolean potVeureDadesTecniques, string idUsuari)
        {
            Casteller casteller = (from cas in _appinyaDbContext.Casteller
                                   .Include(cas => cas.CastellerOrganitzacio).ThenInclude(c1 => c1.IdCarrecNavigation)
                                   .Include(cas => cas.DadesTecniques)
                                   .Include(cas => cas.TipusDocumentNavigation)
                                   .Include(cas => cas.ResponsableLegal).ThenInclude(res => res.IdTipusResponsableNavigation)
                                   .Include(cas => cas.IdMunicipiNavigation).ThenInclude(muni => muni.IdProvinciaNavigation)
                                   .Include(cas => cas.CastellerPosicio).ThenInclude(caspos => caspos.IdPosicioNavigation)
                                   where cas.IdCasteller == idCasteller
                                   select cas).FirstOrDefault();

            int idTemporada = _temporadaService.ObtenirTemporadaActual().Id;

            return CastellerModel.Convert(casteller, potVeureDadesPersonals, potVeureTelefons, potVeureDadesTecniques, casteller.UserId == idUsuari);
        }
        /// <summary>
        /// Retorna la informació detallada d'un casteller assistencia detallad informació d'usuari
        /// </summary>
        /// <param name="IdCasteller"></param>
        /// <returns></returns> 
        public async Task<CastellerDetallModel> ObtenirCastellerDetall(IPrincipal principal)
        {

            if (principal == null) throw new ArgumentNullException(nameof(principal));
            UsuariModel user = await _usuariService.ObtenirUsuariPerEmail(principal.Identity.Name);
            if (user == null || user.CastellerId == 0) return null;

            CastellerModel casteller = ObtenirCasteller(user.CastellerId, true, true, true, user.Id);
            bool assistencia = true;
            bool deutes = true;

            int idTemporada = _temporadaService.ObtenirTemporadaActual().Id;

            return new CastellerDetallModel()
            {
                Casteller = casteller,
                UsuariInfo = user,
                Assistencia = (assistencia) ? _assistenciaService.ObtenirAssistenciaCasteller(casteller.Id, idTemporada) : null,
                EstadisticaIndividual = (assistencia) ? await _assistenciaService.ObtenirEstadisticaCasteller(casteller.Id, idTemporada, principal) : null,
                Deutes = (deutes) ? ObtenirDeuteCasteller(casteller.Id) : null
            };
        }

        /// <summary>
        /// Obtenir la deuta
        /// </summary>
        /// <param name="IdCasteller">id casteller , si es 0 et dona tota la deute</param>
        /// <param name="pagat">Si vols  tambe deutes pagats</param>
        /// <returns></returns>
        public IList<DeuteModel> ObtenirDeutePaginat(String concepte, int IdCasteller, Boolean pagats, int numreg)
        {
            return (from deu in _appinyaDbContext.Deutes
                    where (IdCasteller == 0 || deu.IdCasteller == IdCasteller) && deu.IndBorrat == false && (pagats == true || !deu.Pagat) && (String.IsNullOrEmpty(concepte) || deu.Concepte.Contains(concepte))
                    orderby deu.IdCasteller, deu.DataModific
                    select deu).Skip(numreg).Take(30).ToList().Select<Deutes, DeuteModel>(x => x).ToList();

        }
        /// <summary>
        /// Esborrar la deute  del casteller
        /// </summary>
        /// <param name="idDeute"></param>
        /// <returns></returns>
        public async Task<Resposta> EsborrarDeute(int idDeute, IPrincipal principal)
        {
            Casteller casteller = await ObtenirCastellerSessio(principal);

            Deutes deute = (from deu in _appinyaDbContext.Deutes
                            where deu.IdDeute == idDeute
                            select deu).FirstOrDefault();
            deute.IndBorrat = true;
            deute.DataModific = DateTime.Now;
            deute.UsuariModific = casteller.IdCasteller;
            _appinyaDbContext.SaveChanges();
            _auditoriaService.RegistraAccio<Deutes>(Accio.Esborrar, deute.IdDeute, principal);
            return CrearRespotaOK();

        }
        /// <summary>
        /// Esborrar la deute  del casteller
        /// </summary>
        /// <param name="idDeute"></param>
        /// <returns></returns>
        public async Task<RespostaAmbRetorn<DeuteModel>> DesarDeute(DeuteModel pdeute, IPrincipal principal)
        {
            if (pdeute == null) throw new ArgumentNullException(nameof(pdeute));


            Deutes deute = (from deu in _appinyaDbContext.Deutes
                            where deu.IdDeute == pdeute.IdDeute
                            select deu).FirstOrDefault();

            Casteller casteller = await ObtenirCastellerSessio(principal);

            if (pdeute.Pagat == true && pdeute.DataPagament is null)
            {
                return CrearRespotaAmbRetornError<DeuteModel>(_localizer["nodatapagament"], pdeute);
            }
            if (pdeute.Valor <= 0)
            {
                return CrearRespotaAmbRetornError<DeuteModel>(_localizer["valorNoNegatiu"], pdeute);
            }

            if (deute == null)
            {
                deute = new Deutes()
                {
                    IndBorrat = false,
                    IdCasteller = pdeute.IdCasteller,
                    UsuariCreador = casteller.IdCasteller,
                    DataCreacio = DateTime.Now
                };
                _appinyaDbContext.Deutes.Add(deute);

            }
            deute.Observacions = pdeute.Observacions;
            deute.Valor = pdeute.Valor;
            deute.Pagat = pdeute.Pagat;
            deute.IdCasteller = pdeute.IdCasteller;
            deute.Concepte = pdeute.Concepte;
            deute.Observacions = pdeute.Observacions;
            deute.Data = pdeute.Data;
            deute.DataPagament = pdeute.DataPagament;
            deute.DataModific = DateTime.Now;
            deute.UsuariModific = casteller.IdCasteller;
            _appinyaDbContext.SaveChanges();
            _auditoriaService.RegistraAccio<Deutes>((pdeute.IdDeute == 0) ? Accio.Agregar : Accio.Modificar, deute.IdDeute, principal);
            return CrearRespotaAmbRetornOK<DeuteModel>(deute);

        }


        /// <summary>
        /// Esborrar un responsable
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <param name="idTipusResponsable"></param>
        /// <returns></returns>
        public Resposta EsborrarResponsableLegal(int idCasteller, int idTipusResponsable, IPrincipal principal)
        {

            Casteller cas1 = (from cas in _appinyaDbContext.Casteller.Include(c1 => c1.ResponsableLegal) where cas.IdCasteller == idCasteller select cas).First();
            ResponsableLegal resp = cas1.ResponsableLegal.Where(deu => deu.IdCasteller == idCasteller && deu.IdTipusResponsable == idTipusResponsable).First();
            int now = int.Parse(DateTime.Now.ToString("yyyyMMdd"));
            int dob = int.Parse(cas1.DataNaixement.Value.ToString("yyyyMMdd"));
            int edat = (now - dob) / 10000;
            // Si ets menor d edat pots ser que no tinguis correu electronic.
            if (edat < 18 && cas1.ResponsableLegal.Count == 1)
                return CrearRespotaError(_localizer["esborraultimresponsable"]);
            _appinyaDbContext.ResponsableLegal.Remove(resp);
            _appinyaDbContext.SaveChanges();
            _auditoriaService.RegistraAccio<ResponsableLegal>(Accio.Esborrar, resp.IdTipusResponsable, $"{cas1.IdCasteller}", principal);
            return CrearRespotaOK();

        }

        /// <summary>
        /// Desar un responsable legal d'un casteller
        /// </summary>
        /// <param name="responsable"></param>
        /// <param name="casteller"></param>
        /// <param name="db"></param>
        /// <returns></returns>
        private RespostaAmbRetorn<ResponsableLegalModel> DesarResponsableLegal(ResponsableLegalModel responsable, Casteller casteller, IPrincipal principal)
        {
            Casteller responsableCast = (responsable.Email != null) ? _appinyaDbContext.Casteller.Where(cas => cas.Email.ToUpper() == responsable.Email.ToUpper()).FirstOrDefault() : null;

            if (responsableCast != null)
            {
                responsable.Nom = responsable.Nom ?? responsableCast.Nom;
                responsable.Cognoms = responsable.Cognoms ?? responsableCast.Cognoms;
                responsable.Telefon1 = responsable.Telefon1 ?? responsableCast.Telefon1;
                responsable.Email = responsable.Email ?? responsableCast.Email ?? "";
                responsable.EsCasteller = true;
            }

            if (responsable.Nom == null)
                return CrearRespotaAmbRetornError<ResponsableLegalModel>(_localizer["nomObligatori"], responsable);
            if (responsable.Cognoms == null)
                return CrearRespotaAmbRetornError<ResponsableLegalModel>(_localizer["cognomObligatori"], responsable);

            if (responsable.Telefon1 == null)
                return CrearRespotaAmbRetornError<ResponsableLegalModel>(_localizer["telefonObligatori"], responsable);

            if (responsable.Email == null)
                return CrearRespotaAmbRetornError<ResponsableLegalModel>(_localizer["emailObligatori"], responsable);
            List<ResponsableLegal> lst = (from deu in _appinyaDbContext.ResponsableLegal.Include(res => res.IdTipusResponsableNavigation)
                                          where deu.IdCasteller == casteller.IdCasteller
                                          select deu).ToList();
            ResponsableLegal responsableLegal = lst.Where(it => it.IdTipusResponsable == responsable.TipusResponsableId).FirstOrDefault();
            if (responsableLegal == null)
            {
                responsableLegal = new ResponsableLegal()
                {
                    IdCasteller = casteller.IdCasteller,
                    IdTipusResponsable = responsable.TipusResponsableId
                };

                _appinyaDbContext.ResponsableLegal.Add(responsableLegal);
            }
            responsableLegal.Nom = responsable.Nom;
            responsableLegal.Cognoms = responsable.Cognoms;

            responsableLegal.Email = responsable.Email;
            responsableLegal.Telefon1 = responsable.Telefon1;
            responsableLegal.Telefon2 = responsable.Telefon2;


            if (responsableCast != null)
            {
                responsableLegal.Escasteller = true;
                responsableLegal.IdCastellerResponsable = responsable.IdCastellerResponsable;
                CrearDelegacio(casteller.IdCasteller, responsableCast.IdCasteller);
            }
            else
            {
                responsableLegal.Escasteller = false;
                responsableLegal.IdCastellerResponsable = null;
            }
            _appinyaDbContext.SaveChanges();

            return CrearRespotaAmbRetornOK<ResponsableLegalModel>(responsableLegal);
        }
        /// <summary>
        /// Desar un responsable legal del casteller
        /// </summary>
        /// <param name="responsable"></param>
        /// <returns></returns>
        public RespostaAmbRetorn<ResponsableLegalModel> DesarResponsableLegal(ResponsableLegalModel responsable, IPrincipal principal)
        {
            if (responsable == null) throw new ArgumentNullException(nameof(responsable));

            Casteller cas = _appinyaDbContext.Casteller.Where(cas => cas.IdCasteller == responsable.IdCasteller).FirstOrDefault();
            var res = DesarResponsableLegal(responsable, cas, principal);
            return res;

        }


        /// <summary>
        /// Deute del casteller
        /// </summary>
        /// <param name="IdCasteller"></param>
        /// <returns></returns>
        public IList<DeuteModel> ObtenirDeuteCasteller(int IdCasteller)
        {

            return (from deu in _appinyaDbContext.Deutes
                    where (IdCasteller == 0 || deu.IdCasteller == IdCasteller) && (deu.Pagat == false)
                    select deu).ToList().Select<Deutes, DeuteModel>(x => x).ToList(); ;

        }
        /// <summary>
        /// Deute del casteller
        /// </summary>
        /// <param name="IdCasteller"></param>
        /// <returns></returns>
        public async Task<IList<DeuteModel>> ObtenirDeuteCasteller(IPrincipal principal)
        {
            Casteller owner = await ObtenirCastellerSessio(principal);

            return (from deu in _appinyaDbContext.Deutes
                    where (deu.IdCasteller == owner.IdCasteller) && (deu.Pagat == false)
                    select deu).ToList().Select<Deutes, DeuteModel>(x => x).ToList(); ;

        }
        /// <summary>
        /// Retorna els castellers habituals
        /// </summary>
        /// <returns></returns>
        public IList<Casteller> ObtenirCastellersHabituals()
        {

            return (from cas in _appinyaDbContext.Casteller where cas.IndEsborrat == false && cas.Habitual == true && cas.UserId != null select cas).ToList();

        }

        /// <summary>
        /// Si pot veure dades de castellers associades a un caracter personal (edat, direcció ,...)
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        private Boolean PotVeureDadesPersonals(IPrincipal principal)
        {
            return SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolJunta(principal) || SeguretatHelper.esRolSecretari(principal) || SeguretatHelper.esRolResponsableSalud(principal);
        }
        /// <summary>
        /// Pot veure els telefons dels castellers
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        private Boolean PotVeureDadesTelefons(IPrincipal principal)
        {
            return SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolJunta(principal) || SeguretatHelper.esRolSecretari(principal) || SeguretatHelper.esRolResponsableSalud(principal) || SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolTecnic(principal) || SeguretatHelper.esRolCapMusic(principal);
        }
        /// <summary>
        /// Pot Veure les dades tècniques
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        private Boolean PotVeureDadesTecniques(IPrincipal principal)
        {
            return SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolTecnicNivell2(principal) || SeguretatHelper.esRolTecnic(principal) || SeguretatHelper.esRolCapMusic(principal);
        }
        /// <summary>
        /// Pot Veure dades associades a l'assitencia
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        private Boolean PotVeureDadesAssistencia(IPrincipal principal)
        {
            return SeguretatHelper.esRolCapMusic(principal) || SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolSecretari(principal) || SeguretatHelper.esRolCamises(principal) || SeguretatHelper.esRolTecnic(principal) || SeguretatHelper.esRolTecnicNivell2(principal) || SeguretatHelper.esRolJunta(principal);
        }
        /// <summary>
        /// Pot Veure dades de deutes
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        private Boolean PotVeureDadesDeute(IPrincipal principal)
        {
            return SeguretatHelper.esRolCapMusic(principal) || SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolSecretari(principal) || SeguretatHelper.esRolCamises(principal) || SeguretatHelper.esRolJunta(principal) ||
             SeguretatHelper.esRolTresorer(principal);
        }
        /// <summary>
        /// Retorna tots els castellers amb la marca de temps superior a data facilitada
        /// </summary>
        /// <param name="data"> Marca de temps </param>
        /// <param name="principal">Rol de l'usuari principal</param>
        /// <returns></returns>
        public async Task<IList<CastellerModel>> ObtenirCastellers(DateTime? data, IPrincipal principal)
        {
            Casteller owner = await ObtenirCastellerSessio(principal);
            if (owner == null) return null;
            Boolean potVeureDadesPersonals = PotVeureDadesPersonals(principal);
            Boolean potVeureTelefons = PotVeureDadesTelefons(principal);
            Boolean potVeureDadesTecniques = PotVeureDadesTecniques(principal);
            List<Casteller> lst = null;
            List<CastellerModel> lstCastellers = null;
            // En cas de no tenir data , es toda la base de dades
            if (data == null || !data.HasValue)
                lst = (from cas in _appinyaDbContext.Casteller
                       .Include(cas => cas.CastellerOrganitzacio).ThenInclude(c1 => c1.IdCarrecNavigation)
                       .Include(cas => cas.DadesTecniques)
                       .Include(cas => cas.TipusDocumentNavigation)
                       .Include(cas => cas.ResponsableLegal).ThenInclude(res => res.IdTipusResponsableNavigation)
                       .Include(cas => cas.IdMunicipiNavigation).ThenInclude(muni => muni.IdProvinciaNavigation)
                       .Include(cas => cas.CastellerPosicio).ThenInclude(caspos => caspos.IdPosicioNavigation)
                       where cas.EsBaixa == false
                       orderby cas.Habitual, cas.Alias, cas.Cognoms
                       select cas).ToList(); /*where (cas.NOM + cas.COGNOMS).Contains(query) == true */
            else
            {
                lst = (from cas in _appinyaDbContext.Casteller.Include(cas => cas.CastellerOrganitzacio)
                       .Include(cas => cas.CastellerOrganitzacio).ThenInclude(c1 => c1.IdCarrecNavigation)
                       .Include(cas => cas.DadesTecniques)
                       .Include(cas => cas.TipusDocumentNavigation)
                       .Include(cas => cas.ResponsableLegal).ThenInclude(res => res.IdTipusResponsableNavigation)
                       .Include(cas => cas.IdMunicipiNavigation).ThenInclude(muni => muni.IdProvinciaNavigation)
                       .Include(cas => cas.CastellerPosicio).ThenInclude(caspos => caspos.IdPosicioNavigation)
                       where cas.DataModificacio.CompareTo(data.Value) > 0
                       select cas).ToList(); /*where (cas.NOM + cas.COGNOMS).Contains(query) == true */
            }
            lstCastellers = new List<CastellerModel>();
            //treballem la llista de forma invididual per saber que enviar al client
            foreach (Casteller cas in lst)
            {
                _logger.LogDebug("cas:" + cas.IdCasteller);
                CastellerModel cr = CastellerModel.Convert(cas, potVeureDadesPersonals, potVeureTelefons, potVeureDadesTecniques, cas.IdCasteller == owner.IdCasteller);

                lstCastellers.Add(cr);
            }

            return lstCastellers;

        }
        public async Task<CastellerModel> ObtenirCasteller(int idCasteller, IPrincipal principal)
        {
            Casteller owner = await ObtenirCastellerSessio(principal);
            if (owner == null) return null;
            Boolean potVeureDadesPersonals = PotVeureDadesPersonals(principal);
            Boolean potVeureTelefons = PotVeureDadesTelefons(principal);
            Boolean potVeureDadesTecniques = PotVeureDadesTecniques(principal);
            CastellerModel cas = ObtenirCasteller(idCasteller, potVeureDadesPersonals, potVeureTelefons, potVeureDadesTecniques, owner.UserId);

            return cas;

        }
        /// <summary>
        /// Activa el indicador que vol rebre correus electronics per noticies o fotos
        /// </summary>
        /// <param name="email"> correu del usuari que vol subscriure's</param>
        /// <param name="noticies">Si vol rebre correus de noticies</param>
        /// <param name="fotos"> Si vol rebre correus de albums </param>
        public Resposta ActivarRebreCorreu(String email, Boolean? noticies, Boolean? fotos)
        {
            Casteller cas = _appinyaDbContext.Casteller.Where(cas => cas.Email.ToUpper() == email.ToUpper()).FirstOrDefault(); ;
            if (cas == null) throw new Exception(_localizer["noescasteller"]);
            if (noticies.HasValue)
                cas.Rebremailnot = noticies.Value;
            if (fotos.HasValue)
                cas.Rebremailfotos = fotos.Value;

            _appinyaDbContext.SaveChanges();
            return CrearRespotaOK();
        }

        private static double MAX_TAMANY_FOTO = 14000;

        /// <summary>
        /// Desar Foto del casteller
        /// </summary>
        /// <param name="idCasteller"> identificador del casteller </param>
        /// <param name="Foto"> Base64 de la foto del casteller </param>
        public RespostaAmbRetorn<string> DesarFoto(int idCasteller, String foto, IPrincipal principal)
        {
            Casteller cas = _appinyaDbContext.Casteller.Where(cas => cas.IdCasteller == idCasteller).FirstOrDefault(); ;

            if (cas != null)
            {
                String fotoResult = "";
                var tmpFile = $"{Path.GetTempPath()}{Guid.NewGuid()}";
                String rutaDesti = $"{tmpFile}.jpg";
                String rutaDestiR = $"{tmpFile}-reduccio.jpg";
                CastellerImatge img = _appinyaDbContext.CastellerImatge.Where(it => it.IdCasteller == idCasteller).FirstOrDefault();

                // Guardar imatge original de 600x600 de resolució en la DB
                if (img == null && !String.IsNullOrEmpty(foto))
                {
                    img = new CastellerImatge()
                    {
                        IdCasteller = idCasteller,
                        Foto = ImageUtils.CrearImatgeBinary(foto, 600, 600)
                    };
                    _appinyaDbContext.CastellerImatge.Add(img);
                }
                else if (img != null && String.IsNullOrEmpty(foto))
                {
                    _appinyaDbContext.CastellerImatge.Remove(img);

                }
                else if (img != null && !String.IsNullOrEmpty(foto))
                {
                    img.Foto = ImageUtils.CrearImatgeBinary(foto, 600, 600);
                }

                if (!String.IsNullOrEmpty(foto))
                {
                    ImageUtils.CrearMiniImatge(foto, rutaDesti);

                    FileInfo f = new FileInfo(rutaDesti);
                    if (MAX_TAMANY_FOTO < f.Length)
                    {
                        int quality = (int)(((MAX_TAMANY_FOTO) / f.Length) * 100);
                        if (quality > 100) quality = 90;
                        ImageUtils.ReduirQualitatImatgeJpeg(rutaDesti, rutaDestiR, quality);
                        fotoResult = "data:image/jpeg;base64," + ImageUtils.ConvertirImatgeABase64(rutaDestiR);
                    }
                    else
                        fotoResult = "data:image/jpeg;base64," + ImageUtils.ConvertirImatgeABase64(rutaDesti);

                }
                cas.Foto = fotoResult;

                _appinyaDbContext.SaveChanges();
                _auditoriaService.RegistraAccio<Casteller>(Accio.Modificar, cas.IdCasteller, "foto", principal);
                return CrearRespotaAmbRetornOK<string>(fotoResult);
            }
            else
            {
                return CrearRespotaAmbRetornError<string>(_localizer["noescasteller"], "");
            }


        }
        /// <summary>
        /// Envia una inviatació de delegacio al Casteller
        /// </summary>
        /// <param name="rebre"> Persona que rep la invitació per delegar al usuari</param>
        /// <param name="usuari">Usuari delegat</param>
        /// <returns></returns>
        public async Task<Resposta> EnviaInvitacio(int idCastellerRebre, IPrincipal principal)
        {

            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller owner = _appinyaDbContext.Casteller.Include(c => c.CastellerDelegaIdCasteller1Navigation).Where(cas => cas.UserId == user.Id).FirstOrDefault();


            //CASTELLER_DELEGA peticio =  db.CASTELLER_DELEGA.Where(del => del.ID_CASTELLER1 == owner.ID_CASTELLER && del.ID_CASTELLER2 == acceptor.Id).Select(t => t).FirstOrDefault();
            CastellerDelega peticio = owner.CastellerDelegaIdCasteller1Navigation.Where(t => t.IdCasteller2 == idCastellerRebre).Select(x => x).FirstOrDefault();
            if (peticio == null)
            {
                peticio = new CastellerDelega()
                {
                    IdCasteller1 = owner.IdCasteller,
                    IdCasteller2 = idCastellerRebre,
                    Confirm = false,
                    TReferent = false,
                    DataAlta = DateTime.Now
                };
                _appinyaDbContext.CastellerDelega.Add(peticio);
                _appinyaDbContext.SaveChanges();
                return CrearRespotaOK();
            }
            else
            {
                LogWarning($"S'ha enviat una solicitud de delegació duplicada {owner.IdCasteller}=>{idCastellerRebre} ");
                return CrearRespotaError(_localizer["delegaciduplicada"]);
            }
        }

        /// <summary>
        /// Esborra una invitacio
        /// </summary>
        /// <param name="rebre">Persona que reb la invitació</param>
        /// <param name="usuari">Usuari que esborra la invitacio</param>
        /// <returns></returns>
        public async Task<Resposta> EsborrarInvitacio(int idCastellerRebre, IPrincipal principal)
        {
            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller owner = _appinyaDbContext.Casteller.Include(c => c.CastellerDelegaIdCasteller1Navigation).Where(cas => cas.UserId == user.Id).FirstOrDefault();
            CastellerDelega peticio = owner.CastellerDelegaIdCasteller1Navigation.Where(t => t.IdCasteller2 == idCastellerRebre).Select(x => x).FirstOrDefault();
            if (peticio != null)
            {
                _appinyaDbContext.CastellerDelega.Remove(peticio);
                _appinyaDbContext.SaveChanges();
                return CrearRespotaOK();
            }
            else
            {
                return CrearRespotaError(_localizer["delegacioNoExisteix"]);
            }

        }

        public async Task<Resposta> EsborrarReferenciatTecnic(int idCastellerReferenciat, IPrincipal principal)
        {
            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller owner = _appinyaDbContext.Casteller.Include(t => t.CastellerDelegaIdCasteller2Navigation).Where(cas => cas.UserId == user.Id).FirstOrDefault();
            CastellerDelega peticio = owner.CastellerDelegaIdCasteller2Navigation.Where(t => t.IdCasteller1 == idCastellerReferenciat).Select(x => x).FirstOrDefault();
            if (peticio != null)
            {
                _appinyaDbContext.CastellerDelega.Remove(peticio);
                _appinyaDbContext.SaveChanges();
            }
            else
            {
                return CrearRespotaError(_localizer["delegacioNoExisteix"]);
            }
            // return UsuariBs.getUsuariInfo(usuari).Casteller.Invitacions;
            return CrearRespotaOK();
        }

        public async Task<Resposta> CrearReferenciatTecnic(int idCastellerReferenciat, IPrincipal principal)
        {
            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller owner = _appinyaDbContext.Casteller.Include(t => t.CastellerDelegaIdCasteller2Navigation).Where(cas => cas.UserId == user.Id).FirstOrDefault();
            //CASTELLER_DELEGA peticio = db.CASTELLER_DELEGA.Where(del => del.ID_CASTELLER2 == owner.ID_CASTELLER && del.ID_CASTELLER1 == delegated.Id).Select(t => t).FirstOrDefault();
            CastellerDelega peticio = owner.CastellerDelegaIdCasteller2Navigation.Where(t => t.IdCasteller1 == idCastellerReferenciat).Select(x => x).FirstOrDefault();
            if (peticio != null)
            {
                peticio.Confirm = true;
                peticio.TReferent = true;
                peticio.DataAlta = DateTime.Now;
                _appinyaDbContext.SaveChanges();
            }
            else
            {
                peticio = new CastellerDelega()
                {
                    IdCasteller1 = idCastellerReferenciat,
                    IdCasteller2 = owner.IdCasteller,
                    Confirm = true,
                    TReferent = true,
                    DataAlta = DateTime.Now
                };
                _appinyaDbContext.CastellerDelega.Add(peticio);
                _appinyaDbContext.SaveChanges();
            }
            // return UsuariBs.getUsuariInfo(usuari).Casteller.Invitacions;
            return CrearRespotaOK();
        }



        /// <summary>
        /// Esborra una acceptació
        /// </summary>
        /// <param name="rebre">Persona que reb la invitació</param>
        /// <param name="usuari">Usuari que esborra la invitacio</param>
        /// <returns></returns>
        public async Task<Resposta> EsborrarSolicitud(int idCasteller, IPrincipal principal)
        {

            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller owner = _appinyaDbContext.Casteller.Include(c => c.CastellerDelegaIdCasteller2Navigation).ThenInclude(p => p.IdCasteller2Navigation).Where(cas => cas.UserId == user.Id).FirstOrDefault();
            if (owner == null)
            {
                return CrearRespotaError(_localizer["noescasteller"]);
            }
            CastellerDelega peticio = owner.CastellerDelegaIdCasteller2Navigation.Where(t => t.IdCasteller1 == idCasteller).Select(x => x).FirstOrDefault();
            //Si no existeix
            if (peticio == null)
            {
                LogWarning($"Delegació no existeix {idCasteller} > {owner.IdCasteller}");
                return CrearRespotaError(_localizer["delegacioNoExisteix"]);
            }
            if (!SeguretatHelper.esRolTecnic(principal) && !SeguretatHelper.esRolTecnicNivell2(principal) && !SeguretatHelper.esRolAdmin(principal))
            {
                int now = int.Parse(DateTime.Now.ToString("yyyyMMdd"));
                int dob = int.Parse(peticio.IdCasteller2Navigation.DataNaixement.Value.ToString("yyyyMMdd"));
                int edat = (now - dob) / 10000;
                // Si ets menor d edat pots ser que no tinguis correu electronic.
                if ((String.IsNullOrEmpty(peticio.IdCasteller2Navigation.Email)) && edat >= 18)
                {
                    LogWarning($"S\'ha intentat esborrar solicitud amb ID: {idCasteller}. i és menor");
                    return CrearRespotaError(_localizer["nopermisos_edat"]);
                }

                if (peticio.TReferent)
                {
                    LogWarning($"S\'ha intentat esborrar solicitud amb ID: {idCasteller}. i és menor");
                    return CrearRespotaError(_localizer["nopermisos_delegacioTecnica"]);
                }
            }


            _appinyaDbContext.CastellerDelega.Remove(peticio);
            _appinyaDbContext.SaveChanges();
            //return UsuariBs.getUsuariInfo(usuari).Casteller.AccepInvitacions;
            return CrearRespotaOK();

        }
        public async Task<Resposta> AcceptarSolicitud(int idCastellerReferenciat, IPrincipal principal)
        {
            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller owner = _appinyaDbContext.Casteller.Include(t => t.CastellerDelegaIdCasteller2Navigation).Where(cas => cas.UserId == user.Id).FirstOrDefault();
            //CASTELLER_DELEGA peticio = db.CASTELLER_DELEGA.Where(del => del.ID_CASTELLER2 == owner.ID_CASTELLER && del.ID_CASTELLER1 == delegated.Id).Select(t => t).FirstOrDefault();
            CastellerDelega peticio = owner.CastellerDelegaIdCasteller2Navigation.Where(t => t.IdCasteller1 == idCastellerReferenciat && t.Confirm == false).Select(x => x).FirstOrDefault();
            if (peticio != null)
            {
                peticio.Confirm = true;
                peticio.DataAlta = DateTime.Now;
                _appinyaDbContext.SaveChanges();
                // return UsuariBs.getUsuariInfo(usuari).Casteller.Invitacions;
                return CrearRespotaOK();
            }
            else
            {
                return CrearRespotaError(_localizer["noteSolicitud"]);
            }

        }
        /// <summary>
        /// Esborra una acceptació
        /// </summary>
        /// <param name="rebre">Persona que reb la invitació</param>
        /// <param name="usuari">Usuari que esborra la invitacio</param>
        /// <returns></returns> 

        public Resposta EsborrarDelegacio(int emisor, int receptor)
        {
            CastellerDelega peticio = _appinyaDbContext.CastellerDelega.Where(t => t.IdCasteller1 == emisor && t.IdCasteller2 == receptor).Select(x => x).FirstOrDefault();

            if (peticio == null)
            {
                LogWarning($"Delegació no existeix {emisor} > {receptor}");
                return CrearRespotaError(_localizer["delegacioNoExisteix"]);
            }

            _appinyaDbContext.CastellerDelega.Remove(peticio);
            _appinyaDbContext.SaveChanges();

            return CrearRespotaOK();
        }

        public Resposta CrearDelegacio(int emisor, int receptor)
        {

            if (emisor == receptor) return CrearRespotaOK();
            CastellerDelega peticio = _appinyaDbContext.CastellerDelega.Where(t => t.IdCasteller1 == emisor && t.IdCasteller2 == receptor).Select(x => x).FirstOrDefault();
            if (peticio == null)
            {
                peticio = new CastellerDelega()
                {
                    IdCasteller1 = emisor,
                    IdCasteller2 = receptor,
                    Confirm = true,
                    TReferent = false,
                    DataAlta = DateTime.Now
                };
                _appinyaDbContext.CastellerDelega.Add(peticio);
                _appinyaDbContext.SaveChanges();
            }
            else
            {
                LogWarning($"S'ha creat una delegació duplicada {emisor} => {receptor}");
                return CrearRespotaError(_localizer["delegaciduplicada"]);
            }
            return CrearRespotaOK();




        }

        /// <summary>
        /// Esborra un casteller
        /// </summary>
        /// <param name="idCasteller">Identificador del casteller</param>
        public Resposta EsborrarCasteller(int idCasteller, IPrincipal principal)
        {

            Casteller cas = _appinyaDbContext.Casteller.Where(it => it.IdCasteller == idCasteller).Select(t => t).FirstOrDefault();
            if (cas == null)
            {
                LogWarning($"S\'ha intentat esborrar un casteller amb ID: {idCasteller} . No existeix el casteller amb aquesta ID");
                return CrearRespotaError(_localizer["castellernotrobat"]);


            }
            cas.EsBaixa = true;
            cas.DataBaixa = DateTime.Now;
            _appinyaDbContext.SaveChanges();
            _auditoriaService.RegistraAccio<Casteller>(Accio.Esborrar, cas.IdCasteller, principal);
            return CrearRespotaOK();

        }

        public async Task<RespostaAmbRetorn<CastellerModel>> DesarCasteller(CastellerModel casteller, IPrincipal principal)
        {

            if (casteller == null) throw new ArgumentNullException(nameof(casteller));
            if (casteller.Nom == null || casteller.Cognom == null || casteller.Alias == null ||
                casteller.Nom.Length == 0 || casteller.Cognom.Length == 0 || casteller.Alias.Length == 0)
            {
                String error = _localizer["nomsObligatori"];
                LogWarning("Id:  " + casteller.Id + " " + error);
                return CrearRespotaAmbRetornError<CastellerModel>(error, casteller);
            }
            if (!casteller.DataNaixement.HasValue)
            {
                String error = _localizer["castellerdatanaixement"];
                LogWarning("Id:  " + casteller.Id + " " + error);
                return CrearRespotaAmbRetornError<CastellerModel>(error, casteller);
            }
            if (casteller.Telefon1 == null)
            {
                String error = _localizer["castellernotelefon"];
                LogWarning("Id:  " + casteller.Id + " " + error);
                return CrearRespotaAmbRetornError<CastellerModel>(error, casteller);
            }
            int now = int.Parse(DateTime.Now.ToString("yyyyMMdd"));
            int dob = int.Parse(casteller.DataNaixement.Value.ToString("yyyyMMdd"));
            int edat = (now - dob) / 10000;
            // Si ets menor d edat pots ser que no tinguis correu electronic.
            if ((String.IsNullOrEmpty(casteller.Email)) && edat >= 18)
            {
                String error = _localizer["castellernoemail"];
                LogWarning("Id:  " + casteller.Id + " " + error);
                return CrearRespotaAmbRetornError<CastellerModel>(error, casteller);
            }
            if (edat < 18 && !casteller.ResponsablesLegals.Any())
            {

                String error = _localizer["castellerMenor"];
                LogWarning("Id:  " + casteller.Id + " " + error);
                return CrearRespotaAmbRetornError<CastellerModel>(error, casteller);

            }

            if (String.IsNullOrEmpty(casteller.CodiPostal) && !String.IsNullOrEmpty(casteller.Direccio))
            {
                String error = _localizer["castellernocodipostal"];
                LogWarning("Id:  " + casteller.Id + " " + error);
                return CrearRespotaAmbRetornError<CastellerModel>(error, casteller);
            }
            if ((String.IsNullOrEmpty(casteller.Direccio)) && (!String.IsNullOrEmpty(casteller.CodiPostal)))
            {
                String error = _localizer["castellernodireccio"];
                LogWarning("Id:  " + casteller.Id + " " + error);
                return CrearRespotaAmbRetornError<CastellerModel>(error, casteller);
            }
            using (var dbContextTransaction = _appinyaDbContext.Database.BeginTransaction())
            {
                Casteller cas = null;
                if (casteller.Id != 0)
                {
                    cas = _appinyaDbContext.Casteller.Include(cas => cas.ResponsableLegal).ThenInclude(res => res.IdTipusResponsableNavigation).Where(it => it.IdCasteller == casteller.Id).Select(t => t).FirstOrDefault();
                }
                else
                {
                    cas = new Casteller()
                    {
                        DataAlta = DateTime.Now,
                        DataCreacio = DateTime.Now,
                        EsBaixa = false,
                        UserId = null,
                        VisDatanaix = false,
                        VisDireccio = false,
                        VisTelefon1 = false,
                        VisTelefon2 = false,
                        IndEsborrat = false,
                        Habitual = true,
                        Sanitari = false,
                    };

                }
                if (cas == null)
                {
                    String error = _localizer["castellernodades"];
                    LogWarning("Id:  " + casteller.Id + " " + error);
                    return CrearRespotaAmbRetornError<CastellerModel>(error, casteller);
                }

                var casterlleEmail = _appinyaDbContext.Casteller.Where(it => it.Email == casteller.Email && it.IdCasteller != cas.IdCasteller).FirstOrDefault();
                if (!String.IsNullOrEmpty(casteller.Email) && casterlleEmail != null)
                {
                    String error = _localizer["castellercorreuutilitzat"];
                    LogWarning("Id:  " + casteller.Id + " " + error);
                    return CrearRespotaAmbRetornError<CastellerModel>(error, casteller, casteller.Email, casterlleEmail.Nom, casterlleEmail.Cognoms);
                }
                bool enviarCorreu = casteller.Email != null && (casteller.Id == 0 || casteller.Email.ToUpper() != cas.Email.ToUpper());
                cas.Alias = casteller.Alias;
                cas.Nom = casteller.Nom;
                cas.Cognoms = casteller.Cognom;
                cas.DataNaixement = casteller.DataNaixement;
                cas.DataLliureament = casteller.TeCamisa ? casteller.DataEntregaCamisa : null;
                cas.Direccio = casteller.Direccio;
                cas.DataModificacio = DateTime.Now;
                cas.Email = casteller.Email;
                cas.Cp = casteller.CodiPostal;
                //cas.Carrec = casteller.Carrec;
                cas.Telefon1 = casteller.Telefon1;
                cas.Telefon2 = casteller.Telefon2;
                cas.TeCamisa = casteller.TeCamisa;
                cas.IdMunicipi = casteller.IdMunicipi;
                cas.Assegurat = casteller.Assegurat;

                cas.TipusDocument = casteller.IdTipusDocument;
                cas.DocumentId = casteller.Document;
                cas.Sanitari = casteller.Sanitari;
                cas.TeCasc = casteller.TeCasc;
                cas.CascLloguer = casteller.EsCascLloguer;
                if (casteller.DataAlta.HasValue) cas.DataAlta = casteller.DataAlta.Value;
                if (casteller.Id == 0)
                {
                    _appinyaDbContext.Casteller.Add(cas);

                }

                foreach (ResponsableLegal res in cas.ResponsableLegal)
                {
                    ResponsableLegalModel aux = casteller.ResponsablesLegals.Where(it => it.TipusResponsableId == res.IdTipusResponsable).FirstOrDefault();
                    if (aux == null) _appinyaDbContext.ResponsableLegal.Remove(res);
                }
                if (casteller.Id == 0) _appinyaDbContext.SaveChanges();
                if (casteller.ResponsablesLegals != null)
                    foreach (ResponsableLegalModel t in casteller.ResponsablesLegals)
                    {

                        var ret1 = DesarResponsableLegal(t, cas, principal);
                        if (ret1.Correcte == false)
                        {
                            return CrearRespotaAmbRetornError<CastellerModel>(ret1.Missatge, casteller); ;
                        }
                    };
                _appinyaDbContext.SaveChanges();
                // Desar Foto

                DesarFoto(cas.IdCasteller, casteller.Foto, principal);
                _auditoriaService.RegistraAccio<Casteller>((cas.IdCasteller == 0) ? Accio.Agregar : Accio.Modificar, cas.IdCasteller, principal);
                dbContextTransaction.Commit();
                if (enviarCorreu)
                    await _usuariService.CrearUsuari(casteller, principal);

                return CrearRespotaAmbRetornOK<CastellerModel>(ObtenirCasteller(cas.IdCasteller, true, true, false, cas.UserId));

            }


        }

        /// <summary>
        /// Cacula la data de naixement
        /// </summary>
        public Resposta CalcularEdadCasteller()
        {

            List<Casteller> lst = _appinyaDbContext.Casteller.Where(it => it.Habitual == true).Select(t => t).ToList();
            foreach (Casteller cas in lst)
            {
                if (cas.DataNaixement.HasValue)
                {
                    int edat = 0;
                    edat = DateTime.Now.Year - cas.DataNaixement.Value.Year;
                    if (DateTime.Now.DayOfYear < cas.DataNaixement.Value.DayOfYear)
                        edat = edat - 1;
                    if (edat != cas.Edat)
                    {
                        cas.Edat = edat;
                        _appinyaDbContext.SaveChanges();
                    }
                }
            }
            return CrearRespotaOK();
        }
        /// <summary>
        /// Te Camisa o no?
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <param name="teCamisa"></param>
        /// <param name="dataAlta"></param>
        public Resposta TeCamisa(int idCasteller, Boolean teCamisa, DateTime? dataAlta)
        {

            Casteller cas = _appinyaDbContext.Casteller.Where(it => it.IdCasteller == idCasteller).Select(t => t).FirstOrDefault();

            cas.TeCamisa = teCamisa;
            if (!dataAlta.HasValue) cas.DataAlta = dataAlta.Value;
            if (!teCamisa) cas.DataLliureament = null;
            _appinyaDbContext.SaveChanges();
            return CrearRespotaOK();
        }
        /// <summary>
        /// Exporta la base de dades dels castellers
        /// </summary>
        /// <param name="UrlTemplate">Plantilla del correu a enviar</param>
        /// <param name="email">Correu o envia la fulla excel</param>
        public Resposta EnviarExcelCastellers(String email, IPrincipal principal)
        {
            StringBuilder sb = new StringBuilder();

            List<Casteller> lstcastellers = (from cas in _appinyaDbContext.Casteller.Include(cas => cas.IdMunicipiNavigation)
                                             where cas.IndEsborrat == false
                                             select cas).ToList();
            LogInfo("S'està generant un correu de Exportació de la base de dades castells " + email);
            using (MemoryStream stream = new MemoryStream())
            {
                StreamWriter writer = new StreamWriter(stream);
                writer.WriteLine("Id,Alias,Nom,Cognom,CP, Habitual,Municipi,Assegurat,Té camisa,Data Naixament,Data Alta,Data Baixa,Telèfon 1, Telèfon 2,Email, Direccio");

                foreach (Casteller item in lstcastellers)
                {

                    writer.WriteLine("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14}\"{15}\"",
                        item.IdCasteller, // 0
                        item.Alias, // 1
                        item.Nom, // 2
                        item.Cognoms, // 3
                        item.Cp, // 4
                        item.Habitual, // 5
                        item.IdMunicipiNavigation.Descripcio, //6
                        item.Assegurat, // 7
                        item.TeCamisa, // 8
                        item.DataNaixement, // 9
                        item.DataAlta, // 10
                        item.EsBaixa, // 11
                        item.Telefon1, // 12
                        item.Telefon2, // 13
                        item.Email, //14
                         item.Direccio //.Replace(",", "-") // 15
                    );
                }
                writer.Flush();

                Dictionary<String, String> parames = new Dictionary<String, String>();
                parames.Add("titol", "Exportació Castellers");
                parames.Add("missatge", "Exportació data " + DateTime.Now.ToString("dd/MM"));
                parames.Add("Dia", DateTime.Now.ToString("dd/MM/yyyy"));
                _auditoriaService.RegistraEnviarCorreu(email, "Exportació Castellers", principal);
                _emailService.EnviarEmailCastellers(email, parames, stream);
                writer.Dispose();
                LogInfo("S'ha enviat un correu de Exportació de la base de dades castells " + email);
                return CrearRespotaOK();
            }


        }

        /// <summary>
        /// Funcio per guardar les dades tecniques d'un casteller
        /// </summary>
        /// <param name="dadesTecniques"> Dades tecniques </param>
        /// <returns></returns>
        public Resposta DesarDadesTecniques(CastellerModel casteller, IPrincipal principal)
        {

            if (casteller == null) throw new ArgumentNullException(nameof(casteller));

            DadesTecniques cas = _appinyaDbContext.DadesTecniques.Include(dt => dt.IdCastellerNavigation).ThenInclude(cas => cas.CastellerPosicio).Where(it => it.IdCasteller == casteller.Id).FirstOrDefault(); ;
            if (cas == null)
            {
                cas = new DadesTecniques()
                {
                    IdCasteller = casteller.Id

                };
                _appinyaDbContext.DadesTecniques.Add(cas);

                foreach (PosicioModel pos in casteller.Posicions)
                {
                    if (pos.Experiencia != 0)
                    {
                        CastellerPosicio caspos = new CastellerPosicio()
                        {

                            IdCasteller = casteller.Id,
                            IdPosicio = pos.IdPosicio,
                            Qualitat = pos.Experiencia

                        };
                        _appinyaDbContext.CastellerPosicio.Add(caspos);
                    }
                }
            }
            else
            {
                List<CastellerPosicio> deleteOrder = new List<CastellerPosicio>();
                foreach (CastellerPosicio pos in cas.IdCastellerNavigation.CastellerPosicio)
                {
                    PosicioModel poswrk = casteller.Posicions.Where(it => it.IdPosicio == pos.IdPosicio).FirstOrDefault();
                    if (poswrk == null || (poswrk.Experiencia == 0))
                    {
                        deleteOrder.Add(pos);
                    }

                }

                foreach (CastellerPosicio pos in deleteOrder)
                {
                    _appinyaDbContext.CastellerPosicio.Remove(pos);
                }

                foreach (PosicioModel pos in casteller.Posicions)
                {
                    if (pos.Experiencia != 0)
                    {
                        CastellerPosicio caspos = cas.IdCastellerNavigation.CastellerPosicio.Where(it => it.IdPosicio == pos.IdPosicio).FirstOrDefault();
                        if (caspos == null)
                        {
                            caspos = new CastellerPosicio()
                            {
                                IdCasteller = casteller.Id,
                                IdPosicio = pos.IdPosicio,
                                Qualitat = pos.Experiencia

                            };
                            _appinyaDbContext.CastellerPosicio.Add(caspos);
                        }
                        caspos.IdPosicio = pos.IdPosicio;
                        caspos.Qualitat = pos.Experiencia;
                    }

                }

            }
            cas.Observacions = casteller.Observacions;
            cas.Espatlla = casteller.DadesTecniques.Espatlla;
            cas.Bracos = casteller.DadesTecniques.Bracos;
            cas.Alcada = casteller.DadesTecniques.Alcada;
            cas.Pes = casteller.DadesTecniques.Pes;
            _auditoriaService.RegistraAccio<DadesTecniques>(Accio.Modificar, cas.IdCasteller, principal);
            _appinyaDbContext.SaveChanges();
            return CrearRespotaOK();

        }
    }

}
