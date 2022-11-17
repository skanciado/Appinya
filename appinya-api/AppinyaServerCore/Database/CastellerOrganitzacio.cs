using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("CASTELLER_ORGANITZACIO")]
    public partial class CastellerOrganitzacio
    {
        [Key]
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Key]
        [Column("ID_CARREC")]
        public int IdCarrec { get; set; }

        [ForeignKey(nameof(IdCarrec))]
        [InverseProperty(nameof(Organitzacio.CastellerOrganitzacio))]
        public virtual Organitzacio IdCarrecNavigation { get; set; }
        [ForeignKey(nameof(IdCasteller))]
        [InverseProperty(nameof(Casteller.CastellerOrganitzacio))]
        public virtual Casteller IdCastellerNavigation { get; set; }
    }
}
