using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("ESDEVENIMENT_CASTELLS")]
    public partial class EsdevenimentCastells
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }
        [Column("ID_CASTELL")]
        public int IdCastell { get; set; }
        [Column("ID_ESDEVENIMENT")]
        public int IdEsdeveniment { get; set; }
        [Column("DATA_ALTA", TypeName = "date")]
        public DateTime DataAlta { get; set; }
        [Column("ID_ESTAT_CASTELL")]
        public int IdEstatCastell { get; set; }
        [Column("XARXA")]
        public bool Xarxa { get; set; }
        [Column("PROVA")]
        public bool Prova { get; set; }
        [Column("ORDRE")]
        public int Ordre { get; set; }
        [Column("DATA_MOD", TypeName = "date")]
        public DateTime DataMod { get; set; }
        [Column("OBSERVACIONS")]
        [StringLength(1000)]
        public string Observacions { get; set; }

        [ForeignKey(nameof(IdCastell))]
        [InverseProperty(nameof(TipusCastells.EsdevenimentCastells))]
        public virtual TipusCastells IdCastellNavigation { get; set; }
        [ForeignKey(nameof(IdEsdeveniment))]
        [InverseProperty(nameof(Esdeveniment.EsdevenimentCastells))]
        public virtual Esdeveniment IdEsdevenimentNavigation { get; set; }
        [ForeignKey(nameof(IdEstatCastell))]
        [InverseProperty(nameof(TipusEstatCastell.EsdevenimentCastells))]
        public virtual TipusEstatCastell IdEstatCastellNavigation { get; set; }
    }
}
