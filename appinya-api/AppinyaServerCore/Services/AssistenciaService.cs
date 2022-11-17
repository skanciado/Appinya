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
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

using AppinyaServerCore.Database;
using AppinyaServerCore.Database.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Localization;
using System.Threading.Tasks;
using AppinyaServerCore.Models;
using AppinyaServerCore.Helpers;
using System.Security.Principal;
using System.Web;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using AppinyaServerCore.Excepcions;
using System.Text;
using System.IO;
using System.Text.Json;
using AppinyaServerCore.Database.Appinya;

namespace AppinyaServerCore.Services
{
    public interface IAssistenciaService
    {
        public Task<IList<AssistenciaModel>> ObtenirAssistenciaUsuari(int idEsdeveniment, IPrincipal principal);
        // public List<AssistenciaModel> ObtenirAssistenciaNoConfirmada(int idEsdeveniment);
        // public AssistenciaModel ObtenirAssistencia(int idEsdeveniment, int idCasteller);
        public Task<Resposta> ConfirmarAssitencia(IList<AssistenciaModel> lst, IPrincipal principal);
        public Task<Resposta> EnviarEmailRecordatori();
        public Task<Resposta> EliminarAssistenciaNoConfirmadaTecnicament();
        public Task<Resposta> ConfirmacioAssistenciaEmail(String token, int idEsdeveniment, int idCasteller, Boolean assistire);
        public Task<Resposta> CalcularHabitualitat();
        public Task<Resposta> ConfirmacioTecnica(IList<AssistenciaModel> lst, IPrincipal principal);

        public Task<Resposta> PrevisioAssistencia(IList<AssistenciaModel> lst, IPrincipal principal);
        public IList<AssistenciaModel> ObtenirAssistencia(int idEsdeveniment);
        public Resposta EnviarExcelAssistencia(int idEsdeveniment, String email);
        public Resposta EnviarExcelAssistenciaGlobal(int idTemporada, String email);
        public Resposta EnviarExcelAssistenciaGlobalResum(int idTemporada, String email);
        public Task<IList<EstadisticaIndividualModel>> ObtenirEstadisticaUsuari(int idTemporada, IPrincipal principal);
        public Task<IList<EstadisticaIndividualModel>> ObtenirEstadisticaUsuari(IPrincipal principal);

        public Task<IList<AssistenciaModel>> ObtenirAssistenciaCasteller(IPrincipal principal, int idTemporada);
        public Task<IList<AssistenciaModel>> ObtenirAssistenciaCasteller(IPrincipal principal);
        public IList<AssistenciaModel> ObtenirAssistenciaCasteller(int idCasteller);
        public IList<AssistenciaModel> ObtenirAssistenciaCasteller(int idCasteller, int idTemporada);

        public Task<IList<EstadisticaIndividualModel>> ObtenirEstadisticaCasteller(int idCasteller, int idTemporada, IPrincipal principal);
        public Task<IList<EstadisticaIndividualModel>> ObtenirEstadisticaCasteller(int idCasteller, IPrincipal principal);
        public IList<AssistenciaGlobalModel> ObtenirAssistenciaGlobal(int idTemporada);

    }
    public class AssistenciaService : AppinyaBaseService<AssistenciaService>, IAssistenciaService
    {

        private readonly AppinyaDbContext _appinyaDbContext;
        private readonly IEmailService _emailService;
        private readonly IUsuariService _usuariService;
        private readonly ITemporadaService _temporadaService;
        private readonly AppSettings _appSettings;
        public AssistenciaService(
            AppinyaDbContext appinyaDbContext,
            IOptions<AppSettings> appSettings,
            IUsuariService usuariService,
            IEmailService emailService,
            ITemporadaService temporadaService,
            ILogger<AssistenciaService> logger,
            IStringLocalizer<AssistenciaService> localizer
            ) : base(usuariService, localizer, logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appinyaDbContext = appinyaDbContext;
            _appSettings = appSettings.Value;
            _emailService = emailService;
            _usuariService = usuariService;
            _temporadaService = temporadaService;
        }

        /// <summary>
        /// Actualitza la assistencia de una persona a un esdeveniment 
        /// </summary>
        /// <param name="esdeveniment"></param>
        /// <param name="usuari"></param>
        /// <returns></returns>
        public async Task<IList<AssistenciaModel>> ObtenirAssistenciaUsuari(int idEsdeveniment, IPrincipal principal)
        {

            UsuariSessio user = await ObtenirUsuari(principal);
            List<int> castellersrelacionats = (from casd in _appinyaDbContext.CastellerDelega
                                               where casd.IdCasteller1Navigation.UserId == user.Id && casd.Confirm == true
                                               select casd.IdCasteller2).ToList();

            var lst = (from assis in _appinyaDbContext.Assistencia
                       where (assis.IdCastellerNavigation.UserId == user.Id || castellersrelacionats.Contains(assis.IdCasteller)) && assis.IdEsdeveniment == idEsdeveniment
                       select assis).Select<Assistencia, AssistenciaModel>(t => t).ToList();


            return lst;


        }
        /// <summary>
        /// Obtenir la assitenencia que no s'ha confirmat 
        /// </summary>
        /// <param name="idEsdeveniment"></param>
        /// <param name="db"></param>
        /// <returns></returns>
        protected async Task<IList<Assistencia>> ObtenirAssistenciaNoConfirmada(int idEsdeveniment)
        {
            return (from assis in _appinyaDbContext.Assistencia
                    where assis.IdEsdevenimentNavigation.IdEsdeveniment == idEsdeveniment && assis.Confirmaciotec == false && assis.Assistire == true
                    select assis).ToList();
        }

        /// <summary>
        /// Actualitza la assistencia del casteller a un esdeveniment 
        /// </summary>
        /// <param name="esdeveniment"></param>
        /// <param name="usuari"></param>
        /// <returns></returns>
        protected Assistencia ObtenirAssistencia(int idEsdeveniment, int idCasteller)
        {
            var ass = (from assis in _appinyaDbContext.Assistencia
                       where assis.IdCastellerNavigation.IdCasteller == idCasteller && assis.IdEsdeveniment == idEsdeveniment
                       select assis).FirstOrDefault();

            return ass;
        }

