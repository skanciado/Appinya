using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("FOTOS_IMATGE")]
    public partial class FotosImatge
    {
        [Key]
        [Column("ID_FOTOS")]
        public int IdFotos { get; set; }
        [Required]
        [Column("PORTADA")]
        public byte[] Portada { get; set; }
    }
}
