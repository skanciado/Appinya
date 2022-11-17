using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("CASTELLER_POSICIO")]
    public partial class CastellerPosicio
    {
        [Key]
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Key]
        [Column("ID_POSICIO")]
        public int IdPosicio { get; set; }
        [Column("QUALITAT")]
        public int Qualitat { get; set; }

        [ForeignKey(nameof(IdCasteller))]
        [InverseProperty(nameof(Casteller.CastellerPosicio))]
        public virtual Casteller IdCastellerNavigation { get; set; }
        [ForeignKey(nameof(IdPosicio))]
        [InverseProperty(nameof(Posicio.CastellerPosicio))]
        public virtual Posicio IdPosicioNavigation { get; set; }
    }
}
