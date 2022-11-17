using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("PROVINCIA")]
    public partial class Provincia
    {
        public Provincia()
        {
            Municipi = new HashSet<Municipi>();
        }

        [Key]
        [Column("ID_PROVINCIA", TypeName = "numeric(18, 0)")]
        public decimal IdProvincia { get; set; }
        [Required]
        [Column("CODI")]
        [StringLength(5)]
        public string Codi { get; set; }
        [Required]
        [Column("DESCRIPCIO")]
        [StringLength(256)]
        public string Descripcio { get; set; }

        [InverseProperty("IdProvinciaNavigation")]
        public virtual ICollection<Municipi> Municipi { get; set; }
    }
}
