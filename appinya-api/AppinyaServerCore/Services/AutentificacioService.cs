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
using AppinyaServerCore.Database;
using AppinyaServerCore.Database.Identity;
using Microsoft.Extensions.Localization;
using System.Security.Principal;
using System.Net;
using System.Net.Http;
using System.Text.Json;

namespace AppinyaServerCore.Services
{

    public interface IAutentificacioService
    {

        public bool esUsuariLocal(IPrincipal principal);
        public bool esUsuariLocal(String usuari);
        Task<UsuariSessio> ObtenirUsuariValidacio(string usuari);
        Task<UsuariSessio> ObtenirUsuariSessio(IPrincipal principal);

        Task<SignInResult> Validar(string username, string password);

        Task<Resposta> AssignarRolsaUsuari(String usuari, IEnumerable<String> rols);

        Task<Resposta> AgregarRolaUsuari(String usuari, String rol);

        Task<UsuariSessio> RefrescarToken(string usuari);

        Task<IList<String>> ObtenirRols(string username);

        Task<IList<UsuariSessio>> ObtenirUsuaris();
        Task<UsuariSessio> ObtenirUsuariPerId(string id);
        Task<UsuariSessio> ObtenirUsuariPerEmail(string usuari);
        Task<Resposta> CrearUsuari(UsuariSessio usuari);
        Task<Resposta> EsborrarUsuari(UsuariSessio usuari, IPrincipal principal);
        Task<Resposta> CanviarPassword(String usuari, String passwordActual, String passwordNou);

        Task<RespostaAmbRetorn<String>> ValidarGoogleJWT(String jwt);

        public Task<Resposta> EnviarConfirmacioEmail(String usuari, String urlBase);

        public Task<Resposta> EnviaOblidarContrasenya(string email, String URL);

        public Task<Resposta> ConfirmacioEmailUsuari(string email, string token);
        Task<Resposta> CanviarPasswordOblidat(CanviPasswordPerdutModel canviPassword);
        Task<Resposta> ConfirmarCorreuManualment(String usuari);

    }

    public class AutentificacioService : BaseService<AutentificacioService>, IAutentificacioService
    {


        private readonly AppSettings _appSettings;
        private readonly SignInManager<Usuari> _signInManager;
        private readonly IEmailService _emailService;
        private readonly UserManager<Usuari> _userManager;
        private readonly IAuditoriaService _auditoriaService;
        public AutentificacioService(
            UserManager<Usuari> userManager,
            SignInManager<Usuari> signInManager,
            IEmailService emailService,
            IAuditoriaService auditoriaService,
            IOptions<AppSettings> appSettings,
            ILogger<AutentificacioService> logger,
            IStringLocalizer<AutentificacioService> localizer
            ) : base(localizer, logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
            _emailService = emailService;
            _userManager = userManager;
            _auditoriaService = auditoriaService;
        }

        public async Task<UsuariSessio> ObtenirUsuariValidacio(string usuari)
        {
            if (usuari == null) return null;
            var iuser = _userManager.Users.Where(x => x.UserName == usuari).FirstOrDefault();
            if (iuser == null)
            {
                if (esUsuariLocal(usuari))
                {
                    return crearInstanciaUsuariLocal(usuari);
                }
                return null;
            }

          
            UsuariSessio user = iuser;
            user.Rols = await _userManager.GetRolesAsync(iuser);
            user.Token = createToken(user.Usuari, user.Rols);
            user.RefreshToken = createRefreshToken(user.Usuari);

            return user;
        }
        /// <summary>
        /// Obtenir l'usuari de validació amb les credencials actualitzades 
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public async Task<UsuariSessio> ObtenirUsuariSessio(IPrincipal principal)
        {
            if (principal == null) return null;
            if (esUsuariLocal(principal.Identity.Name))
            {
                return crearInstanciaUsuariLocal(principal.Identity.Name);
            }

            var iuser = _userManager.Users.Where(x => x.UserName == principal.Identity.Name).FirstOrDefault();
            if (iuser == null) return null;
            UsuariSessio user = iuser;
            user.Rols = await _userManager.GetRolesAsync(iuser);
            user.Token = createToken(user.Usuari, user.Rols);
            user.RefreshToken = createRefreshToken(user.Usuari);

            return user;
        }

