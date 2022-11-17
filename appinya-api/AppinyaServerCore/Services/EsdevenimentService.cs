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
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using AppinyaServerCore.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Security.Principal;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using AppinyaServerCore.Helpers;
using System.Security.Claims;
using AppinyaServerCore.Database;
using AppinyaServerCore.Database.Identity;
using Microsoft.Extensions.Localization;
using Microsoft.EntityFrameworkCore;
using AppinyaServerCore.Excepcions;
using AppinyaServerCore.Utils;
using AppinyaServerCore.Database.Appinya;

namespace AppinyaServerCore.Services
{
    public interface IEsdevenimentsService
    {
        Task<EsdevenimentDetallModel> ObtenirDetall(int idEsdeveniemnt, IPrincipal principal);
        Task<EsdevenimentDetallModel> ObtenirDetall(PeticioActualitzacioIdModel peticio, IPrincipal principal);
        IList<Esdeveniment> ObtenirEsdevenimentsSetmanals();

        Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdevenimentsActualitzacio(DateTime? dataActualitzacio, int idTemporada, IPrincipal principal);
        Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdevenimentsActualitzacio(DateTime? dataActualitzacio, IPrincipal principal);
        Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdeveniments(CercaModel cerca, IPrincipal principal);
        Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdeveniments(IPrincipal principal);
        Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdevenimentsActuals(CercaModel cerca, IPrincipal principal);
        Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdevenimentsHistoric(CercaModel cerca, IPrincipal principal);
        Task<Resposta> Esborrar(int id, IPrincipal principal);
        Task<Resposta> DesBloquejar(int id, IPrincipal principal);
        Task<Resposta> Bloquejar(int id, IPrincipal principal);

        Task<RespostaAmbRetorn<EsdevenimentCastellModel>> ModificarCastell(EsdevenimentCastellModel castell, IPrincipal principal);
        Task<Resposta> EsborrarCastell(int id, IPrincipal principal);
        Task<Resposta> EstatCastell(int idEsdeveniment, int idCastell, int idEstatCastell, IPrincipal principal);

        Task<Resposta> Valorar(int idEsdevement, int valorar, IPrincipal principal);
        Task<Resposta> Anular(int id, IPrincipal principal);
        Task<Resposta> Activar(int id, IPrincipal principal);
        Task<RespostaAmbRetorn<EsdevenimentModel>> Desar(EsdevenimentModel esdeveniment, IPrincipal principal);
    }
    /// <summary>
    /// Clase que identificar tota la funcionalitat d'un esdeveniment CRUD i funcions especifiques
    /// </summary>
    public class EsdevenimentService : AppinyaBaseService<EsdevenimentService>, IEsdevenimentsService

    {


        private readonly AppinyaDbContext _appinyaDbContext;
        private readonly ITemporadaService _temporadaService;
        private readonly IAuditoriaService _auditoriaService;

        public EsdevenimentService(
            AppinyaDbContext appinyaDbContext,
            ITemporadaService temporadaService,
            IUsuariService usuariService,
            ILogger<EsdevenimentService> logger,
            IAuditoriaService auditoriaService,
            IStringLocalizer<EsdevenimentService> localizer
            ) : base(usuariService, localizer, logger)
        {
            _temporadaService = temporadaService;
            _appinyaDbContext = appinyaDbContext;
            _auditoriaService = auditoriaService;
        }

