using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("TIPUS_PREGUNTA")]
    public partial class TipusPregunta
    {
        public TipusPregunta()
        {
            EsdevenimentPregunta = new HashSet<EsdevenimentPregunta>();
        }

        [Key]
        [Column("ID")]
        public int Id { get; set; }
        [Required]
        [Column("DESCRIPCIO")]
        [StringLength(200)]
        public string Descripcio { get; set; }

        [InverseProperty("TipusPreguntaNavigation")]
        public virtual ICollection<EsdevenimentPregunta> EsdevenimentPregunta { get; set; }
    }
}
