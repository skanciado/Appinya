﻿ /**
 *  Appinya Open Source Project
 *  Copyright (C) 2019  Daniel Horta Vidal
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as
 *   published by the Free Software Foundation, either version 3 of the
 *   License, or (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 **/ 
  
CREATE TABLE FOTOS_IMATGE (
	ID_FOTOS int,
	PORTADA VARBINARY(MAX) NOT NULL,
	CONSTRAINT [PK_FOTOS_IMATGES] PRIMARY KEY CLUSTERED  ([ID_FOTOS] ASC)
) ;
CREATE TABLE CASTELLER_IMATGE (
	ID_CASTELLER int,
	FOTO VARBINARY(MAX) NOT NULL,
	CONSTRAINT [PK_CASTELLER_IMATGE] PRIMARY KEY CLUSTERED  ([ID_CASTELLER] ASC)
) ;

-- Desconexio usuaris
ALTER TABLE CASTELLER DROP CONSTRAINT FK_CASTELLER_AspNetUsers;
GO
UPDATE CASTELLER SET USER_ID = null;
GO
-- Agregem el idCastellerResponsable
ALTER TABLE [dbo].[RESPONSABLE_LEGAL] ADD  IdCastellerResponsable int ;
GO

-- No permitir duplicados en la base de datos User_id
CREATE UNIQUE INDEX UIX_CASTELLER_USERID
ON CASTELLER (USER_ID) 
WHERE USER_ID IS NOT NULL;
GO

-- Crear la nova funcio Estadistica Individiual

CREATE  FUNCTION [dbo].[fncEstadisticaIndividual] (@casteller INT , @temporada INT , @rolCasteller INT , @rolMusic INT)
RETURNS @estadiscita  TABLE (
	Id bigint ,
	idTipus int ,
	dia int ,
	mes int ,
	anys int , 
	assitire int ,
	confirmacio int ,
	idCasteller int,
	idEsdeveniment int,
	idTemporada int
)
AS BEGIN 
   
  
	if (@rolCasteller > 0 and @rolMusic >0)   
	begin
	  insert into @estadiscita SELECT  *
		FROM vwEstadisticaIndividual es where (ID_CASTELLER=@casteller) AND ID_TEMPORADA=@temporada and ID_TIPUS in (1,2,6)
  
	  insert into @estadiscita SELECT    
			ROW_NUMBER() OVER (ORDER BY  (SELECT        1)) AS Id, 
			esd.ID_TIPUS as idTipus,
			(DATEPART(dw, esd.DATA_INICI) + 5) % 7 + 1 AS dia, 
			MONTH(esd.DATA_INICI) AS mes, 
			YEAR(esd.DATA_INICI) AS anys, 
			0 AS assitire, 
			0 AS confirmacio, 
			@casteller as idCasteller,
			esd.ID_ESDEVENIMENT as idEsdeveniment, 
			esd.ID_TEMPORADA as idTemporada
		  FROM ESDEVENIMENT esd where  ID_TEMPORADA=@temporada and esd.IND_ESBORRAT=0 and ID_TIPUS in (1,2,6) and esd.IND_ESBORRAT=0 and  (esd.ANULAT = 0) AND esd.DATA_INICI < GETDATE() and
		   esd.ID_ESDEVENIMENT not in (  SELECT  es.idEsdeveniment
		  FROM @estadiscita es);
	end
	ELSE if (@rolCasteller > 0)   begin
		insert into @estadiscita SELECT  *
		FROM vwEstadisticaIndividual es where (ID_CASTELLER=@casteller) AND ID_TEMPORADA=@temporada and ID_TIPUS in (1,2);
  
	  insert into @estadiscita SELECT    
			ROW_NUMBER() OVER (ORDER BY  (SELECT        1)) AS Id, 
			esd.ID_TIPUS as idTipus,
			(DATEPART(dw, esd.DATA_INICI) + 5) % 7 + 1 AS dia, 
			MONTH(esd.DATA_INICI) AS mes, 
			YEAR(esd.DATA_INICI) AS anys, 
			0 AS assitire, 
			0 AS confirmacio, 
			@casteller as idCasteller,
			esd.ID_ESDEVENIMENT as idEsdeveniment, 
			esd.ID_TEMPORADA as idTemporada
		  FROM ESDEVENIMENT esd where  ID_TEMPORADA=@temporada and esd.IND_ESBORRAT=0 and  (esd.ANULAT = 0) AND esd.DATA_INICI < GETDATE() and ID_TIPUS in (1,2) and 
		   esd.ID_ESDEVENIMENT not in (  SELECT  es.idEsdeveniment
		  FROM @estadiscita es);
	end
	ELSE if (@rolMusic >0)    begin
		insert into @estadiscita SELECT  *
		FROM vwEstadisticaIndividual es where (ID_CASTELLER=@casteller) AND ID_TEMPORADA=@temporada and ID_TIPUS in (1,6);
  
	  insert into @estadiscita SELECT    
			ROW_NUMBER() OVER (ORDER BY  (SELECT        1)) AS Id, 
			esd.ID_TIPUS as idTipus,
			(DATEPART(dw, esd.DATA_INICI) + 5) % 7 + 1 AS dia, 
			MONTH(esd.DATA_INICI) AS mes, 
			YEAR(esd.DATA_INICI) AS anys, 
			0 AS assitire, 
			0 AS confirmacio, 
			@casteller as idCasteller,
			esd.ID_ESDEVENIMENT as idEsdeveniment, 
			esd.ID_TEMPORADA as idTemporada
		  FROM ESDEVENIMENT esd where  ID_TEMPORADA=@temporada and esd.IND_ESBORRAT=0 and  (esd.ANULAT = 0) AND esd.DATA_INICI < GETDATE() and ID_TIPUS in (1,6) and 
		   esd.ID_ESDEVENIMENT not in (  SELECT  es.idEsdeveniment
		  FROM @estadiscita es);
     end;