        public async Task<EsdevenimentDetallModel> ObtenirDetall(PeticioActualitzacioIdModel peticio, IPrincipal principal)
        {
            if (peticio == null) throw new ArgumentNullException(nameof(peticio));
            DateTime? timestamp = WebApiUtils.convertApiDateHour(peticio.DataActualitzacio);
            int idEsdeveniemnt = Int32.Parse(peticio.Id);
            bool load = !timestamp.HasValue ? true : _appinyaDbContext.Esdeveniment.Where(est => est.IdEsdeveniment == idEsdeveniemnt && est.DataModificacio > timestamp).Any();
            if (!load) return null;

            Esdeveniment esdeve = null;
            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller casteller = await ObtenirCastellerSessio(principal);
            esdeve = (from est in _appinyaDbContext.Esdeveniment.Include(a => a.EsdevenimentPregunta).Include(a => a.Assistencia).ThenInclude(b => b.IdCastellerNavigation)
                          //  join ass in _appinyaDbContext.ASSISTENCIA.Include("CASTELLER") on est.ID_ESDEVENIMENT equals ass.ID_ESDEVENIMENT
                      where est.IdEsdeveniment == idEsdeveniemnt
                      select est).FirstOrDefault();
            List<AssistenciaModel> lstAssistire = esdeve.Assistencia.Where(t => t.Assistire == true).Select<Assistencia, AssistenciaModel>(a => a).ToList();//.CASTELLER).ToList().Select(x => new Casteller() { Id = x.ID_CASTELLER,IdUsuari=x.USER_ID,Nom=x.NOM,Cognom=x.COGNOMS,Alias=x.ALIAS , Foto = x.FOTO }).ToList();
            List<AssistenciaModel> lstNoAssistire = esdeve.Assistencia.Where(t => t.Assistire == false).Select<Assistencia, AssistenciaModel>(a => a).ToList(); ; //.Select(a => a.CASTELLER).ToList().Select<CASTELLER, Casteller>(x => new Casteller() { Id = x.ID_CASTELLER, IdUsuari = x.USER_ID, Nom = x.NOM, Cognom = x.COGNOMS, Alias = x.ALIAS, Foto = x.FOTO }).ToList();

            EsdevenimentDetallModel pub = esdeve;
            if (SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolJunta(principal) || SeguretatHelper.esRolSecretari(principal) || SeguretatHelper.esRolCapMusic(principal) || SeguretatHelper.esRolTecnic(principal) || SeguretatHelper.esRolTecnicNivell2(principal) || SeguretatHelper.esRolOrganitzador(principal))
            {
                pub.EsdevenimentLog = _appinyaDbContext.EsdevenimentLog.Where(log => log.IdEsdeveniment == idEsdeveniemnt).Select<EsdevenimentLog, EsdevenimentLogModel>(t => t).ToList();
            }

            pub.Castells = _appinyaDbContext.EsdevenimentCastells.Where(it => it.IdEsdeveniment == idEsdeveniemnt).Select<EsdevenimentCastells, EsdevenimentCastellModel>(t => t).ToList();
            pub.CastellersAssitiran = lstAssistire;
            pub.CastellersNoAssitiran = lstNoAssistire;
            AssistenciaModel assistenciaPersonal = lstAssistire.Where(it => it.Casteller == casteller.IdCasteller.ToString()).FirstOrDefault();
            if (assistenciaPersonal == null)
                assistenciaPersonal = lstNoAssistire.Where(it => it.Casteller == casteller.IdCasteller.ToString()).FirstOrDefault();
            pub.ValoracioPersonal = _appinyaDbContext.EsdevenimentValoracio.Where(it => it.IdEsdeveniment == idEsdeveniemnt && it.IdCasteller == casteller.IdCasteller).FirstOrDefault();
            pub.AssistenciaPersonal = assistenciaPersonal;
            return pub;


        }
        /// <summary>
        /// Retorna el Detall de l'esdeveniment identificat
        /// </summary>
        /// <param name="idEsdeveniemnt">Identificador del esdeveniment</param>
        /// <param name="principal">Indentificador de seguretat de l'usuari</param>
        /// <returns></returns>        
        public async Task<EsdevenimentDetallModel> ObtenirDetall(int idEsdeveniemnt, IPrincipal principal)
        {

            Esdeveniment esdeve = null;
            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller casteller = await ObtenirCastellerSessio(principal);
            esdeve = (from est in _appinyaDbContext.Esdeveniment.Include(a => a.EsdevenimentPregunta
                      ).Include(a => a.Assistencia).ThenInclude(b => b.IdCastellerNavigation)
                          //  join ass in _appinyaDbContext.ASSISTENCIA.Include("CASTELLER") on est.ID_ESDEVENIMENT equals ass.ID_ESDEVENIMENT
                      where est.IdEsdeveniment == idEsdeveniemnt
                      select est).FirstOrDefault();
            if (esdeve == null) throw new ApplicationException(String.Format(_localizer["noExisteixEsdeveniment"], idEsdeveniemnt));
            List<AssistenciaModel> lstAssistire = esdeve.Assistencia.Where(t => t.Assistire == true).Select<Assistencia, AssistenciaModel>(a => a).ToList();//.CASTELLER).ToList().Select(x => new Casteller() { Id = x.ID_CASTELLER,IdUsuari=x.USER_ID,Nom=x.NOM,Cognom=x.COGNOMS,Alias=x.ALIAS , Foto = x.FOTO }).ToList();
            List<AssistenciaModel> lstNoAssistire = esdeve.Assistencia.Where(t => t.Assistire == false).Select<Assistencia, AssistenciaModel>(a => a).ToList(); ; //.Select(a => a.CASTELLER).ToList().Select<CASTELLER, Casteller>(x => new Casteller() { Id = x.ID_CASTELLER, IdUsuari = x.USER_ID, Nom = x.NOM, Cognom = x.COGNOMS, Alias = x.ALIAS, Foto = x.FOTO }).ToList();

            EsdevenimentDetallModel pub = esdeve;
            if (SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolJunta(principal) || SeguretatHelper.esRolSecretari(principal) || SeguretatHelper.esRolCapMusic(principal) || SeguretatHelper.esRolTecnic(principal) || SeguretatHelper.esRolTecnicNivell2(principal) || SeguretatHelper.esRolOrganitzador(principal))
            {
                pub.EsdevenimentLog = _appinyaDbContext.EsdevenimentLog.Where(log => log.IdEsdeveniment == idEsdeveniemnt).OrderByDescending(t => t.Data).Select<EsdevenimentLog, EsdevenimentLogModel>(t => t).ToList();
            }

            pub.Castells = _appinyaDbContext.EsdevenimentCastells.Where(it => it.IdEsdeveniment == idEsdeveniemnt).OrderBy(t => t.Ordre).Select<EsdevenimentCastells, EsdevenimentCastellModel>(t => t).ToList();
            pub.CastellersAssitiran = lstAssistire;
            pub.CastellersNoAssitiran = lstNoAssistire;
            AssistenciaModel assistenciaPersonal = lstAssistire.Where(it => it.Casteller == casteller.IdCasteller.ToString()).FirstOrDefault();
            if (assistenciaPersonal == null)
                assistenciaPersonal = lstNoAssistire.Where(it => it.Casteller == casteller.IdCasteller.ToString()).FirstOrDefault();
            pub.ValoracioPersonal = _appinyaDbContext.EsdevenimentValoracio.Where(it => it.IdEsdeveniment == idEsdeveniemnt && it.IdCasteller == casteller.IdCasteller).FirstOrDefault();
            pub.AssistenciaPersonal = assistenciaPersonal;
            return pub;

        }

