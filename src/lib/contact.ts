/**
 * Барилгачин Групп ХХК-ийн бодит холбоо барих мэдээлэл.
 *
 * Эх сурвалж: barilgachin.mn (2026-10-11). Нэг газар төвлөрүүлсэн тул
 * дугаар солигдоход зөвхөн энэ файлыг засна.
 */

export const COMPANY = {
  legalName: 'Барилгачин Групп ХХК',
  shortName: 'Барилгачин',
  tradeCentre: 'Барилгачин худалдааны төв',
} as const;

/** Үндсэн лавлах утас. */
export const PHONE = {
  display: '7766-2277',
  href: 'tel:+97677662277',
} as const;

/** Ганц агуулах. Координат нь Google Maps дээрх байршлаас. */
export const WAREHOUSE = {
  code: 'wh-main',
  name: 'Барилгачин худалдааны төв',
  address: 'Сонсголонгийн зам, Баянгол дүүрэг, Улаанбаатар 16103',
  shortAddress: 'БГД, Сонсголонгийн зам',
  lat: 47.8823337,
  lng: 106.7865548,
  mapsUrl: 'https://maps.google.com/?q=47.8823337,106.7865548',
} as const;

/** Борлуулалтын багийн холбоо барих мэдээлэл. */
export const CONTACTS = [
  {
    name: 'С. Түвшинбаяр',
    role: 'Үл хөдлөхийн борлуулалтын менежер',
    email: 'tuvshinbayar@barilgachin.mn',
    phones: ['7711-1177', '8883-7777'],
  },
  {
    name: 'Б. Цэрэнбаатар',
    role: 'Борлуулалтын менежер',
    email: 'tserenbaatar@barilgachin.mn',
    phones: ['7766-2277', '9400-1171'],
  },
  {
    name: 'Э. Алтанцэцэг',
    role: 'Дэлгүүрийн худалдааны зөвлөх',
    email: 'haus@barilgachin.mn',
    phones: ['7766-2277', '8006-2277'],
  },
  {
    name: 'О. Ариунбаяр',
    role: 'Борлуулалтын менежер',
    email: 'ariunbayar@barilgachin.mn',
    phones: ['7711-1177', '8881-7777'],
  },
] as const;
