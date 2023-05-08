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

using System.Linq;
using AppinyaServerCore.Database;
using AppinyaServerCore.Database.Identity;
using AppinyaServerCore.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net.Mail;
using Microsoft.EntityFrameworkCore;
using AppinyaServerCore.Models;

namespace AppinyaServerCore.Services
{
    public enum TipusCompteCorreu { Suport, Principal };

    public interface IEmailService
    {
        public Boolean ServeiActiu();

        public void EnviarInformacioSistema(string missatge);
        public void EnviarParticiparEmail(String usuari, String missatge, int tipusContacte);

        public void EnviarIncidenciaEmail(String usuari, String missatge);
        public Resposta EnviarComisio(String emisor, int idComisio, String missatge);

        public void EnviarConfirmacioEmail(String to, String urlBase, String token, String usuari);

        public String EnviarOblidarContrasenya(String to, String urlBase, String token, String usuari);
        public void EnviarEmailNoReply(String titol, String cco, String urlTemplate, Dictionary<String, String> templateParams);

        public void EnviarEmailConvocatoria(String cco, Dictionary<String, String> templateParams);
        public void EnviarEmailBenvinguda(string cco, Dictionary<string, string> templateParams);

        public void EnviarEmailNotificacioNoticies(string cco, Dictionary<string, string> templateParams);
        public void EnviarEmailNotificacioAlbums(string cco, Dictionary<string, string> templateParams);

        public void EnviarEmailCastellers(String cco, Dictionary<String, String> templateParams, MemoryStream file);

        public String ObtenirUsuariCompteCorreu(TipusCompteCorreu tipus);
        public String ObtenirContrasenyaCompteCorreu(TipusCompteCorreu tipus);
        public void EnviarEmailHtmlTemplate(String titol, String to, String cco, String from, String urlTemplate, Dictionary<String, String> templateParams, String fileName, MemoryStream file, TipusCompteCorreu tipusCompte);

        public void EnviarEmailExportacioCSV(String titol, String to, Dictionary<String, String> templateParams, MemoryStream file);

    }
    public class EmailService : BaseService<EmailService>, IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly AppinyaDbContext _appinyaDbContext;
        public EmailService(
           IOptions<EmailSettings> emailSettings,
           ILogger<EmailService> logger,
           AppinyaDbContext appinyaDbContext,
           IStringLocalizer<EmailService> localizer
           ) : base(localizer, logger)
        {
            if (emailSettings == null) throw new ArgumentNullException(nameof(emailSettings));
            if (emailSettings == null) throw new ArgumentNullException(nameof(emailSettings));
            _emailSettings = emailSettings.Value;

            _appinyaDbContext = appinyaDbContext;
        }
        public Boolean ServeiActiu()
        {
            return _emailSettings.MailingEnable;
        }
        /// <summary>
        /// Informar al administrador que hi ha hagut un error
        /// </summary>
        /// <param name="missatge"></param>
        public void EnviarInformacioSistema(string missatge)
        {
            Dictionary<String, String> templateParams = new Dictionary<String, String>();
            templateParams.Add("message", missatge);
            string body = crearBodyEmail(_emailSettings.TemlateError, templateParams);
            EnviarEmailHtmlFormatejat("Error en el servidor", body, ObtenirUsuariCompteCorreu(TipusCompteCorreu.Suport), TipusCompteCorreu.Suport);
        }
        /// <summary>
        /// Envia un correo per participar
        /// </summary>
        /// <param name="to">email de l'usuari </param>
        /// <param name="templateParams"></param>
        public void EnviarIncidenciaEmail(String usuari, String missatge)

        {
            String titol = _localizer["IncidenciaEmail"];
            Dictionary<String, String> templateParams = new Dictionary<String, String>();
            templateParams.Add("userName", usuari);
            templateParams.Add("message", missatge);
            String urlTemplate = _emailSettings.TemplateSuport;
            string body = crearBodyEmail(urlTemplate, templateParams);
            EnviarEmailHtmlFormatejat(titol, body, ObtenirUsuariCompteCorreu(TipusCompteCorreu.Suport), TipusCompteCorreu.Suport);
        }