        /// <summary>
        /// Metode per unificar la logica de acceptació d'assistencia per usuaris
        /// </summary>
        /// <param name="peticionari"> Casteller que demanar confirmar </param>
        /// <param name="esdeveniment"> Esdeveniment que vol assistir</param>
        /// <param name="assistencia">Si assitirà</param>
        /// <param name="db">Conexio a base de dades</param>
        private Resposta ConfirmarAssitencia(Casteller peticionari, Esdeveniment esdeveniment, AssistenciaModel assistencia)
        {
            String error = "";
            // Si no hi ha esdeveniment
            if (esdeveniment == null)
            {
                error = String.Format(_localizer["esdevenimentNoTrobat"], esdeveniment.IdEsdeveniment);
                LogWarning(error);
                return CrearRespotaError(error);
            }
            // Si l'esdeveniment esta anulat
            if (esdeveniment.Anulat == true)
            {
                error = String.Format(_localizer["esdevenimentAnulat"], esdeveniment.IdEsdeveniment);
                LogWarning(error);
                return CrearRespotaError(error);
            }
            // Si l'esdeveniment esta actiu
            if (esdeveniment.Activa == false)
            {
                error = String.Format(_localizer["esdevenimentActiu"], esdeveniment.IdEsdeveniment);
                LogWarning(error);
                return CrearRespotaError(error);
            }
            // Si l'esdeveniment te bloquejada l'assistencia
            if (esdeveniment.BloqueixAssistencia == true)
            {
                error = string.Format(_localizer["esdevenimentBloquejat"], esdeveniment.IdEsdeveniment);
                LogWarning(error);
                return CrearRespotaError(error);
            }
            // Si es una data futura
            DateTime dt = esdeveniment.DataFi.AddHours(24).Date;
            if ((esdeveniment.DataFi.Hour != 0 && esdeveniment.DataFi < DateTime.Now) ||
                (esdeveniment.DataFi.Hour == 0 && dt < DateTime.Now)
                )
            {
                error = string.Format(_localizer["esdevenimentPassat"], esdeveniment.IdEsdeveniment);
                LogWarning(error);
                return CrearRespotaError(error);
            }

            // Si es una data massa futura
            // Si es un esdeveniemnt amb un formulari o amb servei de transport es pot confirmar abans
            // Si es un esdeveniment comercial també
            DateTime dtMes = DateTime.Now.AddDays(30).Date;
            if (!(esdeveniment.IdTipus == EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_COMERCIAL || esdeveniment.OfreixTransport ||
                (esdeveniment.EsdevenimentPregunta != null && esdeveniment.EsdevenimentPregunta.Any())
               ) && esdeveniment.DataInici > dtMes)
            {
                error = String.Format(_localizer["esdevenimentFutur"], esdeveniment.IdEsdeveniment);
                LogWarning(error);
                return CrearRespotaError(error);
            }
            Temporada temporada = _temporadaService.ObtenirTemporadaActual();
            if (esdeveniment.IdTemporada != temporada.Id)
            {
                error = String.Format(_localizer["esdevenimentTemporadaOut"], esdeveniment.IdEsdeveniment);
                LogWarning(error);
                return CrearRespotaError(error);
            }
            int idCasteller = Int32.Parse(assistencia.Casteller);
            // Recollim assistencia
            Assistencia assisdb = _appinyaDbContext.Assistencia.Where(ass => ass.IdCasteller == idCasteller && ass.IdEsdeveniment == esdeveniment.IdEsdeveniment).FirstOrDefault();
            if (assisdb == null)
            {
                // Si no te es crea
                assisdb = new Assistencia()
                {
                    IdCasteller = idCasteller,
                    IdEsdeveniment = esdeveniment.IdEsdeveniment,
                    Confirmaciotec = false,
                    IdUsuariCreador = peticionari.IdCasteller,
                    DataCreacio = DateTime.Now,
                    DataAssistencia = DateTime.Now,
                    AssistireUsuari = assistencia.Assistire,
                    IndEsborrat = false

                };
                _appinyaDbContext.Assistencia.Add(assisdb);

            }

            // Si té confirmació tècnica no es pot modificar la teva assistència
            if (!assisdb.Confirmaciotec)
            {
                bool anterior = assisdb.Assistire;

                assisdb.Assistire = assistencia.Assistire.HasValue ? assistencia.Assistire.Value : false;

                if (anterior != assisdb.Assistire || assisdb.IdEsdeveniment == 0)
                {
                    // Si es un canvi d'opinio es guarda la data actual
                    assisdb.DataAssistencia = DateTime.Now;
                    assisdb.AssistireUsuari = assisdb.AssistireUsuari;
                    _appinyaDbContext.EsdevenimentLog.Add(EsdevenimentHelper.CrearRegistre(esdeveniment.IdEsdeveniment, idCasteller, assisdb.Assistire, peticionari.IdCasteller));
                }

                // Si es assistire , guardar els acompanyants,transport ...
                if (assisdb.Assistire)
                {
                    // Si no te valor , l'usuari no ha dit res
                    if (assistencia.NumAcompanyants.HasValue)
                    {
                        if (assistencia.NumAcompanyants > 0)
                            assisdb.NumAcompanyants = assistencia.NumAcompanyants;
                        else
                            assisdb.NumAcompanyants = 0;
                    }
                    // Si no te valor , l'usuari no ha dit res
                    if (assistencia.Transport.HasValue)
                    {
                        assisdb.Transport = assistencia.Transport;

                    }
                    if (assisdb.Transport.HasValue && assisdb.Transport.Value)
                    {
                        if ((!assistencia.TransportTornada.HasValue || !assistencia.TransportTornada.Value) && (!assistencia.TransportAnada.HasValue && !assistencia.TransportAnada.Value))
                        {

                            error = String.Format(_localizer["esdevenimentAnadaTornada"], esdeveniment.IdEsdeveniment);
                            LogWarning(error);
                            return CrearRespotaError(error);

                        }
                        assisdb.TransportTornada = assistencia.TransportTornada;
                        assisdb.TransportAnada = assistencia.TransportAnada;
                    }
                    else
                    {
                        assisdb.TransportTornada = null;
                        assisdb.TransportAnada = null;
                    }
                    if (assistencia.Preguntes != null && assistencia.Preguntes.Any())
                    {

                        String jsonForm = JsonSerializer.Serialize(assistencia.Preguntes);
                        assisdb.Respostes = jsonForm;
                    }

                    assisdb.Observacions = assistencia.Observacions;
                }
                else
                {
                    assisdb.NumAcompanyants = 0;
                    assisdb.Transport = false;
                    assisdb.Observacions = null;
                    assisdb.TransportAnada = false;
                    assisdb.TransportTornada = false;
                    assisdb.Respostes = null;
                }


                assisdb.Confirmaciotec = false;
                assisdb.IdUsuariModifi = peticionari.IdCasteller;
                assisdb.DataModifi = DateTime.Now;
                _appinyaDbContext.SaveChanges();
                return CrearRespotaOK();
            }
            else
            {
                error = String.Format(_localizer["assistenciaBloquejadaTecnic"], esdeveniment.IdEsdeveniment);
                LogWarning(error);
                return CrearRespotaError(error);

            }
        }

