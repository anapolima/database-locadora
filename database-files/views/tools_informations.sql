CREATE OR REPLACE VIEW vw_tools_informations AS
	SELECT
		  tools.id AS id_ferramenta
		, tools.name AS nome_ferramenta
		, tools.group_id AS id_grupo_ferramenta
		, tools_groups.name AS nome_grupo_ferramenta
		, tools_managment.available AS quantidade_disponível
		, CONCAT (tools_prices.unit, ' ', unit_measurement.period) AS periodo
		, tools_prices.price AS preco
		, CONCAT('R$', ' ', tools_managment.available * tools_prices.price) AS total_estoque
	FROM
		public.tools
		JOIN
			public.tools_groups
			ON
				tools.group_id = tools_groups.id
			AND
				tools_groups.deleted_at IS NULL
		JOIN
			public.tools_managment
			ON
				tools_managment.tool_id = tools.id
 			AND
 				tools_managment.deleted_at IS NULL
		JOIN
			public.tools_prices
			ON
				tools_prices.tool_id = tools.id
			AND
				tools_prices.deleted_at IS NULL
		JOIN
			public.unit_measurement
			ON
				unit_measurement.id = tools_prices.unit_measurement_id
			AND
				unit_measurement.deleted_at IS NULL
	WHERE
		tools.deleted_at IS NULL
	ORDER BY
		  nome_ferramenta
		, periodo;
		
