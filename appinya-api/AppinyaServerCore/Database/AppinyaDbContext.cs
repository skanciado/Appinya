using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using AppinyaServerCore.Database.Appinya;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Linq;
using System.ComponentModel.DataAnnotations.Schema; 
using Microsoft.Data.SqlClient;
namespace AppinyaServerCore.Database
{
    public partial class AppinyaDbContext : DbContext
    {
        public AppinyaDbContext()
        {
        }

        public AppinyaDbContext(DbContextOptions<AppinyaDbContext> options)
            : base(options)
        {
        }

        /************************************************************************
         *           Personalizacion
         * using System.Linq; 
         ************************************************************************/
        public virtual DbSet<fFotoLikes_Result> fFotoLikes { get; set; }

        public async Task<List<fFotoLikes_Result>> ObtenirFotosLike(int? idCasteller, int idTemporada)
        {


            try
            {
                return await fFotoLikes.FromSqlRaw("SELECT * FROM [dbo].[fncFotoLikes] ({0},{1}) ", idCasteller, idTemporada).ToListAsync().ConfigureAwait(false);
            }
            catch (Exception)
            {
                throw;
            }

        }
        public virtual DbSet<fEstadisticaIndividual_Result> fEstadisticaIndividual { get; set; }

        public async Task<List<fEstadisticaIndividual_Result>> ObtenirEsdevenimentIndividual(int? idCasteller, int idTemporada, bool rolcasteller, bool rolmusic)
        {


            try
            {
                return await fEstadisticaIndividual.FromSqlRaw("SELECT * FROM [dbo].[fncEstadisticaIndividual] ({0},{1},{2},{3}) ", idCasteller, idTemporada, (rolcasteller) ? 1 : 0, (rolmusic) ? 1 : 0).ToListAsync().ConfigureAwait(false);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public virtual DbSet<fEsdeveniments_Result> fEsdeveniments { get; set; }

        public async Task<List<fEsdeveniments_Result>> ObtenirEsdevenimentActuals(int? idCasteller, String text, int idTemporada, int numreg)
        {
            try
            {
                return await fEsdeveniments.FromSqlRaw("SELECT * FROM [dbo].[fEsdevenimentsActuals] ({0},{1},{2}) ", idCasteller, text, idTemporada
                        ).Skip(numreg).Take(30).ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<fEsdeveniments_Result>> ObtenirEsdevenimentDetall(int? idCasteller, int idTemporada, DateTime? dataActualitzacio)
        {
            try
            {
                if (!dataActualitzacio.HasValue)
                    return await fEsdeveniments.FromSqlRaw("SELECT * FROM [dbo].[fEsdeveniments] ({0},{1},{2}) ", idCasteller, idTemporada, DBNull.Value
                        ).ToListAsync().ConfigureAwait(false);
                else
                    return await fEsdeveniments.FromSqlRaw("SELECT * FROM [dbo].[fEsdeveniments] ({0},{1},{2}) ", idCasteller, idTemporada, dataActualitzacio.Value
                    ).ToListAsync().ConfigureAwait(false);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<fEsdeveniments_Result>> ObtenirEsdevenimentHistoric(int? idCasteller, String text, int idTemporada, int numreg)
        {
            try
            {
                return await fEsdeveniments.FromSqlRaw("SELECT * FROM [dbo].[fEsdevenimentsHistoric] ({0},{1},{2}) ", idCasteller, text, idTemporada
                        ).Skip(numreg).Take(30).ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }


        public virtual DbSet<AccioLog> AccioLog { get; set; }
        public virtual DbSet<Actualitzacions> Actualitzacions { get; set; }
        public virtual DbSet<Assistencia> Assistencia { get; set; }
        public virtual DbSet<Casteller> Casteller { get; set; }
        public virtual DbSet<CastellerDelega> CastellerDelega { get; set; }
        public virtual DbSet<CastellerImatge> CastellerImatge { get; set; }
        public virtual DbSet<CastellerOrganitzacio> CastellerOrganitzacio { get; set; }
        public virtual DbSet<CastellerPosicio> CastellerPosicio { get; set; }
        public virtual DbSet<Convocatoria> Convocatoria { get; set; }
        public virtual DbSet<DadesTecniques> DadesTecniques { get; set; }
        public virtual DbSet<Deutes> Deutes { get; set; }
        public virtual DbSet<Equips> Equips { get; set; }
        public virtual DbSet<Esdeveniment> Esdeveniment { get; set; }
        public virtual DbSet<EsdevenimentCastells> EsdevenimentCastells { get; set; }
        public virtual DbSet<EsdevenimentLog> EsdevenimentLog { get; set; }
        public virtual DbSet<EsdevenimentPregunta> EsdevenimentPregunta { get; set; }
        public virtual DbSet<EsdevenimentValoracio> EsdevenimentValoracio { get; set; }
        public virtual DbSet<ExcelColla> ExcelColla { get; set; }
        public virtual DbSet<Fotos> Fotos { get; set; }
        public virtual DbSet<FotosImatge> FotosImatge { get; set; }
        public virtual DbSet<FotosLike> FotosLike { get; set; }
        public virtual DbSet<Log> Log { get; set; }
        public virtual DbSet<LogJobs> LogJobs { get; set; }
        public virtual DbSet<MigrationHistory> MigrationHistory { get; set; }
        public virtual DbSet<Municipi> Municipi { get; set; }
        public virtual DbSet<Noticies> Noticies { get; set; }
        public virtual DbSet<Organitzacio> Organitzacio { get; set; }
        public virtual DbSet<Posicio> Posicio { get; set; }
        public virtual DbSet<Provincia> Provincia { get; set; }
        public virtual DbSet<ResponsableLegal> ResponsableLegal { get; set; }
        public virtual DbSet<Temporada> Temporada { get; set; }
        public virtual DbSet<TipusCastells> TipusCastells { get; set; }
        public virtual DbSet<TipusDocument> TipusDocument { get; set; }
        public virtual DbSet<TipusEsdeveniment> TipusEsdeveniment { get; set; }
        public virtual DbSet<TipusEstatCastell> TipusEstatCastell { get; set; }
        public virtual DbSet<TipusNoticies> TipusNoticies { get; set; }
        public virtual DbSet<TipusPregunta> TipusPregunta { get; set; }
        public virtual DbSet<TipusResponsable> TipusResponsable { get; set; }
        public virtual DbSet<Versions> Versions { get; set; }
        public virtual DbSet<VwEstadisticaGlobal> VwEstadisticaGlobal { get; set; }
        public virtual DbSet<VwEstadisticaIndividual> VwEstadisticaIndividual { get; set; }
        public virtual DbSet<VwEstadisticaXdia> VwEstadisticaXdia { get; set; }
        public virtual DbSet<VwEstadisticaXsetmana> VwEstadisticaXsetmana { get; set; }
        public virtual DbSet<VwFotosLike> VwFotosLike { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            { 
               optionsBuilder.UseSqlServer("Server=(local);Initial Catalog=appinyadb;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AccioLog>(entity =>
            {
                entity.Property(e => e.IdAccio).ValueGeneratedNever();

                entity.Property(e => e.Descripcio).IsUnicode(false);
            });

            modelBuilder.Entity<Actualitzacions>(entity =>
            {
                entity.Property(e => e.IdTabla).IsUnicode(false);

                entity.Property(e => e.DataModificacio).HasDefaultValueSql("(getdate())");
            });

            modelBuilder.Entity<Assistencia>(entity =>
            {
                entity.HasKey(e => new { e.IdCasteller, e.IdEsdeveniment })
                    .HasName("PK_ASSISTENCIA_1");

                entity.Property(e => e.DataAssistencia).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DataCreacio).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DataModifi).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IndEsborrat).HasDefaultValueSql("((1))");

                entity.Property(e => e.Observacions).IsUnicode(false);

                entity.HasOne(d => d.IdCastellerNavigation)
                    .WithMany(p => p.AssistenciaIdCastellerNavigation)
                    .HasForeignKey(d => d.IdCasteller)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ASSISTENCIA_CASTELLER");

                entity.HasOne(d => d.IdEsdevenimentNavigation)
                    .WithMany(p => p.Assistencia)
                    .HasForeignKey(d => d.IdEsdeveniment)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ASSISTENCIA_ESDEVENIMENT");

                entity.HasOne(d => d.IdUsuariCreadorNavigation)
                    .WithMany(p => p.AssistenciaIdUsuariCreadorNavigation)
                    .HasForeignKey(d => d.IdUsuariCreador)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ASSISTENCIA_USUARI_CREADOR");

                entity.HasOne(d => d.IdUsuariModifiNavigation)
                    .WithMany(p => p.AssistenciaIdUsuariModifiNavigation)
                    .HasForeignKey(d => d.IdUsuariModifi)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ASSISTENCIA_USUARI_MODIF");
            });

            modelBuilder.Entity<Casteller>(entity =>
            {
                entity.HasIndex(e => e.Email)
                    .HasName("IX_CASTELLER");

                entity.HasIndex(e => e.UserId)
                    .HasName("UIX_CASTELLER_USERID")
                    .IsUnique()
                    .HasFilter("([USER_ID] IS NOT NULL)");

                entity.Property(e => e.Alias).IsUnicode(false);

                entity.Property(e => e.Cognoms).IsUnicode(false);

                entity.Property(e => e.DataCreacio).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DataModificacio).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DocumentId).IsUnicode(false);

                entity.Property(e => e.Habitual).HasDefaultValueSql("((1))");

                entity.Property(e => e.Nom).IsUnicode(false);

                entity.Property(e => e.Observacions).IsUnicode(false);

                entity.Property(e => e.Telefon1).IsUnicode(false);

                entity.Property(e => e.Telefon2).IsUnicode(false);

                entity.Property(e => e.Twitter).IsUnicode(false);

                entity.HasOne(d => d.IdMunicipiNavigation)
                    .WithMany(p => p.Casteller)
                    .HasForeignKey(d => d.IdMunicipi)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__CASTELLER__ID_MU__66603565");

                entity.HasOne(d => d.TipusDocumentNavigation)
                    .WithMany(p => p.Casteller)
                    .HasForeignKey(d => d.TipusDocument)
                    .HasConstraintName("FK_TIPUS_DOC");
            });

            modelBuilder.Entity<CastellerDelega>(entity =>
            {
                entity.HasKey(e => new { e.IdCasteller1, e.IdCasteller2 });

                entity.Property(e => e.DataAlta).HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.IdCasteller1Navigation)
                    .WithMany(p => p.CastellerDelegaIdCasteller1Navigation)
                    .HasForeignKey(d => d.IdCasteller1)
                    .HasConstraintName("FK_CASTELLER_DELEGA_CASTELLER");

                entity.HasOne(d => d.IdCasteller2Navigation)
                    .WithMany(p => p.CastellerDelegaIdCasteller2Navigation)
                    .HasForeignKey(d => d.IdCasteller2)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CASTELLER_DELEGA_CASTELLER1");
            });

            modelBuilder.Entity<CastellerImatge>(entity =>
            {
                entity.Property(e => e.IdCasteller).ValueGeneratedNever();
            });

            modelBuilder.Entity<CastellerOrganitzacio>(entity =>
            {
                entity.HasKey(e => new { e.IdCasteller, e.IdCarrec });

                entity.HasOne(d => d.IdCarrecNavigation)
                    .WithMany(p => p.CastellerOrganitzacio)
                    .HasForeignKey(d => d.IdCarrec)
                    .HasConstraintName("FK_CASTE_ORGAN_CARREC");

                entity.HasOne(d => d.IdCastellerNavigation)
                    .WithMany(p => p.CastellerOrganitzacio)
                    .HasForeignKey(d => d.IdCasteller)
                    .HasConstraintName("FK_CASTE_ORGAN_CASTEL");
            });

            modelBuilder.Entity<CastellerPosicio>(entity =>
            {
                entity.HasKey(e => new { e.IdCasteller, e.IdPosicio });

                entity.HasOne(d => d.IdCastellerNavigation)
                    .WithMany(p => p.CastellerPosicio)
                    .HasForeignKey(d => d.IdCasteller)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CASTELLER_POSICIO_CASTELLER");

                entity.HasOne(d => d.IdPosicioNavigation)
                    .WithMany(p => p.CastellerPosicio)
                    .HasForeignKey(d => d.IdPosicio)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CASTELLER_POSICIO_POSICIO");
            });

            modelBuilder.Entity<Convocatoria>(entity =>
            {
                entity.Property(e => e.IdConvocatoria).ValueGeneratedNever();

                entity.HasOne(d => d.IdCastellerNavigation)
                    .WithMany(p => p.Convocatoria)
                    .HasForeignKey(d => d.IdCasteller)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_CONVOCATORIA_CASTELLER");
            });

            modelBuilder.Entity<DadesTecniques>(entity =>
            {
                entity.HasKey(e => e.IdCasteller)
                    .HasName("PK__DADES_TE__1D407B195F23B1C8");

                entity.Property(e => e.IdCasteller).ValueGeneratedNever();

                entity.Property(e => e.Observacions).IsUnicode(false);

                entity.HasOne(d => d.IdCastellerNavigation)
                    .WithOne(p => p.DadesTecniques)
                    .HasForeignKey<DadesTecniques>(d => d.IdCasteller)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DADES_TEC_CASTELLER");
            });

            modelBuilder.Entity<Deutes>(entity =>
            {
                entity.Property(e => e.Concepte).IsUnicode(false);

                entity.Property(e => e.Data).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Observacions).IsUnicode(false);

                entity.HasOne(d => d.IdCastellerNavigation)
                    .WithMany(p => p.Deutes)
                    .HasForeignKey(d => d.IdCasteller)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DEUTE_CASTELLER");
            });

            modelBuilder.Entity<Equips>(entity =>
            {
                entity.HasKey(e => e.IdEquip)
                    .HasName("PK_EQUIP");

                entity.Property(e => e.DataCreacio).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DataModific).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.EmailContacte).IsUnicode(false);

                entity.Property(e => e.Nom).IsUnicode(false);
            });