        /// <summary>
        /// Confirmacio assitencia dels usuaris a un esdeveniment
        /// </summary>
        /// <param name="lst">Llista de assitencia de usuari i les seves delegacions</param>
        /// <param name="userName">Usuari conectat</param>
        /// <returns></returns>
        public async Task<Resposta> ConfirmarAssitencia(IList<AssistenciaModel> lst, IPrincipal principal)
        {

            if (lst == null || lst.Count == 0)
            {
                return CrearRespotaError(_localizer["assistenciabuida"]);
            }
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            if (lst == null) throw new ArgumentNullException(nameof(lst));
            var user = await _usuariService.ObtenirUsuariPerEmail(principal.Identity.Name);

            foreach (AssistenciaModel w in lst)
            {
                if (w.Assistire.HasValue) // Si assistire es null vol dir que l'usuari no ha dit res sobre el seus acomp
                {
                    int idEsdeveniment = Int32.Parse(w.Esdeveniment);
                    int idCasteller = Int32.Parse(w.Casteller);
                    Esdeveniment es = _appinyaDbContext.Esdeveniment.Where(esd => esd.IdEsdeveniment == idEsdeveniment).FirstOrDefault();
                    // Validar que l'usuari te permisos com adjunts ( minions) o Delegacions
                    bool confirmador = (user.Adjunts.Where(rebre => rebre == idCasteller.ToString()).Any() || user.Delegacions.Where(rebre => rebre == idCasteller.ToString()).Any());
                    confirmador = confirmador || SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolConfirmadorAssistencia(principal) || SeguretatHelper.esRolJunta(principal);
                    bool propietari = user.CastellerId == idCasteller;
                    if (confirmador || propietari)
                    {
                        Casteller cas = _appinyaDbContext.Casteller.Where(t => t.IdCasteller == user.CastellerId).FirstOrDefault();
                        return ConfirmarAssitencia(cas, es, w);
                    }
                    else
                    {
                        String error = String.Format(_localizer["assistenciaNoDelegada"], user.Email);
                        LogWarning(error);
                        return CrearRespotaError(error);
                    }

                }


            }

            return CrearRespotaOK();
        }


        /// <summary>
        /// Envia un correu electronic a les persones que son habituals en l'assistència si no hi ha 
        /// </summary>
        public async Task<Resposta> EnviarEmailRecordatori()
        {

            String urlconfirmacioassistencia = _appSettings.UrlConfirmacioEmail;
            String urlicons = _appSettings.UrlIcons;
            DateTime dtAvui = DateTime.Now;
            DateTime dtSetmana = dtAvui.AddDays(7);// Una setmana vista
            var lst = (from est in _appinyaDbContext.Esdeveniment
                       where est.DataInici.CompareTo(dtAvui) > 0 && est.DataInici.CompareTo(dtSetmana) < 0 && est.Anulat == false && est.Activa == true && est.BloqueixAssistencia == false && est.IndEsborrat == false
                       select est).ToList();
            List<Esdeveniment> esdeveniments = lst.ToList();

            List<Casteller> castellers = (from cas in _appinyaDbContext.Casteller
                                          where cas.Email != null && !cas.Email.StartsWith("test") && cas.IndEsborrat == false && cas.Habitual == true && cas.UserId != null
                                          select cas).ToList();

            if (esdeveniments.Count == 0) return CrearRespotaOK(_localizer["senseesdeveniments"]); // Si no hi han esdeveniments no fa res.

            // Es cerca per castellers habituals

            foreach (Casteller cas in castellers)
            {
                Boolean bcasteller = false, bmusic = false;
                LogInfo($"Iniciem el control d'assistencia de  {cas.Alias} ({cas.Email})");
                IList<string> roles = await ObtenirRols(cas.Email).ConfigureAwait(false);

                bmusic = roles.Where(rol => rol == SeguretatHelper.ROL_MUSIC).Any();
                bcasteller = roles.Where(rol => rol == SeguretatHelper.ROL_CASTELLER).Any();

                if ((bmusic == false && bcasteller == false) || (cas.Email == null))
                {
                    LogInfo($"   > Casteller habitual sense correo o sense rol o correu  {cas.Alias} ( {cas.Email})");
                }
                else
                {
                    String html = "";
                    bool enviar = false;
                    foreach (Esdeveniment est in esdeveniments) // busquem els esdeveniments de la setmana
                    {
                        // Si es casteller veus els entrenaments
                        // SI es music veu els de musics
                        if (est.IdTipus == EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_MUSICS && bmusic ||
                            est.IdTipus == EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_ENTRENAMENTS && bcasteller ||
                            (est.IdTipus != EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_ENTRENAMENTS && est.IdTipus != EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_MUSICS))
                        {
                            Assistencia ass = ObtenirAssistencia(est.IdEsdeveniment, cas.IdCasteller);
                            if (ass == null)// Si no s'ha informat res es guarda l'esdeveniment
                            {
                                LogInfo($"   > Esdeveniment no confirmat (Alias: {cas.Alias} ) esdeveniment {est.IdEsdeveniment} - {est.DataInici.ToString("dd / MM / yyyy")} ");
                                html +=
                                "<tr style=\"border-bottom:1px solid #860000;\">" +
                                "	<td style=\"font-size: 25px; color: #860000;  width: 100px;  height: 100px;vertical-align: middle;text-align: center;  padding-right: 5px; border-left: none;\"> " +
                                $"	 {est.DataInici.ToString("dd / MM")} <img src=\"{urlicons}{est.IdTipusNavigation.File}.png\" width=\"50\" style=\"vertical-align: middle; \" />" +
                                $"	</td><td><h3 style=\"color: #860000;\"> { est.Titol} </h3> {est.Text}<br/> {"Direccio: " + est.Direccio ?? "(no definida)"} </td>  " +
                                "	<td   style=\"font-size: 25px; color: #860000;  width: 140px;  vertical-align: middle;text-align: center;  padding-right: 5px; border-left: none;\">" +
                                "	   <div style=\"display: flex; width: 100%\">  <div align=\"center\"  style=\"width:50px; background-color:#335c1a;border-radius:50px;padding: 10px 10px 10px 10px;margin:0px 5px 0px 0px;\">" +
                                $"	            <a style=\"color:white;text-decoration:none;font-size:18px;\" href=\"{urlconfirmacioassistencia}{cas.IdCasteller}/{est.IdEsdeveniment}/?token={GenerarTokenEmail(est.DataCreacio, Guid.Parse(cas.UserId))}\">Sí</a></div>" +
                                "	   <div align=\"center\"  style=\"width:50px; background-color:rgb(122,3,21);border-radius:50px;padding: 10px 10px 10px 10px;margin:0px 5px 0px 0px;\">" +
                                $"	    		<a style=\"color:white;text-decoration:none;font-size:18px;\" href=\"{urlconfirmacioassistencia}{cas.IdCasteller}/{est.IdEsdeveniment}/?token={GenerarTokenEmail(est.DataCreacio, Guid.Parse(cas.UserId))}\">No</a></div>" +
                                "	   </div>" +
                                "	</td>" +
                                "</tr>";
                                enviar = true;

                            }
                        }
                    }

                    if (enviar)
                    {
                        Dictionary<String, String> parames = new Dictionary<String, String>();
                        parames.Add("casteller", cas.Alias);
                        parames.Add("esdeveniments", html);

                        LogInfo($"S'ha enviat un correo resum d'assistencia a  {cas.Alias} ({cas.Email})");
                        try
                        {
                            //
                            _emailService.EnviarEmailConvocatoria(cas.Email, parames);
                        }
                        catch (Exception)
                        {
                            LogWarning("Error al enviar un correo resum d'assistencia a  {0} ({1})", cas.Alias, cas.Email);
                        }

                    }

                }
            }
            return CrearRespotaOK();

        }