        /// <summary>
        /// Validar usuari al sistema local
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<SignInResult> Validar(string usuari, string password)
        {

            if (usuari == _appSettings.UsuariAdmin)
            {
                return new LoginResult(password == _appSettings.PasswordAdmin);
            }
            else if (usuari == _appSettings.UsuariTest)
            {
                return new LoginResult(password == _appSettings.UsuariTest);
            }
            else
            {
                var signInResult = await _signInManager.PasswordSignInAsync(usuari, password, false, false);
                return signInResult;
            }
        }
        public async Task<RespostaAmbRetorn<String>>  ValidarGoogleJWT(String encodedJwt)
        {
            try { 
                HttpClient client = new HttpClient();
                String firebaseProjectId = _appSettings.JwtFireBase_Id;
                // 1. Get Google signing keys
                client.BaseAddress = new System.Uri("https://www.googleapis.com/robot/v1/metadata/");
                var response = await client.GetAsync("x509/securetoken@system.gserviceaccount.com");
                if (!response.IsSuccessStatusCode) { return CrearRespotaAmbRetornError<String>("resposta.incorrecte"); }
                var x509DataSteam = await response.Content.ReadAsStreamAsync();
                var x509Data = await JsonSerializer.DeserializeAsync<Dictionary<string, string>>(x509DataSteam);
                List<SecurityKey> keys = new List<SecurityKey>();
                foreach (var s in x509Data.Values)
                {
                    keys.Add(new X509SecurityKey(new System.Security.Cryptography.X509Certificates.X509Certificate2(Encoding.UTF8.GetBytes(s))));
                }
                // 2. Configure validation parameters
                var parameters = new TokenValidationParameters
                {
                    ValidIssuer = "https://securetoken.google.com/" + firebaseProjectId,
                    ValidAudience = firebaseProjectId,
                    IssuerSigningKeys = keys, 
                };
                // 3. Use JwtSecurityTokenHandler to validate signature, issuer, audience and lifetime
                var handler = new JwtSecurityTokenHandler();
                var principal = handler.ValidateToken(encodedJwt, parameters, out var token);
                var jwt = (JwtSecurityToken)token;

                // 4.Validate signature algorithm and other applicable valdiations
                if (jwt.Header.Alg != SecurityAlgorithms.RsaSha256)
                {
                    return CrearRespotaAmbRetornError<String>("error.token.algorithm");
                }
                String email = jwt.Payload["email"].ToString();
                Boolean valid = Boolean.Parse(jwt.Payload["email_verified"].ToString());
                if (!valid) 
                { 
                    return CrearRespotaAmbRetornError<String>("resposta.incorrecte.emailnovalidad"); 
                }
                 
                return CrearRespotaAmbRetornOK<String>(email);
            }
            catch (Exception ex)
            {
                LogError(ex);
                return CrearRespotaAmbRetornError<String>(ex.Message);
            }
         
        }
        public bool esUsuariLocal(IPrincipal principal)
        {
            if (principal == null) return false;
            return esUsuariLocal(principal.Identity.Name);
        }

