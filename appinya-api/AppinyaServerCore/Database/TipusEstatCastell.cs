using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("TIPUS_ESTAT_CASTELL")]
    public partial class TipusEstatCastell
    {
        public TipusEstatCastell()
        {
            EsdevenimentCastells = new HashSet<EsdevenimentCastells>();
        }

        [Key]
        [Column("ID")]
        public int Id { get; set; }
        [Required]
        [Column("ESTAT")]
        [StringLength(200)]
        public string Estat { get; set; }

        [InverseProperty("IdEstatCastellNavigation")]
        public virtual ICollection<EsdevenimentCastells> EsdevenimentCastells { get; set; }
    }
}