        /// <summary>
        /// Proces de eliminació de la assistencia no confirmada tecnimanet
        /// </summary>
        public async Task<Resposta> EliminarAssistenciaNoConfirmadaTecnicament()
        {

            DateTime dtSetmana = DateTime.Now.AddDays(-7);// Una setmana vista
            var lst = (from est in _appinyaDbContext.Esdeveniment.Include(t => t.IdTipusNavigation)
                       where (est.IdTipus == EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_ENTRENAMENTS || est.IdTipus == EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_DIADES || est.IdTipus == EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_COMERCIAL || est.IdTipus == EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_MUSICS) &&
                        est.DataInici.CompareTo(dtSetmana) < 0 && est.Anulat == false && est.Activa == true && est.BloqueixAssistencia == false && est.IndEsborrat == false
                       select est).ToList();

            List<Esdeveniment> esdeveniments = lst.ToList();

            if (esdeveniments.Count == 0) return CrearRespotaOK(_localizer["senseesdeveniments"]); // Si no hi han esdeveniments no fa res.

            foreach (Esdeveniment esd in esdeveniments)
            {
                IList<Assistencia> lstassistencia = await ObtenirAssistenciaNoConfirmada(esd.IdEsdeveniment);
                foreach (Assistencia ass in lstassistencia)
                {
                    ass.Assistire = false;
                    ass.DataModifi = DateTime.Now;
                    ass.Confirmaciotec = true;
                    ass.Observacions = _localizer["confirmatautomaticament"];
                    _appinyaDbContext.EsdevenimentLog.Add(EsdevenimentHelper.CrearRegistreConfirmacio(ass));
                    _appinyaDbContext.SaveChanges();

                }
            }
            return CrearRespotaOK();

        }
        /// <summary>
        /// Metode per confirmar l'assistencia sense necessitat d'accedir a la App.
        /// </summary>
        /// <param name="token"></param>
        /// <param name="idEsdeveniment"></param>
        /// <param name="idCasteller"></param>
        /// <param name="assistire"></param>
        /// <returns></returns>
        public async Task<Resposta> ConfirmacioAssistenciaEmail(String token, int idEsdeveniment, int idCasteller, Boolean assistire)
        {
            try
            {


                Esdeveniment est = _appinyaDbContext.Esdeveniment.Where(t => t.IdEsdeveniment == idEsdeveniment).First();
                Casteller casteller = _appinyaDbContext.Casteller.Where(c => c.IdCasteller == idCasteller).First();
                Boolean correcte = TokenEmailEsCorrecte(token, est.DataCreacio, Guid.Parse(casteller.UserId));
                if (correcte)
                {
                    return ConfirmarAssitencia(casteller, est, new AssistenciaModel()
                    {
                        Assistire = assistire,
                        Casteller = casteller.IdCasteller.ToString(),
                        Esdeveniment = est.IdEsdeveniment.ToString()

                    });
                }
                else return CrearRespotaError(_localizer["errorConfirmacioCorreuToken"]);

            }
            catch (Exception)
            {
                string error = _localizer["errorConfirmacioCorreuToken"];
                LogError(error, token);
                return CrearRespotaError(error);
            }
        }

        /// <summary>
        /// Metode per gener un token per autenificar que s'ha fet una acció del correu
        /// </summary>
        /// <param name="dataEsdeveniment"> Data dde l'Esdeveniment</param>
        /// <param name="idUsuari"> Id d'usuari </param>
        /// <returns></returns>
        private string GenerarTokenEmail(DateTime dataEsdeveniment, Guid idUsuari)
        {
            byte[] data = BitConverter.GetBytes(dataEsdeveniment.ToBinary());
            byte[] key = idUsuari.ToByteArray();
            return HttpUtility.UrlEncode(Convert.ToBase64String(data.Concat(key).ToArray()));
        }
        /// <summary>
        /// Metode per saber si el token es correcte
        /// </summary>
        /// <param name="token">Token a validar </param>
        /// <param name="dataEsdeveniment"> Data dde l'Esdeveniment</param>
        /// <param name="idUsuari"> Id d'usuari </param>
        /// <returns></returns>
        private Boolean TokenEmailEsCorrecte(String token, DateTime dataEsdeveniment, Guid idUsuari)
        {
            byte[] data = BitConverter.GetBytes(dataEsdeveniment.ToBinary());
            byte[] key = idUsuari.ToByteArray();
            return Convert.ToBase64String(data.Concat(key).ToArray()) == token;
        }

        /// <summary>
        /// Calcular si un casteller es habitual en la colla
        /// </summary>
        public async Task<Resposta> CalcularHabitualitat()
        {

            DateTime dt = DateTime.Now.AddMonths(-2);
            int count = _appinyaDbContext.Esdeveniment.Where(it => it.DataInici.CompareTo(dt) > 0).Count();
            if (count < 4) return CrearRespotaOK();
            List<int> lstcasAssistencia = _appinyaDbContext.Assistencia.Include(asi => asi.IdEsdevenimentNavigation).Where(asi => asi.IdEsdevenimentNavigation.DataInici.CompareTo(dt) > 0 && asi.Assistire == true && asi.IndEsborrat == false).Select(t => t.IdCasteller).Distinct().ToList();
            List<Casteller> lst = _appinyaDbContext.Casteller.ToList();
            foreach (Casteller cas in lst)
            {
                if (lstcasAssistencia.Contains(cas.IdCasteller))
                {
                    if (!cas.Habitual)
                    {
                        cas.Habitual = true;
                        LogInfo(string.Format("S'ha canviat l'habitualtitat a true {0}", cas.Alias ?? cas.Email ?? cas.Nom + " " + cas.Cognoms));
                    }

                }
                else if (cas.Habitual)
                {
                    LogInfo(string.Format("S'ha canviat l'habitualtitat a false {0}", cas.Alias ?? cas.Email ?? cas.Nom + " " + cas.Cognoms));
                    cas.Habitual = false;
                }

            }
            _appinyaDbContext.SaveChanges();
            return CrearRespotaOK();
        }

