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
using System.Threading;
using System.Threading.Tasks;

using AppinyaServerCore.Database;
using AppinyaServerCore.Services;

using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using Quartz;

namespace AppinyaServerCore.Jobs
{
    public class EnviarAssistenciaJob : IJob
    {

        private readonly ILogger<EnviarAssistenciaJob> _logger;
        private readonly IAuditoriaService _auditoriaService;
        private readonly IAssistenciaService _assistenciaService;  
        public EnviarAssistenciaJob(
           ILogger<EnviarAssistenciaJob> logger,
            IAuditoriaService auditoriaService,
            IAssistenciaService assistenciaService
            )
        {
            _logger = logger;
            _auditoriaService = auditoriaService;
            _assistenciaService = assistenciaService;

        }
        public Task Execute(IJobExecutionContext context)
        {
            LogJobs log = _auditoriaService.RegistraExecIniProces<EnviarAssistenciaJob>();
            try
            {
                _logger.LogInformation("EnviarAssistenciaJob Encens");
                _assistenciaService.EnviarEmailRecordatori(); 
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                log.Error = ex.Message;
                _auditoriaService.RegistraExecFinProces(log);
                return Task.FromResult(false);
            }
            finally
            {
                _logger.LogInformation("EnviarAssistenciaJob Apagat");
                _auditoriaService.RegistraExecFinProces(log);
            }
        }



    }

}
