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
    public enum Accio { Esborrar, Agregar, Modificar, Consultar , Activar, Desactivar}



    public interface IAuditoriaService
    {
       
        public void RegistraAccio <T>(Accio accio, int idObject, IPrincipal principal = null);
        public void RegistraAccio<T>(Accio accio, int idObject,String descripcio, IPrincipal principal = null);
        public void RegistraEnviarCorreu(String email,String tipusEmail, IPrincipal principal = null); 
        public LogJobs RegistraExecIniProces<T>();
        public void RegistraExecFinProces(LogJobs log);


    }
    /// <summary>
    /// Servei d'usuari 
    /// </summary>
    public class AuditoriaService : BaseService<AuditoriaService>, IAuditoriaService
    {
        private readonly AppinyaDbContext _appinyaDbContext;
        public AuditoriaService(
            AppinyaDbContext appinyaDbContext,
            ILogger<AuditoriaService> logger,
            IStringLocalizer<AuditoriaService> localizer
            ) : base(localizer, logger)
        {
            _appinyaDbContext = appinyaDbContext;
        }
        public void RegistraAccio<T>(Accio accio,  int idObject, IPrincipal principal = null)
        {

            RegistraAccio < T > (accio, idObject, null, principal);


        }
        public void RegistraEnviarCorreu(String email, String tipusEmail, IPrincipal principal = null)
        {
            Log log = new Log()
            {
                Accio = "EnviarCorreu",
                Objecte = tipusEmail, 
                Descripcio = email,
                Usuari = (principal == null) ? null : principal.Identity.Name
            };
            _appinyaDbContext.Log.Add(log);

            _appinyaDbContext.SaveChanges();
        }
        public void RegistraAccio<T>(Accio accio, int idObject, String descripcio, IPrincipal principal = null)
        {
            Log log = new Log()
            {
                Accio = accio.ToString(),
                Objecte = typeof(T).Name,
                ObjecteId = idObject,
                Descripcio = descripcio,
                Usuari = (principal == null) ? null : principal.Identity.Name
            };
            _appinyaDbContext.Log.Add(log);

            _appinyaDbContext.SaveChanges();
        }

        public  LogJobs  RegistraExecIniProces<T>()
        {
            LogJobs log = new LogJobs()
            {
                DataInici = DateTime.Now,
                Descripcio = typeof(T).Name,
                Finalitzat = false,
                DataFi = null,
                Error = null
               
            };
             _appinyaDbContext.LogJobs.Add(log);

            _appinyaDbContext.SaveChanges();
            return log;
        }

        public void RegistraExecFinProces (LogJobs log)
        {
            log.DataFi = DateTime.Now;
            log.Finalitzat = true;
            _appinyaDbContext.SaveChangesAsync(); ; 
        }
    }



}
