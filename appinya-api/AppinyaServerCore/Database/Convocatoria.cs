using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("CONVOCATORIA")]
    public partial class Convocatoria
    {
        [Key]
        [Column("ID_CONVOCATORIA")]
        public int IdConvocatoria { get; set; }
        [Required]
        [Column("MISSATGE", TypeName = "text")]
        public string Missatge { get; set; }
        [Column("DATA_CREACIO", TypeName = "datetime")]
        public DateTime DataCreacio { get; set; }
        [Column("ID_CASTELLER")]
        public int? IdCasteller { get; set; }

        [ForeignKey(nameof(IdCasteller))]
        [InverseProperty(nameof(Casteller.Convocatoria))]
        public virtual Casteller IdCastellerNavigation { get; set; }
    }
}
