using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("TIPUS_NOTICIES")]
    public partial class TipusNoticies
    {
        public TipusNoticies()
        {
            Noticies = new HashSet<Noticies>();
        }

        [Key]
        [Column("ID")]
        public int Id { get; set; }
        [Required]
        [Column("DESCRIPCIO")]
        [StringLength(200)]
        public string Descripcio { get; set; }
        [Required]
        [Column("ICONA")]
        [StringLength(200)]
        public string Icona { get; set; }

        [InverseProperty("IdTipusNoticiesNavigation")]
        public virtual ICollection<Noticies> Noticies { get; set; }
    }
}