RETURN 
END;
GO

ALTER VIEW [vwFotosLike]  as 
SELECT        ID_FOTOS , SUM(contador) AS contador , MAX(Castellers  ) as castellers
FROM            ( SELECT        f.ID_FOTOS, COUNT(*) AS contador , STRING_AGG(ID_CASTELLER, ',') as Castellers
                          FROM            dbo.FOTOS AS f LEFT OUTER JOIN
                                                    dbo.FOTOS_LIKE AS fl ON f.ID_FOTOS = fl.ID_FOTOS
                          WHERE        (fl.[LIKE] = 1)
                          GROUP BY f.ID_FOTOS
                          UNION
                          SELECT        f.ID_FOTOS, 0 AS contador, STRING_AGG(ID_CASTELLER, ',') as Castellers
                          FROM            dbo.FOTOS AS f LEFT OUTER JOIN
                                                   dbo.FOTOS_LIKE AS fl ON f.ID_FOTOS = fl.ID_FOTOS
                          WHERE        (fl.[LIKE] IS NULL) OR
                                                   (fl.[LIKE] <> 1)
                          GROUP BY f.ID_FOTOS) AS s
GROUP BY ID_FOTOS;
GO

CREATE FUNCTION [dbo].[fncFotoLikes] (@casteller INT , @idTemporada INT )
RETURNS TABLE
AS
RETURN 
SELECT  fotoLike.ID_FOTOS as IdFotos, fotoLike.contador as Contador, [like] as Jo , castellers as Castellers
  FROM FOTOS fot INNER JOIN vwFotosLike  fotoLike on fotoLike.ID_FOTOS = fot.ID_FOTOS LEFT JOIN FOTOS_LIKE me 
  on fotoLike.ID_FOTOS=me.ID_FOTOS and me.ID_CASTELLER=@casteller and fot.ID_TEMPORADA=@idTemporada ;
GO

  
CREATE TABLE ESDEVENIMENT_LOG (
[ID_LOG] [int] IDENTITY(1,1) NOT NULL,
[ID_ESDEVENIMENT] [int] not NULL,
[ID_CASTELLER] [int] not NULL,
[DATA] DATETIME not null,
[ID_ACCIO] [int] not null ,
[ID_CASTELLER_CREADOR] [int] not NULL,
CONSTRAINT [PK_ESDEVENIMENT_LOG] PRIMARY KEY CLUSTERED  ([ID_LOG] ASC)
);
ALTER TABLE [dbo].ESDEVENIMENT_LOG ADD  CONSTRAINT [DF__ESDEVENIMENT_LOG_DATA]  DEFAULT (getdate()) FOR [DATA];
ALTER TABLE [dbo].ESDEVENIMENT_LOG   ADD  CONSTRAINT FK_ESDE_LOG_ESDE FOREIGN KEY([ID_ESDEVENIMENT]) REFERENCES [dbo].[ESDEVENIMENT] ([ID_ESDEVENIMENT]);
ALTER TABLE [dbo].ESDEVENIMENT_LOG  ADD  CONSTRAINT FK_ESDE_LOG_CAST FOREIGN KEY([ID_CASTELLER]) REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER]);
GO

