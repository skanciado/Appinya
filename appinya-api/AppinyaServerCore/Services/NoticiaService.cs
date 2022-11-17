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
using Microsoft.AspNetCore.Identity;

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
    public interface INoticiaService
    {
        Task<(string foto, DateTime dataModificacio)> ObtenirFoto(int idNoticies);
        /// <summary>
        /// Retorna la noticia .
        /// </summary>
        /// <returns></returns>
        public NoticiaModel ObtenirNoticia(int idNoticia);
        /// <summary>
        /// Retorna totes les noticies enregistrades.
        /// </summary>
        /// <returns></returns>
        public IList<NoticiaModel> ObtenirNoticies();
        /// <summary>
        /// Retorna les noticies pasades
        /// </summary>
        /// <param name="numreg"> Numero del registre on es posiciona la pagina</param>
        /// <param name="usuari"> Rol del usuari </param>
        /// <returns></returns>
        public IList<NoticiaModel> ObtenirNoticiesHistoriques(int numreg, IPrincipal usuari);
        /// <summary>
        /// Retorna les noticies d'avui
        /// </summary>
        /// <param name="numreg"> Numero del registre on es posiciona la pagina</param>
        /// <param name="usuari"> Rol del usuari </param>
        /// <returns></returns>
        public IList<NoticiaModel> ObtenirNoticiesActuals(int numreg, IPrincipal usuari);
        /// <summary>
        /// Retonra les Noticies superior a una data 
        /// </summary>
        /// <param name="data"> Data de la cerca</param>
        /// <param name="usuari"> Rol del usuari </param>
        /// <returns></returns> 
        public IList<NoticiaModel> ObtenirNoticies(DateTime? data, IPrincipal usuari);
        /// <summary>
        /// Funcio per Modificar/crear Noticies 
        /// </summary>
        /// <param name="notiparam">Noticia objecte de la modificació </param>
        /// <param name="principal">Rol principal de l'usuari </param>
        /// <returns></returns>
        public  Task<RespostaAmbRetorn<NoticiaModel>> EditarNoticia(NoticiaModel notiparam, IPrincipal principal);
        /// <summary>
        /// Esborrar la noticia
        /// </summary>
        /// <param name="id"> Id de la noticia</param>
        /// <param name="principal">Rol de l'usuari </param>
        public Resposta EsborrarNoticia(int id, IPrincipal principal);
    }
    /// <summary>
    /// Clase que identificar tota la funcionalitat de noticies CRUD i funcions especifiques
    /// </summary>
    public class NoticiaService : AppinyaBaseService<NoticiaService>, INoticiaService
    {
        //
        private static double MAX_TAMANY_FOTO = 150000.0;



        private readonly AppinyaDbContext _appinyaDbContext;
        private readonly IEmailService _emailService; 
        private readonly AppSettings _appSettings;
        private readonly IAuditoriaService _auditoriaService;

        public NoticiaService(
            AppinyaDbContext appinyaDbContext,
            IUsuariService usuariService,
            IOptions<AppSettings> appSettings, 
            IEmailService emailService, 
            ILogger<NoticiaService> logger,
           IAuditoriaService auditoriaService,
            IStringLocalizer<NoticiaService> localizer
            ) : base(usuariService, localizer, logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appinyaDbContext = appinyaDbContext;
            _appSettings = appSettings.Value;
            _emailService = emailService;
            _auditoriaService = auditoriaService;
        }

        public async Task<(string foto, DateTime dataModificacio)> ObtenirFoto(int idNoticies)
        {
            var fot = await (from f in _appinyaDbContext.Noticies
                             where f.IdNoticies == idNoticies
                             select new
                             {
                                 f.Foto,
                                 f.DataModificacio
                             }).SingleOrDefaultAsync();

            return fot != null ? (fot.Foto, fot.DataModificacio) : default;
        }

        /// <summary>
        /// Retorna la noticia .
        /// </summary>
        /// <returns></returns>
        public NoticiaModel ObtenirNoticia(int idNoticia)
        {
            var not1 = (from not in _appinyaDbContext.Noticies.Include(not => not.IdCastellerNavigation).Include(not1 => not1.IdTipusNoticiesNavigation)
                                  where not.IdNoticies==idNoticia
                                  orderby not.IdTipusNoticies, not.Data descending
                                  select not).FirstOrDefault();
            return not1;

        }
        /// <summary>
        /// Retorna totes les noticies enregistrades.
        /// </summary>
        /// <returns></returns>
        public IList<NoticiaModel> ObtenirNoticies()
        {
            DateTime dt = DateTime.Now;
            dt = dt.AddDays(-2);

            List<Noticies> lst = (from not in _appinyaDbContext.Noticies.Include(not => not.IdCastellerNavigation).Include(not1 => not1.IdTipusNoticiesNavigation)
                                  where   (not.Data.CompareTo(dt) > 0 || not.Indefinida)
                                  orderby not.IdTipusNoticies, not.Data descending
                                  select not).ToList();
            return lst.Select<Noticies, NoticiaModel>(t => t).ToList();



        }
        /// <summary>
        /// Retorna les noticies pasades al dia d'avui
        /// </summary>
        /// <param name="numreg"> Numero del registre on es posiciona la pagina</param>
        /// <param name="usuari"> Rol del usuari </param>
        /// <returns></returns>
        public IList<NoticiaModel> ObtenirNoticiesHistoriques(int numreg, IPrincipal usuari)
        {
            DateTime dt = DateTime.Now;
            dt = dt.AddDays(-1);
            Boolean isCasteller = SeguretatHelper.esRolCasteller(usuari);



            List<Noticies> lst = null;

            lst = (from not in _appinyaDbContext.Noticies.Include(not => not.IdCastellerNavigation).Include(not1 => not1.IdTipusNoticiesNavigation)
                   where not.Activa == true && (not.Data.CompareTo(dt) < 0 && !not.Indefinida)
                   orderby not.Data descending
                   select not).Skip(numreg).Take(30).ToList();


            return lst.Select<Noticies, NoticiaModel>(t => t).ToList();
        }
        /// <summary>
        /// Retorna les noticies pasades al dia d'avui
        /// </summary>
        /// <param name="numreg"> Numero del registre on es posiciona la pagina</param>
        /// <param name="usuari"> Rol del usuari </param>
        /// <returns></returns>
        public IList<NoticiaModel> ObtenirNoticiesActuals(int numreg, IPrincipal usuari)
        {
            DateTime dt = DateTime.Now;
            dt = dt.AddDays(-2);
            Boolean isCasteller = SeguretatHelper.esRolCasteller(usuari); 

            List<Noticies> lst = null;

            lst = (from not in _appinyaDbContext.Noticies.Include(not => not.IdCastellerNavigation).Include(not1 => not1.IdTipusNoticiesNavigation)
                   where not.Activa == true && (not.Data.CompareTo(dt) >= 0 || not.Indefinida)
                   orderby not.Data descending
                   select not).Skip(numreg).Take(30).ToList();


            return lst.Select<Noticies, NoticiaModel>(t => t).ToList();
        }
        /// <summary>
        /// Retonra les Noticies superior a una data 
        /// </summary>
        /// <param name="data"> Data de la cerca</param>
        /// <param name="usuari"> Rol del usuari </param>
        /// <returns></returns> 
        public IList<NoticiaModel> ObtenirNoticies(DateTime? data, IPrincipal usuari)
        {
            DateTime dt = DateTime.Now;
            dt = dt.AddDays(-1);
            Boolean isCasteller = SeguretatHelper.esRolCasteller(usuari);



            List<Noticies> lst = null;
            if (data == null || !data.HasValue)
            {
                lst = (from not in _appinyaDbContext.Noticies.Include(not => not.IdCastellerNavigation).Include(not1 => not1.IdTipusNoticiesNavigation)
                       where not.Activa == true && (not.Data.CompareTo(dt) > 0 || not.Indefinida)
                       orderby not.IdTipusNoticies, not.Data descending
                       select not).ToList();
            }
            else
            {
                lst = (from not in _appinyaDbContext.Noticies.Include(not => not.IdCastellerNavigation).Include(not1 => not1.IdTipusNoticiesNavigation)
                       where not.DataModificacio.CompareTo(data.Value) > 0
                       orderby not.IdTipusNoticies, not.Data descending
                       select not).ToList();
            }
            return lst.Select<Noticies, NoticiaModel>(t => t).ToList(); ;



        }
        /// <summary>
        /// Funcio per Modificar/crear Noticies 
        /// </summary>
        /// <param name="notiparam">Noticia objecte de la modificació </param>
        /// <param name="principal">Rol principal de l'usuari </param>
        /// <returns></returns>
        public async Task<RespostaAmbRetorn<NoticiaModel>> EditarNoticia(NoticiaModel notiparam, IPrincipal principal)
        {
            UsuariSessio user = await ObtenirUsuari(principal);
            if (notiparam == null) throw new ArgumentNullException(nameof(notiparam));
            String error = null;
            Boolean enviarCorreu = false;
            if (String.IsNullOrEmpty(notiparam.Titol))
            {
                error = _localizer["notetitol"];
                LogWarning($"Id: {notiparam.Id} - {error} ");
                return CrearRespotaAmbRetornError<NoticiaModel>(error);
            }
            if (String.IsNullOrEmpty(notiparam.Descripcio))
            {
                error = _localizer["notedescripcio"];
                LogWarning($"Id: {notiparam.Id} - {error} ");
                return CrearRespotaAmbRetornError<NoticiaModel>(error);
            }
            if (user == null) throw new ArgumentException(_localizer["notepermisos"]);

            if (!notiparam.Data.HasValue && !notiparam.Indefinida)
            {
                error = _localizer["noticianodata"];
                LogWarning($"Id: {notiparam.Id} - {error} ");
                return CrearRespotaAmbRetornError<NoticiaModel>(error);
            }

            Casteller creador = await ObtenirCastellerSessio(principal);

            if (creador == null)
            {
                error = _localizer["notecasteller"];
                LogWarning($"Id: {notiparam.Id} - {error} ");
                return CrearRespotaAmbRetornError<NoticiaModel>(error);
            }

            if (!PotEditarNoticia(notiparam, principal))
            {
                error = _localizer["notepermisosedicio"];
                LogWarning($"Id: {notiparam.Id} - {error} ");
                return CrearRespotaAmbRetornError<NoticiaModel>(error);

            }
            Noticies not = null;
            int id = Int32.Parse(notiparam.Id);
            if (id == 0)
            {
                not = new Noticies();
                not.DataCreacio = DateTime.Now;
                not.DataModificacio = DateTime.Now;
                not.IdTipusNoticies = notiparam.IdTipusNoticia;
                not.IdUsuariCreador = creador.IdCasteller;
                not.Activa = true;
                enviarCorreu = true;
            }
            else
            {
                not = (from n in _appinyaDbContext.Noticies.Include(not => not.IdCastellerNavigation)
                       where n.Activa == true && n.IdNoticies == id
                       select n).FirstOrDefault();
            }
            if (not == null)
            {
                error = _localizer["noticianottrobada"];
                LogWarning($"Id: {notiparam.Id} - {error} ");
                return CrearRespotaAmbRetornError<NoticiaModel>(error);
            }
            int? casId = (notiparam.UsuariReferencia == null || notiparam.UsuariReferencia.Id==0) ? (int?)null : _appinyaDbContext.Casteller.Where(t => t.IdCasteller == notiparam.UsuariReferencia.Id).FirstOrDefault().IdCasteller;
            not.DataModificacio = DateTime.Now;
            not.IdUsuariModifica = creador.IdCasteller;
            not.Titulo = notiparam.Titol;
            not.Descripcio = notiparam.Descripcio;
            not.Data = (notiparam.Data.HasValue) ? notiparam.Data.Value : DateTime.Now;
            not.IdTipusNoticies = notiparam.IdTipusNoticia;
            not.Indefinida = notiparam.Indefinida;
            not.IdCasteller = casId;
            not.Url = notiparam.Url;

            if (!PotEditarNoticia(not, principal))
            {
                error = _localizer["notepermisosedicio"];
                LogWarning($"Id: {notiparam.Id} - {error} ");
                return CrearRespotaAmbRetornError<NoticiaModel>(error);

            }
            if (notiparam.Foto == null) not.Foto = null;
            int idParam = Int32.Parse(notiparam.Id);
            if (idParam == 0)
            {
                _appinyaDbContext.Noticies.Add(not);
                _appinyaDbContext.SaveChanges();
            }
            if (!String.IsNullOrEmpty(notiparam.Foto))
            {
                try
                {
                    not.Foto = "data:image/jpeg;base64," + ImageUtils.ReduirImatgeBase64(notiparam.Foto, 600, 450, MAX_TAMANY_FOTO);
                    LogInfo("Actualitza foto del noticia " + not.IdNoticies ?? "nova " + " size:" + not.Foto.Length);
                }
                catch (Exception)
                {
                    error = _localizer["fotomassagran"];
                    LogWarning("No s'ha grabar la foto perquè hi ha algun problema amb la foto adjunta");
                    LogWarning("Id:  " + not.IdNoticies ?? 0 + " " + error);
                    _appinyaDbContext.Noticies.Remove(not);
                    _appinyaDbContext.SaveChanges();
                    return CrearRespotaAmbRetornError<NoticiaModel>(error);
                }

            }
            _appinyaDbContext.SaveChanges();

            if (enviarCorreu)
                EnviarCorreuNoticies(not);
            _auditoriaService.RegistraAccio<Noticies>((id == 0) ? Accio.Agregar : Accio.Modificar, not.IdNoticies, principal);
            return CrearRespotaAmbRetornOK< NoticiaModel >(ObtenirNoticia(not.IdNoticies));


        }
        /// <summary>
        /// Funció per enviar correu de notificació de canvis de noticies a usuaris subscriptors
        /// </summary>
        /// <param name="not">Noticia objecte de la modificació</param>
        /// <param name="db"> Entity Framework base de dades</param>
        private void EnviarCorreuNoticies(NoticiaModel not)
        {
            try
            {
                List<String> emails = _appinyaDbContext.Casteller.Where(cas => cas.Rebremailnot == true).Select(cas => cas.Email).ToList();

                if (emails.Count == 0) return;

                Dictionary<String, String> parames = new Dictionary<String, String>();
                parames.Add("Title", not.Titol);
                parames.Add("titol", not.Titol);
                parames.Add("descripcio", not.Descripcio);
                if (not.Url == null) parames.Add("linkvisible", "display:none");
                else parames.Add("linkvisible", "display: block;");
                parames.Add("Url", not.Url);
                if (not.Foto == null) parames.Add("fotovisible", "display:none");
                else parames.Add("fotovisible", "display: block;");
                parames.Add("foto", _appSettings.UrlNoticies + $"{not.Id}.jpg");
                LogInfo("Enviar correus de Fotos a :" + String.Join(",", emails));
                _emailService.EnviarEmailNotificacioNoticies(String.Join(",", emails), parames);
            }
            catch (Exception e)
            {
                LogError(e);

            }
        }

        /// <summary>
        /// Valida si pot modificar la noticia
        /// </summary>
        /// <param name="not">Noticia objecte de la evaluacio</param>
        /// <param name="principal"> Rol identificadro del usuari </param>
        /// <returns></returns>
        private bool PotEditarNoticia(NoticiaModel not, IPrincipal principal)
        {
            bool valid = false;
            if (SeguretatHelper.esRolJunta(principal) || SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolNoticier(principal) || SeguretatHelper.esRolSecretari(principal))
                valid = true;

            // Els de bar només poden modificar les noticies de bar, 1º vegada per veure si modifica un tipus correcte 
            if (SeguretatHelper.esRolBar(principal) && not.IdTipusNoticia == NoticiesHelper.ID_TIPUS_NOTICIES_BAR)
                valid = true;
            // Els de bar només poden modificar les noticies de bar, 1º vegada per veure si modifica un tipus correcte 
            if (SeguretatHelper.esRolOrganitzador(principal) && not.IdTipusNoticia == NoticiesHelper.ID_TIPUS_NOTICIES_OCI)
                valid = true;
            // Els de ID_TIPUS_NOTICIES_ENTRENAMENT només poden modificar les noticies de bar, 2º vegada per veure si modifica un tipus correcte  
            if (SeguretatHelper.esRolOrganitzador(principal) && not.IdTipusNoticia == NoticiesHelper.ID_TIPUS_NOTICIES_ENTRENAMENT)
                valid = true;
            if (SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolNoticier(principal) || SeguretatHelper.esRolSecretari(principal))
                valid = true; 

            return valid;


        }
        /// <summary>
        /// Esborrar la noticia
        /// </summary>
        /// <param name="id"> Id de la noticia</param>
        /// <param name="principal">Rol de l'usuari </param>
        public Resposta EsborrarNoticia(int id, IPrincipal principal)
        {

            Noticies not = (from n in _appinyaDbContext.Noticies
                            where n.IdNoticies == id
                            select n).FirstOrDefault();
            if (not == null) 
                    return CrearRespotaError(_localizer["noticianottrobada"]);
            if (!PotEditarNoticia(not, principal))
            {
                LogWarning("Id:  " + not.IdNoticies ?? 0 + " No tens permisos , per crear  les notícies d'aquest tipus  ");
                return CrearRespotaError(_localizer["notepermisos"]);

            }
            not.Activa = false;
            _appinyaDbContext.SaveChanges();
            _auditoriaService.RegistraAccio<Noticies>(Accio.Esborrar, id, principal);
            return CrearRespotaOK(); 
        }

    }
}