        /// <summary>
        /// Envia un correo per participar
        /// </summary>
        /// <param name="to">email de l'usuari </param>
        /// <param name="templateParams"></param>
        public Resposta EnviarComisio(String emisor, int idComisio, String missatge)

        {

            String titol = _localizer[$"titolEmail{idComisio}"];
            Dictionary<String, String> templateParams = new Dictionary<String, String>();
            templateParams.Add("userName", emisor);
            templateParams.Add("message", missatge);
            String urlTemplate = _emailSettings.TemplateComisions;
            Organitzacio organitzacio = _appinyaDbContext.Organitzacio.Include(o => o.CastellerOrganitzacio).ThenInclude(c => c.IdCastellerNavigation).Where(t => t.Id == idComisio).FirstOrDefault();
            if (organitzacio == null) return this.CrearRespotaError((_localizer["noroganitzacioactiva"]));
            List<String> to = organitzacio.CastellerOrganitzacio.Select(cas => cas.IdCastellerNavigation.Email).ToList();
            if (to == null || !to.Any()) return this.CrearRespotaError((_localizer["noroganitzacioactiva"]));
            string body = crearBodyEmail(urlTemplate, templateParams);
            EnviarEmailHtmlFormatejat(titol, body, String.Join(",", to), TipusCompteCorreu.Suport);
            return CrearRespotaOK();
        }
        /// <summary>
        /// Envia un correo per informar una incidencia
        /// </summary>
        /// <param name="to">email de l'usuari </param>
        /// <param name="templateParams"></param>
        public void EnviarParticiparEmail(String usuari, String missatge, int tipusContacte)

        {
            String titol = _localizer["ParticipacioEmail"];
            Dictionary<String, String> templateParams = new Dictionary<String, String>();
            templateParams.Add("userName", usuari);
            templateParams.Add("message", missatge);
            String urlTemplate = _emailSettings.TemplateSuport;
            string body = crearBodyEmail(urlTemplate, templateParams);

            if (tipusContacte == 0) // Suport
                EnviarEmailHtmlFormatejat(titol, body, ObtenirUsuariCompteCorreu(TipusCompteCorreu.Suport), TipusCompteCorreu.Suport);
            else
                EnviarEmailHtmlFormatejat(titol, body, ObtenirUsuariCompteCorreu(TipusCompteCorreu.Suport), TipusCompteCorreu.Suport);

        }

        /// <summary>
        ///  Enviar confirmació del Email per saber si es el seu correo o no
        /// </summary>
        /// <param name="to">email de l'usuari</param>
        /// <param name="urlBase">URL del link per validar el correu</param>
        /// <param name="token"> Token generat per pel sistema se seguretat </param>
        /// <param name="usuari"> Email del usuari que vol confirmar el correu</param>
        public void EnviarConfirmacioEmail(String to, String urlBase, String token, String usuari)

        {
            String titol = _localizer["ConfirmacioEmail"];
            String urlTemplate = _emailSettings.TemplateConfirmacio;
            Dictionary<String, String> templateParams = new Dictionary<String, String>();
            templateParams.Add("Url", urlBase + "/api/v2/usuaris/emailConfirmacio?token=" + token + "&usuari=" + usuari);
            templateParams.Add("message", _localizer["nota"]);
            string body = crearBodyEmail(urlTemplate, templateParams);
            EnviarEmailHtmlFormatejat(titol, body, to, TipusCompteCorreu.Suport);

        }
        /// <summary>
        /// Enviar el correo de confirmació per canviar la contrasenya sense usuari validad
        /// </summary>
        /// <param name="to"></param>
        /// <param name="urlBase"></param>
        /// <param name="token"></param>
        /// <param name="usuari"></param>
        public String EnviarOblidarContrasenya(String to, String urlBase, String token, String usuari)

        {

            String titol = _localizer["OblidarContrasenya"];
            String urlTemplate = _emailSettings.TemplateContrasenya;
            Dictionary<String, String> templateParams = new Dictionary<String, String>();
            templateParams.Add("Url", urlBase + "/email-flow/oblidarContrasenya.html?id=" + token + "&userName=" + usuari);
            templateParams.Add("message", _localizer["nota"]);
            templateParams.Add("email", usuari);
            string body = crearBodyEmail(urlTemplate, templateParams);
            EnviarEmailHtmlFormatejat(titol + " " + usuari, body, to, TipusCompteCorreu.Suport);
            return templateParams["Url"];
        }

