using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("ASSISTENCIA")]
    public partial class Assistencia
    {
        [Key]
        [Column("ID_CASTELLER")]
        public int IdCasteller { get; set; }
        [Key]
        [Column("ID_ESDEVENIMENT")]
        public int IdEsdeveniment { get; set; }
        [Column("NUM_ACOMPANYANTS")]
        public int? NumAcompanyants { get; set; }
        [Required]
        [Column("IND_ESBORRAT")]
        public bool? IndEsborrat { get; set; }
        [Column("DATA_CREACIO", TypeName = "datetime")]
        public DateTime DataCreacio { get; set; }
        [Column("TRANSPORT")]
        public bool? Transport { get; set; }
        [Column("OBSERVACIONS")]
        [StringLength(200)]
        public string Observacions { get; set; }
        [Column("ASSISTIRE")]
        public bool Assistire { get; set; }
        [Column("CONFIRMACIOTEC")]
        public bool Confirmaciotec { get; set; }
        [Column("ID_USUARI_CREADOR")]
        public int IdUsuariCreador { get; set; }
        [Column("ID_USUARI_MODIFI")]
        public int IdUsuariModifi { get; set; }
        [Column("DATA_MODIFI", TypeName = "datetime")]
        public DateTime DataModifi { get; set; }
        [Column("DATA_ASSISTENCIA", TypeName = "datetime")]
        public DateTime DataAssistencia { get; set; }
        [Column("ASSISTIRE_USUARI")]
        public bool? AssistireUsuari { get; set; }
        [Column("TRANSPORT_ANADA")]
        public bool? TransportAnada { get; set; }
        [Column("TRANSPORT_TORNADA")]
        public bool? TransportTornada { get; set; }
        [Column("RESPOSTES")]
        public string Respostes { get; set; }

        [ForeignKey(nameof(IdCasteller))]
        [InverseProperty(nameof(Casteller.AssistenciaIdCastellerNavigation))]
        public virtual Casteller IdCastellerNavigation { get; set; }
        [ForeignKey(nameof(IdEsdeveniment))]
        [InverseProperty(nameof(Esdeveniment.Assistencia))]
        public virtual Esdeveniment IdEsdevenimentNavigation { get; set; }
        [ForeignKey(nameof(IdUsuariCreador))]
        [InverseProperty(nameof(Casteller.AssistenciaIdUsuariCreadorNavigation))]
        public virtual Casteller IdUsuariCreadorNavigation { get; set; }
        [ForeignKey(nameof(IdUsuariModifi))]
        [InverseProperty(nameof(Casteller.AssistenciaIdUsuariModifiNavigation))]
        public virtual Casteller IdUsuariModifiNavigation { get; set; }
    }
}
