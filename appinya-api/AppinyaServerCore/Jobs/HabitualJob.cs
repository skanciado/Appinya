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
    public class HabitualJob : IHostedService, IDisposable
    {
        private int executionCount = 0;
        private readonly ILogger<HabitualJob> _logger;
        private readonly IAuditoriaService _auditoriaService;
        private readonly IAssistenciaService _assistenciaService;
        private readonly int Frequencia = 24 * 3600;
        private Timer _timer;

        public HabitualJob(
            ILogger<HabitualJob> logger
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
            _logger.LogInformation("HabitualJob Encens");

            _timer = new Timer(DoWork, null, TimeSpan.Zero,
                TimeSpan.FromSeconds(Frequencia));

            return Task.CompletedTask;
        }

        private async void DoWork(object state)
        {

            LogJobs log = _auditoriaService.RegistraExecIniProces<HabitualJob>();
            try
            {
                _logger.LogInformation(
                    "HabitualJob ID : {Count}", log.Id);
                _assistenciaService.CalcularHabitualitat();
                _auditoriaService.RegistraExecFinProces(log);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                log.Error = ex.Message;
                _auditoriaService.RegistraExecFinProces(log);
            }


        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("HabitualJob Parat");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
