using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("TIPUS_ESDEVENIMENT")]
    public partial class TipusEsdeveniment
    {
        public TipusEsdeveniment()
        {
            Esdeveniment = new HashSet<Esdeveniment>();
        }

        [Key]
        [Column("ID_TIPUS_ESDEVENIMENT")]
        public int IdTipusEsdeveniment { get; set; }
        [Required]
        [Column("TITOL")]
        [StringLength(50)]
        public string Titol { get; set; }
        [Required]
        [Column("ICONA")]
        [StringLength(200)]
        public string Icona { get; set; }
        [Column("FILE")]
        [StringLength(100)]
        public string File { get; set; }

        [InverseProperty("IdTipusNavigation")]
        public virtual ICollection<Esdeveniment> Esdeveniment { get; set; }
    }
}