        /// <summary>
        /// Confirmació tècnica de l'assistencia
        /// </summary>
        /// <param name="lst"></param>
        public async Task<Resposta> ConfirmacioTecnica(IList<AssistenciaModel> lst, IPrincipal principal)
        {
            Temporada temporada = _temporadaService.ObtenirTemporadaActual();

            foreach (AssistenciaModel w in lst)
            {
                if (w.Assistire.HasValue) // Si assistire es null vol dir que l'usuari no ha dit res sobre el seus acomp
                {
                    int idEsdeveniment = Int32.Parse(w.Esdeveniment);
                    int idCasteller = Int32.Parse(w.Casteller);
                    Esdeveniment esd = _appinyaDbContext.Esdeveniment.Where(it => it.IdEsdeveniment == idEsdeveniment).First();
                    if (!EsdevenimentHelper.PotConfirmarEsdeveniment(esd, principal))
                    {
                        LogWarning("Se ha intentado modificar l'assistencia de l'Esdeveniment sense permisos");
                        throw new SeguretatException();
                    }
                    if (esd.IdTemporada != temporada.Id)
                    {
                        LogWarning(_localizer["esdevenimentForaTemporada"]);
                        throw new NegociException(_localizer["esdevenimentForaTemporada"]);
                    }

                    UsuariSessio user = await ObtenirUsuari(principal).ConfigureAwait(false);
                    Casteller cas = (from cas1 in _appinyaDbContext.Casteller
                                     where cas1.UserId == user.Id
                                     select cas1).FirstOrDefault();

                    Assistencia assis = _appinyaDbContext.Assistencia.Where(ass => ass.IdCasteller == idCasteller && ass.IdEsdeveniment == idEsdeveniment).FirstOrDefault();

                    if (assis == null)
                    {
                        assis = new Assistencia()
                        {
                            IdCasteller = idCasteller,
                            IdEsdeveniment = idEsdeveniment,
                            IdUsuariCreador = cas.IdCasteller,
                            IdUsuariModifi = cas.IdCasteller,
                            DataCreacio = DateTime.Now,
                            DataModifi = DateTime.Now,
                            DataAssistencia = DateTime.Now,
                            Assistire = w.Assistire.HasValue ? w.Assistire.Value : false
                        };
                        assis.Confirmaciotec = w.ConfirmacioTecnica.HasValue ? w.ConfirmacioTecnica.Value : false;

                        _appinyaDbContext.Assistencia.Add(assis);
                        _appinyaDbContext.EsdevenimentLog.Add(EsdevenimentHelper.CrearRegistreConfirmacio(assis));
                    }
                    else
                    {
                        assis.Confirmaciotec = w.ConfirmacioTecnica.HasValue ? w.ConfirmacioTecnica.Value : false;
                        Boolean assistire = w.Assistire.HasValue ? w.Assistire.Value : false;
                        if (assistire != assis.Assistire)
                        {
                            assis.Assistire = w.Assistire.HasValue ? w.Assistire.Value : false;
                            assis.IdUsuariModifi = cas.IdCasteller;
                            assis.DataModifi = DateTime.Now;
                            assis.DataAssistencia = assis.DataAssistencia;
                        }
                        _appinyaDbContext.EsdevenimentLog.Add(EsdevenimentHelper.CrearRegistreConfirmacio(assis));

                    }

                }
                else
                {
                    LogWarning("S'ha enviat assitencia amb valor confirmat null => " + w.Casteller + " ," + w.Esdeveniment);
                }
            }

            _appinyaDbContext.SaveChanges();
            return CrearRespotaOK();
        }
        /// <summary>
        /// Confirmació tècnica de l'assistencia
        /// </summary>
        /// <param name="lst"></param>
        public async Task<Resposta> PrevisioAssistencia(IList<AssistenciaModel> lst, IPrincipal principal)
        {
            Temporada temporada = _temporadaService.ObtenirTemporadaActual();

            foreach (AssistenciaModel w in lst)
            {
                if (w.Assistire.HasValue) // Si assistire es null vol dir que l'usuari no ha dit res sobre el seus acomp
                {
                    int idEsdeveniment = Int32.Parse(w.Esdeveniment);
                    int idCasteller = Int32.Parse(w.Casteller);
                    Esdeveniment esd = _appinyaDbContext.Esdeveniment.Where(it => it.IdEsdeveniment == idEsdeveniment).First();
                     
                    if (esd.IdTemporada != temporada.Id)
                    {
                        LogWarning(_localizer["esdevenimentForaTemporada"]);
                        return CrearRespotaError((_localizer["esdevenimentForaTemporada"]));
                    }

                    UsuariSessio user = await ObtenirUsuari(principal).ConfigureAwait(false);
                    Casteller cas = (from cas1 in _appinyaDbContext.Casteller
                                     where cas1.UserId == user.Id
                                     select cas1).FirstOrDefault();

                    Assistencia assis = _appinyaDbContext.Assistencia.Where(ass => ass.IdCasteller == idCasteller && ass.IdEsdeveniment == idEsdeveniment).FirstOrDefault();

                    if (assis == null)
                    {
                        assis = new Assistencia()
                        {
                            IdCasteller = idCasteller,
                            IdEsdeveniment = idEsdeveniment,
                            IdUsuariCreador = cas.IdCasteller,
                            IdUsuariModifi = cas.IdCasteller,
                            DataCreacio = DateTime.Now,
                            DataModifi = DateTime.Now,
                            DataAssistencia = DateTime.Now,
                            Assistire = w.Assistire.HasValue ? w.Assistire.Value : false
                        };
                        assis.Confirmaciotec = false;

                        _appinyaDbContext.Assistencia.Add(assis);
                        _appinyaDbContext.EsdevenimentLog.Add(EsdevenimentHelper.CrearRegistreConfirmacio(assis));
                    }
                    else
                    {
                        if (assis.Confirmaciotec == true)
                        {
                            LogWarning(String.Format(_localizer["assistenciaBloquejadaTecnic"], assis.IdCasteller));
                            return CrearRespotaError(String.Format(_localizer["assistenciaBloquejadaTecnic"], assis.IdCasteller));
                        }
                        Boolean assistire = w.Assistire.HasValue ? w.Assistire.Value : false;
                        if (assistire != assis.Assistire)
                        {
                            assis.Assistire = w.Assistire.HasValue ? w.Assistire.Value : false;
                            assis.IdUsuariModifi = cas.IdCasteller;
                            assis.DataModifi = DateTime.Now;
                            assis.DataAssistencia = assis.DataAssistencia;
                        }
                        _appinyaDbContext.EsdevenimentLog.Add(EsdevenimentHelper.CrearRegistreConfirmacio(assis));

                    }

                }
                else
                {
                    LogWarning("S'ha enviat assitencia amb valor confirmat null => " + w.Casteller + " ," + w.Esdeveniment);
                }
            }

            _appinyaDbContext.SaveChanges();
            return CrearRespotaOK();
        }
        /// <summary>
        /// Retorna la assistencia d'un Esdeveniment que asistira
        /// </summary>
        /// <param name="Esdeveniment"></param>
        /// <returns>Retorna la assistencia d'un Esdeveniment </returns> 
        public IList<AssistenciaModel> ObtenirAssistencia(int idEsdeveniment)
        {

            return (from ass in _appinyaDbContext.Assistencia.Include(ass => ass.IdCastellerNavigation)
                        //  join ass in _appinyaDbContext.ASSISTENCIA.Include("CASTELLER") on est.ID_Esdeveniment equals ass.ID_Esdeveniment
                    where ass.IdEsdeveniment == idEsdeveniment
                    orderby ass.Confirmaciotec
                    select ass).ToList().Select<Assistencia, AssistenciaModel>(t => t).ToList();

        }