        public bool esUsuariLocal(string usuari)
        {
            return (usuari == _appSettings.UsuariAdmin) ||
                    (usuari == _appSettings.UsuariTest);

        }
        private UsuariSessio crearInstanciaUsuariLocal(string usuari)
        {
            UsuariSessio user = null;
            IList<String> rols = new List<string> { SeguretatHelper.ROL_CASTELLER };
            if (usuari == _appSettings.UsuariAdmin)
            {
                rols.Add(SeguretatHelper.ROL_ADMINISTRADOR);

                user = new UsuariSessio()
                {
                    Id = Guid.NewGuid().ToString(),
                    LocalUser = true,
                    Nom = _appSettings.UsuariAdmin,
                    Usuari = _appSettings.UsuariAdmin,
                    Email = _appSettings.UsuariAdmin,
                    ConfirmatEmail = true,
                    Rols = rols,
                    Token = createToken(_appSettings.UsuariAdmin, rols),
                    RefreshToken = createRefreshToken(_appSettings.UsuariAdmin)
                };
                return user;

            }
            user = new UsuariSessio()
            {
                Id = Guid.NewGuid().ToString(),
                LocalUser = true,
                Nom = _appSettings.UsuariTest,
                Usuari = _appSettings.UsuariTest,
                Email = _appSettings.UsuariTest,
                ConfirmatEmail = true,
                Rols = rols,
                Token = createToken(_appSettings.UsuariAdmin, rols),
                RefreshToken = createRefreshToken(_appSettings.UsuariAdmin)
            };
            return user;

        }
        /// <summary>
        /// Metode per refrescar el token
        /// </summary>
        /// <param name="usuari"></param>
        /// <returns></returns>
        public async Task<UsuariSessio> RefrescarToken(string usuari)
        {
            UsuariSessio user = null;
            if (esUsuariLocal(usuari))
            {
                return crearInstanciaUsuariLocal(usuari);
            }

            var iuser = _userManager.Users.Where(x => x.UserName == usuari).FirstOrDefault();
            user = iuser;
            user.Rols = await _userManager.GetRolesAsync(iuser);
            user.Token = createToken(user.Usuari, user.Rols);
            user.RefreshToken = createRefreshToken(user.Usuari);
            return user;

        }

        /// <summary>
        /// Obtenir Rols d un usuari
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task<IList<String>> ObtenirRols(string username)
        {
            var appUser = await _userManager.FindByEmailAsync(username);

            return await _userManager.GetRolesAsync(appUser);


        }


        /// <summary>
        /// Obtenir usuari per ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<UsuariSessio> ObtenirUsuariPerId(string id)
        {
            UsuariSessio user = null;
            if (esUsuariLocal(id))
            {
                return crearInstanciaUsuariLocal(id);
            }

            var iuser = _userManager.Users.Where(x => x.Id == id).FirstOrDefault();
            if (iuser == null) return null;
            user = iuser;
            user.Rols = await _userManager.GetRolesAsync(iuser);
            return user;
        }
        /// <summary>
        /// Obtenir usuari per email
        /// </summary>
        /// <param name="usuari"></param>
        /// <returns></returns>
        public async Task<UsuariSessio> ObtenirUsuariPerEmail(string email)
        {
            if (email == null) return null;
            UsuariSessio user = null;
            var iuser = _userManager.Users.Where(x => x.UserName == email).FirstOrDefault();
            if (iuser == null)
            { 
                if (esUsuariLocal(email))
                {
                    return crearInstanciaUsuariLocal(email);
                }
                return null;
            }

         
            user = iuser;
            user.Rols = await _userManager.GetRolesAsync(iuser);
            return user;
        }
        /// <summary>
        /// Crear un usuari
        /// </summary>
        /// <param name="userParam"></param>
        /// <returns></returns>
        public async Task<Resposta> CrearUsuari(UsuariSessio userParam)
        {
            if (userParam == null) throw new ArgumentNullException(nameof(userParam));

            
            bool mostraContrasenya = false;
            // Crea una contrasenya random
            if (String.IsNullOrEmpty(userParam.Contrasenya))
            {
                mostraContrasenya = true;
                var options = _userManager.Options.Password;
                int length = options.RequiredLength;
                bool nonAlphanumeric = options.RequireNonAlphanumeric;
                bool digit = options.RequireDigit;
                bool lowercase = options.RequireLowercase;
                bool uppercase = options.RequireUppercase;
                StringBuilder password = new StringBuilder();
                Random random = new Random();

                while (password.Length < length)
                {
                    char c = (char)random.Next(32, 126);

                    password.Append(c);

                    if (char.IsDigit(c))
                        digit = false;
                    else if (char.IsLower(c))
                        lowercase = false;
                    else if (char.IsUpper(c))
                        uppercase = false;
                    else if (!char.IsLetterOrDigit(c))
                        nonAlphanumeric = false;
                }

                if (nonAlphanumeric)
                    password.Append((char)random.Next(33, 48));
                if (digit)
                    password.Append((char)random.Next(48, 58));
                if (lowercase)
                    password.Append((char)random.Next(97, 123));
                if (uppercase)
                    password.Append((char)random.Next(65, 91));

                userParam.Contrasenya = password.ToString();
            }
            IdentityResult res = await _userManager.CreateAsync(new Usuari()
            {
                Email = userParam.Email,
                UserName = userParam.Usuari

            }, userParam.Contrasenya);
            if (res.Succeeded)
            {
                if (userParam.Rols != null && userParam.Rols.Any())
                    await this.AssignarRolsaUsuari(userParam.Email, userParam.Rols);

                await ConfirmarCorreuManualment(userParam.Email);
                Dictionary<String, String> parameters = new Dictionary<string, string>();
                parameters.Add("usuari", userParam.Email);
                parameters.Add("password", (mostraContrasenya) ? userParam.Contrasenya : "***********");
                
                if (_emailService.ServeiActiu())
                    _emailService.EnviarEmailBenvinguda(userParam.Email, parameters);
                else
                    _logger.LogInformation($" WARNING: Creació d'usuari {userParam.Email} amb password {userParam.Contrasenya}");
                return CrearRespotaOK();
            }
            String errors = "";
            foreach (IdentityError error in res.Errors)
            {
                errors += $"{error.Code} - {error.Description} \n";
            }
            return CrearRespotaError(errors);
        }

