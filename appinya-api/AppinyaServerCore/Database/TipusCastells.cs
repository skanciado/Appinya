using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("TIPUS_CASTELLS")]
    public partial class TipusCastells
    {
        public TipusCastells()
        {
            EsdevenimentCastells = new HashSet<EsdevenimentCastells>();
        }

        [Key]
        [Column("ID")]
        public int Id { get; set; }
        [Required]
        [Column("CASTELL")]
        [StringLength(200)]
        public string Castell { get; set; }
        [Column("PROVA")]
        public bool? Prova { get; set; }

        [InverseProperty("IdCastellNavigation")]
        public virtual ICollection<EsdevenimentCastells> EsdevenimentCastells { get; set; }
    }
}
