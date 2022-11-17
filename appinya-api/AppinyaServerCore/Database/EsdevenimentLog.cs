using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("ESDEVENIMENT_LOG")]
    public partial class EsdevenimentLog
    {
        [Key]
        [Column("ID_LOG")]
        public int IdLog { get; set; }
        [Column("ID_ESDEVENIMENT")]
        public int IdEsdeveniment { get; set; }
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Column("DATA", TypeName = "datetime")]
        public DateTime Data { get; set; }
        [Column("ID_ACCIO")]
        public int IdAccio { get; set; }
        [Column("ID_CASTELLER_CREADOR")]
        public int IdCastellerCreador { get; set; }

        [ForeignKey(nameof(IdAccio))]
        [InverseProperty(nameof(AccioLog.EsdevenimentLog))]
        public virtual AccioLog IdAccioNavigation { get; set; }
        [ForeignKey(nameof(IdCasteller))]
        [InverseProperty(nameof(Casteller.EsdevenimentLog))]
        public virtual Casteller IdCastellerNavigation { get; set; }
        [ForeignKey(nameof(IdEsdeveniment))]
        [InverseProperty(nameof(Esdeveniment.EsdevenimentLog))]
        public virtual Esdeveniment IdEsdevenimentNavigation { get; set; }
    }
}