        /// <summary>
        /// Metode que obter els esdeveniments de la a una setmana vista que no estiguin bloquejat o esborrats.
        /// </summary>
        /// <returns></returns>
        public IList<Esdeveniment> ObtenirEsdevenimentsSetmanals()
        {

            DateTime dtAvui = DateTime.Now;
            DateTime dtSetmana = dtAvui.AddDays(7);// Una setmana vista
            var lst = (from est in _appinyaDbContext.Esdeveniment.Include(t => t.IdTipusNavigation)
                       where est.DataInici.CompareTo(dtAvui) > 0 && est.DataInici.CompareTo(dtSetmana) < 0 && est.Anulat == false && est.Activa == true && est.BloqueixAssistencia == false && est.IndEsborrat == false
                       select est).ToList();
            return lst.ToList();

        }
        public async Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdeveniments(CercaModel cerca, IPrincipal principal)
        {
            if (cerca == null) throw new ArgumentNullException(nameof(cerca));
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            String txt = (cerca == null) ? "" : cerca.Text;
            Int32[] idTipus = (String.IsNullOrEmpty(cerca.Opcions)) ? Array.ConvertAll(cerca.Opcions.Split(";"), (id => Int32.Parse(id))) : null;

            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller casteller = await ObtenirCastellerSessio(principal);
            IList<EsdevenimentResumModel> lst = (await this._appinyaDbContext.ObtenirEsdevenimentActuals(casteller.IdCasteller, txt, _temporadaService.ObtenirTemporadaActual().Id, cerca.RegIni)).Select<fEsdeveniments_Result, EsdevenimentResumModel>(x => x).ToList();
            if (idTipus == null || idTipus.Length == 0)
                return lst;
            else
                return lst.Where(es => idTipus.Contains(es.TipusEsdeveniment)).ToList();
        }
        public async Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdeveniments(IPrincipal principal)
        {

            if (principal == null) throw new ArgumentNullException(nameof(principal));


            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller casteller = await ObtenirCastellerSessio(principal);
            IList<EsdevenimentResumModel> lst = (await this._appinyaDbContext.ObtenirEsdevenimentDetall(casteller.IdCasteller, _temporadaService.ObtenirTemporadaActual().Id, null)).Select<fEsdeveniments_Result, EsdevenimentResumModel>(x => x).ToList();

            return lst;

        }
        public async Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdevenimentsActuals(CercaModel cerca, IPrincipal principal)
        {

            if (principal == null) throw new ArgumentNullException(nameof(principal));
            Int32 regIni = 0;
            String txt = "";
            Int32[] idTipus = null;
            if (cerca != null)
            {
                regIni = cerca.RegIni;
                txt = cerca.Text;
                idTipus = (!String.IsNullOrEmpty(cerca.Opcions)) ? Array.ConvertAll(cerca.Opcions.Split(";"), (id => Int32.Parse(id))) : null;
            }

            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller casteller = await ObtenirCastellerSessio(principal);

            IList<EsdevenimentResumModel> lst = (await this._appinyaDbContext.ObtenirEsdevenimentActuals(casteller.IdCasteller, txt, _temporadaService.ObtenirTemporadaActual().Id, regIni)).Select<fEsdeveniments_Result, EsdevenimentResumModel>(x => x).ToList();
            if (idTipus == null || idTipus.Length == 0)
                return lst;
            else
                return lst.Where(es => idTipus.Contains(es.TipusEsdeveniment)).ToList();
        }

