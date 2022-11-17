using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppinyaServerCore.Database
{
    [Table("Excel_colla")]
    public partial class ExcelColla
    {
        [StringLength(128)]
        public string Soci { get; set; }
        [Column("national_id_type")]
        [StringLength(128)]
        public string NationalIdType { get; set; }
        [Column("DNI")]
        [StringLength(128)]
        public string Dni { get; set; }
        [StringLength(128)]
        public string Nom { get; set; }
        [StringLength(128)]
        public string Cognoms { get; set; }
        [StringLength(128)]
        public string Sobrenom { get; set; }
        [StringLength(128)]
        public string Gènere { get; set; }
        [StringLength(128)]
        public string Aniversari { get; set; }
        [Column("E_mail_1")]
        [StringLength(128)]
        public string EMail1 { get; set; }
        [Column("E_mail_2")]
        [StringLength(128)]
        public string EMail2 { get; set; }
        [Column("E_mail_3")]
        [StringLength(128)]
        public string EMail3 { get; set; }
        [Column("Telf_Mobil")]
        [StringLength(128)]
        public string TelfMobil { get; set; }
        [StringLength(128)]
        public string Telf { get; set; }
        [Column("Telf_Emergencia")]
        [StringLength(128)]
        public string TelfEmergencia { get; set; }
        [StringLength(128)]
        public string Adreca { get; set; }
        [Column("Codi_postal")]
        [StringLength(128)]
        public string CodiPostal { get; set; }
        [StringLength(128)]
        public string Ciutat { get; set; }
        [StringLength(128)]
        public string Comarca { get; set; }
        [StringLength(128)]
        public string Pais { get; set; }
        [StringLength(128)]
        public string Comentaris { get; set; }
        [StringLength(128)]
        public string Etiquetes { get; set; }
        [StringLength(128)]
        public string Assegurat { get; set; }
        [StringLength(128)]
        public string Professió { get; set; }
        [Column("Data_alta")]
        [StringLength(128)]
        public string DataAlta { get; set; }
    }
}
