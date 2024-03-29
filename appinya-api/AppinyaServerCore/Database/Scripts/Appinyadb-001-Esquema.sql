/**
 *  Appinya Open Source Project
 *  Copyright (C) 2021  Daniel Horta Vidal
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
 
/****** Object:  Table [dbo].[ASSISTENCIA]    Script Date: 21/11/2019 14:30:07 ******/
 /****** Object:  UserDefinedFunction [dbo].[fEstadisticaIndividual]    Script Date: 22/09/2021 9:24:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE  FUNCTION [dbo].[fEstadisticaIndividual] (@casteller INT , @temporada INT)
RETURNS @estadiscita  TABLE (
	Id bigint ,
	ID_TIPUS int ,
	dia int ,
	mes int ,
	anys int , 
	assitire int ,
	confirmacio int ,
	ID_CASTELLER int,
	ID_ESDEVENIMENT int,
	ID_TEMPORADA int
)
AS BEGIN
declare @castellercount int;
declare @musiccount int;
  SELECT @castellercount = count(*)   FROM CASTELLER cas inner join AspNetUsers usr 
  on cas.USER_ID = usr.Id   inner join  AspNetUserRoles rol  on usr.Id = rol.UserId 
  where rol.RoleId in ( 'CASTELLER') and cas.ID_CASTELLER = @casteller;
   SELECT @musiccount = count(*)   FROM CASTELLER cas inner join AspNetUsers usr 
  on cas.USER_ID = usr.Id   inner join  AspNetUserRoles rol  on usr.Id = rol.UserId 
  where rol.RoleId in ('MUSIC') and cas.ID_CASTELLER = @casteller;
  
	if (@castellercount > 0 and @musiccount >0)   
	begin
	  insert into @estadiscita SELECT  *
		FROM vwEstadisticaIndividual es where (ID_CASTELLER=@casteller) AND ID_TEMPORADA=@temporada and ID_TIPUS in (1,2,6)
  
	  insert into @estadiscita SELECT    
			ROW_NUMBER() OVER (ORDER BY  (SELECT        1)) AS Id, 
			esd.ID_TIPUS,
			(DATEPART(dw, esd.DATA_INICI) + 5) % 7 + 1 AS dia, 
			MONTH(esd.DATA_INICI) AS mes, 
			YEAR(esd.DATA_INICI) AS anys, 
			0 AS assitire, 
			0 AS confirmacio, 
			@casteller as ID_CASTELLER,
			esd.ID_ESDEVENIMENT , 
			esd.ID_TEMPORADA
		  FROM ESDEVENIMENT esd where  ID_TEMPORADA=@temporada and esd.IND_ESBORRAT=0 and ID_TIPUS in (1,2,6) and esd.IND_ESBORRAT=0 and  (esd.ANULAT = 0) AND esd.DATA_INICI < GETDATE() and
		   esd.ID_ESDEVENIMENT not in (  SELECT  es.ID_ESDEVENIMENT
		  FROM @estadiscita es);
	end
	ELSE if (@castellercount > 0)   begin
		insert into @estadiscita SELECT  *
		FROM vwEstadisticaIndividual es where (ID_CASTELLER=@casteller) AND ID_TEMPORADA=@temporada and ID_TIPUS in (1,2);
  
	  insert into @estadiscita SELECT    
			ROW_NUMBER() OVER (ORDER BY  (SELECT        1)) AS Id, 
			esd.ID_TIPUS,
			(DATEPART(dw, esd.DATA_INICI) + 5) % 7 + 1 AS dia, 
			MONTH(esd.DATA_INICI) AS mes, 
			YEAR(esd.DATA_INICI) AS anys, 
			0 AS assitire, 
			0 AS confirmacio, 
			@casteller as ID_CASTELLER,
			esd.ID_ESDEVENIMENT , 
			esd.ID_TEMPORADA
		  FROM ESDEVENIMENT esd where  ID_TEMPORADA=@temporada and esd.IND_ESBORRAT=0 and  (esd.ANULAT = 0) AND esd.DATA_INICI < GETDATE() and ID_TIPUS in (1,2) and 
		   esd.ID_ESDEVENIMENT not in (  SELECT  es.ID_ESDEVENIMENT
		  FROM @estadiscita es);
	end
	ELSE if (@musiccount >0)    begin
		insert into @estadiscita SELECT  *
		FROM vwEstadisticaIndividual es where (ID_CASTELLER=@casteller) AND ID_TEMPORADA=@temporada and ID_TIPUS in (1,6);
  
	  insert into @estadiscita SELECT    
			ROW_NUMBER() OVER (ORDER BY  (SELECT        1)) AS Id, 
			esd.ID_TIPUS,
			(DATEPART(dw, esd.DATA_INICI) + 5) % 7 + 1 AS dia, 
			MONTH(esd.DATA_INICI) AS mes, 
			YEAR(esd.DATA_INICI) AS anys, 
			0 AS assitire, 
			0 AS confirmacio, 
			@casteller as ID_CASTELLER,
			esd.ID_ESDEVENIMENT , 
			esd.ID_TEMPORADA
		  FROM ESDEVENIMENT esd where  ID_TEMPORADA=@temporada and esd.IND_ESBORRAT=0 and  (esd.ANULAT = 0) AND esd.DATA_INICI < GETDATE() and ID_TIPUS in (1,6) and 
		   esd.ID_ESDEVENIMENT not in (  SELECT  es.ID_ESDEVENIMENT
		  FROM @estadiscita es);
     end;
RETURN 
END;
GO
/****** Object:  UserDefinedFunction [dbo].[fncEstadisticaIndividual]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  Table [dbo].[ASSISTENCIA]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ASSISTENCIA](
	[ID_CASTELLER] [int] NOT NULL,
	[ID_ESDEVENIMENT] [int] NOT NULL,
	[NUM_ACOMPANYANTS] [int] NULL,
	[IND_ESBORRAT] [bit] NOT NULL,
	[DATA_CREACIO] [datetime] NOT NULL,
	[TRANSPORT] [bit] NULL,
	[OBSERVACIONS] [varchar](200) NULL,
	[ASSISTIRE] [bit] NOT NULL,
	[CONFIRMACIOTEC] [bit] NOT NULL,
	[ID_USUARI_CREADOR] [int] NOT NULL,
	[ID_USUARI_MODIFI] [int] NOT NULL,
	[DATA_MODIFI] [datetime] NOT NULL,
	[DATA_ASSISTENCIA] [datetime] NOT NULL,
	[ASSISTIRE_USUARI] [bit] NULL,
	[TRANSPORT_ANADA] [bit] NULL,
	[TRANSPORT_TORNADA] [bit] NULL,
	[RESPOSTES] [nvarchar](max) NULL,
 CONSTRAINT [PK_ASSISTENCIA_1] PRIMARY KEY CLUSTERED 
(
	[ID_CASTELLER] ASC,
	[ID_ESDEVENIMENT] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ESDEVENIMENT]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ESDEVENIMENT](
	[ID_ESDEVENIMENT] [int] IDENTITY(1,1) NOT NULL,
	[TITOL] [varchar](100) NULL,
	[TEXT] [ntext] NULL,
	[ID_TIPUS] [int] NOT NULL,
	[DATA_INICI] [datetime] NOT NULL,
	[DATA_FI] [datetime] NOT NULL,
	[IMATGE] [varchar](250) NULL,
	[IMATGE_MINI] [varchar](250) NULL,
	[ID_USUARI_CREADOR] [int] NOT NULL,
	[LATITUD] [numeric](18, 6) NULL,
	[LONGITUD] [numeric](18, 6) NULL,
	[IND_ESBORRAT] [bit] NOT NULL,
	[DATA_CREACIO] [datetime] NOT NULL,
	[DATA_MODIFICACIO] [datetime] NOT NULL,
	[OFREIX_TRANSPORT] [bit] NOT NULL,
	[ACTIVA] [bit] NOT NULL,
	[ANULAT] [bit] NOT NULL,
	[BLOQUEIX_ASSISTENCIA] [bit] NOT NULL,
	[ID_USUARI_MODIFI] [int] NOT NULL,
	[DIRECCIO] [varchar](200) NULL,
	[EMERGENT] [bit] NOT NULL,
	[ID_TEMPORADA] [int] NOT NULL,
	[TRANSPORT_ANADA] [bit] NULL,
	[TRANSPORT_TORNADA] [bit] NULL,
 CONSTRAINT [PK_ESDEVENIMENT] PRIMARY KEY CLUSTERED 
(
	[ID_ESDEVENIMENT] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TIPUS_ESDEVENIMENT]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TIPUS_ESDEVENIMENT](
	[ID_TIPUS_ESDEVENIMENT] [int] NOT NULL,
	[TITOL] [varchar](50) NOT NULL,
	[ICONA] [varchar](200) NOT NULL,
	[FILE] [varchar](100) NULL,
 CONSTRAINT [PK_TIPUS_ESDEVENIMENT] PRIMARY KEY CLUSTERED 
(
	[ID_TIPUS_ESDEVENIMENT] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [dbo].[fEsdevenimentsActuals]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[fEsdevenimentsActuals] (@casteller INT,@text varchar(200),@temporada INT)
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
GO
/****** Object:  UserDefinedFunction [dbo].[fEsdevenimentsHistoric]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

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
GO
/****** Object:  UserDefinedFunction [dbo].[fEsdevenimentsMes]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
  where es.ID_TEMPORADA=@temporada and MONTH(es.DATA_INICI) = @mes  and (@text is null OR es.TEXT like '%' + @text + '%' OR es.TITOL like '%' + @text + '%' )  ;
GO
/****** Object:  View [dbo].[vwEstadisticaGlobal]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 CREATE VIEW [dbo].[vwEstadisticaGlobal]
AS
SELECT        DATEPART(dw, esd.DATA_INICI) AS dia, MONTH(esd.DATA_INICI) AS mes,YEAR(esd.DATA_INICI) AS anys, COALESCE (ass.ASSISTIRE, 0) AS assitire, COALESCE (ass.CONFIRMACIOTEC, 0) 
                         AS confirmacio ,COUNT(*)  as castellers
FROM            dbo.ASSISTENCIA AS ass RIGHT OUTER JOIN
                         dbo.ESDEVENIMENT AS esd ON ass.ID_ESDEVENIMENT = esd.ID_ESDEVENIMENT
WHERE        (esd.ANULAT = 0) 
GROUP BY  DATEPART(dw, esd.DATA_INICI)  , MONTH(esd.DATA_INICI)  , YEAR(esd.DATA_INICI), COALESCE (ass.ASSISTIRE, 0) , COALESCE (ass.CONFIRMACIOTEC, 0)
GO
/****** Object:  View [dbo].[vwEstadisticaIndividual]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE view [dbo].[vwEstadisticaIndividual] as
SELECT        ROW_NUMBER() OVER (ORDER BY 
                             (SELECT        1)) AS Id, esd.ID_TIPUS, 
							 (DATEPART(dw, esd.DATA_INICI) + 5) % 7 + 1 AS dia, 
							 MONTH(esd.DATA_INICI) AS mes, YEAR(esd.DATA_INICI) AS anys, COALESCE (ass.ASSISTIRE, 0) AS assitire, 
COALESCE (ass.CONFIRMACIOTEC, 0) AS confirmacio, ass.ID_CASTELLER,ass.ID_ESDEVENIMENT , esd.ID_TEMPORADA
FROM            dbo.ASSISTENCIA AS ass INNER JOIN
                         dbo.ESDEVENIMENT AS esd ON ass.ID_ESDEVENIMENT = esd.ID_ESDEVENIMENT 
WHERE        (esd.ANULAT = 0) AND esd.DATA_INICI < GETDATE() AND esd.IND_ESBORRAT = 0 and ID_TIPUS  in (1,2,6) ;
GO
/****** Object:  View [dbo].[vwEstadisticaXDia]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE VIEW [dbo].[vwEstadisticaXDia] as
 SELECT assistencia.dia,assistencia.temporada,  COUNT(*) as contador
 FROM 
(
SELECT DISTINCT DATEPART(dw, es.DATA_INICI) as dia, DATEPART(YYYY, es.DATA_INICI) as temporada, ass.ID_CASTELLER  
FROM ASSISTENCIA ass inner join ESDEVENIMENT es 
on ass.ID_ESDEVENIMENT = es.ID_ESDEVENIMENT
where ass.ASSISTIRE=1 and ass.CONFIRMACIOTEC=1 and ass.IND_ESBORRAT=0 and es.ID_TIPUS in (1,2,3) 
) assistencia
GROUP BY assistencia.dia,assistencia.temporada;
GO
/****** Object:  View [dbo].[vwEstadisticaXSetmana]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vwEstadisticaXSetmana] as
SELECT assistencia.Setmana,assistencia.temporada,  COUNT(*) as contador
 FROM 
(
SELECT DISTINCT DATEPART(ww, es.DATA_INICI) as Setmana, DATEPART(YYYY, es.DATA_INICI) as temporada, ass.ID_CASTELLER  
FROM ASSISTENCIA ass inner join ESDEVENIMENT es 
on ass.ID_ESDEVENIMENT = es.ID_ESDEVENIMENT
where ass.ASSISTIRE=1 and ass.CONFIRMACIOTEC=1 and ass.IND_ESBORRAT=0 and es.ID_TIPUS in (1,2,3) 
) assistencia
GROUP BY assistencia.Setmana,assistencia.temporada;
GO
/****** Object:  Table [dbo].[FOTOS]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FOTOS](
	[ID_FOTOS] [int] IDENTITY(1,1) NOT NULL,
	[DATA] [date] NOT NULL,
	[PORTADA] [text] NULL,
	[ALBUM] [text] NOT NULL,
	[DESCRIPCIO] [ntext] NULL,
	[ID_FOTOGRAF] [int] NULL,
	[URL] [text] NULL,
	[DATA_CREACIO] [datetime] NOT NULL,
	[DATA_MODIFICACIO] [datetime] NOT NULL,
	[ACTIVA] [bit] NOT NULL,
	[ID_USUARI_CREADOR] [int] NOT NULL,
	[ID_USUARI_MODIFICA] [int] NOT NULL,
	[ID_TEMPORADA] [int] NOT NULL,
 CONSTRAINT [PK_FOTOS] PRIMARY KEY CLUSTERED 
(
	[ID_FOTOS] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FOTOS_LIKE]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FOTOS_LIKE](
	[ID_FOTOS] [int] NOT NULL,
	[ID_CASTELLER] [int] NOT NULL,
	[DATA_MODIFICACIO] [date] NOT NULL,
	[LIKE] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_FOTOS] ASC,
	[ID_CASTELLER] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[vwFotosLike]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vwFotosLike]  as 
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
/****** Object:  UserDefinedFunction [dbo].[fEsdeveniments]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[fEsdeveniments] (@casteller INT,@temporada INT, @dataActualitzacio Date)
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
GO
/****** Object:  UserDefinedFunction [dbo].[fFotoLikes]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

	CREATE FUNCTION [dbo].[fFotoLikes] (@casteller INT , @idTemporada INT )
RETURNS TABLE
AS
RETURN 
SELECT  fotoLike.ID_FOTOS, fotoLike.contador as contador, [like] as Jo
  FROM FOTOS fot INNER JOIN vwFotosLike  fotoLike on fotoLike.ID_FOTOS = fot.ID_FOTOS LEFT JOIN FOTOS_LIKE me 
  on fotoLike.ID_FOTOS=me.ID_FOTOS and me.ID_CASTELLER=@casteller and fot.ID_TEMPORADA=@idTemporada ;
GO
/****** Object:  UserDefinedFunction [dbo].[fncFotoLikes]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[fncFotoLikes] (@casteller INT , @idTemporada INT )
RETURNS TABLE
AS
RETURN 
SELECT  fotoLike.ID_FOTOS as IdFotos, fotoLike.contador as Contador, [like] as Jo , castellers as Castellers
  FROM FOTOS fot INNER JOIN vwFotosLike  fotoLike on fotoLike.ID_FOTOS = fot.ID_FOTOS LEFT JOIN FOTOS_LIKE me 
  on fotoLike.ID_FOTOS=me.ID_FOTOS and me.ID_CASTELLER=@casteller and fot.ID_TEMPORADA=@idTemporada ;
GO
/****** Object:  Table [dbo].[ACCIO_LOG]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ACCIO_LOG](
	[ID_ACCIO] [int] NOT NULL,
	[DESCRIPCIO] [varchar](200) NULL,
 CONSTRAINT [PK_ACCIO_LOG] PRIMARY KEY CLUSTERED 
(
	[ID_ACCIO] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ACTUALITZACIONS]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ACTUALITZACIONS](
	[ID_TABLA] [varchar](50) NOT NULL,
	[DATA_MODIFICACIO] [datetime] NOT NULL,
 CONSTRAINT [PK_ACTUALITZACIONS] PRIMARY KEY CLUSTERED 
(
	[ID_TABLA] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CASTELLER]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CASTELLER](
	[ID_CASTELLER] [int] IDENTITY(1,1) NOT NULL,
	[NOM] [varchar](50) NOT NULL,
	[COGNOMS] [varchar](200) NOT NULL,
	[ALIAS] [varchar](250) NOT NULL,
	[DATA_NAIXEMENT] [date] NULL,
	[DATA_ALTA] [date] NOT NULL,
	[TELEFON1] [varchar](100) NOT NULL,
	[TE_CAMISA] [bit] NOT NULL,
	[DATA_LLIUREAMENT] [date] NULL,
	[EMAIL] [nvarchar](256) NULL,
	[TELEFON2] [varchar](100) NULL,
	[TWITTER] [varchar](100) NULL,
	[USER_ID] [nvarchar](128) NULL,
	[ES_BAIXA] [bit] NOT NULL,
	[IND_ESBORRAT] [bit] NOT NULL,
	[DATA_CREACIO] [datetime] NOT NULL,
	[DATA_MODIFICACIO] [datetime] NOT NULL,
	[DATA_BAIXA] [datetime] NULL,
	[DIRECCIO] [nvarchar](256) NULL,
	[CP] [nvarchar](8) NULL,
	[ASSEGURAT] [bit] NOT NULL,
	[ID_MUNICIPI] [numeric](18, 0) NOT NULL,
	[VIS_DIRECCIO] [bit] NOT NULL,
	[VIS_TELEFON1] [bit] NOT NULL,
	[VIS_TELEFON2] [bit] NOT NULL,
	[VIS_DATANAIX] [bit] NOT NULL,
	[FOTO] [text] NULL,
	[DOCUMENT_ID] [varchar](20) NULL,
	[TIPUS_DOCUMENT] [int] NULL,
	[HABITUAL] [bit] NOT NULL,
	[REBREMAILNOT] [bit] NOT NULL,
	[REBREMAILFOTOS] [bit] NOT NULL,
	[SANITARI] [bit] NOT NULL,
	[EDAT] [int] NOT NULL,
	[TE_CASC] [bit] NOT NULL,
	[CASC_LLOGUER] [bit] NOT NULL,
	[OBSERVACIONS] [varchar](200) NULL,
 CONSTRAINT [PK_CASTELLER] PRIMARY KEY CLUSTERED 
(
	[ID_CASTELLER] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CASTELLER_DELEGA]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CASTELLER_DELEGA](
	[ID_CASTELLER1] [int] NOT NULL,
	[ID_CASTELLER2] [int] NOT NULL,
	[DATA_ALTA] [date] NOT NULL,
	[CONFIRM] [bit] NOT NULL,
	[T_REFERENT] [bit] NOT NULL,
 CONSTRAINT [PK_CASTELLER_DELEGA] PRIMARY KEY CLUSTERED 
(
	[ID_CASTELLER1] ASC,
	[ID_CASTELLER2] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CASTELLER_IMATGE]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CASTELLER_IMATGE](
	[ID_CASTELLER] [int] NOT NULL,
	[FOTO] [varbinary](max) NOT NULL,
 CONSTRAINT [PK_CASTELLER_IMATGE] PRIMARY KEY CLUSTERED 
(
	[ID_CASTELLER] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CASTELLER_ORGANITZACIO]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CASTELLER_ORGANITZACIO](
	[ID_CASTELLER] [int] NOT NULL,
	[ID_CARREC] [int] NOT NULL,
 CONSTRAINT [PK_CASTELLER_ORGANITZACIO] PRIMARY KEY CLUSTERED 
(
	[ID_CASTELLER] ASC,
	[ID_CARREC] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CASTELLER_POSICIO]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CASTELLER_POSICIO](
	[ID_CASTELLER] [int] NOT NULL,
	[ID_POSICIO] [int] NOT NULL,
	[QUALITAT] [int] NOT NULL,
 CONSTRAINT [PK_CASTELLER_POSICIO] PRIMARY KEY CLUSTERED 
(
	[ID_CASTELLER] ASC,
	[ID_POSICIO] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CONVOCATORIA]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CONVOCATORIA](
	[ID_CONVOCATORIA] [int] NOT NULL,
	[MISSATGE] [text] NOT NULL,
	[DATA_CREACIO] [datetime] NOT NULL,
	[ID_CASTELLER] [int] NULL,
 CONSTRAINT [PK_CONVOCATORIA] PRIMARY KEY CLUSTERED 
(
	[ID_CONVOCATORIA] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DADES_TECNIQUES]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DADES_TECNIQUES](
	[ID_CASTELLER] [int] NOT NULL,
	[ALCADA] [int] NULL,
	[BRACOS] [int] NULL,
	[ESPATLLA] [int] NULL,
	[PES] [int] NULL,
	[OBSERVACIONS] [varchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_CASTELLER] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DEUTES]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DEUTES](
	[ID_DEUTE] [int] IDENTITY(1,1) NOT NULL,
	[ID_CASTELLER] [int] NOT NULL,
	[CONCEPTE] [varchar](200) NOT NULL,
	[DATA] [datetime] NOT NULL,
	[VALOR] [numeric](8, 2) NOT NULL,
	[PAGAT] [bit] NOT NULL,
	[OBSERVACIONS] [varchar](200) NULL,
	[DATA_PAGAMENT] [datetime] NULL,
	[IND_BORRAT] [bit] NOT NULL,
	[USUARI_CREADOR] [int] NOT NULL,
	[DATA_CREACIO] [datetime] NOT NULL,
	[USUARI_MODIFIC] [int] NOT NULL,
	[DATA_MODIFIC] [datetime] NOT NULL,
 CONSTRAINT [PK_DEUTES] PRIMARY KEY CLUSTERED 
(
	[ID_DEUTE] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EQUIPS]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EQUIPS](
	[ID_EQUIP] [int] IDENTITY(1,1) NOT NULL,
	[NOM] [varchar](200) NOT NULL,
	[EMAIL_CONTACTE] [varchar](200) NOT NULL,
	[USUARI_CREADOR] [int] NOT NULL,
	[DATA_CREACIO] [datetime] NOT NULL,
	[USUARI_MODIFIC] [int] NOT NULL,
	[DATA_MODIFIC] [datetime] NOT NULL,
 CONSTRAINT [PK_EQUIP] PRIMARY KEY CLUSTERED 
(
	[ID_EQUIP] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ESDEVENIMENT_CASTELLS]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ESDEVENIMENT_CASTELLS](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ID_CASTELL] [int] NOT NULL,
	[ID_ESDEVENIMENT] [int] NOT NULL,
	[DATA_ALTA] [date] NOT NULL,
	[ID_ESTAT_CASTELL] [int] NOT NULL,
	[XARXA] [bit] NOT NULL,
	[PROVA] [bit] NOT NULL,
	[ORDRE] [int] NOT NULL,
	[DATA_MOD] [date] NOT NULL,
	[OBSERVACIONS] [nvarchar](1000) NULL,
 CONSTRAINT [PK_ESDEVENIMENT_CASTELLS] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ESDEVENIMENT_LOG]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ESDEVENIMENT_LOG](
	[ID_LOG] [int] IDENTITY(1,1) NOT NULL,
	[ID_ESDEVENIMENT] [int] NOT NULL,
	[ID_CASTELLER] [int] NOT NULL,
	[DATA] [datetime] NOT NULL,
	[ID_ACCIO] [int] NOT NULL,
	[ID_CASTELLER_CREADOR] [int] NOT NULL,
 CONSTRAINT [PK_ESDEVENIMENT_LOG] PRIMARY KEY CLUSTERED 
(
	[ID_LOG] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ESDEVENIMENT_PREGUNTA]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ESDEVENIMENT_PREGUNTA](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ID_ESDEVENIMENT] [int] NOT NULL,
	[TIPUS_PREGUNTA] [int] NOT NULL,
	[PREGUNTA] [nvarchar](200) NOT NULL,
	[VALORS] [nvarchar](200) NULL,
	[DATA_ALTA] [date] NOT NULL,
 CONSTRAINT [PK_ESDEVENIMENT_PREGUNTA] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ESDEVENIMENT_VALORACIO]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ESDEVENIMENT_VALORACIO](
	[ID_CASTELLER] [int] NOT NULL,
	[ID_ESDEVENIMENT] [int] NOT NULL,
	[DATA_ALTA] [date] NOT NULL,
	[VALORACIO] [int] NOT NULL,
 CONSTRAINT [PK_ESDEVENIMENT_VALORACIO] PRIMARY KEY CLUSTERED 
(
	[ID_CASTELLER] ASC,
	[ID_ESDEVENIMENT] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Excel_colla]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Excel_colla](
	[Soci] [nvarchar](128) NULL,
	[national_id_type] [nvarchar](128) NULL,
	[DNI] [nvarchar](128) NULL,
	[Nom] [nvarchar](128) NULL,
	[Cognoms] [nvarchar](128) NULL,
	[Sobrenom] [nvarchar](128) NULL,
	[Gènere] [nvarchar](128) NULL,
	[Aniversari] [nvarchar](128) NULL,
	[E_mail_1] [nvarchar](128) NULL,
	[E_mail_2] [nvarchar](128) NULL,
	[E_mail_3] [nvarchar](128) NULL,
	[Telf_Mobil] [nvarchar](128) NULL,
	[Telf] [nvarchar](128) NULL,
	[Telf_Emergencia] [nvarchar](128) NULL,
	[Adreca] [nvarchar](128) NULL,
	[Codi_postal] [nvarchar](128) NULL,
	[Ciutat] [nvarchar](128) NULL,
	[Comarca] [nvarchar](128) NULL,
	[Pais] [nvarchar](128) NULL,
	[Comentaris] [nvarchar](128) NULL,
	[Etiquetes] [nvarchar](128) NULL,
	[Assegurat] [nvarchar](128) NULL,
	[Professió] [nvarchar](128) NULL,
	[Data_alta] [nvarchar](128) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FOTOS_IMATGE]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FOTOS_IMATGE](
	[ID_FOTOS] [int] NOT NULL,
	[PORTADA] [varbinary](max) NOT NULL,
 CONSTRAINT [PK_FOTOS_IMATGES] PRIMARY KEY CLUSTERED 
(
	[ID_FOTOS] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Log]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Log](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Data] [datetime] NOT NULL,
	[Accio] [varchar](100) NOT NULL,
	[Objecte] [varchar](100) NOT NULL,
	[ObjecteId] [int] NULL,
	[Descripcio] [varchar](200) NULL,
	[Usuari] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LogJobs]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LogJobs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Descripcio] [varchar](200) NOT NULL,
	[DataInici] [datetime] NOT NULL,
	[DataFi] [datetime] NULL,
	[Finalitzat] [bit] NOT NULL,
	[Error] [varchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MUNICIPI]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MUNICIPI](
	[ID_MUNICIPI] [numeric](18, 0) NOT NULL,
	[CODI] [nvarchar](5) NOT NULL,
	[DESCRIPCIO] [nvarchar](256) NOT NULL,
	[ID_PROVINCIA] [numeric](18, 0) NOT NULL,
 CONSTRAINT [PK_MUNICIPIO] PRIMARY KEY CLUSTERED 
(
	[ID_MUNICIPI] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NOTICIES]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NOTICIES](
	[ID_NOTICIES] [int] IDENTITY(1,1) NOT NULL,
	[DATA] [date] NOT NULL,
	[TITULO] [ntext] NOT NULL,
	[DESCRIPCIO] [ntext] NOT NULL,
	[URL] [text] NULL,
	[DATA_CREACIO] [datetime] NOT NULL,
	[DATA_MODIFICACIO] [datetime] NOT NULL,
	[ACTIVA] [bit] NOT NULL,
	[ID_CASTELLER] [int] NULL,
	[ID_TIPUS_NOTICIES] [int] NOT NULL,
	[ID_USUARI_CREADOR] [int] NOT NULL,
	[ID_USUARI_MODIFICA] [int] NOT NULL,
	[INDEFINIDA] [bit] NOT NULL,
	[FOTO] [text] NULL,
 CONSTRAINT [PK_NOTICIES] PRIMARY KEY CLUSTERED 
(
	[ID_NOTICIES] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ORGANITZACIO]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORGANITZACIO](
	[ID] [int] NOT NULL,
	[Descripcio] [varchar](100) NOT NULL,
	[ID_PARE] [int] NULL,
 CONSTRAINT [PK_ORGANITZACIO] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[POSICIO]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[POSICIO](
	[ID_POSICIO] [int] NOT NULL,
	[DESCRIPCIO] [varchar](200) NOT NULL,
	[ICONA] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_POSICIO] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PROVINCIA]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PROVINCIA](
	[ID_PROVINCIA] [numeric](18, 0) NOT NULL,
	[CODI] [nvarchar](5) NOT NULL,
	[DESCRIPCIO] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_PROVINCIA] PRIMARY KEY CLUSTERED 
(
	[ID_PROVINCIA] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RESPONSABLE_LEGAL]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RESPONSABLE_LEGAL](
	[ID_CASTELLER] [int] NOT NULL,
	[ID_TIPUS_RESPONSABLE] [int] NOT NULL,
	[NOM] [varchar](50) NOT NULL,
	[COGNOMS] [varchar](200) NOT NULL,
	[TELEFON1] [varchar](100) NOT NULL,
	[EMAIL] [nvarchar](256) NOT NULL,
	[TELEFON2] [varchar](100) NULL,
	[ESCASTELLER] [bit] NOT NULL,
	[IdCastellerResponsable] [int] NULL,
 CONSTRAINT [PK_RESPONSABLE_LEGAL] PRIMARY KEY CLUSTERED 
(
	[ID_CASTELLER] ASC,
	[ID_TIPUS_RESPONSABLE] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TEMPORADA]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TEMPORADA](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[DESCRIPCIO] [nvarchar](250) NOT NULL,
	[DATA_INICI] [date] NOT NULL,
	[DATA_FIN] [date] NOT NULL,
	[PUNTUACIO] [numeric](18, 0) NULL,
 CONSTRAINT [PK_TEMPORADA] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TIPUS_CASTELLS]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TIPUS_CASTELLS](
	[ID] [int] NOT NULL,
	[CASTELL] [varchar](200) NOT NULL,
	[PROVA] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TIPUS_DOCUMENT]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TIPUS_DOCUMENT](
	[ID] [int] NOT NULL,
	[DOCUMENT] [varchar](200) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TIPUS_ESTAT_CASTELL]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TIPUS_ESTAT_CASTELL](
	[ID] [int] NOT NULL,
	[ESTAT] [varchar](200) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TIPUS_NOTICIES]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TIPUS_NOTICIES](
	[ID] [int] NOT NULL,
	[DESCRIPCIO] [varchar](200) NOT NULL,
	[ICONA] [varchar](200) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TIPUS_PREGUNTA]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TIPUS_PREGUNTA](
	[ID] [int] NOT NULL,
	[DESCRIPCIO] [varchar](200) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TIPUS_RESPONSABLE]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TIPUS_RESPONSABLE](
	[ID_TIPUS_RESPONSABLE] [int] NOT NULL,
	[DESCRIPCIO] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_TIPUS_RESPONSABLE] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VERSIONS]    Script Date: 22/09/2021 9:24:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VERSIONS](
	[ID_VERSIO] [int] NOT NULL,
	[VERSIO] [varchar](20) NOT NULL,
	[DESCRIPCIO] [varchar](200) NULL,
	[REFRESCAR_MODEL] [bit] NOT NULL,
	[ACTUALITZACIO_APP] [bit] NOT NULL,
	[ULTIMAVERSIO] [bit] NOT NULL,
	[IND_ESBORRAT] [bit] NOT NULL,
	[DATA_CREACIO] [date] NOT NULL,
 CONSTRAINT [PK_VERSIONS] PRIMARY KEY CLUSTERED 
(
	[ID_VERSIO] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ACTUALITZACIONS] ADD  CONSTRAINT [DF__ACTUALITZ__DATA___681373AD]  DEFAULT (getdate()) FOR [DATA_MODIFICACIO]
GO
ALTER TABLE [dbo].[ASSISTENCIA] ADD  CONSTRAINT [DF_ASSISTENCIA_IND_ESBORRAT]  DEFAULT ((1)) FOR [IND_ESBORRAT]
GO
ALTER TABLE [dbo].[ASSISTENCIA] ADD  CONSTRAINT [DF_ASSISTENCIA_DATA_CREACIO]  DEFAULT (getdate()) FOR [DATA_CREACIO]
GO
ALTER TABLE [dbo].[ASSISTENCIA] ADD  CONSTRAINT [DF__ASSISTENC__CONFI__5EBF139D]  DEFAULT ((0)) FOR [CONFIRMACIOTEC]
GO
ALTER TABLE [dbo].[ASSISTENCIA] ADD  CONSTRAINT [DF__ASSISTENC__DATA___0B91BA14]  DEFAULT (getdate()) FOR [DATA_MODIFI]
GO
ALTER TABLE [dbo].[ASSISTENCIA] ADD  CONSTRAINT [DF__ASSISTENC__DATA___3C34F16F]  DEFAULT (getdate()) FOR [DATA_ASSISTENCIA]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF_CASTELLER_ES_BAIXA]  DEFAULT ((0)) FOR [ES_BAIXA]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF_CASTELLER_IND_BORRAT]  DEFAULT ((0)) FOR [IND_ESBORRAT]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF_CASTELLER_DATA_CREACIO]  DEFAULT (getdate()) FOR [DATA_CREACIO]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__DATA___45F365D3]  DEFAULT (getdate()) FOR [DATA_MODIFICACIO]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__ASSEG__656C112C]  DEFAULT ((0)) FOR [ASSEGURAT]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__VIS_D__6754599E]  DEFAULT ((0)) FOR [VIS_DIRECCIO]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__VIS_T__68487DD7]  DEFAULT ((0)) FOR [VIS_TELEFON1]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__VIS_T__693CA210]  DEFAULT ((0)) FOR [VIS_TELEFON2]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__VIS_D__6A30C649]  DEFAULT ((0)) FOR [VIS_DATANAIX]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__HABIT__151B244E]  DEFAULT ((1)) FOR [HABITUAL]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__REBRE__662B2B3B]  DEFAULT ((0)) FOR [REBREMAILNOT]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__REBRE__671F4F74]  DEFAULT ((0)) FOR [REBREMAILFOTOS]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__SANIT__681373AD]  DEFAULT ((0)) FOR [SANITARI]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__EDAT__345EC57D]  DEFAULT ((0)) FOR [EDAT]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__TE_CA__3552E9B6]  DEFAULT ((0)) FOR [TE_CASC]
GO
ALTER TABLE [dbo].[CASTELLER] ADD  CONSTRAINT [DF__CASTELLER__CASC___36470DEF]  DEFAULT ((0)) FOR [CASC_LLOGUER]
GO
ALTER TABLE [dbo].[CASTELLER_DELEGA] ADD  CONSTRAINT [DF_CASTELLER_DELEGA_dataalta]  DEFAULT (getdate()) FOR [DATA_ALTA]
GO
ALTER TABLE [dbo].[CASTELLER_DELEGA] ADD  DEFAULT ((0)) FOR [CONFIRM]
GO
ALTER TABLE [dbo].[CASTELLER_DELEGA] ADD  DEFAULT ((0)) FOR [T_REFERENT]
GO
ALTER TABLE [dbo].[CASTELLER_POSICIO] ADD  DEFAULT ((0)) FOR [QUALITAT]
GO
ALTER TABLE [dbo].[DEUTES] ADD  DEFAULT (getdate()) FOR [DATA]
GO
ALTER TABLE [dbo].[DEUTES] ADD  DEFAULT ((0)) FOR [VALOR]
GO
ALTER TABLE [dbo].[DEUTES] ADD  DEFAULT ((0)) FOR [PAGAT]
GO
ALTER TABLE [dbo].[DEUTES] ADD  DEFAULT ((0)) FOR [IND_BORRAT]
GO
ALTER TABLE [dbo].[EQUIPS] ADD  DEFAULT (getdate()) FOR [DATA_CREACIO]
GO
ALTER TABLE [dbo].[EQUIPS] ADD  DEFAULT (getdate()) FOR [DATA_MODIFIC]
GO
ALTER TABLE [dbo].[ESDEVENIMENT] ADD  CONSTRAINT [DF_ESDEVENIMENT_IND_BORRAT]  DEFAULT ((0)) FOR [IND_ESBORRAT]
GO
ALTER TABLE [dbo].[ESDEVENIMENT] ADD  CONSTRAINT [DF_ESDEVENIMENT_DATA_CREACIO]  DEFAULT (getdate()) FOR [DATA_CREACIO]
GO
ALTER TABLE [dbo].[ESDEVENIMENT] ADD  CONSTRAINT [DF__ESDEVENIM__DATA___4CA06362]  DEFAULT (getdate()) FOR [DATA_MODIFICACIO]
GO
ALTER TABLE [dbo].[ESDEVENIMENT] ADD  CONSTRAINT [DF__ESDEVENIM__OFREI__4D94879B]  DEFAULT ((0)) FOR [OFREIX_TRANSPORT]
GO
ALTER TABLE [dbo].[ESDEVENIMENT] ADD  CONSTRAINT [DF__ESDEVENIM__ACTIV__6FE99F9F]  DEFAULT ((1)) FOR [ACTIVA]
GO
ALTER TABLE [dbo].[ESDEVENIMENT] ADD  CONSTRAINT [DF__ESDEVENIM__ANULA__7A672E12]  DEFAULT ((0)) FOR [ANULAT]
GO
ALTER TABLE [dbo].[ESDEVENIMENT] ADD  CONSTRAINT [DF__ESDEVENIM__BLOQU__7C4F7684]  DEFAULT ((0)) FOR [BLOQUEIX_ASSISTENCIA]
GO
ALTER TABLE [dbo].[ESDEVENIMENT] ADD  CONSTRAINT [DF__ESDEVENIM__EMERG__3D2915A8]  DEFAULT ((0)) FOR [EMERGENT]
GO
ALTER TABLE [dbo].[ESDEVENIMENT] ADD  CONSTRAINT [DF__ESDEVENIM__ID_TE__03BB8E22]  DEFAULT ((1)) FOR [ID_TEMPORADA]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS] ADD  DEFAULT ((0)) FOR [ORDRE]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS] ADD  DEFAULT (getdate()) FOR [DATA_MOD]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_LOG] ADD  CONSTRAINT [DF__ESDEVENIMENT_LOG_DATA]  DEFAULT (getdate()) FOR [DATA]
GO
ALTER TABLE [dbo].[FOTOS] ADD  CONSTRAINT [FK_FOTOS_DATA_CREACIO]  DEFAULT (getdate()) FOR [DATA_CREACIO]
GO
ALTER TABLE [dbo].[FOTOS] ADD  CONSTRAINT [FK_FOTOS_DATA_MODIFICACIO]  DEFAULT (getdate()) FOR [DATA_MODIFICACIO]
GO
ALTER TABLE [dbo].[FOTOS] ADD  CONSTRAINT [FK_FOTOS_ACTIVA]  DEFAULT ((1)) FOR [ACTIVA]
GO
ALTER TABLE [dbo].[FOTOS] ADD  CONSTRAINT [DF__FOTOS__ID_TEMPOR__05A3D694]  DEFAULT ((1)) FOR [ID_TEMPORADA]
GO
ALTER TABLE [dbo].[FOTOS_LIKE] ADD  DEFAULT (getdate()) FOR [DATA_MODIFICACIO]
GO
ALTER TABLE [dbo].[FOTOS_LIKE] ADD  DEFAULT ((1)) FOR [LIKE]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (getdate()) FOR [Data]
GO
ALTER TABLE [dbo].[LogJobs] ADD  DEFAULT ((0)) FOR [Finalitzat]
GO
ALTER TABLE [dbo].[NOTICIES] ADD  CONSTRAINT [DF__NOTICIES__DATA_C__634EBE90]  DEFAULT (getdate()) FOR [DATA_CREACIO]
GO
ALTER TABLE [dbo].[NOTICIES] ADD  CONSTRAINT [DF__NOTICIES__DATA_M__6442E2C9]  DEFAULT (getdate()) FOR [DATA_MODIFICACIO]
GO
ALTER TABLE [dbo].[NOTICIES] ADD  CONSTRAINT [DF__NOTICIES__ACTIVA__1B9317B3]  DEFAULT ((1)) FOR [ACTIVA]
GO
ALTER TABLE [dbo].[NOTICIES] ADD  CONSTRAINT [DF__NOTICIES__ID_TIP__75A278F5]  DEFAULT ((1)) FOR [ID_TIPUS_NOTICIES]
GO
ALTER TABLE [dbo].[NOTICIES] ADD  CONSTRAINT [DF__NOTICIES__INDEFI__797309D9]  DEFAULT ((0)) FOR [INDEFINIDA]
GO
ALTER TABLE [dbo].[RESPONSABLE_LEGAL] ADD  DEFAULT ((0)) FOR [ESCASTELLER]
GO
ALTER TABLE [dbo].[TIPUS_CASTELLS] ADD  DEFAULT ((0)) FOR [PROVA]
GO
ALTER TABLE [dbo].[ASSISTENCIA]  WITH CHECK ADD  CONSTRAINT [FK_ASSISTENCIA_CASTELLER] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[ASSISTENCIA] CHECK CONSTRAINT [FK_ASSISTENCIA_CASTELLER]
GO
ALTER TABLE [dbo].[ASSISTENCIA]  WITH CHECK ADD  CONSTRAINT [FK_ASSISTENCIA_ESDEVENIMENT] FOREIGN KEY([ID_ESDEVENIMENT])
REFERENCES [dbo].[ESDEVENIMENT] ([ID_ESDEVENIMENT])
GO
ALTER TABLE [dbo].[ASSISTENCIA] CHECK CONSTRAINT [FK_ASSISTENCIA_ESDEVENIMENT]
GO
ALTER TABLE [dbo].[ASSISTENCIA]  WITH CHECK ADD  CONSTRAINT [FK_ASSISTENCIA_USUARI_CREADOR] FOREIGN KEY([ID_USUARI_CREADOR])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[ASSISTENCIA] CHECK CONSTRAINT [FK_ASSISTENCIA_USUARI_CREADOR]
GO
ALTER TABLE [dbo].[ASSISTENCIA]  WITH CHECK ADD  CONSTRAINT [FK_ASSISTENCIA_USUARI_MODIF] FOREIGN KEY([ID_USUARI_MODIFI])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[ASSISTENCIA] CHECK CONSTRAINT [FK_ASSISTENCIA_USUARI_MODIF]
GO
ALTER TABLE [dbo].[CASTELLER]  WITH NOCHECK ADD  CONSTRAINT [FK__CASTELLER__ID_MU__66603565] FOREIGN KEY([ID_MUNICIPI])
REFERENCES [dbo].[MUNICIPI] ([ID_MUNICIPI])
GO
ALTER TABLE [dbo].[CASTELLER] CHECK CONSTRAINT [FK__CASTELLER__ID_MU__66603565]
GO
ALTER TABLE [dbo].[CASTELLER]  WITH NOCHECK ADD  CONSTRAINT [FK_TIPUS_DOC] FOREIGN KEY([TIPUS_DOCUMENT])
REFERENCES [dbo].[TIPUS_DOCUMENT] ([ID])
GO
ALTER TABLE [dbo].[CASTELLER] CHECK CONSTRAINT [FK_TIPUS_DOC]
GO
ALTER TABLE [dbo].[CASTELLER_DELEGA]  WITH CHECK ADD  CONSTRAINT [FK_CASTELLER_DELEGA_CASTELLER] FOREIGN KEY([ID_CASTELLER1])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CASTELLER_DELEGA] CHECK CONSTRAINT [FK_CASTELLER_DELEGA_CASTELLER]
GO
ALTER TABLE [dbo].[CASTELLER_DELEGA]  WITH CHECK ADD  CONSTRAINT [FK_CASTELLER_DELEGA_CASTELLER1] FOREIGN KEY([ID_CASTELLER2])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[CASTELLER_DELEGA] CHECK CONSTRAINT [FK_CASTELLER_DELEGA_CASTELLER1]
GO
ALTER TABLE [dbo].[CASTELLER_ORGANITZACIO]  WITH CHECK ADD  CONSTRAINT [FK_CASTE_ORGAN_CARREC] FOREIGN KEY([ID_CARREC])
REFERENCES [dbo].[ORGANITZACIO] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CASTELLER_ORGANITZACIO] CHECK CONSTRAINT [FK_CASTE_ORGAN_CARREC]
GO
ALTER TABLE [dbo].[CASTELLER_ORGANITZACIO]  WITH CHECK ADD  CONSTRAINT [FK_CASTE_ORGAN_CASTEL] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CASTELLER_ORGANITZACIO] CHECK CONSTRAINT [FK_CASTE_ORGAN_CASTEL]
GO
ALTER TABLE [dbo].[CASTELLER_POSICIO]  WITH CHECK ADD  CONSTRAINT [FK_CASTELLER_POSICIO_CASTELLER] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[CASTELLER_POSICIO] CHECK CONSTRAINT [FK_CASTELLER_POSICIO_CASTELLER]
GO
ALTER TABLE [dbo].[CASTELLER_POSICIO]  WITH CHECK ADD  CONSTRAINT [FK_CASTELLER_POSICIO_POSICIO] FOREIGN KEY([ID_POSICIO])
REFERENCES [dbo].[POSICIO] ([ID_POSICIO])
GO
ALTER TABLE [dbo].[CASTELLER_POSICIO] CHECK CONSTRAINT [FK_CASTELLER_POSICIO_POSICIO]
GO
ALTER TABLE [dbo].[CONVOCATORIA]  WITH CHECK ADD  CONSTRAINT [FK_CONVOCATORIA_CASTELLER] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CONVOCATORIA] CHECK CONSTRAINT [FK_CONVOCATORIA_CASTELLER]
GO
ALTER TABLE [dbo].[DADES_TECNIQUES]  WITH CHECK ADD  CONSTRAINT [FK_DADES_TEC_CASTELLER] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[DADES_TECNIQUES] CHECK CONSTRAINT [FK_DADES_TEC_CASTELLER]
GO
ALTER TABLE [dbo].[DEUTES]  WITH CHECK ADD  CONSTRAINT [FK_DEUTE_CASTELLER] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[DEUTES] CHECK CONSTRAINT [FK_DEUTE_CASTELLER]
GO
ALTER TABLE [dbo].[ESDEVENIMENT]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVEN_USUARI_CREADOR] FOREIGN KEY([ID_USUARI_CREADOR])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[ESDEVENIMENT] CHECK CONSTRAINT [FK_ESDEVEN_USUARI_CREADOR]
GO
ALTER TABLE [dbo].[ESDEVENIMENT]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVEN_USUARI_MODIFI] FOREIGN KEY([ID_USUARI_MODIFI])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[ESDEVENIMENT] CHECK CONSTRAINT [FK_ESDEVEN_USUARI_MODIFI]
GO
ALTER TABLE [dbo].[ESDEVENIMENT]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_TIPUS] FOREIGN KEY([ID_TIPUS])
REFERENCES [dbo].[TIPUS_ESDEVENIMENT] ([ID_TIPUS_ESDEVENIMENT])
GO
ALTER TABLE [dbo].[ESDEVENIMENT] CHECK CONSTRAINT [FK_ESDEVENIMENT_TIPUS]
GO
ALTER TABLE [dbo].[ESDEVENIMENT]  WITH CHECK ADD  CONSTRAINT [FK_TEMPORADA_esdeveniment] FOREIGN KEY([ID_TEMPORADA])
REFERENCES [dbo].[TEMPORADA] ([ID])
GO
ALTER TABLE [dbo].[ESDEVENIMENT] CHECK CONSTRAINT [FK_TEMPORADA_esdeveniment]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_CASTELL] FOREIGN KEY([ID_CASTELL])
REFERENCES [dbo].[TIPUS_CASTELLS] ([ID])
GO
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS] CHECK CONSTRAINT [FK_ESDEVENIMENT_CASTELL]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_ESDEVEN] FOREIGN KEY([ID_ESDEVENIMENT])
REFERENCES [dbo].[ESDEVENIMENT] ([ID_ESDEVENIMENT])
GO
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS] CHECK CONSTRAINT [FK_ESDEVENIMENT_ESDEVEN]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_ESTAT] FOREIGN KEY([ID_ESTAT_CASTELL])
REFERENCES [dbo].[TIPUS_ESTAT_CASTELL] ([ID])
GO
ALTER TABLE [dbo].[ESDEVENIMENT_CASTELLS] CHECK CONSTRAINT [FK_ESDEVENIMENT_ESTAT]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_LOG]  WITH CHECK ADD  CONSTRAINT [FK_ESDE_LOG_ACC] FOREIGN KEY([ID_ACCIO])
REFERENCES [dbo].[ACCIO_LOG] ([ID_ACCIO])
GO
ALTER TABLE [dbo].[ESDEVENIMENT_LOG] CHECK CONSTRAINT [FK_ESDE_LOG_ACC]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_LOG]  WITH CHECK ADD  CONSTRAINT [FK_ESDE_LOG_CAST] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[ESDEVENIMENT_LOG] CHECK CONSTRAINT [FK_ESDE_LOG_CAST]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_LOG]  WITH CHECK ADD  CONSTRAINT [FK_ESDE_LOG_ESDE] FOREIGN KEY([ID_ESDEVENIMENT])
REFERENCES [dbo].[ESDEVENIMENT] ([ID_ESDEVENIMENT])
GO
ALTER TABLE [dbo].[ESDEVENIMENT_LOG] CHECK CONSTRAINT [FK_ESDE_LOG_ESDE]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_PREGUNTA]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_P_ESDEVEN] FOREIGN KEY([ID_ESDEVENIMENT])
REFERENCES [dbo].[ESDEVENIMENT] ([ID_ESDEVENIMENT])
GO
ALTER TABLE [dbo].[ESDEVENIMENT_PREGUNTA] CHECK CONSTRAINT [FK_ESDEVENIMENT_P_ESDEVEN]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_PREGUNTA]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_PREGUNTA] FOREIGN KEY([TIPUS_PREGUNTA])
REFERENCES [dbo].[TIPUS_PREGUNTA] ([ID])
GO
ALTER TABLE [dbo].[ESDEVENIMENT_PREGUNTA] CHECK CONSTRAINT [FK_ESDEVENIMENT_PREGUNTA]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_VALORACIO]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_V_ESDEVEN] FOREIGN KEY([ID_ESDEVENIMENT])
REFERENCES [dbo].[ESDEVENIMENT] ([ID_ESDEVENIMENT])
GO
ALTER TABLE [dbo].[ESDEVENIMENT_VALORACIO] CHECK CONSTRAINT [FK_ESDEVENIMENT_V_ESDEVEN]
GO
ALTER TABLE [dbo].[ESDEVENIMENT_VALORACIO]  WITH CHECK ADD  CONSTRAINT [FK_ESDEVENIMENT_VALORACIO] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[ESDEVENIMENT_VALORACIO] CHECK CONSTRAINT [FK_ESDEVENIMENT_VALORACIO]
GO
ALTER TABLE [dbo].[FOTOS]  WITH CHECK ADD  CONSTRAINT [FK_FOTOS_CASTELLER] FOREIGN KEY([ID_FOTOGRAF])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[FOTOS] CHECK CONSTRAINT [FK_FOTOS_CASTELLER]
GO
ALTER TABLE [dbo].[FOTOS]  WITH CHECK ADD  CONSTRAINT [FK_FOTOS_USU_CREACIO] FOREIGN KEY([ID_USUARI_CREADOR])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[FOTOS] CHECK CONSTRAINT [FK_FOTOS_USU_CREACIO]
GO
ALTER TABLE [dbo].[FOTOS]  WITH CHECK ADD  CONSTRAINT [FK_FOTOS_USU_MODIFICA] FOREIGN KEY([ID_USUARI_MODIFICA])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[FOTOS] CHECK CONSTRAINT [FK_FOTOS_USU_MODIFICA]
GO
ALTER TABLE [dbo].[FOTOS]  WITH CHECK ADD  CONSTRAINT [FK_TEMPORADA_Fotos] FOREIGN KEY([ID_TEMPORADA])
REFERENCES [dbo].[TEMPORADA] ([ID])
GO
ALTER TABLE [dbo].[FOTOS] CHECK CONSTRAINT [FK_TEMPORADA_Fotos]
GO
ALTER TABLE [dbo].[FOTOS_LIKE]  WITH CHECK ADD  CONSTRAINT [FK_FOTOS_LIKE_CASTELLER] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[FOTOS_LIKE] CHECK CONSTRAINT [FK_FOTOS_LIKE_CASTELLER]
GO
ALTER TABLE [dbo].[FOTOS_LIKE]  WITH CHECK ADD  CONSTRAINT [FK_FOTOS_LIKE_FOTOS] FOREIGN KEY([ID_FOTOS])
REFERENCES [dbo].[FOTOS] ([ID_FOTOS])
GO
ALTER TABLE [dbo].[FOTOS_LIKE] CHECK CONSTRAINT [FK_FOTOS_LIKE_FOTOS]
GO
ALTER TABLE [dbo].[MUNICIPI]  WITH CHECK ADD  CONSTRAINT [FK_MUNICIPI_PROVINCIA] FOREIGN KEY([ID_PROVINCIA])
REFERENCES [dbo].[PROVINCIA] ([ID_PROVINCIA])
GO
ALTER TABLE [dbo].[MUNICIPI] CHECK CONSTRAINT [FK_MUNICIPI_PROVINCIA]
GO
ALTER TABLE [dbo].[NOTICIES]  WITH CHECK ADD  CONSTRAINT [FK_NOTICIES_CASTELLER] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[NOTICIES] CHECK CONSTRAINT [FK_NOTICIES_CASTELLER]
GO
ALTER TABLE [dbo].[NOTICIES]  WITH CHECK ADD  CONSTRAINT [FK_TIPUS_NOT] FOREIGN KEY([ID_TIPUS_NOTICIES])
REFERENCES [dbo].[TIPUS_NOTICIES] ([ID])
GO
ALTER TABLE [dbo].[NOTICIES] CHECK CONSTRAINT [FK_TIPUS_NOT]
GO
ALTER TABLE [dbo].[NOTICIES]  WITH CHECK ADD  CONSTRAINT [FK_USU_CREACIO] FOREIGN KEY([ID_USUARI_CREADOR])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[NOTICIES] CHECK CONSTRAINT [FK_USU_CREACIO]
GO
ALTER TABLE [dbo].[NOTICIES]  WITH CHECK ADD  CONSTRAINT [FK_USU_MODIFICA] FOREIGN KEY([ID_USUARI_MODIFICA])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[NOTICIES] CHECK CONSTRAINT [FK_USU_MODIFICA]
GO
ALTER TABLE [dbo].[ORGANITZACIO]  WITH CHECK ADD  CONSTRAINT [FK_ORGAN_ORGAN] FOREIGN KEY([ID_PARE])
REFERENCES [dbo].[ORGANITZACIO] ([ID])
GO
ALTER TABLE [dbo].[ORGANITZACIO] CHECK CONSTRAINT [FK_ORGAN_ORGAN]
GO
ALTER TABLE [dbo].[RESPONSABLE_LEGAL]  WITH CHECK ADD  CONSTRAINT [FK_RESPONSABLE_LEGAL_CASTELLER] FOREIGN KEY([ID_CASTELLER])
REFERENCES [dbo].[CASTELLER] ([ID_CASTELLER])
GO
ALTER TABLE [dbo].[RESPONSABLE_LEGAL] CHECK CONSTRAINT [FK_RESPONSABLE_LEGAL_CASTELLER]
GO
ALTER TABLE [dbo].[RESPONSABLE_LEGAL]  WITH CHECK ADD  CONSTRAINT [FK_RESPONSABLE_LEGAL_TIPUS] FOREIGN KEY([ID_TIPUS_RESPONSABLE])
REFERENCES [dbo].[TIPUS_RESPONSABLE] ([ID_TIPUS_RESPONSABLE])
GO
ALTER TABLE [dbo].[RESPONSABLE_LEGAL] CHECK CONSTRAINT [FK_RESPONSABLE_LEGAL_TIPUS]
GO
ALTER TABLE [dbo].[ASSISTENCIA]  WITH CHECK ADD  CONSTRAINT [ASSITENCIA_RESPOSTA_JSON] CHECK  ((isjson([RESPOSTES])=(1)))
GO
ALTER TABLE [dbo].[ASSISTENCIA] CHECK CONSTRAINT [ASSITENCIA_RESPOSTA_JSON]
GO
ALTER TABLE [dbo].[CASTELLER]  WITH CHECK ADD  CONSTRAINT [CK__CASTELLER__373B3228] CHECK  (([TE_CASC]=(0) AND [CASC_LLOGUER]=(0) OR [TE_CASC]=(1)))
GO
ALTER TABLE [dbo].[CASTELLER] CHECK CONSTRAINT [CK__CASTELLER__373B3228]
GO
ALTER TABLE [dbo].[CASTELLER_DELEGA]  WITH CHECK ADD  CONSTRAINT [CK_CASTELLER_DELEGA] CHECK  (([ID_CASTELLER1]<>[ID_CASTELLER2]))
GO
ALTER TABLE [dbo].[CASTELLER_DELEGA] CHECK CONSTRAINT [CK_CASTELLER_DELEGA]
GO
ALTER TABLE [dbo].[DEUTES]  WITH CHECK ADD CHECK  (([PAGAT]=(0) AND [DATA_PAGAMENT] IS NULL OR [PAGAT]=(1) AND [DATA_PAGAMENT] IS NOT NULL))
GO
