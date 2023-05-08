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
using Microsoft.EntityFrameworkCore;
using AppinyaServerCore.Database;
using AppinyaServerCore.Database.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Localization;
using System.Threading.Tasks;
using AppinyaServerCore.Models;
using AppinyaServerCore.Helpers;
using System.Security.Principal;
using Microsoft.AspNetCore.Http;
using System.Net;

namespace AppinyaServerCore.Services
{

    public interface IUsuariService
    {
        Task<RespostaAmbRetorn<int>> CrearUsuaris(IList<UsuariModel> lst, IPrincipal principal);

        Task<UsuariSessio> ObtenirUsuariSessio(IPrincipal principal);
        Task<Casteller> ObtenirCastellerSessio(IPrincipal principal);

        Task<IList<String>> ObtenirRols(string username);
        Task<UsuariSessio> ObtenirUsuariSessioPerEmail(string usuari);
        Task<RespostaAmbRetorn<UsuariModel>> RelacionarCastellerAmbUsuari(IPrincipal principal);

        Task<UsuariModel> ObtenirUsuariPerId(String idUsuari);
        Task<UsuariModel> ObtenirUsuariPerEmail(String email);

        Task<List<UsuariModel>> ObtenirLlistaUsuari(String text, int numreg);

        Task<Resposta> EsborrarUsuariByEmail(String email, IPrincipal principal);
        Task<Resposta> EsborrarUsuariById(String id, IPrincipal principal);

        Task<Resposta> CrearUsuari(int idCasteller, IPrincipal principal);
        Task<Resposta> CrearUsuari(CastellerModel casteller, IPrincipal principal, IList<string> roles = null);

    }
    /// <summary>
    /// Servei d'usuari 
    /// </summary>
    public class UsuariService : BaseService<UsuariService>, IUsuariService
    {
        private readonly AppinyaDbContext _appinyaDbContext;
        private readonly IEmailService _emailService;
        private readonly IAutentificacioService _autenticacioService;
        private readonly UserManager<Usuari> _userManager;
        private readonly IAuditoriaService _auditoriaService;
        public UsuariService(
            UserManager<Usuari> userManager,
            AppinyaDbContext appinyaDbContext,
            IAutentificacioService autenticacioService,
            IEmailService emailService,
            ILogger<UsuariService> logger,
            IAuditoriaService auditoriaService,
            IStringLocalizer<UsuariService> localizer
            ) : base(localizer, logger)
        {
            _appinyaDbContext = appinyaDbContext;
            _emailService = emailService;
            _autenticacioService = autenticacioService;
            _userManager = userManager;
            _auditoriaService = auditoriaService;
        }





