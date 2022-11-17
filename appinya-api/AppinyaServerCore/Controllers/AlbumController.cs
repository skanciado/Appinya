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
using Microsoft.AspNetCore.Authorization; 

using System.Threading.Tasks; 
using AppinyaServerCore.Models; 
using Microsoft.Extensions.Logging; 
using System;
using System.Collections.Generic;  
using AppinyaServerCore.Helpers; 
using AppinyaServerCore.Services;
using Microsoft.Extensions.Localization;  
using AppinyaServerCore.Api.Entities;
using AppinyaLib.Api.Entities;

namespace AppinyaServerCore.Controllers
{
    [ApiVersion("1.0")]
    /// <summary>
    /// Publicacions Controller
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    public class AlbumController : BaseController<AlbumController>
    {
        #region Variables privades 
        private readonly IAlbumService _albumService;

        public AlbumController(
         ILogger<AlbumController> logger,
         IAlbumService albumService,
         IStringLocalizer<AlbumController> localizer
         ) : base(localizer, logger)
        {
            _albumService = albumService;
        }
        #endregion
        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [HttpGet]
        [Route("{id}")]
        public AlbumModel ObtenirNoticiaPerId(int id)
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return _albumService.ObtenirAlbum(id);

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
        [AllowAnonymous]
        [HttpGet]
        [Route("fotos/{idAlbum}")]
        public async Task<IActionResult> ObtenirAlbum(int idAlbum)
        {
            var (album, dataModificacio) = await _albumService.ObtenirFoto(idAlbum);

            if (album == null)
            {
                return NotFound();
            }

            var bytes = Utils.WebApiUtils.ParseDataUri(album, out var contentType);

            return FileOrNotModified(bytes, contentType, dataModificacio);
        }

        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [HttpGet]
        [Route("cercar/{idTemporada}")]
        public async Task<IList<AlbumModel>> ObtenirAlbumsTemporada(int idTemporada)
        {
            try
            {
                LogEntra(idTemporada);
                String usuari = ObtenirUsuari();
                return await _albumService.ObtenirAlbum(null, idTemporada, User);
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
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [HttpGet]
        [Route("like/{idAlbum}")]
        public async Task<RespostaAmbRetorn<int>> DonarLike(int idAlbum)
        {
            try
            {
                LogEntra(idAlbum);
                String usuari = ObtenirUsuari();
                return await _albumService.SumarUnLike(idAlbum, User);

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
        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [HttpDelete]
        [Route("like/{idAlbum}")]
        public async Task<RespostaAmbRetorn<int>> EsborrarLike(int idAlbum)
        {
            try
            {
                LogEntra(idAlbum);
                String usuari = ObtenirUsuari();
                return await _albumService.RestarUnLike(idAlbum, User);

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

        [HttpPut]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_NOTICIER + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        public async Task<RespostaAmbRetorn<AlbumModel>> AgregarAlbum([FromBody] AlbumModel album)
        {
            try
            {
                if (album == null) throw new ArgumentNullException(nameof(album));
                LogEntra(album.Id);
                String usuari = ObtenirUsuari();
                return await _albumService.EditarAlbum(album, User);

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
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_NOTICIER + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        public async Task<RespostaAmbRetorn<AlbumModel>> EditarAlbum([FromBody] AlbumModel album)
        {
            try
            {
                if (album == null) throw new ArgumentNullException(nameof(album));
                LogEntra(album.Id);
                String usuari = ObtenirUsuari();
                return await _albumService.EditarAlbum(album, User);

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
        [HttpDelete]
        [Authorize(Roles = SeguretatHelper.ROL_JUNTA + "," + SeguretatHelper.ROL_NOTICIER + "," + SeguretatHelper.ROL_ADMINISTRADOR + "," + SeguretatHelper.ROL_SECRETARI)]
        public Resposta EsborrarAlbum(int id)
        {
            try
            { 
                LogEntra(id);
                String usuari = ObtenirUsuari();
                return _albumService.EsborrarAlbum(id, User);

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

        [Authorize(Roles = SeguretatHelper.ROL_CASTELLER + "," + SeguretatHelper.ROL_MUSIC)]
        [HttpGet]
        [Route("likes/{idTemporada}")]
        public async Task<IList<LikeModel>> ObtenirLikes(int idTemporada)
        {
            try
            {
                LogEntra();
                String usuari = ObtenirUsuari();
                return await _albumService.ObtenirLikes(idTemporada, User);

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
            ;

        }

    }
}
