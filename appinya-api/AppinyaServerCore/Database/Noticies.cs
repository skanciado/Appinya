using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("NOTICIES")]
    public partial class Noticies
    {
        [Key]
        [Column("ID_NOTICIES")]
        public int IdNoticies { get; set; }
        [Column("DATA", TypeName = "date")]
        public DateTime Data { get; set; }
        [Required]
        [Column("TITULO", TypeName = "ntext")]
        public string Titulo { get; set; }
        [Required]
        [Column("DESCRIPCIO", TypeName = "ntext")]
        public string Descripcio { get; set; }
        [Column("URL", TypeName = "text")]
        public string Url { get; set; }
        [Column("DATA_CREACIO", TypeName = "datetime")]
        public DateTime DataCreacio { get; set; }
        [Column("DATA_MODIFICACIO", TypeName = "datetime")]
        public DateTime DataModificacio { get; set; }
        [Required]
        [Column("ACTIVA")]
        public bool Activa { get; set; }
        [Column("ID_CASTELLER")]
        public int? IdCasteller { get; set; }
        [Column("ID_TIPUS_NOTICIES")]
        public int IdTipusNoticies { get; set; }
        [Column("ID_USUARI_CREADOR")]
        public int IdUsuariCreador { get; set; }
        [Column("ID_USUARI_MODIFICA")]
        public int IdUsuariModifica { get; set; }
        [Column("INDEFINIDA")]
        public bool Indefinida { get; set; }
        [Column("FOTO", TypeName = "text")]
        public string Foto { get; set; }

        [ForeignKey(nameof(IdCasteller))]
        [InverseProperty(nameof(Casteller.NoticiesIdCastellerNavigation))]
        public virtual Casteller IdCastellerNavigation { get; set; }
        [ForeignKey(nameof(IdTipusNoticies))]
        [InverseProperty(nameof(TipusNoticies.Noticies))]
        public virtual TipusNoticies IdTipusNoticiesNavigation { get; set; }
        [ForeignKey(nameof(IdUsuariCreador))]
        [InverseProperty(nameof(Casteller.NoticiesIdUsuariCreadorNavigation))]
        public virtual Casteller IdUsuariCreadorNavigation { get; set; }
        [ForeignKey(nameof(IdUsuariModifica))]
        [InverseProperty(nameof(Casteller.NoticiesIdUsuariModificaNavigation))]
        public virtual Casteller IdUsuariModificaNavigation { get; set; }
    }
}
