using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("ORGANITZACIO")]
    public partial class Organitzacio
    {
        public Organitzacio()
        {
            CastellerOrganitzacio = new HashSet<CastellerOrganitzacio>();
            InverseIdPareNavigation = new HashSet<Organitzacio>();
        }

        [Key]
        [Column("ID")]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Descripcio { get; set; }
        [Column("ID_PARE")]
        public int? IdPare { get; set; }

        [ForeignKey(nameof(IdPare))]
        [InverseProperty(nameof(Organitzacio.InverseIdPareNavigation))]
        public virtual Organitzacio IdPareNavigation { get; set; }
        [InverseProperty("IdCarrecNavigation")]
        public virtual ICollection<CastellerOrganitzacio> CastellerOrganitzacio { get; set; }
        [InverseProperty(nameof(Organitzacio.IdPareNavigation))]
        public virtual ICollection<Organitzacio> InverseIdPareNavigation { get; set; }
    }
}