        public async Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdevenimentsHistoric(CercaModel cerca, IPrincipal principal)
        {
            if (cerca == null) throw new ArgumentNullException(nameof(cerca));
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            Int32[] idTipus = (String.IsNullOrEmpty(cerca.Opcions)) ? Array.ConvertAll(cerca.Opcions.Split(";"), (id => Int32.Parse(id))) : null;

            UsuariSessio user = await ObtenirUsuari(principal);
            Casteller casteller = await ObtenirCastellerSessio(principal);

            IList<EsdevenimentResumModel> lst = (await this._appinyaDbContext.ObtenirEsdevenimentHistoric(casteller.IdCasteller, cerca.Text, _temporadaService.ObtenirTemporadaActual().Id, cerca.RegIni)).Select<fEsdeveniments_Result, EsdevenimentResumModel>(x => x).ToList();
            if (idTipus == null || idTipus.Length == 0)
                return lst;
            else
                return lst.Where(es => idTipus.Contains(es.TipusEsdeveniment)).ToList();
        }

        public async Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdevenimentsActualitzacio(DateTime? data, IPrincipal principal)
        {
            return await ObtenirLlistaEsdevenimentsActualitzacio(data, _temporadaService.ObtenirTemporadaActual().Id, principal);
        }
        public async Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdeveniments(DateTime? data, IPrincipal principal)
        {
            return await ObtenirLlistaEsdevenimentsActualitzacio(data, _temporadaService.ObtenirTemporadaActual().Id, principal);
        }
        /// <summary>
        /// LLista d'esdeveniments 
        /// </summary>
        /// <param name="tipusExcloss"> Si es 0 son tots els tipus d'esdeveniments</param>
        /// <returns></returns>
        public async Task<IList<EsdevenimentResumModel>> ObtenirLlistaEsdevenimentsActualitzacio(DateTime? data, int idTemporada, IPrincipal principal)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            UsuariSessio user = await ObtenirUsuari(principal);


            DateTime dtFin = DateTime.Now;
            dtFin = dtFin.AddDays(45);  // Control temporal per usuaris anonims
            Boolean tipusMusics = SeguretatHelper.esRolMusic(principal) || SeguretatHelper.esRolCapMusic(principal);
            Boolean tipusAssaig = SeguretatHelper.esRolCasteller(principal);

            Casteller casteller = await ObtenirCastellerSessio(principal);

            int? idCasteller = null;
            if (casteller != null) idCasteller = casteller.IdCasteller;

            List<fEsdeveniments_Result> lstEst = await _appinyaDbContext.ObtenirEsdevenimentDetall(idCasteller, idTemporada, data);
            if (!tipusMusics) // no vol veure musics
                lstEst = (from est in lstEst
                          where (!data.HasValue || est.DATA_MODIFICACIO.CompareTo(data.Value) > 0) &&
                          est.ID_TIPUS != EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_MUSICS && (idCasteller != null || est.DATA_FI.CompareTo(dtFin) < 0)
                          orderby est.DATA_INICI
                          select est).ToList();

            else if (tipusMusics && !tipusAssaig)
            {
                lstEst = (from est in lstEst
                          where (!data.HasValue || est.DATA_MODIFICACIO.CompareTo(data.Value) > 0) &&
                          est.ID_TIPUS != EsdevenimentHelper.ID_TIPUS_ESDEVENIMENT_ENTRENAMENTS && (idCasteller != null || est.DATA_FI.CompareTo(dtFin) < 0)
                          orderby est.DATA_INICI
                          select est).ToList();
            }
            else
                lstEst = (from est in lstEst
                          where (!data.HasValue || est.DATA_MODIFICACIO.CompareTo(data.Value) > 0) &&
                          (idCasteller != null || est.DATA_FI.CompareTo(dtFin) < 0)
                          orderby est.DATA_INICI
                          select est).ToList();

