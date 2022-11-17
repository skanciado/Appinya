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

namespace AppinyaServerCore.Services
{

    public interface IControlVersioService
    {
        ControlDeVersioModel ValidarVersio(Int32 versioDB, Int32 versioApp);
        ControlDeVersioModel ObtenirUltimaVersio();
    }

    public class ControlVersioService : AppinyaBaseService<ControlVersioService>, IControlVersioService
    {
        private DateTime DataActualitzacio = DateTime.Now;

        private AppinyaDbContext _appinyaDbContext;
        public ControlVersioService(
            AppinyaDbContext appinyaDbContext,
            IUsuariService usuariService,
            ILogger<ControlVersioService> logger,
            IStringLocalizer<ControlVersioService> localizer) : base(usuariService, localizer, logger)
        {
            _appinyaDbContext = appinyaDbContext;
        }

        /// <summary>
        /// Validar la version local del del dispositiu
        /// </summary>
        /// <param name="versioDB"></param>
        /// <param name="versioApp"></param>
        /// <returns></returns>
        public ControlDeVersioModel ValidarVersio(Int32 versioDB, Int32 versioApp)
        {
            DateTime wrk = DataActualitzacio.AddDays(1);
            LogInfo("Check Version: controldeversio/check/" + versioDB + " a app " + versioApp);


            //La versio pot ser versio Web , es a dir que no esta registrada Exemple "0"
            ControlDeVersioModel appVersion = _appinyaDbContext.Versions.Where(it => it.IndEsborrat == false && it.IdVersio == versioApp).Select(v => new ControlDeVersioModel
            {
                Descripcio = v.Versio + " " + v.Descripcio,
                EsUltimaVersio = v.Ultimaversio,
                RequereixRefresc = v.RefrescarModel,
                RequereixActualitzacio = v.ActualitzacioApp,
                Versio = "" + v.IdVersio,
                Id = v.IdVersio
            }).FirstOrDefault();

            //Versio DB
            ControlDeVersioModel dbVersion = _appinyaDbContext.Versions.Where(it => it.IndEsborrat == false && it.IdVersio == versioDB).Select(v => new ControlDeVersioModel
            {
                Descripcio = v.Versio + " " + v.Descripcio,
                EsUltimaVersio = v.Ultimaversio,
                RequereixRefresc = v.RefrescarModel,
                RequereixActualitzacio = false,
                Versio = "" + v.IdVersio,
                Id = v.IdVersio
            }).FirstOrDefault();
            // Ultima version
            ControlDeVersioModel ultimaVersio = _appinyaDbContext.Versions.Where(it => it.IndEsborrat == false && it.Ultimaversio == true).Select(v => new ControlDeVersioModel
            {
                Descripcio = v.Versio + " " + v.Descripcio,
                EsUltimaVersio = v.Ultimaversio,
                RequereixRefresc = true, // Forçarem el refresc, ja que te una versió no registrada
                RequereixActualitzacio = false, // Si no te versio registrada serem poc restrictius referent a l'actualitzacio per evitar errors en pujadas a produccio
                Versio = "" + v.IdVersio,
                Id = v.IdVersio
            }).FirstOrDefault();

            // Si els dos son nulls  donem una versió perque l'app s'apiga algu del servidor
            if (appVersion == null && dbVersion == null)
            {
                return ultimaVersio;
            }
            else if (dbVersion == null)
            {

                return appVersion;
            }
            else
            {
                int iversioDb = dbVersion.Id / 100;
                int iversioUltima = ultimaVersio.Id / 100;
                // Si els una versio igual 106XX i la ultima versio es superior
                if (iversioDb == iversioUltima && dbVersion.Id < ultimaVersio.Id)
                {
                    dbVersion.RequereixRefresc = appVersion.RequereixRefresc || dbVersion.RequereixRefresc;
                }
                else if (appVersion == null) // En el cas de ser WEB
                {
                    if (dbVersion.Id < ultimaVersio.Id) // si la versio DB es inferior
                    {
                        dbVersion.RequereixRefresc = true; // actualitzem
                        dbVersion.Id = ultimaVersio.Id; // Es version Web le ponemos siempre la misma que la ultima
                        dbVersion.Versio = ultimaVersio.Versio; // Es version Web le ponemos siempre la misma que la ultima 
                    }
                    else
                    {
                        dbVersion.RequereixRefresc = false;
                    }
                }
                else if (dbVersion.Id < appVersion.Id)
                {
                    dbVersion.Id = appVersion.Id; // Es version de la App
                    dbVersion.Versio = appVersion.Versio; // Es version de la App
                    dbVersion.RequereixRefresc = true;

                }

                if (appVersion == null)
                {
                    dbVersion.RequereixActualitzacio = false;
                }
                else
                {
                    dbVersion.RequereixActualitzacio = (appVersion.RequereixActualitzacio || dbVersion.RequereixActualitzacio);
                }
                //Mirarem la versio App si requereix una actualitzacio del marquet

                // Si la Versio App no existeix o 
                return dbVersion;
            }

        }  
        /// <summary>
        /// Obtenir ultima Versio 
        /// </summary>
        /// <returns></returns>
        public ControlDeVersioModel ObtenirUltimaVersio ()
        {
            DateTime wrk = DataActualitzacio.AddDays(1); 
            
            ControlDeVersioModel ultimaVersio = _appinyaDbContext.Versions.Where(it => it.IndEsborrat == false && it.Ultimaversio == true).Select(v => new ControlDeVersioModel
            {
                Descripcio = v.Versio + " " + v.Descripcio,
                EsUltimaVersio = v.Ultimaversio,
                RequereixRefresc = false,
                RequereixActualitzacio = false,
                Versio = "" + v.IdVersio,
                Id = v.IdVersio 
            }).FirstOrDefault();
            return ultimaVersio;
             
        }
    }
}
