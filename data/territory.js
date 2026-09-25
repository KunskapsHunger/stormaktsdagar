// Who controlled each map region, and how, over time.
// territory[regionId] = [[fromYear, ownerId|null, status?], …] sorted by year.
// status: undefined = core, "loose" = loosely tied / tributary / vague frontier,
// "pledge" = pawned (pant), "occupied" = held in war, not (yet) ceded, "disputed".
// Fractional years place a change within a year (e.g. 1658.15 ≈ late February).
// Borders are approximations drawn on modern administrative units; see "Om kartan".
window.SM = window.SM || {};

window.SM.owners = {
  svear:       { name: { sv: "Svear", en: "Svear (Swedes)", ar: "السفيار" } },
  gotar:       { name: { sv: "Götar", en: "Götar (Geats)", ar: "الغوتار" } },
  sweden:      { name: { sv: "Sverige", en: "Sweden", ar: "السويد" } },
  denmark:     { name: { sv: "Danmark", en: "Denmark", ar: "الدنمارك" } },
  norway:      { name: { sv: "Norge", en: "Norway", ar: "النرويج" } },
  holstein:    { name: { sv: "Holstein (grevarna)", en: "Holstein (the counts)", ar: "هولشتاين (الكونتات)" } },
  erik:        { name: { sv: "Erik av Pommern (egen besittning)", en: "Eric of Pomerania (personal holding)", ar: "إريك البوميراني (ملكية شخصية)" } },
  novgorod:    { name: { sv: "Novgorod", en: "Novgorod", ar: "نوفغورود" } },
  muscovy:     { name: { sv: "Moskva/Ryssland", en: "Muscovy/Russia", ar: "موسكوفيا/روسيا" } },
  order:       { name: { sv: "Tyska orden / Livländska orden", en: "Teutonic / Livonian Order", ar: "الرهبنة التيوتونية / الرهبنة الليفونية" } },
  poland:      { name: { sv: "Polen(-Litauen)", en: "Poland(-Lithuania)", ar: "بولندا (وليتوانيا)" } },
  lithuania:   { name: { sv: "Litauen", en: "Lithuania", ar: "ليتوانيا" } },
  prussia:     { name: { sv: "Hertigdömet Preussen", en: "Duchy of Prussia", ar: "دوقية بروسيا" } },
  brandenburg: { name: { sv: "Brandenburg-Preussen", en: "Brandenburg-Prussia", ar: "براندنبورغ-بروسيا" } },
  pomerania:   { name: { sv: "Hertigdömet Pommern", en: "Duchy of Pomerania", ar: "دوقية بوميرانيا" } },
  mecklenburg: { name: { sv: "Mecklenburg", en: "Mecklenburg", ar: "مكلنبورغ" } },
  hre:         { name: { sv: "Tysk-romerska riket", en: "Holy Roman Empire", ar: "الإمبراطورية الرومانية المقدسة" } },
  lubeck:      { name: { sv: "Lübeck", en: "Lübeck", ar: "لوبيك" } },
  scotland:    { name: { sv: "Skottland", en: "Scotland", ar: "اسكتلندا" } },
};

window.SM.statuses = {
  core:     { sv: "Fast del av riket", en: "Integral part of the realm", ar: "جزء أساسي من المملكة" },
  loose:    { sv: "Löst knuten / oklar gräns", en: "Loosely attached / vague frontier", ar: "ارتباط فضفاض / حدود غير واضحة" },
  pledge:   { sv: "Pantsatt", en: "Pledged (pawned)", ar: "مرهونة" },
  occupied: { sv: "Ockuperad i krig", en: "Occupied in war", ar: "محتلة أثناء الحرب" },
  disputed: { sv: "Omstridd", en: "Disputed", ar: "متنازع عليها" },
};

