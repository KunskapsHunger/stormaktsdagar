// Historical region definitions. Each region = union of modern admin-1 units,
// optionally intersected with a hand-drawn mask ([lon, lat] ring). Masks only need to be
// accurate where they cut through land; their sea edges are irrelevant.
// Regions are processed in order and each one erases what earlier regions claimed.

// Nöteborg 1323 line (approx.): Sestra river → Saimaa/Savonlinna → Pyhäjoki on the Gulf of Bothnia.
const NOTEBORG = [
  [29.95, 60.1], [29.7, 60.45], [29.3, 60.85], [28.9, 61.2], [29.05, 61.8],
  [28.6, 62.2], [27.6, 62.7], [26.7, 63.2], [25.6, 63.9], [24.3, 64.5],
];
const WEST_OF_NOTEBORG = [...NOTEBORG, [18, 64.5], [18, 59.3], [23, 59.4], [26, 59.75], [28, 59.87], [29.5, 60.02], [29.95, 60.1]];

export const MASKS = {
  bohuslan: [
    [10.4, 57.55], [11.6, 57.66], [11.95, 57.71], [12.02, 57.86], [12.1, 58.05], [12.16, 58.16],
    [12.02, 58.36], [11.95, 58.6], [11.83, 58.85], [11.73, 59.05], [11.55, 59.25], [10.4, 59.3],
  ],
  idre_sarna: [[11.5, 61.35], [13.6, 61.35], [13.6, 62.5], [11.5, 62.5]],
  lappmark_se: [
    [13.5, 63.95], [16.5, 64.05], [18.0, 64.3], [19.4, 64.8], [20.4, 65.35], [21.3, 66.0],
    [22.2, 66.5], [23.0, 67.1], [23.6, 67.5], [23.8, 68.0], [24.8, 69.6], [13.5, 69.6],
  ],
  nordmore_romsdal: [[5.5, 62.62], [6.6, 62.62], [7.2, 62.47], [8.3, 62.38], [9.8, 62.3], [9.8, 63.6], [5.5, 63.6]],
  bornholm: [[14.5, 54.9], [15.4, 54.9], [15.4, 55.4], [14.5, 55.4]],
  schleswig: [
    [7.0, 54.2], [8.95, 54.3], [9.4, 54.27], [9.67, 54.3], [10.0, 54.36], [10.15, 54.42],
    [10.5, 54.55], [11.2, 54.6], [11.2, 55.47], [9.5, 55.49], [8.65, 55.45], [7.0, 55.45],
  ],
  fin_west_all: WEST_OF_NOTEBORG,
  fin_karelia: [
    [26.3, 60.1], [26.55, 61.2], [27.8, 61.62], [28.9, 61.2], [29.3, 60.85], [29.7, 60.45],
    [29.95, 60.1], [28.5, 59.9], [27.0, 60.0],
  ],
  kexholm: [
    [29.9, 60.32], [30.95, 60.55], [31.5, 60.9], [32.1, 61.3], [31.9, 61.8], [31.3, 62.4],
    [31.6, 63.4], [29.0, 64.0], [27.6, 63.4], [27.6, 62.7], [28.6, 62.2], [29.05, 61.8],
    [28.9, 61.2], [29.3, 60.85], [29.7, 60.45],
  ],
  ingria: [
    [27.7, 60.0], [27.7, 58.9], [29.5, 58.7], [30.8, 59.0], [31.7, 59.3], [32.0, 60.1],
    [30.95, 60.55], [29.9, 60.32], [29.95, 60.1],
  ],
  livonia_lv: [
    [24.0, 57.06], [24.12, 56.95], [24.4, 56.87], [24.6, 56.82], [25.0, 56.68], [25.25, 56.6],
    [25.6, 56.53], [25.85, 56.5], [26.1, 56.45], [26.5, 56.75], [26.9, 56.95], [27.0, 57.3],
    [27.35, 57.55], [27.6, 58.2], [24.0, 58.2],
  ],
  latgale: [
    [26.1, 56.45], [26.2, 56.35], [26.4, 56.0], [26.53, 55.88], [26.9, 55.85], [27.2, 55.9],
    [27.6, 55.75], [28.3, 55.55], [29.5, 55.5], [29.5, 57.8], [27.35, 57.55], [27.0, 57.3],
    [26.9, 56.95], [26.5, 56.75],
  ],
  pomerania_w: [
    [12.2, 54.6], [12.45, 54.24], [12.7, 54.08], [13.0, 53.93], [13.1, 53.75], [13.3, 53.6],
    [13.75, 53.45], [14.1, 53.3], [14.38, 53.12], [14.75, 53.28], [14.95, 53.55], [14.8, 53.9],
    [14.6, 54.2], [13.6, 55.0],
  ],
  // Pomerania south of the Peene incl. Usedom, Wollin and Stettin – ceded to Prussia 1720
  pomerania_s: [
    [12.3, 53.93], [13.04, 53.9], [13.4, 53.87], [13.7, 53.86], [13.83, 53.93], [13.8, 54.05],
    [13.85, 54.14], [14.2, 54.3], [15.2, 54.3], [15.2, 52.9], [12.3, 52.9],
  ],
  wismar: [[11.28, 53.82], [11.74, 53.82], [11.74, 53.96], [11.6, 54.12], [11.28, 54.12]],
  pomerania_e_pl: [[16.2, 54.9], [18.05, 54.95], [17.95, 54.2], [17.6, 53.85], [16.5, 53.85]],
  kuyavia_north: [[17.0, 52.95], [19.8, 52.95], [19.8, 54.0], [17.0, 54.0]],
  bremen_verden: [
    [8.4, 53.6], [8.5, 53.95], [8.75, 53.92], [9.4, 53.75], [9.8, 53.56], [9.97, 53.43],
    [9.92, 53.2], [9.72, 52.95], [9.45, 52.78], [9.1, 52.78], [8.85, 53.0], [8.72, 53.15],
    [8.52, 53.35],
  ],
};