        public async Task<Resposta> EsborrarUsuari(UsuariSessio userParam, IPrincipal principal)
        {
            if (userParam == null) throw new ArgumentNullException(nameof(userParam));

            if (esUsuariLocal(userParam.Email))
            {
                throw new ArgumentException("No es pot esborrar un usuari local de proves");
            }

            var iuser = _userManager.Users.Where(x => x.UserName == userParam.Email).FirstOrDefault();
            if (iuser == null) return CrearRespotaError(_localizer["usuariNoTrobat"]);
            IdentityResult res = await _userManager.DeleteAsync(iuser);

            if (res.Succeeded)
            {
                _auditoriaService.RegistraAccio<Usuari>(Accio.Esborrar, 0, userParam.Email, principal);
                await _userManager.UpdateAsync(iuser);
                return CrearRespotaOK();
            }
            String errors = "";
            foreach (IdentityError error in res.Errors)
            {
                errors += $"{error.Code} - {error.Description} \n";
            }
            return CrearRespotaError(errors);
        }
        /// <summary>
        /// Canviar el password
        /// </summary>
        /// <param name="usuari"></param>
        /// <param name="passwordActual"></param>
        /// <param name="passwordNou"></param>
        /// <returns></returns>
        public async Task<Resposta> CanviarPassword(String usuari, String passwordActual, String passwordNou)
        {
            var iuser = _userManager.Users.Where(x => x.UserName == usuari).FirstOrDefault();
            var res = await _userManager.ChangePasswordAsync(iuser, passwordActual, passwordNou);
            if (res.Succeeded) return CrearRespotaOK();
            String errors = "";
            foreach (IdentityError error in res.Errors)
            {
                errors += $"{error.Code} - {error.Description} \n";
            }
            return CrearRespotaError(errors);

        }

