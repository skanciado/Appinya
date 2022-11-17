using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("ESDEVENIMENT_PREGUNTA")]
    public partial class EsdevenimentPregunta
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }
        [Column("ID_ESDEVENIMENT")]
        public int IdEsdeveniment { get; set; }
        [Column("TIPUS_PREGUNTA")]
        public int TipusPregunta { get; set; }
        [Required]
        [Column("PREGUNTA")]
        [StringLength(200)]
        public string Pregunta { get; set; }
        [Column("VALORS")]
        [StringLength(200)]
        public string Valors { get; set; }
        [Column("DATA_ALTA", TypeName = "date")]
        public DateTime DataAlta { get; set; }

        [ForeignKey(nameof(IdEsdeveniment))]
        [InverseProperty(nameof(Esdeveniment.EsdevenimentPregunta))]
        public virtual Esdeveniment IdEsdevenimentNavigation { get; set; }
        [ForeignKey(nameof(TipusPregunta))]
        [InverseProperty("EsdevenimentPregunta")]
        public virtual TipusPregunta TipusPreguntaNavigation { get; set; }
    }
}
