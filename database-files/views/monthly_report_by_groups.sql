CREATE OR REPLACE VIEW vw_monthly_report_by_groups AS
    SELECT
          location_items.tool_id AS id_ferramenta
        , tools_groups.name AS grupo_ferramenta
        , DATE_PART('month', location_items.departure_date) AS mes
        , COUNT (tool_id) AS locacoes_no_mes
        , CONCAT('R$', ' ', MAX (total_price)) AS maior_valor_total_mes
        , (
            SELECT
                CONCAT('R$', ' ', MAX(total_price)) AS maior_valor_unitario
            FROM
                location_items AS items
            WHERE
                items.quantity = 1
                AND
                location_items.tool_id = items.tool_id
                AND
                items.deleted_at IS NULL
        )
        , (
            SELECT
                CONCAT('R$', ' ', AVG(total_price)) AS media_valor_unitario
            FROM
                location_items AS items
            WHERE
                items.quantity = 1
                AND
                location_items.tool_id = items.tool_id
                AND
                items.deleted_at IS NULL
        )
        , CONCAT('R$', ' ', SUM (total_price)) AS total_no_mes
    FROM
        public.location_items
        JOIN
            public.tools
        ON
            location_items.tool_id = tools.id
            AND
            tools.deleted_at IS NULL
        JOIN
            public.tools_groups
        ON
            tools_groups.id = tools.group_id
            AND
            tools.deleted_at IS NULL
    WHERE
        location_items.deleted_at IS NULL
    GROUP BY
          id_ferramenta
        , grupo_ferramenta
        , mes;
