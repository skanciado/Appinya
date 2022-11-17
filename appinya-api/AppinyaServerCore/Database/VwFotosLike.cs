using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    public partial class VwFotosLike
    {
        [Column("ID_FOTOS")]
        public int IdFotos { get; set; }
        [Column("contador")]
        public int? Contador { get; set; }
        [Column("castellers")]
        [StringLength(4000)]
        public string Castellers { get; set; }
    }
}
