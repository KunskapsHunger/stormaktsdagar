// Map labels: towns (with approximate founding / first mention), realm names and campaign routes.
// Historical Swedish forms are used in Swedish; English gives the common English form.
window.SM = window.SM || {};
(function () {

const P = (id, sv, en, ar, lon, lat, rank, from = 800, to = 9999) => ({ id, name: { sv, en, ar }, lon, lat, rank, from, to });

// rank 1 = always shown, 2 = from zoom ≈1.6, 3 = from zoom ≈2.6
window.SM.places = [
  P("birka", "Birka", "Birka", "بيركا", 17.54, 59.33, 2, 750, 975),
  P("sigtuna", "Sigtuna", "Sigtuna", "سيغتونا", 17.72, 59.62, 2, 980),
  P("uppsala", "Uppsala", "Uppsala", "أوبسالا", 17.64, 59.86, 1),
  P("stockholm", "Stockholm", "Stockholm", "ستوكهولم", 18.07, 59.33, 1, 1252),
  P("vasteras", "Västerås", "Västerås", "فيستروس", 16.54, 59.61, 3, 1100),
  P("strangnas", "Strängnäs", "Strängnäs", "سترينغنيس", 17.03, 59.38, 3, 1100),
  P("nykoping", "Nyköping", "Nyköping", "نيشوبينغ", 17.01, 58.75, 3, 1200),
  P("linkoping", "Linköping", "Linköping", "لينشوبينغ", 15.62, 58.41, 2, 1100),
  P("vadstena", "Vadstena", "Vadstena", "فادستينا", 14.89, 58.45, 3, 1350),
  P("skara", "Skara", "Skara", "سكارا", 13.44, 58.39, 2, 1000),
  P("jonkoping", "Jönköping", "Jönköping", "يونشوبينغ", 14.16, 57.78, 3, 1284),
  P("kalmar", "Kalmar", "Kalmar", "كالمار", 16.36, 56.66, 1, 1100),
  P("visby", "Visby", "Visby", "فيسبي", 18.29, 57.64, 1, 1000),
  P("falun", "Falun", "Falun", "فالون", 15.63, 60.6, 3, 1288),
  P("mora", "Mora", "Mora", "مورا", 14.54, 61.0, 3, 1300),
  P("lodose", "Lödöse", "Lödöse", "لودوسه", 12.15, 58.03, 3, 1000, 1646),
  P("alvsborg", "Älvsborg", "Älvsborg", "إلفسبوري", 11.9, 57.69, 3, 1366, 1621),
  P("goteborg", "Göteborg", "Gothenburg", "غوتنبرغ", 11.97, 57.71, 1, 1621),
  P("lund", "Lund", "Lund", "لوند", 13.19, 55.7, 2, 990),
  P("malmo", "Malmö", "Malmö", "مالمو", 13.0, 55.6, 3, 1250),
  P("halmstad", "Halmstad", "Halmstad", "هالمستاد", 12.86, 56.67, 3, 1300),
  P("kobenhavn", "Köpenhamn", "Copenhagen", "كوبنهاغن", 12.57, 55.68, 1, 1167),
  P("roskilde", "Roskilde", "Roskilde", "روسكيلده", 12.08, 55.64, 3, 980),
  P("helsingor", "Helsingör", "Elsinore (Helsingør)", "هلسنغور", 12.61, 56.04, 3, 1426),
  P("ribe", "Ribe", "Ribe", "ريبه", 8.76, 55.33, 3),
  P("bergen", "Bergen", "Bergen", "بيرغن", 5.32, 60.39, 1, 1070),
  P("oslo", "Oslo", "Oslo", "أوسلو", 10.75, 59.91, 1, 1050, 1624),
  P("christiania", "Kristiania", "Christiania (Oslo)", "كريستيانيا (أوسلو)", 10.75, 59.91, 1, 1624),
  P("nidaros", "Nidaros (Trondheim)", "Nidaros (Trondheim)", "نيداروس (تروندهايم)", 10.39, 63.43, 1, 997),
  P("turku", "Åbo", "Åbo (Turku)", "أوبو (توركو)", 22.27, 60.45, 1, 1229),
  P("viborg", "Viborg", "Vyborg (Viipuri)", "فيبورغ", 28.73, 60.71, 1, 1293),
  P("helsingfors", "Helsingfors", "Helsinki", "هلسنكي", 24.94, 60.17, 2, 1550),
  P("noteborg", "Nöteborg", "Nöteborg (Oreshek)", "نوتيبورغ", 31.04, 59.95, 2, 1323),
  P("kexholm", "Kexholm", "Kexholm (Korela)", "كيكسهولم", 30.13, 61.03, 3, 1300),
  P("nyen", "Nyen", "Nyen", "نيين", 30.4, 59.95, 3, 1611, 1703),
  P("reval", "Reval", "Reval (Tallinn)", "ريفال (تالين)", 24.75, 59.44, 1, 1219),
  P("narva", "Narva", "Narva", "نارفا", 28.19, 59.38, 2, 1256),
  P("dorpat", "Dorpat", "Dorpat (Tartu)", "دوربات (تارتو)", 26.72, 58.38, 2, 1224),
  P("pernau", "Pernau", "Pernau (Pärnu)", "بيرناو (بارنو)", 24.5, 58.39, 3, 1251),
  P("riga", "Riga", "Riga", "ريغا", 24.1, 56.95, 1, 1201),
  P("novgorod", "Novgorod", "Novgorod", "نوفغورود", 31.27, 58.52, 1),
  P("pskov", "Pskov", "Pskov", "بسكوف", 28.33, 57.82, 2),
  P("moskva", "Moskva", "Moscow", "موسكو", 37.62, 55.75, 1, 1147),
  P("lubeck", "Lübeck", "Lübeck", "لوبيك", 10.69, 53.87, 1, 1143),
  P("hamburg", "Hamburg", "Hamburg", "هامبورغ", 9.99, 53.55, 2),
  P("bremen", "Bremen", "Bremen", "بريمن", 8.8, 53.08, 2),
  P("stade", "Stade", "Stade", "شتاده", 9.48, 53.6, 3),
  P("wismar", "Wismar", "Wismar", "فيسمار", 11.46, 53.89, 2, 1229),
  P("stralsund", "Stralsund", "Stralsund", "شترالزوند", 13.09, 54.31, 2, 1234),
  P("greifswald", "Greifswald", "Greifswald", "غرايفسفالد", 13.38, 54.09, 3, 1250),
  P("stettin", "Stettin", "Stettin (Szczecin)", "شتيتين (شتشيتسين)", 14.55, 53.43, 2),
  P("danzig", "Danzig", "Danzig (Gdańsk)", "دانتسيغ (غدانسك)", 18.65, 54.35, 1),
  P("konigsberg", "Königsberg", "Königsberg", "كونيغسبرغ", 20.51, 54.71, 2, 1255),
  P("warszawa", "Warszawa", "Warsaw", "وارسو", 21.01, 52.23, 1, 1300),
  P("krakow", "Kraków", "Kraków", "كراكوف", 19.94, 50.06, 1),
  P("vilnius", "Vilnius", "Vilnius", "فيلنيوس", 25.28, 54.69, 2, 1323),
  P("berlin", "Berlin", "Berlin", "برلين", 13.4, 52.52, 2, 1237),
  P("magdeburg", "Magdeburg", "Magdeburg", "ماغدبورغ", 11.63, 52.13, 3),
  P("leipzig", "Leipzig", "Leipzig", "لايبزيغ", 12.37, 51.34, 3, 1165),
  P("praha", "Prag", "Prague", "براغ", 14.42, 50.09, 1),
  P("wien", "Wien", "Vienna", "فيينا", 16.37, 48.21, 1),
  P("munchen", "München", "Munich", "ميونخ", 11.58, 48.14, 2, 1158),
  P("amsterdam", "Amsterdam", "Amsterdam", "أمستردام", 4.9, 52.37, 2, 1275),
  P("london", "London", "London", "لندن", -0.13, 51.51, 1),
  P("paris", "Paris", "Paris", "باريس", 2.35, 48.86, 1),
  P("edinburgh", "Edinburgh", "Edinburgh", "إدنبرة", -3.19, 55.95, 2),
  P("kirkwall", "Kirkwall", "Kirkwall", "كيركوول", -2.96, 58.98, 3),
];

const R = (sv, en, ar, lon, lat, from, to, size = 1, owner = null) => ({ text: { sv, en, ar }, lon, lat, from, to, size, owner });

// Realm and land names. size: 1 = major realm, 0.7 = region/land name.
window.SM.realmLabels = [
  R("SVEAR", "SVEAR", "السفيار", 17.2, 60.4, 800, 995, 0.8, "svear"),
  R("GÖTAR", "GÖTAR", "الغوتار", 14.2, 58.0, 800, 995, 0.8, "gotar"),
  R("SVERIGE", "SWEDEN", "السويد", 15.6, 62.3, 995, 9999, 1.15, "sweden"),
  R("DANMARK", "DENMARK", "الدنمارك", 9.2, 56.3, 800, 9999, 1, "denmark"),
  R("NORGE", "NORWAY", "النرويج", 8.6, 61.4, 800, 9999, 1, "norway"),
  R("Österland (Finland)", "Österland (Finland)", "أوسترلاند (فنلندا)", 25.6, 62.6, 1250, 1580, 0.7, "sweden"),
  R("Finland", "Finland", "فنلندا", 25.6, 62.6, 1580, 9999, 0.75, "sweden"),
  R("Estland", "Estonia", "إستونيا", 25.6, 58.95, 1561, 9999, 0.62, "sweden"),
  R("Livland", "Livonia", "ليفونيا", 25.6, 57.35, 1629, 9999, 0.62, "sweden"),
  R("Ingermanland", "Ingria", "إنغريا", 29.6, 59.35, 1617, 9999, 0.55, "sweden"),
  R("Pommern", "Pomerania", "بوميرانيا", 13.6, 53.9, 1648, 9999, 0.55, "sweden"),
  R("NOVGOROD", "NOVGOROD", "نوفغورود", 34.6, 61.4, 800, 1478, 1, "novgorod"),
  R("MOSKVA", "MUSCOVY", "موسكوفيا", 36.0, 58.5, 1478, 1547, 1, "muscovy"),
  R("RYSSLAND", "RUSSIA", "روسيا", 36.0, 58.5, 1547, 9999, 1, "muscovy"),
  R("TYSKA ORDEN", "TEUTONIC ORDER", "الرهبنة التيوتونية", 21.2, 53.7, 1283, 1525, 0.75, "order"),
  R("LIVLÄNDSKA ORDEN", "LIVONIAN ORDER", "الرهبنة الليفونية", 25.6, 57.6, 1237, 1561, 0.75, "order"),
  R("POLEN", "POLAND", "بولندا", 19.2, 51.9, 1000, 1569, 1, "poland"),
  R("LITAUEN", "LITHUANIA", "ليتوانيا", 26.5, 54.4, 1253, 1569, 1, "lithuania"),
  R("POLEN–LITAUEN", "POLAND–LITHUANIA", "بولندا–ليتوانيا", 22.5, 53.2, 1569, 9999, 1, "poland"),
  R("TYSK-ROMERSKA RIKET", "HOLY ROMAN EMPIRE", "الإمبراطورية الرومانية المقدسة", 10.2, 50.9, 962, 9999, 0.9, "hre"),
  R("ENGLAND", "ENGLAND", "إنجلترا", -1.3, 52.6, 800, 9999, 0.7, null),
  R("SKOTTLAND", "SCOTLAND", "اسكتلندا", -4.2, 56.9, 800, 9999, 0.6, null),
  R("FRANKRIKE", "FRANCE", "فرنسا", 2.6, 48.0, 800, 9999, 0.7, null),
];

// The Kalmar Union label is drawn separately while the union exists.
window.SM.unionLabel = R("KALMARUNIONEN", "THE KALMAR UNION", "اتحاد كالمار", 13.2, 64.2, 1397, 1523.43, 1.25, null);

// Campaign routes and journeys ([lon, lat] waypoints, drawn in order).
window.SM.routes = {
  "erik-crusade-1150": { points: [[18.07, 59.4], [19.2, 59.9], [20.5, 60.2], [22.27, 60.45]] },
  "birger-1249": { points: [[18.3, 59.5], [21.0, 60.1], [22.3, 60.45], [23.5, 60.8], [24.46, 60.99]] },
  "torgils-1293": { points: [[18.3, 59.4], [21.5, 59.9], [24.9, 60.0], [27.5, 60.3], [28.73, 60.71]] },
  "margaret-1389": { points: [[12.57, 55.68], [12.9, 56.6], [12.95, 57.5], [13.55, 58.15]] },
  "engelbrekt-1434": { points: [[15.63, 60.6], [16.54, 59.61], [18.07, 59.33], [17.4, 58.2], [16.36, 56.66], [13.0, 56.7], [12.86, 56.67]] },
  "gustav-vasa-1520": { points: [[10.69, 53.87], [16.36, 56.66], [15.2, 57.6], [14.6, 58.6], [15.63, 60.6], [15.0, 60.9], [14.54, 61.0], [13.0, 61.15]] },
  "gustav-adolf-1630": { points: [[13.78, 54.14], [14.55, 53.43], [14.55, 52.35], [12.45, 51.4], [11.03, 50.98], [9.93, 49.79], [8.27, 50.0], [11.08, 49.45], [10.9, 48.7], [11.58, 48.14], [11.08, 49.45], [12.1, 51.24]] },
  "karl-x-1658": { points: [[9.5, 55.5], [9.75, 55.52], [10.4, 55.3], [10.75, 54.95], [11.4, 54.8], [11.9, 54.75], [12.0, 55.1], [12.08, 55.64], [12.4, 55.65]] },
};
})();