const u = (iso, ...names) => names.map((n) => `${iso}|${n}`);

// [id, units (or "ISO|*" for the whole country), mask key | null, invertMask]
export const REGIONS = [
  // --- Sweden (modern län) ---
  ["skane", u("SWE", "Skåne"), null],
  ["blekinge", u("SWE", "Blekinge"), null],
  ["halland", u("SWE", "Halland"), null],
  ["gotland", u("SWE", "Gotland"), null],
  ["jamtland", u("SWE", "Jämtland"), null],
  ["bohuslan", u("SWE", "Västra Götaland"), "bohuslan"],
  ["vastergotland", u("SWE", "Västra Götaland"), null],
  ["idre_sarna", u("SWE", "Dalarna"), "idre_sarna"],
  ["svealand", u("SWE", "Stockholm", "Uppsala", "Södermanland", "Västmanland", "Orebro", "Värmland", "Dalarna"), null],
  ["ostergotland", u("SWE", "Östergötland"), null],
  ["smaland", u("SWE", "Jönköping", "Kronoberg", "Kalmar"), null],
  ["norrland_s", u("SWE", "Gävleborg", "Västernorrland"), null],
  ["lappmark_se", u("SWE", "Västerbotten", "Norrbotten"), "lappmark_se"],
  ["norrland_n", u("SWE", "Västerbotten", "Norrbotten"), null],
  // --- Norway ---
  ["trondelag", u("NOR", "Nord-Trøndelag", "Sør-Trøndelag"), null],
  ["trondelag2", u("NOR", "Møre og Romsdal"), "nordmore_romsdal"],
  ["norway", ["NOR|*"], null],
  ["northern_isles", u("GBR", "Orkney", "Shetland Islands"), null],
  ["faroes", ["FRO|*"], null],
  // --- Denmark ---
  ["bornholm", u("DNK", "Hovedstaden"), "bornholm"],
  ["schleswig", [...u("DEU", "Schleswig-Holstein"), ...u("DNK", "Syddanmark")], "schleswig"],
  ["holstein", u("DEU", "Schleswig-Holstein"), null],
  ["denmark", ["DNK|*"], null],
  // --- Finland & Russian northwest ---
  ["fin_karelia", ["FIN|*", ...u("RUS", "Leningrad", "City of St. Petersburg")], "fin_karelia"],
  ["fin_sw", [...u("FIN", "Finland Proper", "Satakunta"), "ALD|*"], null],
  ["fin_tavast", u("FIN", "Tavastia Proper", "Päijät-Häme", "Pirkanmaa"), null],
  ["fin_north", u("FIN", "Lapland"), null],
  ["fin_west", ["FIN|*", ...u("RUS", "Leningrad", "City of St. Petersburg")], "fin_west_all"],
  ["kexholm", [...u("FIN", "North Karelia", "South Karelia", "Southern Savonia", "Northern Savonia"), ...u("RUS", "Leningrad", "Karelia", "City of St. Petersburg")], "kexholm"],
  ["fin_east", ["FIN|*"], null],
  ["ingria", u("RUS", "Leningrad", "City of St. Petersburg"), "ingria"],
  ["novgorod", u("RUS", "Leningrad", "Karelia", "Novgorod", "Pskov", "Murmansk", "Arkhangel'sk", "Vologda", "Nenets"), null],
  // --- Baltics ---
  ["osel", u("EST", "Saare"), null],
  ["estland", u("EST", "Harju", "Rapla", "Lääne", "Hiiu", "Järva", "Lääne-Viru", "Ida-Viru"), null],
  ["livonia_ee", ["EST|*"], null],
  ["livonia_lv", ["LVA|*"], "livonia_lv"],
  ["latgale", ["LVA|*"], "latgale"],
  ["courland", ["LVA|*"], null],
  // --- Southern Baltic rim ---
  ["wismar", u("DEU", "Mecklenburg-Vorpommern"), "wismar"],
  ["pomerania_s", [...u("DEU", "Mecklenburg-Vorpommern", "Brandenburg"), ...u("POL", "West Pomeranian")], "pomerania_s_in_w"],
  ["pomerania_w", [...u("DEU", "Mecklenburg-Vorpommern", "Brandenburg"), ...u("POL", "West Pomeranian")], "pomerania_w"],
  ["mecklenburg", u("DEU", "Mecklenburg-Vorpommern"), null],
  ["pomerania_e", [...u("POL", "West Pomeranian"), ...u("POL", "Pomeranian")], "pomerania_e_pl"],
  ["pomerania_e2", u("POL", "West Pomeranian"), null],
  ["royal_prussia", u("POL", "Pomeranian"), null],
  ["royal_prussia2", u("POL", "Kuyavian-Pomeranian"), "kuyavia_north"],
  ["prussia", [...u("RUS", "Kaliningrad"), ...u("POL", "Warmian-Masurian"), ...u("LTU", "Klaipedos")], null],
  ["lithuania", ["LTU|*", "BLR|*"], null],
  ["poland", ["POL|*"], null],
  ["bremen_verden", u("DEU", "Niedersachsen"), "bremen_verden"],
  ["hre", ["DEU|*", "CZE|*", "AUT|*", "LUX|*", "BEL|*", "NLD|*", "CHE|*", "LIE|*", "SVN|*"], null],
  ["rus_rest", ["RUS|*"], null],
];

// Regions merged into another id after construction.
export const MERGE = { trondelag2: "trondelag", pomerania_e2: "pomerania_e", royal_prussia2: "royal_prussia" };
