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
using System.Threading.Tasks;
using AppinyaServerCore.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using AppinyaServerCore.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Text;
using Microsoft.AspNetCore.Localization;
using System.Globalization;
using AppinyaServerCore.Helpers;
using AppinyaServerCore.Database;
using AppinyaServerCore.Database.Identity;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using AppinyaServerCore.Utils;
using AppinyaServerCore.Jobs;

namespace AppinyaServerCore
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry();

            //Configurar el API Versioning
            //services.AddMvc().SetCompatibilityVersion(Microsoft.AspNetCore.Mvc.CompatibilityVersion.Version_2_2); 

            services.AddLocalization(options => options.ResourcesPath = "Resources");

            services.AddControllers().AddJsonOptions(options =>
            {
                // options.JsonSerializerOptions.Converters.Add(new StringConverter());
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
                //options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });
            // Versioning de las APIs
            services.AddApiVersioning(o =>
            {
                o.AssumeDefaultVersionWhenUnspecified = true;
                o.DefaultApiVersion = new Microsoft.AspNetCore.Mvc.ApiVersion(1, 0);
            });

            // Guarda la configuracio de la app
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.JwtKey);

            // Guarda la configuracio dels emails
            var emailSettings = Configuration.GetSection("EmailSettings");
            services.Configure<EmailSettings>(emailSettings);

            // Db Context Identity
            services.AddDbContext<IdentityDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("IdentityConnection")));

            // Identity Config
            services.AddIdentity<Usuari, IdentityRole>()
                .AddEntityFrameworkStores<IdentityDbContext>()
                .AddDefaultTokenProviders();

            // Db Context  Appinya
            services.AddDbContext<AppinyaDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // Opcions de seguretat
            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = false;
                options.Password.RequiredUniqueChars = 6;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;
                options.Lockout.AllowedForNewUsers = true;

                // User settings
                options.User.RequireUniqueEmail = true;


            });

            // Opcions de Autenificació per Token
            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                 .AddJwtBearer(configureOptions =>
                 {
                     configureOptions.RequireHttpsMetadata = false;
                     configureOptions.SaveToken = true;
                     configureOptions.TokenValidationParameters = new TokenValidationParameters
                     {
                         ValidateIssuerSigningKey = true,
                         IssuerSigningKey = new SymmetricSecurityKey(key),
                         ValidateIssuer = false,
                         ValidateAudience = false
                     };
                     configureOptions.Events = new JwtBearerEvents
                     {
                         OnAuthenticationFailed = context =>
                         {
                             if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                             {
                                 context.Response.Headers.Add("Token-Expired", "true");
                             }
                             return Task.CompletedTask;
                         }
                     };
                 });
            // Opcions per autenticar de Google 

            services.AddAuthentication().AddGoogle(options =>
            {
                options.ClientId = Configuration.GetSection("GoogleSettings").GetValue<string>("ClientId");
                options.ClientSecret = Configuration.GetSection("GoogleSettings").GetValue<string>("ClientSecret");
            });

            /**
              ATENCIO: Aqui van tots els serveis que es realitzin de la app
             */
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ITemporadaService, TemporadaService>();
            services.AddScoped<IAutentificacioService, AutentificacioService>();
            services.AddScoped<IUsuariService, UsuariService>();

            services.AddScoped<IEsdevenimentsService, EsdevenimentService>();
            services.AddScoped<ICastellerService, CastellerService>();
            services.AddScoped<IAssistenciaService, AssistenciaService>();
            services.AddScoped<IPaquetActualitacioService, PaquetActualitacioService>();
            services.AddScoped<IControlVersioService, ControlVersioService>();
            services.AddScoped<IAlbumService, AlbumService>();
            services.AddScoped<INoticiaService, NoticiaService>();
            services.AddScoped<ITipusBasicService, TipusBasicService>();
            services.AddScoped<IAuditoriaService, AuditoriaService>();
            services.AddScoped<IOrganitzacioService, OrganitzacioService>();
            //Jobs 
            //services.AddHostedService<HabitualJob>();
            // services.AddHostedService<EnviarAssistenciaJob>();
        }




        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
#pragma warning disable CA1822 // Marcar miembros como static
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
#pragma warning restore CA1822 // Marcar miembros como static
        {
            if (env == null) throw new ArgumentNullException(nameof(env));
            if (env.EnvironmentName.ToLower() == "development")
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            // Definir la pàgina inicial per defecte
            DefaultFilesOptions options = new DefaultFilesOptions();
            options.DefaultFileNames.Clear();
            options.DefaultFileNames.Add("index.html");
            app.UseDefaultFiles(options);

            // Definicio dels fitxers estatics
            app.UseStaticFiles();

            // Cultures acceptades 
            IList<CultureInfo> culturas = new List<CultureInfo>() {

                new CultureInfo("es"),
                new CultureInfo("es-ES"),
                new CultureInfo("ca")

            };
            //Localization
            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                // RequestCultureProviders = new List<IRequestCultureProvider> { new AcceptLanguageHeaderRequestCultureProvider() },
                DefaultRequestCulture = new RequestCulture("ca"),
                SupportedCultures = culturas,
                SupportedUICultures = culturas
            });

            /*Cors Configuracio Permet Tot*/
            app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseApiVersioning();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

    }

}