CREATE TABLE ACCIO_LOG (
ID_ACCIO int,
DESCRIPCIO VARCHAR(200),
CONSTRAINT [PK_ACCIO_LOG] PRIMARY KEY CLUSTERED  ([ID_ACCIO] ASC)
);
ALTER TABLE [dbo].ESDEVENIMENT_LOG  ADD  CONSTRAINT FK_ESDE_LOG_ACC FOREIGN KEY([ID_ACCIO]) REFERENCES [dbo].[ACCIO_LOG] (ID_ACCIO);
GO
ALTER TABLE ESDEVENIMENT DROP COLUMN [RESPOSTA_PREGUNTA_1];
ALTER TABLE ESDEVENIMENT DROP COLUMN [RESPOSTA_PREGUNTA_2];
ALTER TABLE ESDEVENIMENT DROP COLUMN [RESPOSTA_COMBO_1];

/****** Object:  UserDefinedFunction [dbo].[fEsdeveniments]    Script Date: 02/04/2020 11:32:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER FUNCTION [dbo].[fEsdeveniments] (@casteller INT,@temporada INT)
RETURNS TABLE
AS
RETURN 
SELECT es.ID_ESDEVENIMENT
      ,es.[TITOL]
      ,es.[TEXT]
      ,es.[ID_TIPUS]
	  ,tipus.TITOL as TIPUS
	  ,tipus.ICONA 
	  , tipus.[FILE] as ICONASRC
      ,es.[DATA_INICI]
      ,es.[DATA_FI]
      ,es.[IMATGE]
      ,es.[IMATGE_MINI]
      ,es.[ID_USUARI_CREADOR]
      ,es.[LATITUD]
      ,es.[LONGITUD]
      ,es.[IND_ESBORRAT]
      ,es.[DATA_CREACIO]
      ,es.[DATA_MODIFICACIO]
      ,es.[OFREIX_TRANSPORT]
      ,es.[ACTIVA]
      ,es.[ANULAT]
	  ,es.DIRECCIO
      ,es.[BLOQUEIX_ASSISTENCIA]
      ,es.[ID_USUARI_MODIFI] 
	   ,es.[TRANSPORT_ANADA] 
	   ,es.[TRANSPORT_TORNADA] 
	   ,es.[PREGUNTA_1]     
	   ,es.[PREGUNTA_2]   
	   ,es.PREGUNTA_COMBO_1
	   ,es.PREGUNTA_VALORES_COMBO_1
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1) as Assistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=0) as NoAssistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1 and CONFIRMACIOTEC=1) as ConfirmTecnics
	   , (SELECT TOP 1 ASSISTIRE FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ID_CASTELLER=@casteller ) as Assistire,
	   es.ID_TEMPORADA
  FROM [dbo].[ESDEVENIMENT] es INNER JOIN TIPUS_ESDEVENIMENT tipus 
  on es.ID_TIPUS = tipus.ID_TIPUS_ESDEVENIMENT where es.ID_TEMPORADA=@temporada;
--GROUP BY DATEPART(ww, es.DATA_INICI) ,DATEPART(YYYY, es.DATA_INICI);


DROP TABLE AspNetUserClaims;
DROP TABLE AspNetUserLogins;
DROP TABLE AspNetUserRoles;
DROP TABLE AspNetUsers;
DROP TABLE AspNetRoles;


DROP TABLE [dbo].[QRTZ_BLOB_TRIGGERS];
DROP TABLE [dbo].[QRTZ_CALENDARS];
DROP TABLE [dbo].[QRTZ_CRON_TRIGGERS];
DROP TABLE [dbo].[QRTZ_SIMPROP_TRIGGERS]; 
DROP TABLE [dbo].[QRTZ_SIMPLE_TRIGGERS];

DROP TABLE [dbo].[QRTZ_SCHEDULER_STATE];
DROP TABLE [dbo].[QRTZ_PAUSED_TRIGGER_GRPS];

DROP TABLE [dbo].[QRTZ_TRIGGERS];
DROP TABLE [dbo].[QRTZ_JOB_DETAILS]; 

DROP TABLE [dbo].[QRTZ_FIRED_TRIGGERS]; 
DROP TABLE [dbo].[QRTZ_LOCKS]; 


INSERT INTO ACCIO_LOG VALUES (10,'Vinc');
INSERT INTO ACCIO_LOG VALUES (20,'No Vinc');
INSERT INTO ACCIO_LOG VALUES (30,'Confirmació Tècnica');

 
   
CREATE TABLE ORGANITZACIO (
	[ID] [int] not null ,
	[Descripcio] [varchar](100) not null,
	[ID_PARE] [int],
	CONSTRAINT [PK_ORGANITZACIO] PRIMARY KEY CLUSTERED 
	([ID] ASC )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
);

ALTER TABLE [dbo].ORGANITZACIO  WITH CHECK ADD  CONSTRAINT [FK_ORGAN_ORGAN] FOREIGN KEY([ID_PARE]) REFERENCES [dbo].ORGANITZACIO ([Id])

INSERT INTO ORGANITZACIO  VALUES (1, 'Cap de Colla',null);
INSERT INTO ORGANITZACIO VALUES (2, 'Presidencia',1);
INSERT INTO ORGANITZACIO VALUES (3, 'Cap de Troncs',1);
INSERT INTO ORGANITZACIO VALUES (11, 'Tècnic de Troncs',3);
INSERT INTO ORGANITZACIO VALUES (12, 'Adjunts',3);
INSERT INTO ORGANITZACIO VALUES (4, 'Cap de Pinyes',1);
INSERT INTO ORGANITZACIO VALUES (13, 'Tècnic de Pinyes',4);
INSERT INTO ORGANITZACIO VALUES (14, 'Adjunts',4);
INSERT INTO ORGANITZACIO VALUES (5, 'Cap de Canalla',1);
INSERT INTO ORGANITZACIO VALUES (15, 'Tècnic de Canalla',5);
INSERT INTO ORGANITZACIO VALUES (16, 'Adjunts',5);
INSERT INTO ORGANITZACIO VALUES (6, 'Suport Informàtic',1);
INSERT INTO ORGANITZACIO VALUES (7,'Bar',2);
INSERT INTO ORGANITZACIO VALUES (8, 'Imatge',1);
INSERT INTO ORGANITZACIO VALUES (9, 'Tresoreria',2);
INSERT INTO ORGANITZACIO VALUES (10, 'Secretaria',2);


CREATE TABLE CASTELLER_ORGANITZACIO (
	[ID_CASTELLER] [int] not null , 
	[ID_CARREC] [int] not null , 
	CONSTRAINT [PK_CASTELLER_ORGANITZACIO] PRIMARY KEY CLUSTERED 
	([ID_CASTELLER],[ID_CARREC] ASC )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
); 

ALTER TABLE [dbo].CASTELLER_ORGANITZACIO  WITH CHECK ADD  CONSTRAINT [FK_CASTE_ORGAN_CARREC] FOREIGN KEY(ID_CARREC) REFERENCES [dbo].ORGANITZACIO ([Id]) ON DELETE CASCADE;
ALTER TABLE [dbo].CASTELLER_ORGANITZACIO  WITH CHECK ADD  CONSTRAINT [FK_CASTE_ORGAN_CASTEL] FOREIGN KEY(ID_CASTELLER) REFERENCES [dbo].CASTELLER ([Id_CASTELLER]) ON DELETE CASCADE;

ALTER TABLE CASTELLER DROP COLUMN CARREC;


CREATE FUNCTION [dbo].[fEsdevenimentsActuals] (@casteller INT,@temporada INT)
RETURNS TABLE AS RETURN 
SELECT TOP 10 es.ID_ESDEVENIMENT
      ,es.[TITOL]
      ,es.[TEXT]
      ,es.[ID_TIPUS]
	  ,tipus.TITOL as TIPUS
	  ,tipus.ICONA 
	  , tipus.[FILE] as ICONASRC
      ,es.[DATA_INICI]
      ,es.[DATA_FI]
      ,es.[IMATGE]
      ,es.[IMATGE_MINI]
      ,es.[ID_USUARI_CREADOR]
      ,es.[LATITUD]
      ,es.[LONGITUD]
      ,es.[IND_ESBORRAT]
      ,es.[DATA_CREACIO]
      ,es.[DATA_MODIFICACIO]
      ,es.[OFREIX_TRANSPORT]
      ,es.[ACTIVA]
      ,es.[ANULAT]
	  ,es.DIRECCIO
      ,es.[BLOQUEIX_ASSISTENCIA]
      ,es.[ID_USUARI_MODIFI] 
	   ,es.[TRANSPORT_ANADA] 
	   ,es.[TRANSPORT_TORNADA] 
	   ,es.[PREGUNTA_1]     
	   ,es.[PREGUNTA_2]   
	   ,es.PREGUNTA_COMBO_1
	   ,es.PREGUNTA_VALORES_COMBO_1
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1) as Assistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=0) as NoAssistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1 and CONFIRMACIOTEC=1) as ConfirmTecnics
	   , (SELECT TOP 1 ASSISTIRE FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ID_CASTELLER=@casteller ) as Assistire,
	   es.ID_TEMPORADA
  FROM [dbo].[ESDEVENIMENT] es INNER JOIN TIPUS_ESDEVENIMENT tipus 
  on es.ID_TIPUS = tipus.ID_TIPUS_ESDEVENIMENT where es.ID_TEMPORADA=@temporada and es.DATA_INICI > GETDATE();



  
ALTER FUNCTION [dbo].[fEsdevenimentsActuals] (@casteller INT,@text varchar(200),@temporada INT)
RETURNS TABLE AS RETURN 
SELECT TOP 10 es.ID_ESDEVENIMENT
      ,es.[TITOL]
      ,es.[TEXT]
      ,es.[ID_TIPUS]
	  ,tipus.TITOL as TIPUS
	  ,tipus.ICONA 
	  , tipus.[FILE] as ICONASRC
      ,es.[DATA_INICI]
      ,es.[DATA_FI]
      ,es.[IMATGE]
      ,es.[IMATGE_MINI]
      ,es.[ID_USUARI_CREADOR]
      ,es.[LATITUD]
      ,es.[LONGITUD]
      ,es.[IND_ESBORRAT]
      ,es.[DATA_CREACIO]
      ,es.[DATA_MODIFICACIO]
      ,es.[OFREIX_TRANSPORT]
      ,es.[ACTIVA]
      ,es.[ANULAT]
	  ,es.DIRECCIO
      ,es.[BLOQUEIX_ASSISTENCIA]
      ,es.[ID_USUARI_MODIFI] 
	   ,es.[TRANSPORT_ANADA] 
	   ,es.[TRANSPORT_TORNADA] 
	   ,es.[PREGUNTA_1]     
	   ,es.[PREGUNTA_2]   
	   ,es.PREGUNTA_COMBO_1
	   ,es.PREGUNTA_VALORES_COMBO_1
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1) as Assistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=0) as NoAssistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1 and CONFIRMACIOTEC=1) as ConfirmTecnics
	   , (SELECT TOP 1 ASSISTIRE FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ID_CASTELLER=@casteller ) as Assistire,
	   es.ID_TEMPORADA
  FROM [dbo].[ESDEVENIMENT] es INNER JOIN TIPUS_ESDEVENIMENT tipus 
  on es.ID_TIPUS = tipus.ID_TIPUS_ESDEVENIMENT 
  where es.ID_TEMPORADA=@temporada and es.DATA_INICI > GETDATE() and (@text is null OR es.TEXT like '%' + @text + '%' OR es.TITOL like '%' + @text + '%' )  ;


  CREATE FUNCTION [dbo].[fEsdevenimentsHistoric] (@casteller INT,@text varchar(200),@temporada INT)
RETURNS TABLE AS RETURN 
SELECT TOP 10 es.ID_ESDEVENIMENT
      ,es.[TITOL]
      ,es.[TEXT]
      ,es.[ID_TIPUS]
	  ,tipus.TITOL as TIPUS
	  ,tipus.ICONA 
	  , tipus.[FILE] as ICONASRC
      ,es.[DATA_INICI]
      ,es.[DATA_FI]
      ,es.[IMATGE]
      ,es.[IMATGE_MINI]
      ,es.[ID_USUARI_CREADOR]
      ,es.[LATITUD]
      ,es.[LONGITUD]
      ,es.[IND_ESBORRAT]
      ,es.[DATA_CREACIO]
      ,es.[DATA_MODIFICACIO]
      ,es.[OFREIX_TRANSPORT]
      ,es.[ACTIVA]
      ,es.[ANULAT]
	  ,es.DIRECCIO
      ,es.[BLOQUEIX_ASSISTENCIA]
      ,es.[ID_USUARI_MODIFI] 
	   ,es.[TRANSPORT_ANADA] 
	   ,es.[TRANSPORT_TORNADA] 
	   ,es.[PREGUNTA_1]     
	   ,es.[PREGUNTA_2]   
	   ,es.PREGUNTA_COMBO_1
	   ,es.PREGUNTA_VALORES_COMBO_1
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1) as Assistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=0) as NoAssistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1 and CONFIRMACIOTEC=1) as ConfirmTecnics
	   , (SELECT TOP 1 ASSISTIRE FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ID_CASTELLER=@casteller ) as Assistire,
	   es.ID_TEMPORADA
  FROM [dbo].[ESDEVENIMENT] es INNER JOIN TIPUS_ESDEVENIMENT tipus 
  on es.ID_TIPUS = tipus.ID_TIPUS_ESDEVENIMENT 
  where es.ID_TEMPORADA=@temporada and es.DATA_INICI < GETDATE() and (@text is null OR es.TEXT like '%' + @text + '%' OR es.TITOL like '%' + @text + '%' )  ;
--GROUP BY DATEPART(ww, es.DATA_INICI) ,DATEPART(YYYY, es.DATA_INICI);	


  CREATE FUNCTION [dbo].[fEsdevenimentsMes] (@casteller INT,@text varchar(200),@temporada INT, @mes INT)
RETURNS TABLE AS RETURN 
SELECT TOP 10 es.ID_ESDEVENIMENT
      ,es.[TITOL]
      ,es.[TEXT]
      ,es.[ID_TIPUS]
	  ,tipus.TITOL as TIPUS
	  ,tipus.ICONA 
	  , tipus.[FILE] as ICONASRC
      ,es.[DATA_INICI]
      ,es.[DATA_FI]
      ,es.[IMATGE]
      ,es.[IMATGE_MINI]
      ,es.[ID_USUARI_CREADOR]
      ,es.[LATITUD]
      ,es.[LONGITUD]
      ,es.[IND_ESBORRAT]
      ,es.[DATA_CREACIO]
      ,es.[DATA_MODIFICACIO]
      ,es.[OFREIX_TRANSPORT]
      ,es.[ACTIVA]
      ,es.[ANULAT]
	  ,es.DIRECCIO
      ,es.[BLOQUEIX_ASSISTENCIA]
      ,es.[ID_USUARI_MODIFI] 
	   ,es.[TRANSPORT_ANADA] 
	   ,es.[TRANSPORT_TORNADA] 
	   ,es.[PREGUNTA_1]     
	   ,es.[PREGUNTA_2]   
	   ,es.PREGUNTA_COMBO_1
	   ,es.PREGUNTA_VALORES_COMBO_1
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1) as Assistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=0) as NoAssistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1 and CONFIRMACIOTEC=1) as ConfirmTecnics
	   , (SELECT TOP 1 ASSISTIRE FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ID_CASTELLER=@casteller ) as Assistire,
	   es.ID_TEMPORADA
  FROM [dbo].[ESDEVENIMENT] es INNER JOIN TIPUS_ESDEVENIMENT tipus 
  on es.ID_TIPUS = tipus.ID_TIPUS_ESDEVENIMENT 
  where es.ID_TEMPORADA=@temporada and es.DATA_INICI < GETDATE() and (@text is null OR es.TEXT like '%' + @text + '%' OR es.TITOL like '%' + @text + '%' )  ;






  
CREATE TABLE [dbo].[TIPUS_CASTELLS](
	[ID] [int] NOT NULL,
	[CASTELL] [varchar](200) NOT NULL,
PRIMARY KEY CLUSTERED 
( 	[ID] ASC )WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]) ON [PRIMARY]; 


INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 100,'p5');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 110,'p6');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 120,'p7');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 130,'p8');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 140,'p9');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 200,'2p6');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 210,'2p7');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 220,'2p8');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 230,'2p9');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 340,'3p6');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 350,'3p7');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 360,'3p8');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 370,'3p9'); 
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 400,'4p6');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 410,'4p7');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 420,'4p8');
INSERT INTO TIPUS_CASTELLS (ID,CASTELL) VALUES ( 430,'4p9'); 

CREATE TABLE [TIPUS_ESTAT_CASTELL] 
	(
	[ID] [int] NOT NULL,
	[ESTAT] [varchar](200) NOT NULL,
PRIMARY KEY CLUSTERED 
( 	[ID] ASC )WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]) ON [PRIMARY]; 
INSERT INTO TIPUS_ESTAT_CASTELL (ID,[ESTAT]) VALUES ( 0,'Planificat');
INSERT INTO TIPUS_ESTAT_CASTELL (ID,[ESTAT]) VALUES ( 10,'Carregat');
INSERT INTO TIPUS_ESTAT_CASTELL (ID,[ESTAT]) VALUES ( 20,'Descarregat ');
INSERT INTO TIPUS_ESTAT_CASTELL (ID,[ESTAT]) VALUES ( 30,'Llenya'); 
INSERT INTO TIPUS_ESTAT_CASTELL (ID,[ESTAT]) VALUES ( 40,'Intent Desmontat'); 
 

CREATE TABLE [dbo].[ESDEVENIMENT_CASTELLS](
	[ID] [int]  IDENTITY(1,1) NOT NULL,
	[ID_CASTELL] [int] NOT NULL,
	[ID_ESDEVENIMENT] [int] NOT NULL,
	[DATA_ALTA] [date] NOT NULL, 
	[ID_ESTAT_CASTELL] [int] NOT NULL, 
	[XARXA] bit NOT NULL,
	[PROVA] bit NOT NULL,
	[ORDRE] int not null default 0,
	[DATA_MOD] date not null default GETDATE(),
	[OBSERVACIONS] nvarchar(1000)
 CONSTRAINT [PK_ESDEVENIMENT_CASTELLS] PRIMARY KEY CLUSTERED 
(
	[ID] ASC 
) ) ON [PRIMARY]
GO   
SET IDENTITY_INSERT [ESDEVENIMENT_CASTELLS] ON;


ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_CASTELL] FOREIGN KEY([ID_CASTELL])
REFERENCES [dbo].TIPUS_CASTELLS ([ID]); 
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS] CHECK CONSTRAINT [FK_ESDEVENIMENT_CASTELL]
GO

ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_ESDEVEN] FOREIGN KEY([ID_ESDEVENIMENT])
REFERENCES [dbo].ESDEVENIMENT ([ID_ESDEVENIMENT])
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS] CHECK CONSTRAINT [FK_ESDEVENIMENT_ESDEVEN]
GO 
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_ESTAT] FOREIGN KEY([ID_ESTAT_CASTELL])
REFERENCES [dbo].TIPUS_ESTAT_CASTELL (ID)
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS] CHECK CONSTRAINT [FK_ESDEVENIMENT_ESTAT]
GO 
 
CREATE TABLE [dbo].[ESDEVENIMENT_VALORACIO](
	[ID_CASTELLER] [int] NOT NULL,
	[ID_ESDEVENIMENT] [int] NOT NULL,
	[DATA_ALTA] [date] NOT NULL,
	[VALORACIO] [int] NOT NULL
 CONSTRAINT [PK_ESDEVENIMENT_VALORACIO] PRIMARY KEY CLUSTERED 
(
	[ID_CASTELLER] ASC,
	[ID_ESDEVENIMENT] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO  
ALTER TABLE [dbo].[ESDEVENIMENT_VALORACIO]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_VALORACIO] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].CASTELLER ([ID_CASTELLER]);  
GO

ALTER TABLE [dbo].[ESDEVENIMENT_VALORACIO]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_V_ESDEVEN] FOREIGN KEY([ID_ESDEVENIMENT])
REFERENCES [dbo].ESDEVENIMENT ([ID_ESDEVENIMENT])
ALTER TABLE [dbo].[ESDEVENIMENT_VALORACIO] CHECK CONSTRAINT [FK_ESDEVENIMENT_V_ESDEVEN]
GO

 
ALTER TABLE TIPUS_CASTELLS ADD  PROVA bit not null default 0;




INSERT INTO TIPUS_CASTELLS (ID,CASTELL,PROVA) VALUES ( 1010,'p5n',1);
INSERT INTO TIPUS_CASTELLS (ID,CASTELL,PROVA) VALUES ( 1400,'4d6n',1);
INSERT INTO TIPUS_CASTELLS (ID,CASTELL,PROVA) VALUES ( 1500,'5d6n',1);
INSERT INTO TIPUS_CASTELLS (ID,CASTELL,PROVA) VALUES ( 1600,'6d6n',1);
INSERT INTO TIPUS_CASTELLS (ID,CASTELL,PROVA) VALUES ( 1700,'7d6n',1);
INSERT INTO TIPUS_CASTELLS (ID,CASTELL,PROVA) VALUES ( 1800,'8d6n',1);
INSERT INTO TIPUS_CASTELLS (ID,CASTELL,PROVA) VALUES ( 1960,'9d6n',1); 
UPDATE TIPUS_CASTELLS SET PROVA=0 where PROVA is null;



CREATE TABLE [dbo].[TIPUS_PREGUNTA](
	[ID] [int] NOT NULL,
	[DESCRIPCIO] [varchar](200) NOT NULL 
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)); 
INSERT INTO [TIPUS_PREGUNTA] VALUES (10,'Pregunta Booleana'); 
INSERT INTO [TIPUS_PREGUNTA] VALUES (20,'Pregunta Combo'); 
INSERT INTO [TIPUS_PREGUNTA] VALUES (30,'Pregunta Text');
 

/*Refactory de Pregunta*/ 

  
CREATE TABLE [dbo].[TIPUS_PREGUNTA](
	[ID] [int] NOT NULL,
	[DESCRIPCIO] [varchar](200) NOT NULL 
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)); 
INSERT INTO [TIPUS_PREGUNTA] VALUES (10,'Pregunta Booleana'); 
INSERT INTO [TIPUS_PREGUNTA] VALUES (20,'Pregunta Combo'); 
INSERT INTO [TIPUS_PREGUNTA] VALUES (30,'Pregunta Text');
 
   
  
