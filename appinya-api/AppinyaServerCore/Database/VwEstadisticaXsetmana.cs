using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    public partial class VwEstadisticaXsetmana
    {
        public int? Setmana { get; set; }
        [Column("temporada")]
        public int? Temporada { get; set; }
        [Column("contador")]
        public int? Contador { get; set; }
    }
}
