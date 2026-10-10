-- Барааг брэндэд холбох засвар (scripts/fix-brands.ts).

begin;

update products set brand_id = (select id from brands where slug = 'mak') where sku = 'CEM-MAK-PC425';
update products set brand_id = (select id from brands where slug = 'mak') where sku = 'BLK-MAK-AAC600';
update products set brand_id = (select id from brands where slug = 'darkhan') where sku = 'STL-REB-D16-A500';
update products set brand_id = (select id from brands where slug = 'knauf') where sku = 'INS-KNAUF-RW100';
update products set brand_id = (select id from brands where slug = 'knauf') where sku = 'DRY-KNAUF-GKB12';
update products set brand_id = (select id from brands where slug = 'tikkurila') where sku = 'PNT-TIK-LUMI20';
update products set brand_id = (select id from brands where slug = 'basalt') where sku = 'ELC-CBL-3X25-CU';
update products set brand_id = (select id from brands where slug = 'hilti') where sku = 'TLS-HILTI-TE30';
update products set brand_id = (select id from brands where slug = 'kalde') where sku = 'PLB-PPR-PN20-D25';
insert into brands (slug, name, short_code, sort_order) values ('decra-roofing-shine-zeland', 'Decra Roofing (Шинэ Зеланд)', 'DECRA', 99) on conflict (slug) do nothing;
update products set brand_id = (select id from brands where slug = 'decra-roofing-shine-zeland') where sku = 'ROF-DECRA-ROMAN';
update products set brand_id = (select id from brands where slug = 'moncement') where sku = 'CEM-MON-M500-BULK';
update products set brand_id = (select id from brands where slug = 'knauf') where sku = 'ADH-KNAUF-FLIESEN';
update products set brand_id = (select id from brands where slug = 'schneider') where sku = 'ELC-SCH-IC60N-16A';
update products set brand_id = (select id from brands where slug = 'dewalt') where sku = 'TLS-DEW-DWE4120';
update products set brand_id = (select id from brands where slug = 'wilo') where sku = 'PLB-WILO-YONOS25';
update products set brand_id = (select id from brands where slug = 'basalt') where sku = 'INS-BAS-RW50';
update products set brand_id = (select id from brands where slug = 'valtec') where sku = 'PLB-VAL-BALL-12';
update products set brand_id = (select id from brands where slug = 'technonicol') where sku = 'ROF-TN-BIKRO';

commit;