CREATE TABLE [dbo].[ESDEVENIMENT_PREGUNTA]( 
	[ID]  [int] NOT NULL IDENTITY(1,1),
	[ID_ESDEVENIMENT] [int] NOT NULL,
	[TIPUS_PREGUNTA] [int] NOT NULL,
	[PREGUNTA] nvarchar(200) NOT NULL,
	[VALORS] nvarchar(200),
	[DATA_ALTA] [date] NOT NULL 
 CONSTRAINT [PK_ESDEVENIMENT_PREGUNTA] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ESDEVENIMENT_PREGUNTA]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_P_ESDEVEN] FOREIGN KEY([ID_ESDEVENIMENT])
REFERENCES [dbo].[ESDEVENIMENT] ([ID_ESDEVENIMENT])
GO 

ALTER TABLE [dbo].[ESDEVENIMENT_PREGUNTA]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_PREGUNTA] FOREIGN KEY([TIPUS_PREGUNTA])
REFERENCES [dbo].[TIPUS_PREGUNTA] ([ID])
GO

ALTER TABLE [dbo].[ESDEVENIMENT] DROP COLUMN PREGUNTA_1; 
ALTER TABLE [dbo].[ESDEVENIMENT] DROP COLUMN PREGUNTA_2;
ALTER TABLE [dbo].[ESDEVENIMENT] DROP COLUMN PREGUNTA_COMBO_1;
ALTER TABLE [dbo].[ESDEVENIMENT] DROP COLUMN PREGUNTA_VALORES_COMBO_1;

