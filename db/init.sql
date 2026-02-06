CREATE TABLE IF NOT EXISTS procedures (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

DELETE FROM procedures;

INSERT INTO procedures (title, content, sort_order) VALUES
('НЕОБХОДИМЫЕ ДОКУМЕНТЫ ДЛЯ РОЗЫСКА', '- коммерческий инвойс (оформленный на клиента);\n- накладная;\n- либо подробное описание.', 1),
('ПОРЯДОК ДЕЙСТВИЙ В СЛУЧАЕ УТРАТЫ', '1. В первую очередь осуществляется розыск.\n2. Если не будет найдена, запрашивается заявление.', 2);