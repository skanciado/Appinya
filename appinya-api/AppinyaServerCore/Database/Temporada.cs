using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("TEMPORADA")]
    public partial class Temporada
    {
        public Temporada()
        {
            Esdeveniment = new HashSet<Esdeveniment>();
            Fotos = new HashSet<Fotos>();
        }

        [Key]
        [Column("ID")]
        public int Id { get; set; }
        [Required]
        [Column("DESCRIPCIO")]
        [StringLength(250)]
        public string Descripcio { get; set; }
        [Column("DATA_INICI", TypeName = "date")]
        public DateTime DataInici { get; set; }
        [Column("DATA_FIN", TypeName = "date")]
        public DateTime DataFin { get; set; }
        [Column("PUNTUACIO", TypeName = "numeric(18, 0)")]
        public decimal? Puntuacio { get; set; }

        [InverseProperty("IdTemporadaNavigation")]
        public virtual ICollection<Esdeveniment> Esdeveniment { get; set; }
        [InverseProperty("IdTemporadaNavigation")]
        public virtual ICollection<Fotos> Fotos { get; set; }
    }
}
