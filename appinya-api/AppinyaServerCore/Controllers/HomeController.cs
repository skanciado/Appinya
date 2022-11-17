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
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Authorization; 
using AppinyaServerCore.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;  
using System; 
using Microsoft.Extensions.Options;
using AppinyaServerCore.Helpers;
using System.Linq;
using AppinyaServerCore.Services;
using Microsoft.Extensions.Localization; 
using System.Threading.Tasks;

namespace AppinyaServerCore.Controllers
{
    [ApiVersion("1.0")] 
    [Route("api/v{version:apiVersion}/[controller]")]
    public class HomeController : BaseController<ControlDeVersioController>
    {

        #region Variables privades
        private readonly AppSettings _appSettings;
        private readonly IEsdevenimentsService _esdevenimentsService;
        private readonly INoticiaService _noticieService;
        #endregion

        public HomeController(
         ILogger<ControlDeVersioController> logger,
         IOptions<AppSettings> appSettings,
         IEsdevenimentsService esdevenimentsService,
         INoticiaService noticieService,
         IStringLocalizer<ControlDeVersioController> localizer
         ) : base(localizer,logger)
        {
            if (appSettings == null) throw new ArgumentNullException(nameof(appSettings));
            _appSettings = appSettings.Value;
            _esdevenimentsService = esdevenimentsService;
            _noticieService = noticieService;
        } 
        [AllowAnonymous]
        [HttpGet]
        [Route("echo")]
        public String echo()
        {
            return "Echo:" + this.GetType();

        }
        [Authorize] 
        [HttpGet]
        [Route("resum")]
        public async Task<ResumHomeModel> Resum()
        {
            try
            {
                LogEntra();
                return new ResumHomeModel()
                {
                    Esdeveniments = await this._esdevenimentsService.ObtenirLlistaEsdevenimentsActuals(null,this.User),
                    Noticies = this._noticieService.ObtenirNoticies()
                };

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


    }

}
