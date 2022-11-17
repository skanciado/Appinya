using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("ACCIO_LOG")]
    public partial class AccioLog
    {
        public AccioLog()
        {
            EsdevenimentLog = new HashSet<EsdevenimentLog>();
        }

        [Key]
        [Column("ID_ACCIO")]
        public int IdAccio { get; set; }
        [Column("DESCRIPCIO")]
        [StringLength(200)]
        public string Descripcio { get; set; }

        [InverseProperty("IdAccioNavigation")]
        public virtual ICollection<EsdevenimentLog> EsdevenimentLog { get; set; }
    }
}
