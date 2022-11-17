using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("MUNICIPI")]
    public partial class Municipi
    {
        public Municipi()
        {
            Casteller = new HashSet<Casteller>();
        }

        [Key]
        [Column("ID_MUNICIPI", TypeName = "numeric(18, 0)")]
        public decimal IdMunicipi { get; set; }
        [Required]
        [Column("CODI")]
        [StringLength(5)]
        public string Codi { get; set; }
        [Required]
        [Column("DESCRIPCIO")]
        [StringLength(256)]
        public string Descripcio { get; set; }
        [Column("ID_PROVINCIA", TypeName = "numeric(18, 0)")]
        public decimal IdProvincia { get; set; }

        [ForeignKey(nameof(IdProvincia))]
        [InverseProperty(nameof(Provincia.Municipi))]
        public virtual Provincia IdProvinciaNavigation { get; set; }
        [InverseProperty("IdMunicipiNavigation")]
        public virtual ICollection<Casteller> Casteller { get; set; }
    }
}
