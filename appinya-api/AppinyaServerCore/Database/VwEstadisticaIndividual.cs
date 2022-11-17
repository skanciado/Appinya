using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    public partial class VwEstadisticaIndividual
    {
        public long? Id { get; set; }
        [Column("ID_TIPUS")]
        public int IdTipus { get; set; }
        [Column("dia")]
        public int? Dia { get; set; }
        [Column("mes")]
        public int? Mes { get; set; }
        [Column("anys")]
        public int? Anys { get; set; }
        [Column("assitire")]
        public int Assitire { get; set; }
        [Column("confirmacio")]
        public int Confirmacio { get; set; }
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Column("ID_ESDEVENIMENT")]
        public int IdEsdeveniment { get; set; }
        [Column("ID_TEMPORADA")]
        public int IdTemporada { get; set; }
    }
}