        public async Task<UsuariModel> ObtenirUsuariPerEmail(String email)
        {
            if (String.IsNullOrEmpty(email)) return null;

            var usuari = await _autenticacioService.ObtenirUsuariPerEmail(email);
            Casteller casteller = null;
            if (_autenticacioService.esUsuariLocal(email))
            {
                casteller = (from castellers in _appinyaDbContext.Casteller
                             select castellers).FirstOrDefault();

            }
            else if (usuari != null) // primer per usuari
            {
                casteller = (from castellers in _appinyaDbContext.Casteller
                             where castellers.UserId == usuari.Id
                             select castellers).FirstOrDefault();
            }
            if (casteller == null) // en cas de no trobar casteller per usuari cerquem per correu
            {
                casteller = (from castellers in _appinyaDbContext.Casteller
                             where castellers.Email.ToUpper() == email.ToUpper()
                             select castellers).FirstOrDefault();

            }

            if (casteller != null)
            {
                List<CastellerDelega> emisor = (from delegats in _appinyaDbContext.CastellerDelega
                                                where delegats.IdCasteller1 == casteller.IdCasteller
                                                select delegats).ToList();

                List<CastellerDelega> receptor = (from delegats in _appinyaDbContext.CastellerDelega
                                                  where delegats.IdCasteller2 == casteller.IdCasteller
                                                  select delegats).ToList();

                return UsuariModel.ConvertTo(casteller, usuari, (usuari == null) ? null : usuari.Rols,
                    receptor.Where(c => c.Confirm == true && c.TReferent == true).Select(c => c.IdCasteller1).ToList(),
                    emisor.Where(c => c.Confirm == true && c.TReferent == false).Select(c => c.IdCasteller2).ToList(),
                    receptor.Where(c => c.Confirm == true && c.TReferent == false).Select(c => c.IdCasteller1).ToList(),
                    emisor.Where(c => c.Confirm == true && c.TReferent == true).Select(c => c.IdCasteller2).ToList(),
                    receptor.Where(c => c.Confirm == false).Select(c => c.IdCasteller1).ToList(),
                    emisor.Where(c => c.Confirm == false).Select(c => c.IdCasteller2).ToList()
                    );
            }
            else
                return UsuariModel.ConvertTo(casteller, usuari, usuari.Rols, null, null);



        }
        /// <summary>
        /// Retorna la informació associada de l'usuari
        /// </summary>
        /// <param name="idUsuari"> Identificador de l'usuari </param>
        /// <returns></returns>
        public async Task<UsuariModel> ObtenirUsuariPerId(String idUsuari)
        {
            if (idUsuari == null) return null;
            Casteller casteller = null;
            if (_autenticacioService.esUsuariLocal(idUsuari))
            {
                casteller = (from castellers in _appinyaDbContext.Casteller
                             select castellers).FirstOrDefault();

            }
            else
            {
                casteller = (from castellers in _appinyaDbContext.Casteller
                             where castellers.UserId == idUsuari
                             select castellers).FirstOrDefault();
            }


            var usuari = await _autenticacioService.ObtenirUsuariPerId(idUsuari).ConfigureAwait(false);
            if (casteller != null)
            {

                List<CastellerDelega> emisor = (from delegats in _appinyaDbContext.CastellerDelega
                                                where delegats.IdCasteller1 == casteller.IdCasteller
                                                select delegats).ToList();

                List<CastellerDelega> receptor = (from delegats in _appinyaDbContext.CastellerDelega
                                                  where delegats.IdCasteller2 == casteller.IdCasteller
                                                  select delegats).ToList();


                return UsuariModel.ConvertTo(casteller, usuari, usuari.Rols,
                    receptor.Where(c => c.Confirm == true && c.TReferent == true).Select(c => c.IdCasteller1).ToList(),
                    emisor.Where(c => c.Confirm == true && c.TReferent == false).Select(c => c.IdCasteller2).ToList(),
                    receptor.Where(c => c.Confirm == true && c.TReferent == false).Select(c => c.IdCasteller1).ToList(),
                    emisor.Where(c => c.Confirm == true && c.TReferent == true).Select(c => c.IdCasteller2).ToList(),
                    receptor.Where(c => c.Confirm == false).Select(c => c.IdCasteller1).ToList(),
                    emisor.Where(c => c.Confirm == false).Select(c => c.IdCasteller2).ToList()
                    );
            }
            else
                return UsuariModel.ConvertTo(casteller, usuari, usuari.Rols, null, null);

        }
        public Int32 ObtenirCastellerIdUsuari(String idUsuari)
        {
            var casteller = (from castellers in _appinyaDbContext.Casteller
                             where castellers.UserId == idUsuari
                             select castellers).FirstOrDefault();

            return casteller.IdCasteller;
        }


