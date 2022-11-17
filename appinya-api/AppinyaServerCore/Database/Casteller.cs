using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("CASTELLER")]
    public partial class Casteller
    {
        public Casteller()
        {
            AssistenciaIdCastellerNavigation = new HashSet<Assistencia>();
            AssistenciaIdUsuariCreadorNavigation = new HashSet<Assistencia>();
            AssistenciaIdUsuariModifiNavigation = new HashSet<Assistencia>();
            CastellerDelegaIdCasteller1Navigation = new HashSet<CastellerDelega>();
            CastellerDelegaIdCasteller2Navigation = new HashSet<CastellerDelega>();
            CastellerOrganitzacio = new HashSet<CastellerOrganitzacio>();
            CastellerPosicio = new HashSet<CastellerPosicio>();
            Convocatoria = new HashSet<Convocatoria>();
            Deutes = new HashSet<Deutes>();
            EsdevenimentIdUsuariCreadorNavigation = new HashSet<Esdeveniment>();
            EsdevenimentIdUsuariModifiNavigation = new HashSet<Esdeveniment>();
            EsdevenimentLog = new HashSet<EsdevenimentLog>();
            EsdevenimentValoracio = new HashSet<EsdevenimentValoracio>();
            FotosIdFotografNavigation = new HashSet<Fotos>();
            FotosIdUsuariCreadorNavigation = new HashSet<Fotos>();
            FotosIdUsuariModificaNavigation = new HashSet<Fotos>();
            FotosLike = new HashSet<FotosLike>();
            NoticiesIdCastellerNavigation = new HashSet<Noticies>();
            NoticiesIdUsuariCreadorNavigation = new HashSet<Noticies>();
            NoticiesIdUsuariModificaNavigation = new HashSet<Noticies>();
            ResponsableLegal = new HashSet<ResponsableLegal>();
        }

        [Key]
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Required]
        [Column("NOM")]
        [StringLength(50)]
        public string Nom { get; set; }
        [Required]
        [Column("COGNOMS")]
        [StringLength(200)]
        public string Cognoms { get; set; }
        [Required]
        [Column("ALIAS")]
        [StringLength(250)]
        public string Alias { get; set; }
        [Column("DATA_NAIXEMENT", TypeName = "date")]
        public DateTime? DataNaixement { get; set; }
        [Column("DATA_ALTA", TypeName = "date")]
        public DateTime DataAlta { get; set; }
        [Required]
        [Column("TELEFON1")]
        [StringLength(100)]
        public string Telefon1 { get; set; }
        [Column("TE_CAMISA")]
        public bool TeCamisa { get; set; }
        [Column("DATA_LLIUREAMENT", TypeName = "date")]
        public DateTime? DataLliureament { get; set; }
        [Column("EMAIL")]
        [StringLength(256)]
        public string Email { get; set; }
        [Column("TELEFON2")]
        [StringLength(100)]
        public string Telefon2 { get; set; }
        [Column("TWITTER")]
        [StringLength(100)]
        public string Twitter { get; set; }
        [Column("USER_ID")]
        [StringLength(128)]
        public string UserId { get; set; }
        [Column("ES_BAIXA")]
        public bool EsBaixa { get; set; }
        [Column("IND_ESBORRAT")]
        public bool IndEsborrat { get; set; }
        [Column("DATA_CREACIO", TypeName = "datetime")]
        public DateTime DataCreacio { get; set; }
        [Column("DATA_MODIFICACIO", TypeName = "datetime")]
        public DateTime DataModificacio { get; set; }
        [Column("DATA_BAIXA", TypeName = "datetime")]
        public DateTime? DataBaixa { get; set; }
        [Column("DIRECCIO")]
        [StringLength(256)]
        public string Direccio { get; set; }
        [Column("CP")]
        [StringLength(8)]
        public string Cp { get; set; }
        [Column("ASSEGURAT")]
        public bool Assegurat { get; set; }
        [Column("ID_MUNICIPI", TypeName = "numeric(18, 0)")]
        public decimal IdMunicipi { get; set; }
        [Column("VIS_DIRECCIO")]
        public bool VisDireccio { get; set; }
        [Column("VIS_TELEFON1")]
        public bool VisTelefon1 { get; set; }
        [Column("VIS_TELEFON2")]
        public bool VisTelefon2 { get; set; }
        [Column("VIS_DATANAIX")]
        public bool VisDatanaix { get; set; }
        [Column("FOTO", TypeName = "text")]
        public string Foto { get; set; }
        [Column("DOCUMENT_ID")]
        [StringLength(20)]
        public string DocumentId { get; set; }
        [Column("TIPUS_DOCUMENT")]
        public int? TipusDocument { get; set; }
        [Required]
        [Column("HABITUAL")]
        public bool Habitual { get; set; }
        [Column("REBREMAILNOT")]
        public bool Rebremailnot { get; set; }
        [Column("REBREMAILFOTOS")]
        public bool Rebremailfotos { get; set; }
        [Column("SANITARI")]
        public bool Sanitari { get; set; }
        [Column("EDAT")]
        public int Edat { get; set; }
        [Column("TE_CASC")]
        public bool TeCasc { get; set; }
        [Column("CASC_LLOGUER")]
        public bool CascLloguer { get; set; }
        [Column("OBSERVACIONS")]
        [StringLength(200)]
        public string Observacions { get; set; }

        [ForeignKey(nameof(IdMunicipi))]
        [InverseProperty(nameof(Municipi.Casteller))]
        public virtual Municipi IdMunicipiNavigation { get; set; }
        [ForeignKey(nameof(TipusDocument))]
        [InverseProperty("Casteller")]
        public virtual TipusDocument TipusDocumentNavigation { get; set; }
        [InverseProperty("IdCastellerNavigation")]
        public virtual DadesTecniques DadesTecniques { get; set; }
        [InverseProperty(nameof(Assistencia.IdCastellerNavigation))]
        public virtual ICollection<Assistencia> AssistenciaIdCastellerNavigation { get; set; }
        [InverseProperty(nameof(Assistencia.IdUsuariCreadorNavigation))]
        public virtual ICollection<Assistencia> AssistenciaIdUsuariCreadorNavigation { get; set; }
        [InverseProperty(nameof(Assistencia.IdUsuariModifiNavigation))]
        public virtual ICollection<Assistencia> AssistenciaIdUsuariModifiNavigation { get; set; }
        [InverseProperty(nameof(CastellerDelega.IdCasteller1Navigation))]
        public virtual ICollection<CastellerDelega> CastellerDelegaIdCasteller1Navigation { get; set; }
        [InverseProperty(nameof(CastellerDelega.IdCasteller2Navigation))]
        public virtual ICollection<CastellerDelega> CastellerDelegaIdCasteller2Navigation { get; set; }
        [InverseProperty("IdCastellerNavigation")]
        public virtual ICollection<CastellerOrganitzacio> CastellerOrganitzacio { get; set; }
        [InverseProperty("IdCastellerNavigation")]
        public virtual ICollection<CastellerPosicio> CastellerPosicio { get; set; }
        [InverseProperty("IdCastellerNavigation")]
        public virtual ICollection<Convocatoria> Convocatoria { get; set; }
        [InverseProperty("IdCastellerNavigation")]
        public virtual ICollection<Deutes> Deutes { get; set; }
        [InverseProperty(nameof(Esdeveniment.IdUsuariCreadorNavigation))]
        public virtual ICollection<Esdeveniment> EsdevenimentIdUsuariCreadorNavigation { get; set; }
        [InverseProperty(nameof(Esdeveniment.IdUsuariModifiNavigation))]
        public virtual ICollection<Esdeveniment> EsdevenimentIdUsuariModifiNavigation { get; set; }
        [InverseProperty("IdCastellerNavigation")]
        public virtual ICollection<EsdevenimentLog> EsdevenimentLog { get; set; }
        [InverseProperty("IdCastellerNavigation")]
        public virtual ICollection<EsdevenimentValoracio> EsdevenimentValoracio { get; set; }
        [InverseProperty(nameof(Fotos.IdFotografNavigation))]
        public virtual ICollection<Fotos> FotosIdFotografNavigation { get; set; }
        [InverseProperty(nameof(Fotos.IdUsuariCreadorNavigation))]
        public virtual ICollection<Fotos> FotosIdUsuariCreadorNavigation { get; set; }
        [InverseProperty(nameof(Fotos.IdUsuariModificaNavigation))]
        public virtual ICollection<Fotos> FotosIdUsuariModificaNavigation { get; set; }
        [InverseProperty("IdCastellerNavigation")]
        public virtual ICollection<FotosLike> FotosLike { get; set; }
        [InverseProperty(nameof(Noticies.IdCastellerNavigation))]
        public virtual ICollection<Noticies> NoticiesIdCastellerNavigation { get; set; }
        [InverseProperty(nameof(Noticies.IdUsuariCreadorNavigation))]
        public virtual ICollection<Noticies> NoticiesIdUsuariCreadorNavigation { get; set; }
        [InverseProperty(nameof(Noticies.IdUsuariModificaNavigation))]
        public virtual ICollection<Noticies> NoticiesIdUsuariModificaNavigation { get; set; }
        [InverseProperty("IdCastellerNavigation")]
        public virtual ICollection<ResponsableLegal> ResponsableLegal { get; set; }
    }
}
