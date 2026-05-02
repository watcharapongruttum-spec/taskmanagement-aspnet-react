-- Seed Users (30 users: mix of Admin=0 and Member=1)
-- Password for all users: "Password123!" (bcrypt hash)

DELETE FROM "Users" WHERE "Id" LIKE 'a1000001%';

INSERT INTO "Users" ("Id", "Username", "Email", "PasswordHash", "Role", "CreatedAt", "UpdatedAt") VALUES
('a1000001-0000-0000-0000-000000000001', 'somchai_k',    'somchai.k@company.com',    '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 0, NOW() - INTERVAL '90 days', NOW()),
('a1000001-0000-0000-0000-000000000002', 'wanchai_p',    'wanchai.p@company.com',    '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '88 days', NOW()),
('a1000001-0000-0000-0000-000000000003', 'nipa_s',       'nipa.s@company.com',       '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '85 days', NOW()),
('a1000001-0000-0000-0000-000000000004', 'krit_t',       'krit.t@company.com',       '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '83 days', NOW()),
('a1000001-0000-0000-0000-000000000005', 'malee_w',      'malee.w@company.com',      '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '80 days', NOW()),
('a1000001-0000-0000-0000-000000000006', 'prasert_b',    'prasert.b@company.com',    '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 0, NOW() - INTERVAL '78 days', NOW()),
('a1000001-0000-0000-0000-000000000007', 'siriporn_c',   'siriporn.c@company.com',   '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '75 days', NOW()),
('a1000001-0000-0000-0000-000000000008', 'thanat_r',     'thanat.r@company.com',     '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '73 days', NOW()),
('a1000001-0000-0000-0000-000000000009', 'orawan_m',     'orawan.m@company.com',     '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '70 days', NOW()),
('a1000001-0000-0000-0000-000000000010', 'nattapol_j',   'nattapol.j@company.com',   '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '68 days', NOW()),
('a1000001-0000-0000-0000-000000000011', 'sunisa_l',     'sunisa.l@company.com',     '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '65 days', NOW()),
('a1000001-0000-0000-0000-000000000012', 'chaiwat_n',    'chaiwat.n@company.com',    '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 0, NOW() - INTERVAL '63 days', NOW()),
('a1000001-0000-0000-0000-000000000013', 'patcharee_s',  'patcharee.s@company.com',  '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '60 days', NOW()),
('a1000001-0000-0000-0000-000000000014', 'weerasak_p',   'weerasak.p@company.com',   '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '58 days', NOW()),
('a1000001-0000-0000-0000-000000000015', 'naruemon_t',   'naruemon.t@company.com',   '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '55 days', NOW()),
('a1000001-0000-0000-0000-000000000016', 'komkrit_w',    'komkrit.w@company.com',    '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '53 days', NOW()),
('a1000001-0000-0000-0000-000000000017', 'pimchanok_r',  'pimchanok.r@company.com',  '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '50 days', NOW()),
('a1000001-0000-0000-0000-000000000018', 'surachai_k',   'surachai.k@company.com',   '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '48 days', NOW()),
('a1000001-0000-0000-0000-000000000019', 'jintana_b',    'jintana.b@company.com',    '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '45 days', NOW()),
('a1000001-0000-0000-0000-000000000020', 'witthaya_c',   'witthaya.c@company.com',   '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 0, NOW() - INTERVAL '43 days', NOW()),
('a1000001-0000-0000-0000-000000000021', 'ratchanee_m',  'ratchanee.m@company.com',  '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '40 days', NOW()),
('a1000001-0000-0000-0000-000000000022', 'mongkol_j',    'mongkol.j@company.com',    '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '38 days', NOW()),
('a1000001-0000-0000-0000-000000000023', 'duangjai_s',   'duangjai.s@company.com',   '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '35 days', NOW()),
('a1000001-0000-0000-0000-000000000024', 'chakrit_p',    'chakrit.p@company.com',    '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 0, NOW() - INTERVAL '33 days', NOW()),
('a1000001-0000-0000-0000-000000000025', 'waraporn_t',   'waraporn.t@company.com',   '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '30 days', NOW()),
('a1000001-0000-0000-0000-000000000026', 'anuwat_k',     'anuwat.k@company.com',     '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '28 days', NOW()),
('a1000001-0000-0000-0000-000000000027', 'ladawan_c',    'ladawan.c@company.com',    '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '25 days', NOW()),
('a1000001-0000-0000-0000-000000000028', 'sombat_w',     'sombat.w@company.com',     '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '23 days', NOW()),
('a1000001-0000-0000-0000-000000000029', 'kanokwan_r',   'kanokwan.r@company.com',   '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '20 days', NOW()),
('a1000001-0000-0000-0000-000000000030', 'theerawut_m',  'theerawut.m@company.com',  '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NOW() - INTERVAL '18 days', NOW());

-- Verify
SELECT COUNT(*) AS total_users FROM "Users";
SELECT "Id", "Username", "Role", "CreatedAt"::date AS joined FROM "Users" WHERE "Id" LIKE 'a1000001%' ORDER BY "CreatedAt";
