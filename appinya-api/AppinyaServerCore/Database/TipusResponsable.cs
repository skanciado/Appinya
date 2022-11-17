using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("TIPUS_RESPONSABLE")]
    public partial class TipusResponsable
    {
        public TipusResponsable()
        {
            ResponsableLegal = new HashSet<ResponsableLegal>();
        }

        [Key]
        [Column("ID_TIPUS_RESPONSABLE")]
        public int IdTipusResponsable { get; set; }
        [Required]
        [Column("DESCRIPCIO")]
        [StringLength(100)]
        public string Descripcio { get; set; }

        [InverseProperty("IdTipusResponsableNavigation")]
        public virtual ICollection<ResponsableLegal> ResponsableLegal { get; set; }
    }
}
