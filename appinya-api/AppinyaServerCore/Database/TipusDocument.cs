using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("TIPUS_DOCUMENT")]
    public partial class TipusDocument
    {
        public TipusDocument()
        {
            Casteller = new HashSet<Casteller>();
        }

        [Key]
        [Column("ID")]
        public int Id { get; set; }
        [Required]
        [Column("DOCUMENT")]
        [StringLength(200)]
        public string Document { get; set; }

        [InverseProperty("TipusDocumentNavigation")]
        public virtual ICollection<Casteller> Casteller { get; set; }
    }
}
