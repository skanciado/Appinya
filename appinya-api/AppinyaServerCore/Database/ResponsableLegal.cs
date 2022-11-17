using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("RESPONSABLE_LEGAL")]
    public partial class ResponsableLegal
    {
        [Key]
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Key]
        [Column("ID_TIPUS_RESPONSABLE")]
        public int IdTipusResponsable { get; set; }
        [Required]
        [Column("NOM")]
        [StringLength(50)]
        public string Nom { get; set; }
        [Required]
        [Column("COGNOMS")]
        [StringLength(200)]
        public string Cognoms { get; set; }
        [Required]
        [Column("TELEFON1")]
        [StringLength(100)]
        public string Telefon1 { get; set; }
        [Required]
        [Column("EMAIL")]
        [StringLength(256)]
        public string Email { get; set; }
        [Column("TELEFON2")]
        [StringLength(100)]
        public string Telefon2 { get; set; }
        [Column("ESCASTELLER")]
        public bool Escasteller { get; set; }
        public int? IdCastellerResponsable { get; set; }

        [ForeignKey(nameof(IdCasteller))]
        [InverseProperty(nameof(Casteller.ResponsableLegal))]
        public virtual Casteller IdCastellerNavigation { get; set; }
        [ForeignKey(nameof(IdTipusResponsable))]
        [InverseProperty(nameof(TipusResponsable.ResponsableLegal))]
        public virtual TipusResponsable IdTipusResponsableNavigation { get; set; }
    }
}