        /// <summary>
        /// Enviar un Excel per correu del la assistencia assosciada a un esdevenimnet
        /// </summary>
        /// <param name="idEsdeveniment"> Id Esdeveniment</param>
        /// <param name="UrlTemplate"> URL del correu </param>
        /// <param name="email">correo del usuari</param>
        public Resposta EnviarExcelAssistencia(int idEsdeveniment, String email)
        {
            StringBuilder sb = new StringBuilder();

            List<Assistencia> lstAssistencia = (from ass in _appinyaDbContext.Assistencia.Include(ass => ass.IdCastellerNavigation).ThenInclude(cas => cas.CastellerPosicio).ThenInclude(caspos => caspos.IdPosicioNavigation)
                                                    //  join ass in _appinyaDbContext.ASSISTENCIA.Include("CASTELLER") on est.ID_Esdeveniment equals ass.ID_Esdeveniment
                                                where ass.IdEsdeveniment == idEsdeveniment
                                                orderby ass.Confirmaciotec
                                                select ass).ToList();
            LogInfo("S'està enviant un correu de Exportació d'un Esdeveniment " + idEsdeveniment);
            Esdeveniment esd = (from est in _appinyaDbContext.Esdeveniment where est.IdEsdeveniment == idEsdeveniment select est).First();
            using (MemoryStream stream = new MemoryStream())
            {

                StreamWriter writer = new StreamWriter(stream);
                String titols = "Esdeveniment,Data Esdeveniment, Persona, Malnom, Assistirà?, Observacions,  Núm. Acompanyants,Confirmació Tècnica, Posicions ";
                if (esd.OfreixTransport)
                {
                    titols += ",Transport, Nomès Anada, Nomès tornada";
                }
                foreach (PreguntaModel t in esd.EsdevenimentPregunta)
                {
                    titols += "," + t.Pregunta;
                }

                writer.WriteLine(titols);

                foreach (Assistencia item in lstAssistencia)
                {
                    String pos = "";
                    item.IdCastellerNavigation.CastellerPosicio.ToList().ForEach(
                        it =>
                        {
                            pos += it.IdPosicioNavigation.Descripcio + " ";
                        }
                        );
                    String detall = "{0},{1},{2},{3},{4},{5},{6},{7},{8}";
                    int i = 8;
                    List<object> args = new List<object>();
                    args.Add(esd.Titol);
                    args.Add(esd.DataInici.ToString("dd-MM-yy"));
                    args.Add(item.IdCastellerNavigation.Nom + " " + item.IdCastellerNavigation.Cognoms);
                    args.Add(item.IdCastellerNavigation.Alias);
                    args.Add(item.Assistire ? "SI" : "NO");
                    if (item.Observacions != null)
                    {
                        item.Observacions = item.Observacions.Replace('\n', ' ').Replace(';', ' ');
                    }
                    args.Add(item.Observacions);
                    args.Add("" + item.NumAcompanyants);
                    args.Add(item.Confirmaciotec ? "SI" : "NO");
                    args.Add(pos);
                    if (esd.OfreixTransport)
                    {
                        i++;
                        detall += ",{" + i + "}";
                        args.Add(item.Transport.HasValue && item.Transport.Value ? "SI" : "NO");
                        i++;
                        detall += ",{" + i + "}";
                        args.Add(item.TransportAnada.HasValue && item.TransportAnada.Value ? "SI" : "NO");

                        i++;
                        detall += ",{" + i + "}";
                        args.Add(item.TransportTornada.HasValue && item.TransportTornada.Value ? "SI" : "NO");

                    }
                    List<PreguntaModel> lst = (item.Respostes == null) ? new List<PreguntaModel>() : JsonSerializer.Deserialize<List<PreguntaModel>>(item.Respostes);
                    foreach (PreguntaModel pregunta in esd.EsdevenimentPregunta)
                    {
                        var p = lst.Where(it => it.IdPregunta == pregunta.IdPregunta).FirstOrDefault();
                        i++;
                        detall += ",{" + i + "}";
                        if (pregunta.TipusPregunta == 10)
                            args.Add(pregunta.Resposta == "true" ? "SI" : "NO");
                        else
                            args.Add(pregunta.Resposta);
                    }

                    writer.WriteLine(detall, args.ToArray());
                }
                writer.Flush();

                Esdeveniment est = _appinyaDbContext.Esdeveniment.Where(it => it.IdEsdeveniment == idEsdeveniment).First();
                Dictionary<String, String> parames = new Dictionary<String, String>();
                parames.Add("titol", "Exportació " + est.Titol);
                parames.Add("missatge", "Exportació " + est.Titol + " " + est.DataInici.ToString("dd/MM"));
                parames.Add("Dia", est.DataInici.ToString("dd/MM/yyyy"));
                _emailService.EnviarEmailExportacioCSV("Exportació " + est.Titol, email, parames, stream);
                writer.Dispose();
                LogInfo("S'ha enviat un correu de Exportació d'un Esdeveniment " + idEsdeveniment);
                return CrearRespotaOK(String.Format(_localizer["emailenviat"], email));
            }




        }

