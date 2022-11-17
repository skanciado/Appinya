using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("CASTELLER_DELEGA")]
    public partial class CastellerDelega
    {
        [Key]
        [Column("ID_CASTELLER1")]
        public int IdCasteller1 { get; set; }
        [Key]
        [Column("ID_CASTELLER2")]
        public int IdCasteller2 { get; set; }
        [Column("DATA_ALTA", TypeName = "date")]
        public DateTime DataAlta { get; set; }
        [Column("CONFIRM")]
        public bool Confirm { get; set; }
        [Column("T_REFERENT")]
        public bool TReferent { get; set; }

        [ForeignKey(nameof(IdCasteller1))]
        [InverseProperty(nameof(Casteller.CastellerDelegaIdCasteller1Navigation))]
        public virtual Casteller IdCasteller1Navigation { get; set; }
        [ForeignKey(nameof(IdCasteller2))]
        [InverseProperty(nameof(Casteller.CastellerDelegaIdCasteller2Navigation))]
        public virtual Casteller IdCasteller2Navigation { get; set; }
    }
}