        /// <summary>
        /// Relaciona un usuari amb un casteller i li assigna el rol de casteller
        /// </summary>
        /// <param name="usuari"> email de L'usauri</param>
        /// <returns>Retorna si hi ha un tipus de canvi </returns>
        public async Task<RespostaAmbRetorn<UsuariModel>> RelacionarCastellerAmbUsuari(IPrincipal principal)
        {



            var usuari = await _autenticacioService.ObtenirUsuariPerEmail(principal.Identity.Name);

            if (usuari == null) return CrearRespotaAmbRetornError<UsuariModel>(_localizer["usuariNull"]);
            if (!usuari.ConfirmatEmail) return CrearRespotaAmbRetornError<UsuariModel>(_localizer["ConfirmatEmailFalse"]);
            //Cercar de l'usuari seleccionat
            Casteller cas = null;

            cas = (from caste in _appinyaDbContext.Casteller
                   where caste.Email == usuari.Email
                   select caste).FirstOrDefault();

            // Si no existeix casteller 
            if (cas == null)
            {
                if (_autenticacioService.esUsuariLocal(principal))
                {
                    return CrearRespotaAmbRetornOK<UsuariModel>(await ObtenirUsuariPerId(usuari.Id));
                }
                else
                 
                    return CrearRespotaAmbRetornError<UsuariModel>(_localizer["castellerNoRelacionat"]);  // No relacionat
            }

            //Llista els castellers que tenia l'usuari per reassignar lo al nou
            List<Casteller> lstCastellers = (from caste in _appinyaDbContext.Casteller
                                             where caste.UserId == usuari.Id
                                             select caste).ToList();
            foreach (Casteller casteller in lstCastellers)
            {
                casteller.UserId = null;
            }
            bool posMusic = cas.CastellerPosicio.Where(t => t.IdPosicio == PosicionsHelper.ID_POSICIO_MUSIC_GRALLA || t.IdPosicio == PosicionsHelper.ID_POSICIO_MUSIC_GRALLA).Any();
            cas.UserId = usuari.Id;
            Resposta resposta = new Resposta() { Correcte = true };
            if (!usuari.Rols.Where(rol => rol == SeguretatHelper.ROL_MUSIC).Any() && posMusic)
            {
                var iuser = _userManager.Users.Where(x => x.UserName == usuari.Usuari).FirstOrDefault();
                await _userManager.AddToRoleAsync(iuser, SeguretatHelper.ROL_MUSIC).ConfigureAwait(false);
                resposta.Missatge = _localizer["CanviRolMusic"];
            }

            if (!usuari.Rols.Where(rol => rol == SeguretatHelper.ROL_CASTELLER).Any())
            {
                var iuser = _userManager.Users.Where(x => x.UserName == usuari.Usuari).FirstOrDefault();
                await _userManager.AddToRoleAsync(iuser, SeguretatHelper.ROL_CASTELLER).ConfigureAwait(false);
                resposta.Missatge = _localizer["CanviRolCasteller"];
            }
            _appinyaDbContext.SaveChanges();

            return CrearRespotaAmbRetornOK<UsuariModel>(await ObtenirUsuariPerId(usuari.Id));

        }





        /// <summary>
        /// Retorna la llista de usuaris de l'aplicació (de 30 en 30)
        /// </summary>
        /// <param name="text"> Text de cerca per correu electronic</param>
        /// <param name="numreg">Numero de registre on comença la cerca</param>
        /// <returns></returns>
        public async Task<List<UsuariModel>> ObtenirLlistaUsuari(String text, int numreg)
        {



            List<Casteller> listCastellers = (from cas in _appinyaDbContext.Casteller
                                              where cas.UserId != null && (text == null || cas.Email.Contains(text) || cas.Alias.Contains(text) || cas.Cognoms.Contains(text) || cas.Nom.Contains(text))
                                              orderby cas.Email
                                              select cas
           ).Skip(numreg).Take(30).ToList();

            List<UsuariModel> lst = new List<UsuariModel>();
            foreach (Casteller cas in listCastellers)
            {
                var user = await _userManager.FindByIdAsync(cas.UserId);
                if (user != null)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    lst.Add(new UsuariModel(cas, user, roles, null, null));
                }
            }
            return lst;
            //(from users in _identityDbContext.Users
            // join cas in _appinyaDbContext.Casteller on users.Id equals cas.UserId into cas
            // from casteller in cas.DefaultIfEmpty()
            // where (text == null || users.Email.Contains(text) || casteller.Alias.Contains(text) || casteller.Cognoms.Contains(text) || casteller.Nom.Contains(text))
            // orderby users.Email
            // select  new UsuariModelPlus (casteller, users,null,null) 
            // ).Skip(numreg).Take(30).ToList().ForEach(aspuser =>
            // {

