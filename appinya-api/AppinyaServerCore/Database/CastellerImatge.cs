using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("CASTELLER_IMATGE")]
    public partial class CastellerImatge
    {
        [Key]
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Required]
        [Column("FOTO")]
        public byte[] Foto { get; set; }
    }
}