window.SM.territory = {
  // --- Svealand & Götaland: the core of the kingdom ---
  svealand:      [[800, "svear", "loose"], [995, "sweden", "loose"], [1130, "sweden"]],
  vastergotland: [[800, "gotar", "loose"], [995, "sweden", "loose"], [1130, "sweden"]],
  ostergotland:  [[800, "gotar", "loose"], [995, "sweden", "loose"], [1130, "sweden"]],
  smaland:       [[800, null], [1000, "sweden", "loose"], [1200, "sweden"]],
  gotland:       [[800, null], [1000, "sweden", "loose"], [1288, "sweden", "loose"], [1361.55, "denmark", "disputed"],
                  [1394, "mecklenburg", "occupied"], [1398.3, "order", "occupied"], [1408.5, "denmark"], [1437.8, "erik"],
                  [1449.5, "denmark"], [1645.61, "sweden"], [1676.4, "denmark", "occupied"], [1679.72, "sweden"]],
  norrland_s:    [[800, null], [1100, "sweden", "loose"], [1300, "sweden"]],
  norrland_n:    [[800, null], [1320, "sweden", "loose"], [1595.38, "sweden"]],
  lappmark_se:   [[800, null], [1320, "sweden", "loose"]],
  // --- lands won from Denmark and Norway ---
  jamtland:      [[800, null], [1178, "norway", "loose"], [1300, "norway"], [1563.5, "sweden", "occupied"],
                  [1570.95, "norway"], [1611.4, "sweden", "occupied"], [1613.05, "norway"], [1645.61, "sweden"]],
  idre_sarna:    [[800, null], [1300, "norway", "loose"], [1644.3, "sweden", "occupied"]],
  skane:         [[800, "denmark"], [1329, "holstein", "pledge"], [1332.45, "sweden", "pledge"], [1360.5, "denmark"], [1658.15, "sweden"]],
  blekinge:      [[800, "denmark"], [1329, "holstein", "pledge"], [1332.45, "sweden", "pledge"], [1360.5, "denmark"], [1523.4, "sweden", "occupied"], [1524.66, "denmark"], [1658.15, "sweden"]],
  halland:       [[800, "denmark"], [1305, "norway", "loose"], [1332.45, "sweden", "pledge"], [1366, "denmark"], [1645.61, "sweden", "pledge"], [1658.15, "sweden"]],
  bohuslan:      [[800, "norway"], [1523.5, "sweden", "occupied"], [1532.5, "norway"], [1658.15, "sweden"]],
  // --- Norway & its tributary lands ---
  norway:        [[800, "norway"]],
  trondelag:     [[800, "norway"], [1658.15, "sweden"], [1658.94, "norway"]],
  northern_isles:[[800, "norway", "loose"], [1468.68, "scotland", "pledge"], [1472.2, "scotland"]],
  faroes:        [[800, "norway", "loose"], [1380, "norway"]],
  // --- Denmark ---
  denmark:       [[800, "denmark"], [1332, "holstein", "pledge"], [1340.5, "denmark"]],
  bornholm:      [[800, "denmark"], [1525.5, "lubeck", "pledge"], [1576.5, "denmark"], [1658.15, "sweden"], [1658.93, "denmark"]],
  schleswig:     [[800, "denmark"], [1232, "denmark", "loose"], [1386.5, "holstein", "loose"], [1460.17, "denmark", "loose"]],
  holstein:      [[800, "hre"], [1111, "holstein"], [1460.17, "denmark", "loose"]],
  // --- Finland (Österland) ---
  fin_sw:        [[800, null], [1200, "sweden", "loose"], [1280, "sweden"], [1713.6, "muscovy", "occupied"], [1721.66, "sweden"]],
  fin_tavast:    [[800, null], [1249, "sweden", "loose"], [1300, "sweden"], [1713.6, "muscovy", "occupied"], [1721.66, "sweden"]],
  fin_karelia:   [[800, "novgorod", "loose"], [1293.5, "sweden", "disputed"], [1323.6, "sweden"], [1710.45, "muscovy", "occupied"], [1721.66, "muscovy"]],
  fin_west:      [[800, null], [1300, "sweden", "loose"], [1323.6, "sweden"], [1713.6, "muscovy", "occupied"], [1721.66, "sweden"]],
  fin_east:      [[800, "novgorod", "loose"], [1478, "muscovy", "loose"], [1500, "sweden", "disputed"], [1595.38, "sweden"], [1713.6, "muscovy", "occupied"], [1721.66, "sweden"]],
  fin_north:     [[800, null], [1595.38, "sweden", "loose"], [1713.6, "muscovy", "occupied"], [1721.66, "sweden"]],
  // --- the Russian northwest ---
  kexholm:       [[800, "novgorod"], [1478, "muscovy"], [1580.85, "sweden", "occupied"], [1597.5, "muscovy"],
                  [1611.2, "sweden", "occupied"], [1617.15, "sweden"], [1710.7, "muscovy", "occupied"], [1721.66, "muscovy"]],
  ingria:        [[800, "novgorod"], [1478, "muscovy"], [1581.75, "sweden", "occupied"], [1590.1, "muscovy"],
                  [1612, "sweden", "occupied"], [1617.15, "sweden"], [1702.8, "muscovy", "occupied"], [1721.66, "muscovy"]],
  novgorod:      [[800, "novgorod"], [1478, "muscovy"]],
  rus_rest:      [[800, null]],
  // --- the eastern Baltic ---
  estland:       [[800, null], [1219.45, "denmark"], [1346.5, "order"], [1561.45, "sweden"], [1710.7, "muscovy", "occupied"], [1721.66, "muscovy"]],
  osel:          [[800, null], [1228, "order"], [1559.3, "denmark"], [1645.61, "sweden"], [1710.75, "muscovy", "occupied"], [1721.66, "muscovy"]],
  livonia_ee:    [[800, null], [1224, "order"], [1558.5, "muscovy", "occupied"], [1582.05, "poland"], [1625.6, "sweden", "occupied"], [1629.7, "sweden"], [1704.55, "muscovy", "occupied"], [1721.66, "muscovy"]],
  livonia_lv:    [[800, null], [1206, "order"], [1561.9, "poland"], [1621.7, "sweden", "occupied"], [1629.7, "sweden"], [1710.53, "muscovy", "occupied"], [1721.66, "muscovy"]],
  latgale:       [[800, null], [1224, "order"], [1561.9, "poland"]],
  courland:      [[800, null], [1260, "order"], [1561.9, "poland", "loose"]],
  // --- the southern Baltic rim ---
  prussia:       [[800, null], [1230, "order", "occupied"], [1283, "order"], [1466.78, "order", "loose"], [1525.3, "prussia", "loose"],
                  [1618.6, "brandenburg", "loose"], [1657.75, "brandenburg"]],
  royal_prussia: [[800, null], [1000, "poland", "loose"], [1308.9, "order"], [1466.78, "poland"]],
  lithuania:     [[800, null], [1240, "lithuania"], [1569.5, "poland"]],
  poland:        [[800, null], [1000, "poland"]],
  pomerania_w:   [[800, null], [1180, "pomerania", "loose"], [1227, "pomerania"], [1630.5, "sweden", "occupied"], [1648.81, "sweden"], [1678.8, "brandenburg", "occupied"], [1679.72, "sweden"], [1715.95, "denmark", "occupied"], [1720.45, "sweden"]],
  pomerania_s:   [[800, null], [1180, "pomerania", "loose"], [1227, "pomerania"], [1630.5, "sweden", "occupied"], [1648.81, "sweden"], [1678.8, "brandenburg", "occupied"], [1679.72, "sweden"], [1713.75, "brandenburg", "occupied"], [1720.1, "brandenburg"]],
  pomerania_e:   [[800, null], [1180, "pomerania", "loose"], [1227, "pomerania"], [1630.6, "sweden", "occupied"], [1653.35, "brandenburg"]],
  mecklenburg:   [[800, null], [1170, "mecklenburg"]],
  wismar:        [[800, null], [1170, "mecklenburg"], [1632, "sweden", "occupied"], [1648.81, "sweden"], [1675.9, "denmark", "occupied"], [1680, "sweden"], [1716.3, "denmark", "occupied"], [1720.45, "sweden"]],
  bremen_verden: [[800, "hre"], [1645.4, "sweden", "occupied"], [1648.81, "sweden"], [1676.6, "hre", "occupied"], [1679.9, "sweden"], [1712.7, "denmark", "occupied"], [1715.5, "hre", "occupied"], [1719.9, "hre"]],
  hre:           [[800, "hre"]],
};
