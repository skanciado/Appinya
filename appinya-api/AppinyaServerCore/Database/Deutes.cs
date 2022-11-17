using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("DEUTES")]
    public partial class Deutes
    {
        [Key]
        [Column("ID_DEUTE")]
        public int IdDeute { get; set; }
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Required]
        [Column("CONCEPTE")]
        [StringLength(200)]
        public string Concepte { get; set; }
        [Column("DATA", TypeName = "datetime")]
        public DateTime Data { get; set; }
        [Column("VALOR", TypeName = "numeric(8, 2)")]
        public decimal Valor { get; set; }
        [Column("PAGAT")]
        public bool Pagat { get; set; }
        [Column("OBSERVACIONS")]
        [StringLength(200)]
        public string Observacions { get; set; }
        [Column("DATA_PAGAMENT", TypeName = "datetime")]
        public DateTime? DataPagament { get; set; }
        [Column("IND_BORRAT")]
        public bool IndBorrat { get; set; }
        [Column("USUARI_CREADOR")]
        public int UsuariCreador { get; set; }
        [Column("DATA_CREACIO", TypeName = "datetime")]
        public DateTime DataCreacio { get; set; }
        [Column("USUARI_MODIFIC")]
        public int UsuariModific { get; set; }
        [Column("DATA_MODIFIC", TypeName = "datetime")]
        public DateTime DataModific { get; set; }

        [ForeignKey(nameof(IdCasteller))]
        [InverseProperty(nameof(Casteller.Deutes))]
        public virtual Casteller IdCastellerNavigation { get; set; }
    }
}
