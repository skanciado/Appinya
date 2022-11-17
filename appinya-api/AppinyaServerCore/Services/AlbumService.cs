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
using AppinyaServerCore.Api.Entities;
using AppinyaLib.Api.Entities;
using AppinyaServerCore.Utils;
using AppinyaServerCore.Database.Appinya;

namespace AppinyaServerCore.Services
{
    public interface IAlbumService

    {
        /// <summary>
        /// Obtenir album per Id
        /// </summary>
        /// <param name="idAlbum"></param>
        /// <returns></returns>
        public AlbumModel ObtenirAlbum(int idAlbum);
        /// <summary>
        /// Obtenir album amb una marca temporal
        /// </summary>
        /// <param name="data">Marca temporal</param>
        /// <param name="idTemporada"></param>
        /// <param name="usuari"></param>
        /// <returns></returns>
        public Task<IList<AlbumModel>> ObtenirAlbum(DateTime? data, int idTemporada, IPrincipal usuari);

        Task<(string album, DateTime dataModificacio)> ObtenirFoto(int idAlbum);

        /// <summary>
        /// Obtenir les fotos d'una temporada
        /// </summary>
        /// <param name="idTemporada">Id Temporada</param>
        /// <param name="usuari">Usuari que realitza la peticio </param>
        /// <returns></returns>
        public Task<List<AlbumModel>> ObtenirAlbumTemporada(int idTemporada, IPrincipal usuari);
        /// <summary>
        /// Editar l'album
        /// </summary>
        /// <param name="notiparam">Objecte modificat</param>
        /// <param name="principal">id Usuari </param>
        /// <returns></returns>
        public Task<RespostaAmbRetorn<AlbumModel>> EditarAlbum(AlbumModel album, IPrincipal principal);

        /// <summary>
        /// Esborrar la foto
        /// </summary>
        /// <param name="id">Identificador de la foto </param>
        /// <param name="principal"></param>
        public Resposta EsborrarAlbum(int id, IPrincipal principal);
        /// <summary>
        /// Ofereix els likes que ha realitzat el casteller
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public Task<IList<LikeModel>> ObtenirLikes(int idTemporada, IPrincipal principal);
        /// <summary>
        /// Agregar likes a les fotos
        /// </summary>
        /// <param name="idFoto"></param>
        /// <param name="principal"></param>
        /// <returns></returns> 
        public Task<RespostaAmbRetorn<int>> SumarUnLike(int idFoto, IPrincipal principal);

        /// <summary>
        /// Eliminar el Like d una foto
        /// </summary>
        /// <param name="idFoto"></param>
        /// <param name="principal"></param>
        /// <returns></returns>
        public Task<RespostaAmbRetorn<int>> RestarUnLike(int idFoto, IPrincipal principal);

    }
    public class AlbumService : AppinyaBaseService<AlbumService>, IAlbumService
    {


        private readonly AppinyaDbContext _appinyaDbContext;
        private readonly ITemporadaService _temporadaService;
        private readonly AppSettings _appSettings;
        private readonly IEmailService _emailService; 
        private readonly IAuditoriaService _auditoriaService;
        public AlbumService(
            AppinyaDbContext appinyaDbContext,
            ITemporadaService temporadaService, 
            IEmailService emailService,
            IUsuariService usuariService,
            IOptions<AppSettings> appSettings,
            ILogger<AlbumService> logger,
           IAuditoriaService auditoriaService,
            IStringLocalizer<AlbumService> localizer
            ) : base(usuariService, localizer, logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));

