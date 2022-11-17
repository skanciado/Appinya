using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("FOTOS")]
    public partial class Fotos
    {
        public Fotos()
        {
            FotosLike = new HashSet<FotosLike>();
        }

        [Key]
        [Column("ID_FOTOS")]
        public int IdFotos { get; set; }
        [Column("DATA", TypeName = "date")]
        public DateTime Data { get; set; }
        [Column("PORTADA", TypeName = "text")]
        public string Portada { get; set; }
        [Required]
        [Column("ALBUM", TypeName = "text")]
        public string Album { get; set; }
        [Column("DESCRIPCIO", TypeName = "ntext")]
        public string Descripcio { get; set; }
        [Column("ID_FOTOGRAF")]
        public int? IdFotograf { get; set; }
        [Column("URL", TypeName = "text")]
        public string Url { get; set; }
        [Column("DATA_CREACIO", TypeName = "datetime")]
        public DateTime DataCreacio { get; set; }
        [Column("DATA_MODIFICACIO", TypeName = "datetime")]
        public DateTime DataModificacio { get; set; }
        [Required]
        [Column("ACTIVA")]
        public bool Activa { get; set; }
        [Column("ID_USUARI_CREADOR")]
        public int IdUsuariCreador { get; set; }
        [Column("ID_USUARI_MODIFICA")]
        public int IdUsuariModifica { get; set; }
        [Column("ID_TEMPORADA")]
        public int IdTemporada { get; set; }

        [ForeignKey(nameof(IdFotograf))]
        [InverseProperty(nameof(Casteller.FotosIdFotografNavigation))]
        public virtual Casteller IdFotografNavigation { get; set; }
        [ForeignKey(nameof(IdTemporada))]
        [InverseProperty(nameof(Temporada.Fotos))]
        public virtual Temporada IdTemporadaNavigation { get; set; }
        [ForeignKey(nameof(IdUsuariCreador))]
        [InverseProperty(nameof(Casteller.FotosIdUsuariCreadorNavigation))]
        public virtual Casteller IdUsuariCreadorNavigation { get; set; }
        [ForeignKey(nameof(IdUsuariModifica))]
        [InverseProperty(nameof(Casteller.FotosIdUsuariModificaNavigation))]
        public virtual Casteller IdUsuariModificaNavigation { get; set; }
        [InverseProperty("IdFotosNavigation")]
        public virtual ICollection<FotosLike> FotosLike { get; set; }
    }
}
