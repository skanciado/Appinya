using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("EQUIPS")]
    public partial class Equips
    {
        [Key]
        [Column("ID_EQUIP")]
        public int IdEquip { get; set; }
        [Required]
        [Column("NOM")]
        [StringLength(200)]
        public string Nom { get; set; }
        [Required]
        [Column("EMAIL_CONTACTE")]
        [StringLength(200)]
        public string EmailContacte { get; set; }
        [Column("USUARI_CREADOR")]
        public int UsuariCreador { get; set; }
        [Column("DATA_CREACIO", TypeName = "datetime")]
        public DateTime DataCreacio { get; set; }
        [Column("USUARI_MODIFIC")]
        public int UsuariModific { get; set; }
        [Column("DATA_MODIFIC", TypeName = "datetime")]
        public DateTime DataModific { get; set; }
    }
}
