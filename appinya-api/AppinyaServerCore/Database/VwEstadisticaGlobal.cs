using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    public partial class VwEstadisticaGlobal
    {
        [Column("dia")]
        public int? Dia { get; set; }
        [Column("mes")]
        public int? Mes { get; set; }
        [Column("anys")]
        public int? Anys { get; set; }
        [Column("assitire")]
        public int? Assitire { get; set; }
        [Column("confirmacio")]
        public int? Confirmacio { get; set; }
        [Column("castellers")]
        public int? Castellers { get; set; }
    }
}