            List<EsdevenimentResumModel> lst = lstEst.Select<fEsdeveniments_Result, EsdevenimentResumModel>(x => x).ToList();
            /*
             List<int> lstInt = lst.Select(it => it.Id).ToList(); 
             // Si es casteller pot veure l assistencia
                if (idCasteller != null)
             {
                 List<Assistencia> asslist = _appinyaDbContext.Assistencia.Where(assistencia => lstInt.Contains(assistencia.IdEsdeveniment) && assistencia.IndEsborrat == false).ToList();

                 for (int i = 0; i < lst.Count; i++)
                 {
                     int idEsdeveniment = lst[i].Id;
                     lst[i].CastellersAssitiran = asslist.Where(t=>t.Assistire==true).Select<Assistencia, AssistenciaModel>(t => t).ToList();// _appinyaDbContext.Assistencia.Where(assistencia => assistencia.IdEsdeveniment == idEsdeveniment && assistencia.IndEsborrat == false && assistencia.Assistire).ToList().Select<Assistencia, AssistenciaModel>(t => t).ToList();
                     lst[i].CastellersNoAssitiran = asslist.Where(t => t.Assistire == false).Select<Assistencia, AssistenciaModel>(t => t).ToList();// _appinyaDbContext.Assistencia.Where(assistencia => assistencia.IdEsdeveniment == idEsdeveniment && assistencia.IndEsborrat == false && assistencia.Assistire == false).ToList().Select<Assistencia, AssistenciaModel>(t => t).ToList();


                 }
             }
             */
            return lst;



        }

        /// <summary>
        /// Funció per esborrar un esdeveniment
        /// </summary>
        /// <param name="id">Identificador de l'esdevenimnet</param>
        /// <param name="principal"> l'usuari </param>
        public async Task<Resposta> Esborrar(int id, IPrincipal principal)
        {

            UsuariSessio user = await ObtenirUsuari(principal);
            Esdeveniment es = _appinyaDbContext.Esdeveniment.Where(it => it.IdEsdeveniment == id).FirstOrDefault();

            // Los organizadores solo pueden modificar sus eventos 
            if (!EsdevenimentHelper.PotEditarEsdeveniment(es, principal))
            {
                LogWarning("S'ha intentat esborrar un esdeveniment sense permisos id:" + id + " " + user.Email);
                throw new SeguretatException();
            }

            es.Activa = false;
            es.IndEsborrat = true;
            _appinyaDbContext.SaveChanges();
            _auditoriaService.RegistraAccio<Esdeveniment>(Accio.Esborrar, es.IdEsdeveniment, principal);
            return CrearRespotaOK();

        }
        public async Task<Resposta> Valorar(int idEsdevement, int valorar, IPrincipal principal)
        {
            Casteller casteller = await ObtenirCastellerSessio(principal);
            EsdevenimentValoracio esdevenimentValoracio = _appinyaDbContext.EsdevenimentValoracio.Where(it => it.IdEsdeveniment == idEsdevement && it.IdCasteller == casteller.IdCasteller).FirstOrDefault();
            if (esdevenimentValoracio == null)
            {
                esdevenimentValoracio = new EsdevenimentValoracio()
                {
                    IdCasteller = casteller.IdCasteller,
                    IdEsdeveniment = idEsdevement,
                    DataAlta = DateTime.Now,
                    Valoracio = valorar
                };
                _appinyaDbContext.EsdevenimentValoracio.Add(esdevenimentValoracio);
                _appinyaDbContext.SaveChanges();
            }
            else
            {
                esdevenimentValoracio.Valoracio = valorar;
                _appinyaDbContext.SaveChanges();
            }
            return CrearRespotaOK();

        }
        /// <summary>
        /// Funcio per debloquejar l'assistencia d'un esdeveniment
        /// </summary>
        /// <param name="id"> Identificador de l'esdeveniment</param>
        /// <param name="principal">Rol de l'usuari </param>
        public async Task<Resposta> DesBloquejar(int id, IPrincipal principal)
        {

            UsuariSessio user = await ObtenirUsuari(principal);
            Esdeveniment es = _appinyaDbContext.Esdeveniment.Where(it => it.IdEsdeveniment == id).FirstOrDefault();

            // Los organizadores solo pueden modificar sus eventos 
            if (!EsdevenimentHelper.PotEditarEsdeveniment(es, principal))
            {
                LogWarning("S'ha intentat desbloquejar un esdeveniment sense permisos id:" + id + " " + user.Email);
                throw new SeguretatException();
            }
            es.BloqueixAssistencia = false;
            _appinyaDbContext.SaveChanges();
            _auditoriaService.RegistraAccio<Esdeveniment>(Accio.Modificar, es.IdEsdeveniment, principal);
            return CrearRespotaOK();

        }
        public async Task<RespostaAmbRetorn<EsdevenimentCastellModel>> ModificarCastell(EsdevenimentCastellModel castell, IPrincipal principal)
        {
            UsuariSessio user = await ObtenirUsuari(principal);
            EsdevenimentCastells castelldb = (castell.Id == 0) ? null : _appinyaDbContext.EsdevenimentCastells.Where(it => it.Id == castell.Id).FirstOrDefault();
            if (castelldb == null)
            {
                castelldb = new EsdevenimentCastells()
                {
                    IdCastell = Int32.Parse(castell.IdTipusCastell),
                    IdEsdeveniment = Int32.Parse(castell.IdEsdeveniment),
                    Observacions = castell.Observacions,
                    IdEstatCastell = Int32.Parse(castell.IdEstatCastell),
                    Xarxa = castell.Xarxa,
                    Ordre = castell.Ordre,
                    DataAlta = DateTime.Now,
                    DataMod = DateTime.Now,

                };
                List<EsdevenimentCastells> castellreord = _appinyaDbContext.EsdevenimentCastells.Where(it => it.Ordre >= castell.Ordre).ToList();
                foreach (EsdevenimentCastells cas in castellreord)
                {
                    cas.Ordre += 1;
                }
                _appinyaDbContext.EsdevenimentCastells.Add(castelldb);
                _appinyaDbContext.SaveChanges();
                _auditoriaService.RegistraAccio<Esdeveniment>(Accio.Modificar, castelldb.IdEsdeveniment, $"Creacio Castell {castelldb.IdCastell}", principal);
            }
            return CrearRespotaAmbRetornOK<EsdevenimentCastellModel>(castelldb);

        }