            _temporadaService = temporadaService;
            _appinyaDbContext = appinyaDbContext;
            _emailService = emailService;
            _appSettings = appSettings.Value;
            _auditoriaService = auditoriaService;
        }

        private double MAX_TAMANY_FOTO = 150000.0;

        /// <summary>
        /// Obtenir album per Id
        /// </summary>
        /// <param name="idAlbum"></param>
        /// <returns></returns>
        public AlbumModel ObtenirAlbum(int idAlbum)
        {
            return (from not in _appinyaDbContext.Fotos.Include(i => i.IdFotografNavigation)
                    where not.IdFotos == idAlbum
                    orderby not.Data descending
                    select not).FirstOrDefault();
        }

        public async Task<(string album, DateTime dataModificacio)> ObtenirFoto(int idAlbum)
        {
            var fot = await (from f in _appinyaDbContext.Fotos
                             where f.IdFotos == idAlbum
                             select new
                             {
                                 f.Album,
                                 f.DataModificacio
                             }).SingleOrDefaultAsync();

            return fot != null ? (fot.Album, fot.DataModificacio) : default;
        }

        /// <summary>
        /// Obtenir les fotos amb una marca de temps 
        /// </summary>
        /// <param name="data">Marca de temps</param>
        /// <param name="usuari">Usuari que realitza la peticio </param>
        /// <returns></returns>
        public async Task<IList<AlbumModel>> ObtenirAlbum(DateTime? data, int idTemporada, IPrincipal usuari)
        {
            DateTime dt = DateTime.Now;
            dt = dt.AddDays(-1); 
            Casteller casteller = await ObtenirCastellerSessio(usuari);

            Boolean isCasteller = (casteller != null);

            List<Fotos> lst = null;
            if (data == null || !data.HasValue)
            {
                lst = (from fotos in _appinyaDbContext.Fotos.Include(i => i.IdFotografNavigation)
                       where fotos.Activa == true && fotos.IdTemporada == idTemporada
                       orderby fotos.Data descending
                       select fotos).ToList();
            }
            else
            {
                lst = (from fotos in _appinyaDbContext.Fotos.Include(i => i.IdFotografNavigation)
                       where fotos.DataModificacio.CompareTo(data.Value) > 0 && fotos.IdTemporada == idTemporada
                       orderby fotos.Data descending
                       select fotos).ToList();
            }
            List<fFotoLikes_Result> likes = null;
            if (casteller == null)
                likes = await _appinyaDbContext.ObtenirFotosLike(0, idTemporada);
            else
                likes = await _appinyaDbContext.ObtenirFotosLike(casteller.IdCasteller, idTemporada);
            List<AlbumModel> lstFotos = lst.Select<Fotos, AlbumModel>(t => t).ToList();
            likes.ForEach(like =>
            {
                foreach (AlbumModel foto in lstFotos)
                {
                  
                    if (foto.Id == like.IdFotos.ToString())
                    {
                        foto.JoLike = (like.Jo == true);
                        foto.Likes = like.Contador;
                        foto.Castellers = like.Castellers != null ? like.Castellers.Split(",").Select<String, int>(t => Int32.Parse(t)).ToList() : null;
                        break;
                    }
                }
            });
            return lstFotos;



        }
        /// <summary>
        /// Obtenir les fotos d'una temporada
        /// </summary>
        /// <param name="idTemporada">Id Temporada</param>
        /// <param name="usuari">Usuari que realitza la peticio </param>
        /// <returns></returns>
        public async Task<List<AlbumModel>> ObtenirAlbumTemporada(int idTemporada, IPrincipal usuari)
        {
            Casteller casteller = await ObtenirCastellerSessio(usuari);

            Boolean isCasteller = (casteller != null);

            List<Fotos> lst = null;
            lst = (from not in _appinyaDbContext.Fotos.Include(i => i.IdFotografNavigation)
                   where not.Activa == true && not.IdTemporada == idTemporada
                   orderby not.Data descending
                   select not).ToList();

            List<fFotoLikes_Result> likes = null;
            if (casteller == null)
                likes = await _appinyaDbContext.ObtenirFotosLike(0, idTemporada);
            else
                likes = await _appinyaDbContext.ObtenirFotosLike(casteller.IdCasteller, idTemporada);

            List<AlbumModel> lstFotos = lst.Select<Fotos, AlbumModel>(t => t).ToList();
            likes.ForEach(like =>
            {
                foreach (AlbumModel foto in lstFotos)
                {
                    if (foto.Id == like.IdFotos.ToString())
                    {
                        foto.JoLike = (like.Jo == true);
                        foto.Likes = like.Contador;
                        foto.Castellers = like.Castellers != null ? like.Castellers.Split(",").Select<String, int>(t => Int32.Parse(t)).ToList() : null;
                        break;
                    }
                }
            });
            return lstFotos;
        }
        /// <summary>
        /// Editar l'album
        /// </summary>
        /// <param name="notiparam">Objecte modificat</param>
        /// <param name="principal">id Usuari </param>
        /// <returns></returns>
        public async Task<RespostaAmbRetorn<AlbumModel>> EditarAlbum(AlbumModel album, IPrincipal principal)
        {
            Boolean enviarCorreu = false;
            String error = null;
            if (album == null) throw new ArgumentNullException(nameof(album));

            if (album.Album == null || album.Album.Length == 0)
            {
                error = _localizer["notetitol"];
                LogWarning($"Id: {album.Id} - {error} ");
                return CrearRespotaAmbRetornError<AlbumModel>(error);
            }
            /*if (album.Descripcio == null || album.Descripcio.Length == 0)
            {
                error = _localizer["notedescripcio"];
                LogWarning($"Id: {album.Id} - {error} ");
                return CrearRespotaAmbRetornError<AlbumModel>(error);
            }*/
            if (album.Fotograf == null)
            {
                error = _localizer["notefotograf"];
                LogWarning($"Id: {album.Id} - {error} ");
                return CrearRespotaAmbRetornError<AlbumModel>(error);
            }
            if (album.Portada == null)
            {
                error = _localizer["noteportada"];
                LogWarning($"Id: {album.Id} - {error} ");
                return CrearRespotaAmbRetornError<AlbumModel>(error);
            }
            if (album.Url == null)
            {
                error = _localizer["noteurl"];
                LogWarning($"Id: {album.Id} - {error} ");
                return CrearRespotaAmbRetornError<AlbumModel>(error);
            }
            Casteller creador = await ObtenirCastellerSessio(principal);

            if (creador == null)
            {
                error = _localizer["notecreador"];
                LogWarning($"Id: {album.Id} - {error} ");
                return CrearRespotaAmbRetornError<AlbumModel>(error);
            }
            if (!PotEditarAlbum(album, principal))
            {
                error = _localizer["notepermisos"];
                LogWarning($"Id: {album.Id} - {error} ");
                return CrearRespotaAmbRetornError<AlbumModel>(error);

            }
            Fotos fot = null;
            if (String.IsNullOrEmpty(album.Id) ||  album.Id == "0")
            {
                fot = new Fotos();
                fot.IdUsuariCreador = creador.IdCasteller;
                fot.DataCreacio = DateTime.Now;
                fot.DataModificacio = DateTime.Now;
                fot.IdUsuariModifica = creador.IdCasteller;
                fot.Activa = true;
                fot.IdTemporada = _temporadaService.ObtenirTemporadaActual().Id;
            }
            else
            {
                int idAlbum = Int32.Parse(album.Id);
                fot = (from n in _appinyaDbContext.Fotos.Include(i => i.IdFotografNavigation)
                       where n.IdFotos == idAlbum
                       select n).FirstOrDefault();
            }

            if (fot == null)
            {
                error = _localizer["nottrobatfoto"];
                LogWarning($"Id: {album.Id} - {error} ");
                return CrearRespotaAmbRetornError<AlbumModel>(error);
            }
            else if (fot.Activa == false)
            {
                error = _localizer["albumnoactiu"];
                LogWarning($"Id: {album.Id} - {error} ");
                return CrearRespotaAmbRetornError<AlbumModel>(error);
            }


            if (fot.Url != album.Url) enviarCorreu = true;
            fot.DataModificacio = DateTime.Now;
            fot.IdUsuariModifica = creador.IdCasteller;
            fot.Album = album.Album;
            fot.Descripcio = album.Descripcio;
            fot.Data = album.Data;
            fot.IdFotograf = (album.Fotograf == null) ? (int?)null : album.Fotograf.Id;
            fot.Url = album.Url;

            if (!PotEditarAlbum(fot, principal))
            {
                error = _localizer["notepermisos"];
                LogWarning($"Id: {album.Id} - {error} ");
                return CrearRespotaAmbRetornError<AlbumModel>(error);

            }
            if (String.IsNullOrEmpty(album.Id) || album.Id == "0"  )
            {
                _appinyaDbContext.Fotos.Add(fot);
                enviarCorreu = true;
                _appinyaDbContext.SaveChanges();
                _auditoriaService.RegistraAccio<AlbumModel>(Accio.Agregar, fot.IdFotos, principal);
            }else
            {
                _auditoriaService.RegistraAccio<AlbumModel>(Accio.Modificar, fot.IdFotos, principal);
            }

            if (album.Portada != null)
            {
                try
                {
                    fot.Portada = "data:image/jpeg;base64," + ImageUtils.ReduirImatgeBase64(album.Portada, 600, 450, MAX_TAMANY_FOTO);

                    FotosImatge img = _appinyaDbContext.FotosImatge.Where(it => it.IdFotos == fot.IdFotos).FirstOrDefault();

                    // Guardar imatge original de 600x600 de resolució en la DB
                    if (img == null)
                    {
                        img = new FotosImatge()
                        {
                            IdFotos = fot.IdFotos,
                            Portada = ImageUtils.CrearImatgeBinary( album.Portada, 1200, 1200)
                        };
                        _appinyaDbContext.FotosImatge.Add(img);
                    }
                    else
                    {
                        img.Portada = ImageUtils.CrearImatgeBinary(album.Portada, 1200, 1200);
                    }

                    LogInfo("Actualitza foto  " + fot.IdFotos ?? "nova " + " size:" + fot.Portada.Length);
                }
                catch (Exception e)
                {

                    error = _localizer["fotomassagran"];
                    LogWarning($"Id: {album.Id} - {e.Message} ");
                    _appinyaDbContext.Fotos.Remove(fot);
                    _appinyaDbContext.SaveChanges();
                    return CrearRespotaAmbRetornError<AlbumModel>(error);
                }

            }
            else
            {
                FotosImatge img = _appinyaDbContext.FotosImatge.Where(it => it.IdFotos == fot.IdFotos).FirstOrDefault();
                fot.Portada = null;
                if (img != null)
                {
                    _appinyaDbContext.FotosImatge.Remove(img);
                }
            } 
            _appinyaDbContext.SaveChanges();
            if (enviarCorreu)
            {
                EnviarCorreuFotos(fot);
            }
            return CrearRespotaAmbRetornOK<AlbumModel>(ObtenirAlbum(fot.IdFotos));

        }

        /// <summary>
        ///  Validació de l'edicio del objecte foto
        /// </summary>
        /// <param name="fot">Objecte foto a modificar</param>
        /// <param name="principal"></param>
        /// <returns></returns>

        private bool PotEditarAlbum(AlbumModel fot, IPrincipal principal)
        {
            bool valid = false;
            if (SeguretatHelper.esRolJunta(principal) || SeguretatHelper.esRolAdmin(principal) || SeguretatHelper.esRolNoticier(principal) || SeguretatHelper.esRolSecretari(principal))
                valid = true;

            return valid;


        }

        /// <summary>
        /// Esborrar la foto
        /// </summary>
        /// <param name="id">Identificador de la foto </param>
        /// <param name="principal"></param>
        public Resposta EsborrarAlbum(int id, IPrincipal principal)
        {

            Fotos not = (from n in _appinyaDbContext.Fotos.Include(f => f.IdFotografNavigation)
                         where n.Activa == true && n.IdFotos == id
                         select n).FirstOrDefault();

            if (!PotEditarAlbum(not, principal))
            {
                LogWarning("Id:  " + not.IdFotos ?? 0 + _localizer["notepermisos"]);
                return CrearRespotaError(_localizer["notepermisos"]);

            }
            not.Activa = false;
            _appinyaDbContext.SaveChanges();
            _auditoriaService.RegistraAccio<AlbumModel>(Accio.Esborrar, not.IdFotos, principal);
            return CrearRespotaOK();


        }
        /// <summary>
        /// Ofereix els likes que ha realitzat el casteller
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public async Task<IList<LikeModel>> ObtenirLikes(int idTemporada, IPrincipal principal)
        {
            Casteller casteller = await ObtenirCastellerSessio(principal);

            int? idCasteller = (casteller == null) ? 0 : casteller.IdCasteller;
            List<fFotoLikes_Result> likes = await _appinyaDbContext.ObtenirFotosLike(idCasteller, idTemporada);
            return likes.Select(t => new LikeModel() { IdAlbum = ""+t.IdFotos, Likes = t.Contador, JoLike = (t.Jo == true) }).ToList();

        }
        /// <summary>
        /// Agregar likes a les fotos
        /// </summary>
        /// <param name="idFoto"></param>
        /// <param name="principal"></param>
        /// <returns></returns> 
        public async Task<RespostaAmbRetorn<int>> SumarUnLike(int idFoto, IPrincipal principal)
        {

            Casteller creador = await ObtenirCastellerSessio(principal);
            if (creador == null)
            {
                return CrearRespotaAmbRetornError<int>(_localizer["notepermisos"], 0);
            }



            FotosLike fotlike = (from n in _appinyaDbContext.FotosLike
                                 where n.IdFotos == idFoto && n.IdCasteller == creador.IdCasteller
                                 select n).FirstOrDefault();

            if (fotlike == null)
            {
                fotlike = new FotosLike()
                {
                    IdCasteller = creador.IdCasteller,
                    DataModificacio = DateTime.Now,
                    IdFotos = idFoto,
                    Like = true
                };
                _appinyaDbContext.FotosLike.Add(fotlike);
                _appinyaDbContext.SaveChanges();
            }
            else
            {
                fotlike.Like = true;
                fotlike.DataModificacio = DateTime.Now;
                _appinyaDbContext.SaveChanges();
            }

            return new RespostaAmbRetorn<int>()
            {
                Correcte = true,
                Missatge = "+1",
                Retorn = (from n in _appinyaDbContext.FotosLike
                          where n.IdFotos == idFoto && n.Like == true
                          select n).Count()
            };

        }
        /// <summary>
        /// Enviar correos per modificacions o insercions de fotos en la app
        /// </summary>
        /// <param name="fot"></param>
        /// <param name="db"></param>
        private Resposta EnviarCorreuFotos(Fotos fot)
        {
            try
            {
                List<String> emails = _appinyaDbContext.Casteller.Where(cas => cas.Rebremailnot == true).Select(cas => cas.Email).ToList();

                if (emails.Count == 0) return CrearRespotaOK();
                _appinyaDbContext.Entry(fot).Reference(t => t.IdFotografNavigation).Load(); 
                Dictionary<String, String> parames = new Dictionary<String, String>();
                parames.Add("titol", fot.Album);
                parames.Add("album", fot.Album);
                parames.Add("descripcio", fot.Descripcio);
                parames.Add("autor",   fot.IdFotografNavigation.Alias);
                parames.Add("fotoCasteller", _appSettings.UrlRetrats + $"{fot.IdFotografNavigation.IdCasteller}.jpg");
                parames.Add("portada", _appSettings.UrlAlbums + $"{fot.IdFotos}.jpg");
                parames.Add("url", fot.Url);
                LogInfo("Enviar correus de Fotos a :" + String.Join(",", emails));
                _emailService.EnviarEmailNotificacioAlbums(String.Join(",", emails), parames);
                return CrearRespotaOK();
            }
            catch (Exception e)
            {
                LogError(e);
                return CrearRespotaError(e.Message);

            }
        }


        /// <summary>
        /// Eliminar el Like d una foto
        /// </summary>
        /// <param name="idFoto"></param>
        /// <param name="principal"></param>
        /// <returns></returns>
        public async Task<RespostaAmbRetorn<int>> RestarUnLike(int idFoto, IPrincipal principal)
        {
            Casteller creador = await ObtenirCastellerSessio(principal);
            if (creador == null)
            {
                return CrearRespotaAmbRetornError<int>(_localizer["notepermisos"], 0);
            }
            FotosLike fotlike = (from n in _appinyaDbContext.FotosLike
                                 where n.IdFotos == idFoto && n.IdCasteller == creador.IdCasteller
                                 select n).FirstOrDefault();

            if (fotlike == null)
            {
                fotlike = new FotosLike()
                {
                    IdCasteller = creador.IdCasteller,
                    DataModificacio = DateTime.Now,
                    IdFotos = idFoto,
                    Like = false
                };
                _appinyaDbContext.FotosLike.Add(fotlike);
                _appinyaDbContext.SaveChanges();
            }
            else
            {
                fotlike.Like = false;
                fotlike.DataModificacio = DateTime.Now;
                _appinyaDbContext.SaveChanges();
            }

            return new RespostaAmbRetorn<int>()
            {
                Correcte = true,
                Missatge = "-1",
                Retorn = (from n in _appinyaDbContext.FotosLike
                          where n.IdFotos == idFoto && n.Like == true
                          select n).Count()
            };


        }

    }
}
