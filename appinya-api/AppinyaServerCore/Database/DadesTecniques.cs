using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("DADES_TECNIQUES")]
    public partial class DadesTecniques
    {
        [Key]
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Column("ALCADA")]
        public int? Alcada { get; set; }
        [Column("BRACOS")]
        public int? Bracos { get; set; }
        [Column("ESPATLLA")]
        public int? Espatlla { get; set; }
        [Column("PES")]
        public int? Pes { get; set; }
        [Column("OBSERVACIONS")]
        [StringLength(500)]
        public string Observacions { get; set; }

        [ForeignKey(nameof(IdCasteller))]
        [InverseProperty(nameof(Casteller.DadesTecniques))]
        public virtual Casteller IdCastellerNavigation { get; set; }
    }
}