        /// <summary>
        /// Eliminar un castell d'un esdeveniment
        /// </summary>
        /// <param name="idEsdeveniment"></param>
        /// <param name="idCastell"></param>
        /// <param name="principal"></param>
        /// <returns></returns>
        public async Task<Resposta> EsborrarCastell(int id, IPrincipal principal)
        {
            UsuariSessio user = await ObtenirUsuari(principal);
            EsdevenimentCastells castelldb = _appinyaDbContext.EsdevenimentCastells.Where(it => it.Id == id).FirstOrDefault();
            if (castelldb != null)
            {
                _appinyaDbContext.EsdevenimentCastells.Remove(castelldb);
                _appinyaDbContext.SaveChanges();
                _auditoriaService.RegistraAccio<Esdeveniment>(Accio.Modificar, castelldb.IdEsdeveniment, $"Creacio Castell {castelldb.IdCastell}", principal);
            }
            return CrearRespotaOK();
        }
        /// <summary>
        /// Canviar l'estat del castell (Carregat,descarregat ....)
        /// </summary>
        /// <param name="idEsdeveniment"></param>
        /// <param name="idCastell"></param>
        /// <param name="idEstatCastell"></param>
        /// <param name="principal"></param>
        /// <returns></returns>
        public async Task<Resposta> EstatCastell(int idEsdeveniment, int idCastell, int idEstatCastell, IPrincipal principal)
        {
            UsuariSessio user = await ObtenirUsuari(principal);
            EsdevenimentCastells castell = _appinyaDbContext.EsdevenimentCastells.Where(it => it.IdEsdeveniment == idEsdeveniment && it.IdCastell == idCastell).FirstOrDefault();
            if (castell != null)
            {
                castell.IdEstatCastell = idEstatCastell;
                _appinyaDbContext.SaveChanges();
                _auditoriaService.RegistraAccio<Esdeveniment>(Accio.Modificar, idEsdeveniment, $"Estat Castell {idCastell} a {idEstatCastell}", principal);
            }
            return CrearRespotaOK();
        }

        /// <summary>
        /// Funcio per bloqueixar l'assitencia d'un esdeveniment
        /// </summary>
        /// <param name="id"> Identificador de l'esdeveniment</param>
        /// <param name="principal">Rol de l'usuari </param>
        public async Task<Resposta> Bloquejar(int id, IPrincipal principal)
        {

            UsuariSessio user = await ObtenirUsuari(principal);
            Esdeveniment es = _appinyaDbContext.Esdeveniment.Where(it => it.IdEsdeveniment == id).FirstOrDefault();

            // Los organizadores solo pueden modificar sus eventos 
            if (!EsdevenimentHelper.PotEditarEsdeveniment(es, principal))
            {
                LogWarning("S'ha intentat bloquejar un esdeveniment sense permisos id:" + id + " " + user.Email);
                throw new SeguretatException();
            }
            es.BloqueixAssistencia = true;
            _appinyaDbContext.SaveChanges();
            _auditoriaService.RegistraAccio<Esdeveniment>(Accio.Modificar, es.IdEsdeveniment, principal);
            return CrearRespotaOK();
        }