ALTER TABLE [dbo].[ASSISTENCIA] DROP COLUMN RESPOSTA_PREGUNTA_1; 
ALTER TABLE [dbo].[ASSISTENCIA] DROP COLUMN RESPOSTA_PREGUNTA_2; 
ALTER TABLE [dbo].[ASSISTENCIA] DROP COLUMN RESPOSTA_PREGUNTA_COMBO_1; 

ALTER TABLE [dbo].[ASSISTENCIA] ADD  RESPOSTES nvarchar(max); 

ALTER TABLE [ASSISTENCIA] ADD CONSTRAINT [ASSITENCIA_RESPOSTA_JSON] CHECK (ISJSON(RESPOSTES)=1)

/****** Object:  UserDefinedFunction [dbo].[fEsdeveniments]    Script Date: 15/03/2021 13:00:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER FUNCTION [dbo].[fEsdeveniments] (@casteller INT,@temporada INT, @dataActualitzacio Date)
RETURNS TABLE
AS
RETURN 
SELECT es.ID_ESDEVENIMENT
      ,es.[TITOL]
      ,es.[TEXT]
      ,es.[ID_TIPUS]
	  ,tipus.TITOL as TIPUS
	  ,tipus.ICONA 
	  , tipus.[FILE] as ICONASRC
      ,es.[DATA_INICI]
      ,es.[DATA_FI]
      ,es.[IMATGE]
      ,es.[IMATGE_MINI]
      ,es.[ID_USUARI_CREADOR]
      ,es.[LATITUD]
      ,es.[LONGITUD]
      ,es.[IND_ESBORRAT]
      ,es.[DATA_CREACIO]
      ,es.[DATA_MODIFICACIO]
      ,es.[OFREIX_TRANSPORT]
      ,es.[ACTIVA]
      ,es.[ANULAT]
	  ,es.DIRECCIO
      ,es.[BLOQUEIX_ASSISTENCIA]
      ,es.[ID_USUARI_MODIFI] 
	   ,es.[TRANSPORT_ANADA] 
	   ,es.[TRANSPORT_TORNADA]  
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1) as Assistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=0) as NoAssistencia
	  , (SELECT COUNT(*) FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ASSISTIRE=1 and CONFIRMACIOTEC=1) as ConfirmTecnics
	   , (SELECT TOP 1 ASSISTIRE FROM ASSISTENCIA WHERE ID_ESDEVENIMENT= es.ID_ESDEVENIMENT and ID_CASTELLER=@casteller ) as Assistire,
	   es.ID_TEMPORADA
  FROM [dbo].[ESDEVENIMENT] es INNER JOIN TIPUS_ESDEVENIMENT tipus 
  on es.ID_TIPUS = tipus.ID_TIPUS_ESDEVENIMENT where es.ID_TEMPORADA=@temporada and (@dataActualitzacio is null OR es.DATA_MODIFICACIO > @dataActualitzacio);
--GROUP BY DATEPART(ww, es.DATA_INICI) ,DATEPART(YYYY, es.DATA_INICI);

ALTER TABLE FOTOS   ALTER COLUMN DESCRIPCIO ntext NULL;
ALTER TABLE ESDEVENIMENT   ALTER COLUMN Activa bit not null;
ALTER TABLE CASTELLER   ALTER COLUMN HABITUAL bit not null;
ALTER TABLE NOTICIES   ALTER COLUMN ACTIVA bit not null;
ALTER TABLE FOTOS   ALTER COLUMN ACTIVA bit not null;

ALTER TABLE ESDEVENIMENT_CASTELLS ADD XARXA bit not null default 0;
ALTER TABLE ESDEVENIMENT_CASTELLS ADD OBSERVACIONS VARCHAR(300);