            //     lst.Add(aspuser);

            // }); 
        }

        public async Task<Resposta> EsborrarUsuariByEmail(String email, IPrincipal principal)
        {
            var user = await _userManager.FindByEmailAsync(email).ConfigureAwait(false);
            Casteller cas = _appinyaDbContext.Casteller.Where(it => it.UserId == user.Id).FirstOrDefault();
            if (cas != null)
            {
                cas.UserId = null;
                _appinyaDbContext.SaveChanges();
            }
            // await _userManager.RemoveLoginAsync(iuser, email, email);
            IdentityResult identity = await _userManager.DeleteAsync(user).ConfigureAwait(false);
            if (identity.Succeeded) return CrearRespotaOK();
            if (identity.Succeeded)
            {
                _auditoriaService.RegistraAccio<Usuari>(Accio.Esborrar, 0, user.Email, principal);
                return CrearRespotaOK();
            }

            String errors = "";

            foreach (IdentityError error in identity.Errors)
            {
                errors += $"{error.Code} - {error.Description} \n";
            }
            return CrearRespotaError(errors);
        }


        /// <summary>
        /// Esborra Usuari per IdUsuari
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Resposta> EsborrarUsuariById(String id, IPrincipal principal)
        {
            var user = await _userManager.FindByIdAsync(id).ConfigureAwait(false);
            Casteller cas = _appinyaDbContext.Casteller.Where(it => it.UserId == user.Id).FirstOrDefault();
            if (cas != null)
            {
                cas.UserId = null;
                _appinyaDbContext.SaveChanges();
            }
            // await _userManager.RemoveLoginAsync(iuser, email, email);
            IdentityResult identity = await _userManager.DeleteAsync(user).ConfigureAwait(false);
            if (identity.Succeeded)
            {
                _auditoriaService.RegistraAccio<Usuari>(Accio.Esborrar, 0, user.Email, principal);
                return CrearRespotaOK();
            }
            String errors = "";
            foreach (IdentityError error in identity.Errors)
            {
                errors += $"{error.Code} - {error.Description} \n";
            }
            return CrearRespotaError(errors);
        }
        public async Task<RespostaAmbRetorn<int>> CrearUsuaris(IList<UsuariModel> lst, IPrincipal principal)
        {
            if (lst == null) throw new ArgumentNullException(nameof(lst));
            int i = 0;
            foreach (UsuariModel usr in lst)
            {

                Casteller cas = _appinyaDbContext.Casteller.Where(it => it.Email.ToUpper() == usr.Email.ToUpper()).FirstOrDefault();
                if (cas != null)
                {
                    Resposta res = await CrearUsuari(CastellerModel.Convert(cas), principal, usr.Rols);
                    if (res.Correcte) i++;
                }
            }
            return CrearRespotaAmbRetornOK<int>(i);
        }

