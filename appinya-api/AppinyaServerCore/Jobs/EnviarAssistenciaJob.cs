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

namespace AppinyaServerCore.Jobs
{
    public class EnviarAssistenciaJob : IHostedService, IDisposable
    {
         
        private readonly ILogger<EnviarAssistenciaJob> _logger;
        private readonly IAuditoriaService _auditoriaService;
        private readonly IAssistenciaService _assistenciaService; 
        private Timer _timer;

        public EnviarAssistenciaJob(
            ILogger<EnviarAssistenciaJob> logger
            ,
            IAuditoriaService auditoriaService,
            IAssistenciaService assistenciaService)
        {
            _logger = logger;
            _auditoriaService = auditoriaService;
            _assistenciaService = assistenciaService;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("EnviarAssistenciaJob Encens");
            int calculo = 0;
            int iDia = (int) DateTime.Now.DayOfWeek;
            int hora = DateTime.Now.Hour;

            
            calculo = ((8 - iDia) % 7) * 24 + 9 - hora;

            _timer = new Timer(DoWork, null, TimeSpan.Zero,
                TimeSpan.FromSeconds(calculo));

            return Task.CompletedTask;
        }

        private async void DoWork(object state)
        {
           
            LogJobs log = _auditoriaService.RegistraExecIniProces<EnviarAssistenciaJob>();
            try {  
                _logger.LogInformation(
                    "EnviarAssistenciaJob ID : {Count}", log.Id);
               // await _assistenciaService.EnviarEmailRecordatori();
                _auditoriaService.RegistraExecFinProces(log);
            }catch(Exception ex)
            {
                _logger.LogError(ex,ex.Message);
                log.Error = ex.Message;
                _auditoriaService.RegistraExecFinProces(log); 
            }
            
            
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("EnviarAssistenciaJob Parat");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