            modelBuilder.Entity<Esdeveniment>(entity =>
            {
                entity.Property(e => e.Activa).HasDefaultValueSql("((1))");

                entity.Property(e => e.DataCreacio).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DataModificacio).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Direccio).IsUnicode(false);

                entity.Property(e => e.IdTemporada).HasDefaultValueSql("((1))");

                entity.Property(e => e.Imatge).IsUnicode(false);

                entity.Property(e => e.ImatgeMini).IsUnicode(false);

                entity.Property(e => e.Titol).IsUnicode(false);

                entity.HasOne(d => d.IdTemporadaNavigation)
                    .WithMany(p => p.Esdeveniment)
                    .HasForeignKey(d => d.IdTemporada)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TEMPORADA_esdeveniment");

                entity.HasOne(d => d.IdTipusNavigation)
                    .WithMany(p => p.Esdeveniment)
                    .HasForeignKey(d => d.IdTipus)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDEVENIMENT_TIPUS");

                entity.HasOne(d => d.IdUsuariCreadorNavigation)
                    .WithMany(p => p.EsdevenimentIdUsuariCreadorNavigation)
                    .HasForeignKey(d => d.IdUsuariCreador)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDEVEN_USUARI_CREADOR");

                entity.HasOne(d => d.IdUsuariModifiNavigation)
                    .WithMany(p => p.EsdevenimentIdUsuariModifiNavigation)
                    .HasForeignKey(d => d.IdUsuariModifi)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDEVEN_USUARI_MODIFI");
            });

            modelBuilder.Entity<EsdevenimentCastells>(entity =>
            {
                entity.Property(e => e.DataMod).HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.IdCastellNavigation)
                    .WithMany(p => p.EsdevenimentCastells)
                    .HasForeignKey(d => d.IdCastell)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDEVENIMENT_CASTELL");

                entity.HasOne(d => d.IdEsdevenimentNavigation)
                    .WithMany(p => p.EsdevenimentCastells)
                    .HasForeignKey(d => d.IdEsdeveniment)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDEVENIMENT_ESDEVEN");

                entity.HasOne(d => d.IdEstatCastellNavigation)
                    .WithMany(p => p.EsdevenimentCastells)
                    .HasForeignKey(d => d.IdEstatCastell)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDEVENIMENT_ESTAT");
            });

            modelBuilder.Entity<EsdevenimentLog>(entity =>
            {
                entity.Property(e => e.Data).HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.IdAccioNavigation)
                    .WithMany(p => p.EsdevenimentLog)
                    .HasForeignKey(d => d.IdAccio)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDE_LOG_ACC");

                entity.HasOne(d => d.IdCastellerNavigation)
                    .WithMany(p => p.EsdevenimentLog)
                    .HasForeignKey(d => d.IdCasteller)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDE_LOG_CAST");

                entity.HasOne(d => d.IdEsdevenimentNavigation)
                    .WithMany(p => p.EsdevenimentLog)
                    .HasForeignKey(d => d.IdEsdeveniment)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDE_LOG_ESDE");
            });

            modelBuilder.Entity<EsdevenimentPregunta>(entity =>
            {
                entity.HasOne(d => d.IdEsdevenimentNavigation)
                    .WithMany(p => p.EsdevenimentPregunta)
                    .HasForeignKey(d => d.IdEsdeveniment)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDEVENIMENT_P_ESDEVEN");

                entity.HasOne(d => d.TipusPreguntaNavigation)
                    .WithMany(p => p.EsdevenimentPregunta)
                    .HasForeignKey(d => d.TipusPregunta)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDEVENIMENT_PREGUNTA");
            });

            modelBuilder.Entity<EsdevenimentValoracio>(entity =>
            {
                entity.HasKey(e => new { e.IdCasteller, e.IdEsdeveniment });

                entity.HasOne(d => d.IdCastellerNavigation)
                    .WithMany(p => p.EsdevenimentValoracio)
                    .HasForeignKey(d => d.IdCasteller)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDEVENIMENT_VALORACIO");

                entity.HasOne(d => d.IdEsdevenimentNavigation)
                    .WithMany(p => p.EsdevenimentValoracio)
                    .HasForeignKey(d => d.IdEsdeveniment)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ESDEVENIMENT_V_ESDEVEN");
            });

            modelBuilder.Entity<ExcelColla>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<Fotos>(entity =>
            {
                entity.Property(e => e.Activa).HasDefaultValueSql("((1))");

                entity.Property(e => e.DataCreacio).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DataModificacio).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IdTemporada).HasDefaultValueSql("((1))");

                entity.HasOne(d => d.IdFotografNavigation)
                    .WithMany(p => p.FotosIdFotografNavigation)
                    .HasForeignKey(d => d.IdFotograf)
                    .HasConstraintName("FK_FOTOS_CASTELLER");

                entity.HasOne(d => d.IdTemporadaNavigation)
                    .WithMany(p => p.Fotos)
                    .HasForeignKey(d => d.IdTemporada)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TEMPORADA_Fotos");

                entity.HasOne(d => d.IdUsuariCreadorNavigation)
                    .WithMany(p => p.FotosIdUsuariCreadorNavigation)
                    .HasForeignKey(d => d.IdUsuariCreador)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FOTOS_USU_CREACIO");

                entity.HasOne(d => d.IdUsuariModificaNavigation)
                    .WithMany(p => p.FotosIdUsuariModificaNavigation)
                    .HasForeignKey(d => d.IdUsuariModifica)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FOTOS_USU_MODIFICA");
            });

            modelBuilder.Entity<FotosImatge>(entity =>
            {
                entity.HasKey(e => e.IdFotos)
                    .HasName("PK_FOTOS_IMATGES");

                entity.Property(e => e.IdFotos).ValueGeneratedNever();
            });

            modelBuilder.Entity<FotosLike>(entity =>
            {
                entity.HasKey(e => new { e.IdFotos, e.IdCasteller })
                    .HasName("PK__FOTOS_LI__B3132C38346284ED");

                entity.Property(e => e.DataModificacio).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Like).HasDefaultValueSql("((1))");

                entity.HasOne(d => d.IdCastellerNavigation)
                    .WithMany(p => p.FotosLike)
                    .HasForeignKey(d => d.IdCasteller)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FOTOS_LIKE_CASTELLER");

                entity.HasOne(d => d.IdFotosNavigation)
                    .WithMany(p => p.FotosLike)
                    .HasForeignKey(d => d.IdFotos)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FOTOS_LIKE_FOTOS");
            });

            modelBuilder.Entity<Log>(entity =>
            {
                entity.Property(e => e.Accio).IsUnicode(false);

                entity.Property(e => e.Data).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Descripcio).IsUnicode(false);

                entity.Property(e => e.Objecte).IsUnicode(false);

                entity.Property(e => e.Usuari).IsUnicode(false);
            });

            modelBuilder.Entity<LogJobs>(entity =>
            {
                entity.Property(e => e.Descripcio).IsUnicode(false);

                entity.Property(e => e.Error).IsUnicode(false);
            });

            modelBuilder.Entity<MigrationHistory>(entity =>
            {
                entity.HasKey(e => new { e.MigrationId, e.ContextKey })
                    .HasName("PK_dbo.__MigrationHistory");
            });

            modelBuilder.Entity<Municipi>(entity =>
            {
                entity.HasKey(e => e.IdMunicipi)
                    .HasName("PK_MUNICIPIO");

                entity.HasOne(d => d.IdProvinciaNavigation)
                    .WithMany(p => p.Municipi)
                    .HasForeignKey(d => d.IdProvincia)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MUNICIPI_PROVINCIA");
            });

            modelBuilder.Entity<Noticies>(entity =>
            {
                entity.Property(e => e.Activa).HasDefaultValueSql("((1))");

                entity.Property(e => e.DataCreacio).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DataModificacio).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IdTipusNoticies).HasDefaultValueSql("((1))");

                entity.HasOne(d => d.IdCastellerNavigation)
                    .WithMany(p => p.NoticiesIdCastellerNavigation)
                    .HasForeignKey(d => d.IdCasteller)
                    .HasConstraintName("FK_NOTICIES_CASTELLER");

                entity.HasOne(d => d.IdTipusNoticiesNavigation)
                    .WithMany(p => p.Noticies)
                    .HasForeignKey(d => d.IdTipusNoticies)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TIPUS_NOT");

                entity.HasOne(d => d.IdUsuariCreadorNavigation)
                    .WithMany(p => p.NoticiesIdUsuariCreadorNavigation)
                    .HasForeignKey(d => d.IdUsuariCreador)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_USU_CREACIO");

                entity.HasOne(d => d.IdUsuariModificaNavigation)
                    .WithMany(p => p.NoticiesIdUsuariModificaNavigation)
                    .HasForeignKey(d => d.IdUsuariModifica)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_USU_MODIFICA");
            });

            modelBuilder.Entity<Organitzacio>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Descripcio).IsUnicode(false);

                entity.HasOne(d => d.IdPareNavigation)
                    .WithMany(p => p.InverseIdPareNavigation)
                    .HasForeignKey(d => d.IdPare)
                    .HasConstraintName("FK_ORGAN_ORGAN");
            });

            modelBuilder.Entity<Posicio>(entity =>
            {
                entity.HasKey(e => e.IdPosicio)
                    .HasName("PK__POSICIO__7A8AFB29C3FE8484");

                entity.Property(e => e.IdPosicio).ValueGeneratedNever();

                entity.Property(e => e.Descripcio).IsUnicode(false);

                entity.Property(e => e.Icona).IsUnicode(false);
            });

            modelBuilder.Entity<ResponsableLegal>(entity =>
            {
                entity.HasKey(e => new { e.IdCasteller, e.IdTipusResponsable });

                entity.Property(e => e.Cognoms).IsUnicode(false);

                entity.Property(e => e.Nom).IsUnicode(false);

                entity.Property(e => e.Telefon1).IsUnicode(false);

                entity.Property(e => e.Telefon2).IsUnicode(false);

                entity.HasOne(d => d.IdCastellerNavigation)
                    .WithMany(p => p.ResponsableLegal)
                    .HasForeignKey(d => d.IdCasteller)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RESPONSABLE_LEGAL_CASTELLER");

                entity.HasOne(d => d.IdTipusResponsableNavigation)
                    .WithMany(p => p.ResponsableLegal)
                    .HasForeignKey(d => d.IdTipusResponsable)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RESPONSABLE_LEGAL_TIPUS");
            });

            modelBuilder.Entity<TipusCastells>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Castell).IsUnicode(false);

                entity.Property(e => e.Prova).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<TipusDocument>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Document).IsUnicode(false);
            });

            modelBuilder.Entity<TipusEsdeveniment>(entity =>
            {
                entity.Property(e => e.IdTipusEsdeveniment).ValueGeneratedNever();

                entity.Property(e => e.File).IsUnicode(false);

                entity.Property(e => e.Icona).IsUnicode(false);

                entity.Property(e => e.Titol).IsUnicode(false);
            });

            modelBuilder.Entity<TipusEstatCastell>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Estat).IsUnicode(false);
            });

            modelBuilder.Entity<TipusNoticies>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Descripcio).IsUnicode(false);

                entity.Property(e => e.Icona).IsUnicode(false);
            });

            modelBuilder.Entity<TipusPregunta>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Descripcio).IsUnicode(false);
            });

            modelBuilder.Entity<TipusResponsable>(entity =>
            {
                entity.HasKey(e => e.IdTipusResponsable)
                    .HasName("PK__TIPUS_RE__6F15F4E1AEF46A20");

                entity.Property(e => e.IdTipusResponsable).ValueGeneratedNever();

                entity.Property(e => e.Descripcio).IsUnicode(false);
            });

            modelBuilder.Entity<Versions>(entity =>
            {
                entity.Property(e => e.IdVersio).ValueGeneratedNever();

                entity.Property(e => e.Descripcio).IsUnicode(false);

                entity.Property(e => e.Versio).IsUnicode(false);
            });

            modelBuilder.Entity<VwEstadisticaGlobal>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwEstadisticaGlobal");
            });

            modelBuilder.Entity<VwEstadisticaIndividual>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwEstadisticaIndividual");
            });

            modelBuilder.Entity<VwEstadisticaXdia>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwEstadisticaXDia");
            });

            modelBuilder.Entity<VwEstadisticaXsetmana>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwEstadisticaXSetmana");
            });

            modelBuilder.Entity<VwFotosLike>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwFotosLike");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
