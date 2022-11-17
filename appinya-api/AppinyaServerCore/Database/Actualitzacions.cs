using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("ACTUALITZACIONS")]
    public partial class Actualitzacions
    {
        [Key]
        [Column("ID_TABLA")]
        [StringLength(50)]
        public string IdTabla { get; set; }
        [Column("DATA_MODIFICACIO", TypeName = "datetime")]
        public DateTime DataModificacio { get; set; }
    }
}