        /// <summary>
        /// Enviar un correo amb un usuari de correu perquè no puguin respondre al correu
        /// </summary>
        /// <param name="titol"></param>
        /// <param name="cco"></param>
        /// <param name="urlTemplate"></param>
        /// <param name="templateParams"></param>
        public void EnviarEmailNoReply(String titol, String cco, String urlTemplate, Dictionary<String, String> templateParams)
        {
            string body = crearBodyEmail(urlTemplate, templateParams);
            EnviarEmailHtmlFormatejat(titol, body, null, cco, TipusCompteCorreu.Principal);

        }
        public String ObtenirUsuariCompteCorreu(TipusCompteCorreu tipus)
        {
            return (TipusCompteCorreu.Principal == tipus) ? _emailSettings.UsuariPrincipal :
                   _emailSettings.UsuariSupport;

        }
        public String ObtenirContrasenyaCompteCorreu(TipusCompteCorreu tipus)
        {
            return (TipusCompteCorreu.Principal == tipus) ?
                _emailSettings.ContrasenyaPrincipal :
                   _emailSettings.ContrasenyaSupport;

        }
        public void EnviarEmailHtmlTemplate(String titol, String to, String cco, String from, String urlTemplate, Dictionary<String, String> templateParams, String fileName, MemoryStream file, TipusCompteCorreu tipusCompte)

        {

            string body = crearBodyEmail(urlTemplate, templateParams);
            string user = ObtenirUsuariCompteCorreu(tipusCompte);
            string pass = ObtenirContrasenyaCompteCorreu(tipusCompte);
            EnviarEmailHtmlFormatejat(titol, body, to, cco, from, fileName, file, user, pass);


        }
        public void EnviarEmailExportacioCSV(string titol, string to, Dictionary<String, String> templateParams, MemoryStream file)
        {
            String urlExportacio = _emailSettings.TemplateExportacio;
            string body = crearBodyEmail(urlExportacio, templateParams);
            string user = ObtenirUsuariCompteCorreu(TipusCompteCorreu.Principal);
            string pass = ObtenirContrasenyaCompteCorreu(TipusCompteCorreu.Principal);
            EnviarEmailHtmlFormatejat(titol, body, to, null, null, "export.csv", file, user, pass);
        }
        private void EnviarEmailHtmlFormatejat(string assumpte, string body, string to, TipusCompteCorreu tipusCompte)
        {
            string user = ObtenirUsuariCompteCorreu(tipusCompte);
            string pass = ObtenirContrasenyaCompteCorreu(tipusCompte);

            EnviarEmailHtmlFormatejat(assumpte, body, to, null, null, null, null, user, pass);

        }
        private void EnviarEmailHtmlFormatejat(string assumpte, string body, string to, string cco, TipusCompteCorreu tipusCompte)
        {
            string user = ObtenirUsuariCompteCorreu(tipusCompte);
            string pass = ObtenirContrasenyaCompteCorreu(tipusCompte);
            EnviarEmailHtmlFormatejat(assumpte, body, to, cco, null, null, null, user, pass);

        }
        private void EnviarEmailHtmlFormatejat(string assumpte, string body, string to, string cco, string from, TipusCompteCorreu tipusCompte)
        {
            string user = ObtenirUsuariCompteCorreu(tipusCompte);
            string pass = ObtenirContrasenyaCompteCorreu(tipusCompte);
            EnviarEmailHtmlFormatejat(assumpte, body, to, cco, from, null, null, user, pass);

        }
        private void EnviarEmailHtmlFormatejat(string assumpte, string body, string to, string cco, string from, string fileName, MemoryStream file, String userCredencials, String password)

