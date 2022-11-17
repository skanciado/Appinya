using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("FOTOS_LIKE")]
    public partial class FotosLike
    {
        [Key]
        [Column("ID_FOTOS")]
        public int IdFotos { get; set; }
        [Key]
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Column("DATA_MODIFICACIO", TypeName = "date")]
        public DateTime DataModificacio { get; set; }
        [Required]
        [Column("LIKE")]
        public bool? Like { get; set; }

        [ForeignKey(nameof(IdCasteller))]
        [InverseProperty(nameof(Casteller.FotosLike))]
        public virtual Casteller IdCastellerNavigation { get; set; }
        [ForeignKey(nameof(IdFotos))]
        [InverseProperty(nameof(Fotos.FotosLike))]
        public virtual Fotos IdFotosNavigation { get; set; }
    }
}