        /// <summary>
        /// Enviar un Excel per correu del la assistencia global detallada
        /// </summary> 
        /// <param name="UrlTemplate"> URL del correu </param>
        /// <param name="email">correo del usuari</param>
        public Resposta EnviarExcelAssistenciaGlobal(int idTemporada, String email)
        {
            StringBuilder sb = new StringBuilder();
            Temporada temporada = _temporadaService.ObtenirTemporada(idTemporada);
            IList<AssistenciaGlobalModel> lstAssistencia = ObtenirAssistenciaGlobal(idTemporada);
            LogInfo("S'està enviant un correu de Exportació d'assistencia Global");
            using (MemoryStream stream = new MemoryStream())
            {
                StreamWriter writer = new StreamWriter(stream);
                writer.WriteLine("Casteller,  Nom, Àlias, Id Esdeveniment, Títol Esdeveniment, Id Tipus, Tipus , Data Inici," +
                "Data Fi,  Assistirè? , Confirmació Técnica, Vol Transport,  Número d'acompanyants, Observacions,  Data de Modificació");

                foreach (AssistenciaGlobalModel item in lstAssistencia)
                {
                    writer.WriteLine("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9} ",
                             item.Casteller,
                             item.Nom,
                             item.Alias,
                             item.Esdeveniment,
                             item.NomEsdeveniment,
                             item.idTipus,
                             item.NomTipus,
                             item.DataInici.ToString("dd/MM/yyyy"),
                             item.DataFi.ToString("dd/MM/yyyy"),
                             (item.Assistire.HasValue && item.Assistire.Value == true) ? "SI" : "NO",
                             item.ConfirmacioTecnica ? "SI" : "NO",
                             (item.Transport.HasValue && item.Transport.Value == true) ? "SI" : "NO",
                             item.NumAcompanyants,
                             item.Observacions,
                             item.DataModificacio);


                }
                writer.Flush();
                Dictionary<String, String> parames = new Dictionary<String, String>();
                parames.Add("titol", "Exportació Global " + temporada.Descripcio);
                parames.Add("missatge", "Exportació " + temporada.Descripcio);
                parames.Add("Dia", temporada.DataInici.ToString("dd/MM/yyyy"));
                _emailService.EnviarEmailExportacioCSV("Exportació " + temporada.Descripcio, email, parames, stream);
                writer.Dispose();
                LogInfo("S'ha enviat un correu de Exportació d'un Esdeveniment Global");
                return CrearRespotaOK(String.Format(_localizer["emailenviat"], email));
            }





        }
        /// <summary>
        /// Enviar un Excel per correu del la assistencia global Resum
        /// </summary> 
        /// <param name="UrlTemplate"> URL del correu </param>
        /// <param name="email">correo del usuari</param>
        public Resposta EnviarExcelAssistenciaGlobalResum(int idTemporada, String email)
        {
            StringBuilder sb = new StringBuilder();
            Temporada temporada = _temporadaService.ObtenirTemporada(idTemporada);
            IList<AssistenciaGlobalModel> lstAssistencia = ObtenirAssistenciaGlobal(idTemporada);

            LogInfo("S'està enviant un correu de Exportació d'assistencia Global");
            using (MemoryStream stream = new MemoryStream())
            {
                StreamWriter writer = new StreamWriter(stream);
                writer.WriteLine("Casteller, Nom, Alias, Num Diades, Num Entrenaments, Num Comecials, Num Taller, Num Musics, Num Altres");

                List<Casteller> castellers = _appinyaDbContext.Casteller.Where(cas => cas.IndEsborrat == false).ToList();

                foreach (Casteller cas in castellers)
                {
                    int diades = 0;
                    int entrenaments = 0;
                    int comercials = 0;
                    int tallers = 0;
                    int musics = 0;
                    int otros = 0;
                    List<AssistenciaGlobalModel> lstCasAssistencia = lstAssistencia.Where(a => a.Casteller == cas.IdCasteller && a.ConfirmacioTecnica == true && a.Assistire == true).ToList();
                    foreach (AssistenciaGlobalModel assis in lstCasAssistencia)
                    {
                        switch (assis.idTipus)
                        {
                            case EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_DIADES:
                                diades++; break;
                            case EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_ENTRENAMENTS:
                                entrenaments++; break;
                            case EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_COMERCIAL:
                                comercials++; break;
                            case EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_TALLER:
                                tallers++; break;
                            case EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_MUSICS:
                                musics++; break;
                            default:
                                otros++; break;
                        }

                    }
                    if (diades != 0 ||
                     entrenaments != 0 ||
                     comercials != 0 ||
                     tallers != 0 ||
                     musics != 0 ||
                     otros != 0)
                        writer.WriteLine("{0},{1},{2},{3},{4},{5},{6},{7},{8}",
                                cas.IdCasteller,
                                cas.Nom + " " + cas.Cognoms,
                                cas.Alias,
                                diades,
                                entrenaments,
                                comercials,
                                tallers,
                                musics,
                                otros
                                 );
                }

                writer.Flush();
                Dictionary<String, String> parames = new Dictionary<String, String>();
                parames.Add("titol", "Exportació Global " + temporada.Descripcio);
                parames.Add("missatge", "Exportació " + temporada.Descripcio);
                parames.Add("Dia", temporada.DataInici.ToString("dd/MM/yyyy"));
                _emailService.EnviarEmailExportacioCSV("Exportació " + temporada.Descripcio, email, parames, stream);
                writer.Dispose();
                LogInfo("S'ha enviat un correu de Exportació d'un Esdeveniment Global");
                return CrearRespotaOK(String.Format(_localizer["emailenviat"], email));
            }





        }
        /// <summary>
        /// Retorna la assitencia de una temporada per usuari
        /// </summary>
        /// <param name="idTemporada">id Temporada</param>
        /// <param name="principal"> Usuari casteller</param>
        /// <returns></returns>
        public async Task<IList<EstadisticaIndividualModel>> ObtenirEstadisticaUsuari(int idTemporada, IPrincipal principal)
        {
            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller casteller = await ObtenirCastellerSessio(principal);
            bool rolcasteller = user.Rols.Contains(SeguretatHelper.ROL_CASTELLER);
            bool rolmusic = user.Rols.Where(it => it == SeguretatHelper.ROL_MUSIC || it == SeguretatHelper.ROL_CAPMUSIC).Any();
            List<fEstadisticaIndividual_Result> lst = await _appinyaDbContext.ObtenirEsdevenimentIndividual(casteller.IdCasteller, idTemporada, rolcasteller, rolmusic);
            return lst.Select<fEstadisticaIndividual_Result, EstadisticaIndividualModel>(t => t).ToList();


        }
        /// <summary>
        /// Retorna la assitencia de una temporada per usuari
        /// </summary>
        /// <param name="idTemporada">id Temporada</param>
        /// <param name="principal"> Usuari casteller</param>
        /// <returns></returns> 
        public async Task<IList<EstadisticaIndividualModel>> ObtenirEstadisticaUsuari(IPrincipal principal)
        {
            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller casteller = await ObtenirCastellerSessio(principal);
            bool rolcasteller = user.Rols.Contains(SeguretatHelper.ROL_CASTELLER);
            bool rolmusic = user.Rols.Where(it => it == SeguretatHelper.ROL_MUSIC || it == SeguretatHelper.ROL_CAPMUSIC).Any();
            Temporada temp = _temporadaService.ObtenirTemporadaActual();
            List<fEstadisticaIndividual_Result> lst = await _appinyaDbContext.ObtenirEsdevenimentIndividual(casteller.IdCasteller, temp.Id, rolcasteller, rolmusic);
            return lst.Select<fEstadisticaIndividual_Result, EstadisticaIndividualModel>(t => t).ToList();


        }
        /// <summary>
        /// Obtenir l'estadistica del casteller mitjançant l'usuari
        /// </summary>
        /// <param name="principal"></param>
        /// <param name="idTemporada"></param>
        /// <returns></returns>
        public async Task<IList<AssistenciaModel>> ObtenirAssistenciaCasteller(IPrincipal principal, int idTemporada)
        {
            DateTime actual = DateTime.Now;

            Casteller casteller = await ObtenirCastellerSessio(principal);

            if (casteller == null) return null;

            return ObtenirAssistenciaCasteller(casteller.IdCasteller, idTemporada);

        }
        public async Task<IList<AssistenciaModel>> ObtenirAssistenciaCasteller(IPrincipal principal)
        {
            Temporada temp = _temporadaService.ObtenirTemporadaActual();
            return await ObtenirAssistenciaCasteller(principal, temp.Id).ConfigureAwait(false);

        }