        {
            if (!String.IsNullOrEmpty(to) && (to.StartsWith("test.") || to.StartsWith("test_")))
            {
                LogWarning("Compte a enviar el correu bloquejada per ser de test " + to);
                return;
            }

            if (!_emailSettings.MailingEnable)
            {
                LogWarning("El enviament del correu bloquejat, activi MailingEnable en la configuració del servidor");
                return;
            }

            if (!String.IsNullOrEmpty(_emailSettings.MailingTest))
            {
                to = String.IsNullOrEmpty(to) ? null : _emailSettings.MailingTest;
                cco = String.IsNullOrEmpty(cco) ? null : _emailSettings.MailingTest;
            }
            using (MailMessage mailMessage = new MailMessage())

            {

                mailMessage.From = (from == null) ? new MailAddress(_emailSettings.From) : new MailAddress(from);

                mailMessage.Subject = assumpte;

                mailMessage.Body = body;

                mailMessage.IsBodyHtml = true;
                if (to != null && to.Length > 0)
                    foreach (string to1 in to.Split(','))
                    {
                        mailMessage.To.Add(new MailAddress(to1));
                    }

                if (cco != null && cco.Length > 0)
                    foreach (string cco1 in cco.Split(','))
                    {
                        mailMessage.Bcc.Add(new MailAddress(cco1));
                    }


                if (file != null)
                {
                    file.Position = 0;
                    System.Net.Mime.ContentType ct = new System.Net.Mime.ContentType(System.Net.Mime.MediaTypeNames.Text.Plain);
                    Attachment attachment = new Attachment(file, ct);
                    attachment.ContentDisposition.FileName = fileName;
                    mailMessage.Attachments.Add(attachment);
                }

                SmtpClient smtp = new SmtpClient();

                smtp.Timeout = 20000;

                smtp.Host = _emailSettings.Server;

                smtp.EnableSsl = _emailSettings.SSL;

                System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential();

                NetworkCred.UserName = userCredencials;

                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                NetworkCred.Password = password;

                //smtp.UseDefaultCredentials = true;
                smtp.UseDefaultCredentials = false;

                smtp.Credentials = NetworkCred;

                smtp.Port = _emailSettings.Port;
                System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate (object s,
                        System.Security.Cryptography.X509Certificates.X509Certificate certificate,
                        System.Security.Cryptography.X509Certificates.X509Chain chain,
                        System.Net.Security.SslPolicyErrors sslPolicyErrors)
                {
                    return true;
                };

                smtp.Send(mailMessage);

            }

        }
        private String crearBodyEmail(String templateUrl, Dictionary<String, String> paramList)

        {
            String body = String.Empty;
            //using streamreader for reading my htmltemplate   

            using (StreamReader reader = new StreamReader(templateUrl))
            {
                body = reader.ReadToEnd();

            }
            foreach (String item in paramList.Keys)
                body = body.Replace("{" + item + "}", paramList[item]);

            return body;

        }
        public void EnviarEmailBenvinguda(string cco, Dictionary<string, string> templateParams)
        {
            EnviarEmailNoReply(" Benvingut/@ a la Colla", cco, _emailSettings.TemplateBenvinguda, templateParams);

        }
        public void EnviarEmailNotificacioAlbums(string cco, Dictionary<string, string> templateParams)
        {
            EnviarEmailNoReply(" Notificació Albums ", cco, _emailSettings.TemplateAlbums, templateParams);

        }
        public void EnviarEmailNotificacioNoticies(string cco, Dictionary<string, string> templateParams)
        {
            EnviarEmailNoReply(" Notificació Notícies ", cco, _emailSettings.TemplateNoticies, templateParams);

        }
        public void EnviarEmailConvocatoria(string cco, Dictionary<string, string> templateParams)
        {
            EnviarEmailNoReply("Avís Assistència", cco, _emailSettings.TemplateConvocatoria, templateParams);
        }
        public void EnviarEmailCastellers(String cco, Dictionary<String, String> templateParams, MemoryStream file)
        {
            string body = crearBodyEmail(_emailSettings.TemplateExportacio, templateParams);
            string user = ObtenirUsuariCompteCorreu(TipusCompteCorreu.Principal);
            string pass = ObtenirContrasenyaCompteCorreu(TipusCompteCorreu.Principal);
            EnviarEmailHtmlFormatejat("Exportació " + "Exportació Castellers ", body, null, cco, user, "casteller.csv", file, user, pass);
        }
    }
}