        /// <summary>
        /// Metode per crear un token d'autentificacio per una sessio HTTP
        /// </summary>
        /// <param name="username"></param>
        /// <param name="roles"></param>
        /// <returns></returns> 
        private string createToken(string username, IList<string> roles)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.JwtKey);
            ClaimsIdentity identity = new ClaimsIdentity();
            identity.AddClaim(new Claim(ClaimTypes.Name, username.ToString()));
            foreach (string rol in roles)
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, rol.ToString()));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.UtcNow.AddDays(_appSettings.JwtExpireDays),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        /// <summary>
        /// Metode per crear un token d'autentificacio per una sessio HTTP
        /// </summary>
        /// <param name="username"></param>
        /// <param name="roles"></param>
        /// <returns></returns>

        private string createRefreshToken(string username)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.JwtKey);
            ClaimsIdentity identity = new ClaimsIdentity();
            identity.AddClaim(new Claim(ClaimTypes.Name, username.ToString()));
            identity.AddClaim(new Claim(ClaimTypes.Role, SeguretatHelper.REFRESH_TOKEN));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.UtcNow.AddDays(_appSettings.JwtRefreshDays),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        /// <summary>
        /// Obtenir la llista d'usuaris
        /// </summary>
        /// <returns></returns>
        public async Task<IList<UsuariSessio>> ObtenirUsuaris()
        {
            var usuaris = _userManager.Users.ToList();
            List<UsuariSessio> lst = new List<UsuariSessio>();
            foreach (var iuser in usuaris)
            {
                UsuariSessio user = iuser;
                user.Rols = await _userManager.GetRolesAsync(iuser);
                lst.Add(user);
            }
            return lst;
        }

        /// <summary>
        /// Envia el Email de confirmacion del Correo del usuario, generea un token aleatorio i se envia por correo electronico
        /// </summary>
        /// <param name="usuari"></param>
        /// <param name="token"></param>
        /// <param name="urlBase"></param>
        public async Task<Resposta> EnviarConfirmacioEmail(String usuari, String urlBase)
        {
            if (usuari == null) throw new ArgumentNullException(_localizer["usuariNul"]);
            if (urlBase == null) throw new ArgumentNullException(_localizer["urlNul"]);

            var iuser = _userManager.Users.Where(x => x.UserName == usuari).FirstOrDefault();
            String token = await _userManager.GenerateEmailConfirmationTokenAsync(iuser);
            _emailService.EnviarConfirmacioEmail(usuari, urlBase, token, usuari);
            return CrearRespotaOK();
        }

        /// <summary>
        /// Enviar el correu per canviar la contrasenya enviant un token d'autentificació 
        /// </summary>
        /// <param name="email"></param>
        /// <param name="URL"></param>
        /// <returns></returns>

        public async Task<Resposta> EnviaOblidarContrasenya(string email, String URL)
        {
            var usuari = await _userManager.FindByEmailAsync(email);
            //Token del sistema de seguretat
            String token = await _userManager.GeneratePasswordResetTokenAsync(usuari);
            // Envia Correo
            string url = _emailService.EnviarOblidarContrasenya(email, URL, WebUtility.UrlEncode(token), email);
            return CrearRespotaOK(url);
        }

        /// <summary>
        /// Canviar el password quanl 'usuari no s'enrecorda del seu password
        /// </summary>
        /// <param name="canviPassword"></param>
        /// <returns></returns>
        public async Task<Resposta> CanviarPasswordOblidat(CanviPasswordPerdutModel canviPassword)
        {
            if (canviPassword.Tiket == null || canviPassword.Email == null)
            {
                LogWarning("Error en la peticio de CanviarPasswordOblidat  IsValid");
                return CrearRespotaError(_localizer["canviContrasenyadades"]);
            }
            LogInfo("S'ha accedit al canvi de contrasenya per perdua de password, " + canviPassword.Email);
            var usuari = await _userManager.FindByEmailAsync(canviPassword.Email);

            if (usuari == null)
            {
                LogWarning("Error en la peticio de CanviarPasswordOblidat  user=null");
                return CrearRespotaError(_localizer["usuariNotrobat"]);
            }
            IdentityResult identity = await _userManager.ResetPasswordAsync(usuari, canviPassword.Tiket, canviPassword.NewPassword);
            if (identity.Succeeded)
                return CrearRespotaOK();
            String errors = "";
            await _userManager.SetLockoutEndDateAsync(usuari, new DateTimeOffset(DateTime.UtcNow));
            foreach (IdentityError error in identity.Errors)
            {
                errors += $"{error.Code} - {error.Description} \n";
            }
            return CrearRespotaError(errors);

        }
        /// <summary>
        /// Activa el flag de confirmació de forma manual de correu electronic
        /// </summary>
        /// <param name="email"></param>
        public async Task<Resposta> ConfirmarCorreuManualment(String usuari)
        {

            var iuser = _userManager.Users.Where(x => x.UserName == usuari).FirstOrDefault();
            String token = await _userManager.GenerateEmailConfirmationTokenAsync(iuser);
            var identity = await _userManager.ConfirmEmailAsync(iuser, token);
            return CrearRespotaOK();
        }
        /// <summary>
        /// Enviar un correu per confirmar el correu de l'usuari
        /// </summary>
        /// <param name="principal"></param>
        /// <param name="URL"></param>
        /// <returns></returns>
        public async Task<Resposta> EnviarCorreoConfirmacioEmail(IPrincipal principal, String URL)
        {
            var usuariApp = await _userManager.FindByNameAsync(principal.Identity.Name);
            if (usuariApp.EmailConfirmed) return CrearRespotaError(_localizer["correujaconfirmat"]);

            String token = await _userManager.GenerateEmailConfirmationTokenAsync(usuariApp);
            _emailService.EnviarConfirmacioEmail(usuariApp.Email, URL, WebUtility.UrlEncode(token), usuariApp.Email);
            return CrearRespotaOK();
        }

        /// <summary>
        /// Autentificació per token de la confirmacio del usuari del seu correu
        /// </summary>
        /// <param name="email"></param>
        /// <param name="token"></param> 
        /// <returns></returns>
        public async Task<Resposta> ConfirmacioEmailUsuari(string email, string token)
        {
            var iuser = await _userManager.FindByEmailAsync(email);
            IdentityResult identity = await _userManager.ConfirmEmailAsync(iuser, token);
            if (identity.Succeeded)
                return CrearRespotaOK();
            String errors = "";
            foreach (IdentityError error in identity.Errors)
            {
                errors += $"{error.Code} - {error.Description} \n";
            }
            return CrearRespotaError(errors);
        }

        /// <summary>
        /// Canviar el Password de l'usuari
        /// </summary>
        /// <param name="canviPassword"></param>
        /// <returns></returns>

        public async Task<Resposta> CanviarPassword(CanviPasswordModel canviPassword)
        {
            if (canviPassword.Usuari == null)
            {
                LogWarning("Error en la peticio de CanviarPassword  IsValid");
                return CrearRespotaError(_localizer["canviContrasenyadades"]);
            }
            LogInfo("S'ha accedit al canvi de contrasenya per perdua de password, " + canviPassword.Usuari);
            var usuari = await _userManager.FindByEmailAsync(canviPassword.Usuari);

            if (usuari == null)
            {
                LogWarning("Error en la peticio de CanviarPassword  user=null");
                return CrearRespotaError(_localizer["usuariNotrobat"]);
            }
            IdentityResult identity = await _userManager.ChangePasswordAsync(usuari, canviPassword.PasswordActual, canviPassword.PasswordNou);
            if (identity.Succeeded)
                return CrearRespotaOK();
            String errors = "";

            foreach (IdentityError error in identity.Errors)
            {
                errors += $"{error.Code} - {error.Description} \n";
            }
            return CrearRespotaError(errors);
        }

        /// <summary>
        /// Assignar rols a un usuari
        /// </summary>
        /// <param name="usuari"></param>
        /// <param name="rols"></param>
        /// <returns></returns>
        public async Task<Resposta> AssignarRolsaUsuari(String usuari, IEnumerable<String> rols)
        {
            var iuser = _userManager.Users.Where(x => x.UserName == usuari).FirstOrDefault();
            await _userManager.RemoveFromRolesAsync(iuser, await _userManager.GetRolesAsync(iuser).ConfigureAwait(false)).ConfigureAwait(false);

            var identity = await _userManager.AddToRolesAsync(iuser, rols).ConfigureAwait(false);
            if (identity.Succeeded) return CrearRespotaOK();

            String errors = "";
            foreach (IdentityError error in identity.Errors)
            {
                errors += $"{error.Code} - {error.Description} \n";
            }
            return CrearRespotaError(errors);


        }

        /// <summary>
        /// Assignar rol a un usuari
        /// </summary>
        /// <param name="usuari"></param>
        /// <param name="rol"></param>
        /// <returns></returns>
        public async Task<Resposta> AgregarRolaUsuari(String usuari, String rol)
        {
            var iuser = _userManager.Users.Where(x => x.UserName == usuari).FirstOrDefault();
            var identity = await _userManager.AddToRoleAsync(iuser, rol).ConfigureAwait(false);
            if (identity.Succeeded) return CrearRespotaOK();
            String errors = "";
            foreach (IdentityError error in identity.Errors)
            {
                errors += $"{error.Code} - {error.Description} \n";
            }
            return CrearRespotaError(errors);
        }


    }


}