        /// <summary>
        ///  OBtenir la assitencia del casteller mitjançant el identificador del casteller
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <param name="idTemporada"></param>
        /// <returns></returns>
        public IList<AssistenciaModel> ObtenirAssistenciaCasteller(int idCasteller)
        {
            Temporada temp = _temporadaService.ObtenirTemporadaActual();
            return ObtenirAssistenciaCasteller(idCasteller, temp.Id);
        }
        /// <summary>
        ///  OBtenir la assitencia del casteller mitjançant el identificador del casteller
        /// </summary>
        /// <param name="idCasteller"></param>
        /// <param name="idTemporada"></param>
        /// <returns></returns>
        public IList<AssistenciaModel> ObtenirAssistenciaCasteller(int idCasteller, int idTemporada)
        {
            DateTime actual = DateTime.Now;


            List<Esdeveniment> lstEsdeveniments = (from est in _appinyaDbContext.Esdeveniment where est.IndEsborrat == false && est.Anulat == false && est.Activa == true && est.IdTemporada == idTemporada select est).OrderByDescending(order => order.DataInici).ToList();
            List<Assistencia> lstAssistencia = (from ass in _appinyaDbContext.Assistencia where ass.IdCasteller == idCasteller && ass.IndEsborrat == false select ass).ToList();
            List<AssistenciaModel> result = new List<AssistenciaModel>();
            foreach (Esdeveniment est in lstEsdeveniments)
            {
                Assistencia ass = lstAssistencia.Where(it => it.IdEsdeveniment == est.IdEsdeveniment).FirstOrDefault();
                if (ass == null)
                {
                    result.Add(new AssistenciaModel()
                    {
                        Assistire = null,
                        Casteller = idCasteller.ToString(),
                        ConfirmacioTecnica = true,
                        DataModificacio = DateTime.Now,
                        Esdeveniment = est.IdEsdeveniment.ToString(),
                        NumAcompanyants = 0,
                        Observacions = "",
                        Transport = false
                    });
                }
                else
                {
                    result.Add(new AssistenciaModel()
                    {
                        Assistire = ass.Assistire,
                        Casteller = idCasteller.ToString(),
                        ConfirmacioTecnica = ass.Confirmaciotec,
                        DataModificacio = ass.DataAssistencia,
                        Esdeveniment = est.IdEsdeveniment.ToString(),
                        NumAcompanyants = ass.NumAcompanyants,
                        Observacions = ass.Observacions,
                        Transport = ass.Transport
                    });
                }
            }
            return result;
        }


        /// <summary>
        /// Retorna la Estadistica associada a un casteller i temporada
        /// </summary>
        /// <param name="idCasteller">Id del casteller</param> 
        /// <returns></returns>
        public async Task<IList<EstadisticaIndividualModel>> ObtenirEstadisticaCasteller(int idCasteller, IPrincipal principal)
        {

            Temporada temp = _temporadaService.ObtenirTemporadaActual();

            return await ObtenirEstadisticaCasteller(idCasteller, temp.Id, principal);


        }

        /// <summary>
        /// Retorna la Estadistica associada a un casteller i temporada
        /// </summary>
        /// <param name="idCasteller">Id del casteller</param>
        /// <param name="idTemporada">Id de la temporada</param> 
        /// <returns></returns>
        public async Task<IList<EstadisticaIndividualModel>> ObtenirEstadisticaCasteller(int idCasteller, int idTemporada, IPrincipal principal)
        {

            Casteller casteller = _appinyaDbContext.Casteller.Where(cas => cas.IdCasteller == idCasteller).FirstOrDefault();

            List<fEstadisticaIndividual_Result> lst = await _appinyaDbContext.ObtenirEsdevenimentIndividual(casteller.IdCasteller, idTemporada, SeguretatHelper.esRolCasteller(principal), SeguretatHelper.esRolMusic(principal));
            return lst.Select<fEstadisticaIndividual_Result, EstadisticaIndividualModel>(t => t).ToList();
            //  return _appinyaDbContext.fEstadisticaIndividual(idCasteller, idTemporada).ToList();

        }
        /// <summary>
        /// Retorna la assistencia global de la temporada
        /// </summary>
        /// <param name="idTemporada">Id de la temporada</param>
        /// <returns></returns>
        public IList<AssistenciaGlobalModel> ObtenirAssistenciaGlobal(int idTemporada)
        {


            return (from ass in _appinyaDbContext.Assistencia.Include(ass => ass.IdCastellerNavigation).Include(ass => ass.IdEsdevenimentNavigation).ThenInclude(es => es.IdTipusNavigation)
                        //  join ass in _appinyaDbContext.ASSISTENCIA.Include("CASTELLER") on est.ID_ESDEVENIMENT equals ass.ID_ESDEVENIMENT
                    where ass.IdEsdevenimentNavigation.IdTemporada == idTemporada && ass.IndEsborrat == false && ass.IdEsdevenimentNavigation.IndEsborrat == false && ass.IdEsdevenimentNavigation.Anulat == false
                    orderby ass.IdCasteller
                    select ass).ToList().Select<Assistencia, AssistenciaGlobalModel>(t => t).ToList();

        }



    }
}
