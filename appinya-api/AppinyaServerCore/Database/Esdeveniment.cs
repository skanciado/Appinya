using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("ESDEVENIMENT")]
    public partial class Esdeveniment
    {
        public Esdeveniment()
        {
            Assistencia = new HashSet<Assistencia>();
            EsdevenimentCastells = new HashSet<EsdevenimentCastells>();
            EsdevenimentLog = new HashSet<EsdevenimentLog>();
            EsdevenimentPregunta = new HashSet<EsdevenimentPregunta>();
            EsdevenimentValoracio = new HashSet<EsdevenimentValoracio>();
        }

        [Key]
        [Column("ID_ESDEVENIMENT")]
        public int IdEsdeveniment { get; set; }
        [Column("TITOL")]
        [StringLength(100)]
        public string Titol { get; set; }
        [Column("TEXT", TypeName = "ntext")]
        public string Text { get; set; }
        [Column("ID_TIPUS")]
        public int IdTipus { get; set; }
        [Column("DATA_INICI", TypeName = "datetime")]
        public DateTime DataInici { get; set; }
        [Column("DATA_FI", TypeName = "datetime")]
        public DateTime DataFi { get; set; }
        [Column("IMATGE")]
        [StringLength(250)]
        public string Imatge { get; set; }
        [Column("IMATGE_MINI")]
        [StringLength(250)]
        public string ImatgeMini { get; set; }
        [Column("ID_USUARI_CREADOR")]
        public int IdUsuariCreador { get; set; }
        [Column("LATITUD", TypeName = "numeric(18, 6)")]
        public decimal? Latitud { get; set; }
        [Column("LONGITUD", TypeName = "numeric(18, 6)")]
        public decimal? Longitud { get; set; }
        [Column("IND_ESBORRAT")]
        public bool IndEsborrat { get; set; }
        [Column("DATA_CREACIO", TypeName = "datetime")]
        public DateTime DataCreacio { get; set; }
        [Column("DATA_MODIFICACIO", TypeName = "datetime")]
        public DateTime DataModificacio { get; set; }
        [Column("OFREIX_TRANSPORT")]
        public bool OfreixTransport { get; set; }
        [Required]
        [Column("ACTIVA")]
        public bool Activa { get; set; }
        [Column("ANULAT")]
        public bool Anulat { get; set; }
        [Column("BLOQUEIX_ASSISTENCIA")]
        public bool BloqueixAssistencia { get; set; }
        [Column("ID_USUARI_MODIFI")]
        public int IdUsuariModifi { get; set; }
        [Column("DIRECCIO")]
        [StringLength(200)]
        public string Direccio { get; set; }
        [Column("EMERGENT")]
        public bool Emergent { get; set; }
        [Column("ID_TEMPORADA")]
        public int IdTemporada { get; set; }
        [Column("TRANSPORT_ANADA")]
        public bool? TransportAnada { get; set; }
        [Column("TRANSPORT_TORNADA")]
        public bool? TransportTornada { get; set; }

        [ForeignKey(nameof(IdTemporada))]
        [InverseProperty(nameof(Temporada.Esdeveniment))]
        public virtual Temporada IdTemporadaNavigation { get; set; }
        [ForeignKey(nameof(IdTipus))]
        [InverseProperty(nameof(TipusEsdeveniment.Esdeveniment))]
        public virtual TipusEsdeveniment IdTipusNavigation { get; set; }
        [ForeignKey(nameof(IdUsuariCreador))]
        [InverseProperty(nameof(Casteller.EsdevenimentIdUsuariCreadorNavigation))]
        public virtual Casteller IdUsuariCreadorNavigation { get; set; }
        [ForeignKey(nameof(IdUsuariModifi))]
        [InverseProperty(nameof(Casteller.EsdevenimentIdUsuariModifiNavigation))]
        public virtual Casteller IdUsuariModifiNavigation { get; set; }
        [InverseProperty("IdEsdevenimentNavigation")]
        public virtual ICollection<Assistencia> Assistencia { get; set; }
        [InverseProperty("IdEsdevenimentNavigation")]
        public virtual ICollection<EsdevenimentCastells> EsdevenimentCastells { get; set; }
        [InverseProperty("IdEsdevenimentNavigation")]
        public virtual ICollection<EsdevenimentLog> EsdevenimentLog { get; set; }
        [InverseProperty("IdEsdevenimentNavigation")]
        public virtual ICollection<EsdevenimentPregunta> EsdevenimentPregunta { get; set; }
        [InverseProperty("IdEsdevenimentNavigation")]
        public virtual ICollection<EsdevenimentValoracio> EsdevenimentValoracio { get; set; }
    }
}