        /// <summary>
        ///  Esborrar un esdeveniment (encara visible per l'usuari) 
        /// </summary>
        /// <param name="id"> Identificador de l'esdeveniment</param>
        /// <param name="principal">Rol de l'usuari </param>
        public async Task<Resposta> Anular(int id, IPrincipal principal)
        {

            Esdeveniment es = _appinyaDbContext.Esdeveniment.Where(it => it.IdEsdeveniment == id).FirstOrDefault();
            UsuariSessio user = await ObtenirUsuari(principal);
            // Los organizadores solo pueden modificar sus eventos 
            if (!EsdevenimentHelper.PotEditarEsdeveniment(es, principal))
            {
                LogWarning("S'ha intentat anular un esdeveniment sense permisos id:" + id + " " + user.Email);
                throw new SeguretatException();
            }
            es.Anulat = true;
            _appinyaDbContext.SaveChanges();
            _auditoriaService.RegistraAccio<Esdeveniment>(Accio.Desactivar, es.IdEsdeveniment, principal);
            return CrearRespotaOK();

        }
        /// <summary>
        /// Funcio per activa un esdeveniment esborrat (anulat) 
        /// </summary>
        /// <param name="id"> Identificador de l'esdeveniment</param>
        /// <param name="principal">Rol de l'usuari </param>
        public async Task<Resposta> Activar(int id, IPrincipal principal)
        {


            Esdeveniment es = _appinyaDbContext.Esdeveniment.Where(it => it.IdEsdeveniment == id).FirstOrDefault();
            UsuariSessio user = await ObtenirUsuari(principal);
            // Los organizadores solo pueden modificar sus eventos 
            if (!EsdevenimentHelper.PotEditarEsdeveniment(es, principal))
            {
                LogWarning("S'ha intentat activar un esdeveniment sense permisos id:" + id + " " + user.Email);
                throw new SeguretatException();
            }
            es.Anulat = false;
            _appinyaDbContext.SaveChanges();
            _auditoriaService.RegistraAccio<Esdeveniment>(Accio.Activar, es.IdEsdeveniment, principal);
            return CrearRespotaOK();

        }
        /// <summary>
        /// Modificar o Crear un esdevemieniment
        /// </summary>
        /// <param name="esdeveniment">Esdeveniment a crear o modificar</param> 
        /// <param name="principal"> Credencials d'usuari</param>
        /// <returns></returns>
        public async Task<RespostaAmbRetorn<EsdevenimentModel>> Desar(EsdevenimentModel esdeveniment, IPrincipal principal)
        {
            using (Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction transaction = _appinyaDbContext.Database.BeginTransaction())
            {
                if (esdeveniment == null) throw new ArgumentNullException(nameof(esdeveniment));
                String error = "";
                UsuariSessio user = await ObtenirUsuari(principal);
                Casteller cas = await ObtenirCastellerSessio(principal);
                if (cas == null)
                {
                    error = _localizer["usuarinotecasteller"];
                    LogWarning(error, esdeveniment.Id);
                    return CrearRespotaAmbRetornError<EsdevenimentModel>(error, null, esdeveniment.Id);
                }

                if (esdeveniment.DataIni.CompareTo(esdeveniment.DataFi) > 0)
                {
                    error = _localizer["errorDates"];
                    LogWarning(error, esdeveniment.DataIni, esdeveniment.DataFi);
                    return CrearRespotaAmbRetornError<EsdevenimentModel>(error, null, esdeveniment.DataFi, esdeveniment.DataFi);
                }
                // Els organitzador només poden modificar els esdeveniments de taller i social , 1º vegada per veure si l'evento és del tipus correcte 
                if (!EsdevenimentHelper.PotEditarEsdeveniment(esdeveniment, principal)
                    )
                {
                    error = _localizer["noTensPermisosEdicio"];
                    LogWarning(error, esdeveniment.Id);
                    return CrearRespotaAmbRetornError<EsdevenimentModel>(error, null, esdeveniment.Id);
                }



                Esdeveniment es = null;
                if (esdeveniment.Id == 0)
                {

                    es = new Esdeveniment()
                    {
                        DataCreacio = DateTime.Now,
                        IdUsuariCreador = cas.IdCasteller,
                        Activa = true,
                        Anulat = false,
                        BloqueixAssistencia = false,
                        Emergent = false
                    };

                }
                else
                    es = _appinyaDbContext.Esdeveniment.Where(it => it.IdEsdeveniment == esdeveniment.Id).FirstOrDefault();

                if (es == null)
                {
                    error = _localizer["noExisteixEsdeveniment"];
                    LogWarning(error, esdeveniment.Id);
                    return CrearRespotaAmbRetornError<EsdevenimentModel>(error, null, esdeveniment.Id);
                };
                if (es.Anulat || !es.Activa)
                {
                    error = _localizer["anulatEsdeveniment"];
                    LogWarning(error, esdeveniment.Id);
                    return CrearRespotaAmbRetornError<EsdevenimentModel>(error, null, esdeveniment.Id);
                }


                es.IdTemporada = _temporadaService.ObtenirTemporadaPerData(esdeveniment.DataIni).Id;
                es.DataInici = esdeveniment.DataIni;
                es.DataFi = esdeveniment.DataFi;
                es.IdTipus = esdeveniment.TipusEsdeveniment;
                es.Titol = esdeveniment.Titol;
                es.Text = esdeveniment.Descripcio;
                es.OfreixTransport = esdeveniment.OfereixTransport;

                if (esdeveniment.OfereixTransport)
                {
                    if (!esdeveniment.TransportAnada && !esdeveniment.TransportTornada)
                    {
                        error = _localizer["obligatoriTransportAnadaTornada"];
                        LogWarning(error);
                        return CrearRespotaAmbRetornError<EsdevenimentModel>(error);
                    }

                    es.TransportAnada = esdeveniment.TransportAnada;
                    es.TransportTornada = esdeveniment.TransportTornada;
                }
                else
                {
                    es.TransportAnada = null;
                    es.TransportTornada = null;
                }

                es.Latitud = esdeveniment.Latitud;
                es.Longitud = esdeveniment.Longitud;
                es.DataModificacio = DateTime.Now;
                es.IdUsuariModifi = cas.IdCasteller;
                es.Direccio = esdeveniment.Direccio;

                if (esdeveniment.Id == 0)
                {
                    _appinyaDbContext.Esdeveniment.Add(es);
                    _appinyaDbContext.SaveChanges();
                }

                if (esdeveniment.Preguntes != null)
                {
                    foreach (PreguntaModel pregunta in esdeveniment.Preguntes)
                    {
                        var p = (es.EsdevenimentPregunta != null && pregunta.IdPregunta != 0) ? es.EsdevenimentPregunta.Where(p => p.Id == pregunta.IdPregunta).FirstOrDefault() : null;
                        if (p == null)
                        {
                            p = new EsdevenimentPregunta()
                            {
                                IdEsdeveniment = es.IdEsdeveniment,
                                Pregunta = pregunta.Pregunta,
                                TipusPregunta = pregunta.TipusPregunta,
                                Valors = String.Join(";", pregunta.Valores),
                                DataAlta = DateTime.Now
                            };
                            _appinyaDbContext.EsdevenimentPregunta.Add(p);

                        }
                        else
                        {
                            p.Pregunta = pregunta.Pregunta;
                            p.TipusPregunta = pregunta.TipusPregunta;
                            p.Valors = String.Join(";", pregunta.Valores);
                        }
                    }
                }
                if (es.EsdevenimentPregunta != null)
                {
                    // Eliminamos las que no hay
                    foreach (EsdevenimentPregunta pregunta in es.EsdevenimentPregunta)
                    {
                        var p = esdeveniment.Preguntes.Where(p => p.IdPregunta == pregunta.Id).FirstOrDefault();
                        if (p == null)
                        {
                            _appinyaDbContext.EsdevenimentPregunta.Remove(pregunta);
                        }
                    }
                }
                // Els organitzador només poden modificar els esdeveniments de taller i social , 2º vegada per ver si ha canviat el tipus d'event a un tipus incorrecte 
                if (!EsdevenimentHelper.PotEditarEsdeveniment(es, principal))
                {
                    error = _localizer["noTensPermisosEdicio"];
                    LogWarning(error, esdeveniment.Id);
                    return CrearRespotaAmbRetornError<EsdevenimentModel>(error, null, esdeveniment.Id);
                }

                _appinyaDbContext.SaveChanges();
                EsdevenimentHelper.CrearRegistreCreacio(es.IdEsdeveniment, cas.IdCasteller);
                _auditoriaService.RegistraAccio<Esdeveniment>(esdeveniment.Id == 0 ? Accio.Agregar : Accio.Modificar, es.IdEsdeveniment, principal);
                transaction.Commit();
                return CrearRespotaAmbRetornOK<EsdevenimentModel>(await ObtenirDetall(es.IdEsdeveniment, principal));
            }
        }

    }
}
