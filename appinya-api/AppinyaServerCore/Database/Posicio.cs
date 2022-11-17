using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("POSICIO")]
    public partial class Posicio
    {
        public Posicio()
        {
            CastellerPosicio = new HashSet<CastellerPosicio>();
        }

        [Key]
        [Column("ID_POSICIO")]
        public int IdPosicio { get; set; }
        [Required]
        [Column("DESCRIPCIO")]
        [StringLength(200)]
        public string Descripcio { get; set; }
        [Column("ICONA")]
        [StringLength(100)]
        public string Icona { get; set; }

        [InverseProperty("IdPosicioNavigation")]
        public virtual ICollection<CastellerPosicio> CastellerPosicio { get; set; }
    }
}