        /// <summary>
        /// Crear un Usuari d'aplicació
        /// </summary>
        /// <param name="casteller"></param>
        /// <returns></returns>
        public async Task<Resposta> CrearUsuari(CastellerModel casteller, IPrincipal principal, IList<string> roles = null)
        {
            if (casteller == null) throw new ArgumentNullException(nameof(casteller));
            if (String.IsNullOrEmpty(casteller.Email))
                return CrearRespotaError(_localizer["usuarisenseemail"]);

            String password = $"Appinya.{DateTime.Now.Minute}{DateTime.Now.Second}{DateTime.Now.Millisecond}";

            UsuariSessio user = await _autenticacioService.ObtenirUsuariPerEmail(casteller.Email).ConfigureAwait(false);
            if (user == null || user.LocalUser) // si no existeix es crea
            {
                Resposta resp = await _autenticacioService.CrearUsuari(new UsuariSessio()
                {

                    Nom = casteller.Nom,
                    Cognoms = casteller.Cognom,
                    Contrasenya = password,
                    Email = casteller.Email,
                    Usuari = casteller.Email,
                    Rols = (roles == null || roles.Count == 0) ? new List<string> { SeguretatHelper.ROL_CASTELLER } : roles

                });
                if (resp.Correcte)
                {
                    _ = await _autenticacioService.ConfirmarCorreuManualment(casteller.Email);

                    // Nomes s'envia si es un casteller nou  
                    Dictionary<String, String> parames = new Dictionary<String, String>();
                    try
                    {
                        parames.Add("usuari", casteller.Nom);
                        parames.Add("email", casteller.Email);
                        parames.Add("password", password);
                        if (_emailService.ServeiActiu())
                            _emailService.EnviarEmailBenvinguda(casteller.Email, parames);
                        else
                            _logger.LogInformation($" WARNING: Creació d'usuari {casteller.Email} amb password {password}");

                        _auditoriaService.RegistraAccio<Usuari>(Accio.Agregar, casteller.Id, principal);
                        return CrearRespotaOK();
                    }
                    catch (Exception)
                    {
                        LogWarning(_localizer["emailNoEnviatBenvinguda"]);
                        return CrearRespotaError(_localizer["emailNoEnviatBenvinguda"], casteller.Email);
                    }
                }
                else
                {
                    _logger.LogWarning($"Error al crear {casteller.Email}. ");
                }
                return resp;

            }
            else // si ja està creat ja te un password assignat
            {
                _logger.LogWarning($"No s'ha enviat el correu al {casteller.Alias} , perque ja estava creat");
                if ((roles != null && roles.Count != 0))
                {
                    _auditoriaService.RegistraAccio<Usuari>(Accio.Modificar, casteller.Id, principal);
                    return await _autenticacioService.AssignarRolsaUsuari(user.Usuari, roles);
                }
                else
                {
                    _auditoriaService.RegistraAccio<Usuari>(Accio.Modificar, casteller.Id, principal);
                    return await _autenticacioService.AssignarRolsaUsuari(user.Usuari, new List<string>() { SeguretatHelper.ROL_CASTELLER });
                }
            }

        }

        public Task<UsuariSessio> ObtenirUsuariSessio(IPrincipal principal)
        {
            return _autenticacioService.ObtenirUsuariSessio(principal);
        }

        public async Task<Casteller> ObtenirCastellerSessio(IPrincipal principal)
        {
            if (_autenticacioService.esUsuariLocal(principal))
            {
                return _appinyaDbContext.Casteller.Include(c => c.CastellerDelegaIdCasteller1Navigation).FirstOrDefault();
            }
            UsuariSessio user = await _autenticacioService.ObtenirUsuariSessio(principal);
            return _appinyaDbContext.Casteller.Include(c => c.CastellerDelegaIdCasteller1Navigation).Where(cas => cas.UserId == user.Id).FirstOrDefault();
        }

        public Task<IList<string>> ObtenirRols(string username)
        {
            return _autenticacioService.ObtenirRols(username);
        }

        public Task<UsuariSessio> ObtenirUsuariSessioPerEmail(string usuari)
        {
            return _autenticacioService.ObtenirUsuariPerEmail(usuari);
        }
        public Task<Resposta> CrearUsuari(int idCasteller, IPrincipal principal)
        {
            Casteller cas = _appinyaDbContext.Casteller.Where(it => it.IdCasteller == idCasteller).FirstOrDefault();
            return CrearUsuari(CastellerModel.Convert(cas), principal);
        }

    }
}
