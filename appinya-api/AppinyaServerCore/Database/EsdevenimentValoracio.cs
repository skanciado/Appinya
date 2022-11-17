using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("ESDEVENIMENT_VALORACIO")]
    public partial class EsdevenimentValoracio
    {
        [Key]
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Key]
        [Column("ID_ESDEVENIMENT")]
        public int IdEsdeveniment { get; set; }
        [Column("DATA_ALTA", TypeName = "date")]
        public DateTime DataAlta { get; set; }
        [Column("VALORACIO")]
        public int Valoracio { get; set; }

        [ForeignKey(nameof(IdCasteller))]
        [InverseProperty(nameof(Casteller.EsdevenimentValoracio))]
        public virtual Casteller IdCastellerNavigation { get; set; }
        [ForeignKey(nameof(IdEsdeveniment))]
        [InverseProperty(nameof(Esdeveniment.EsdevenimentValoracio))]
        public virtual Esdeveniment IdEsdevenimentNavigation { get; set; }
    }
}
