// Glossary of key terms, Sweden c. 1000–1721 (sv master text, en/ar translations).
// Sources are given only where a specific work supports the definition; the book
// citations below are standard works and carry no URLs.
window.SM = window.SM || {};

(function () {
  var LARSSON = { author: "Lars-Olof Larsson", title: "Kalmarunionens tid: från drottning Margareta till Kristian II", year: 1997, publisher: "Rabén Prisma" };
  var HARRISON = { author: "Dick Harrison", title: "Sveriges historia 600–1350", year: 2009, publisher: "Norstedts" };
  var UVF_KOR = { title: "Korståg", publisher: "Uppslagsverket Finland", url: "https://www.uppslagsverket.fi/sv/view-170045-Korstaag" };
  var VILLSTRAND = { author: "Nils Erik Villstrand", title: "Sveriges historia 1600–1721", year: 2011, publisher: "Norstedts" };
  var ERICSON = { author: "Lars Ericson", title: "Svenska knektar: indelta soldater, ryttare och båtsmän i krig och fred", year: 2002, publisher: "Historiska media" };
  var LINDEGREN = { author: "Jan Lindegren", title: "Utskrivning och utsugning: produktion och reproduktion i Bygdeå 1620–1640", year: 1980, publisher: "Uppsala universitet (Studia historica Upsaliensia)" };
  var LILJA = { author: "Sven Lilja", title: "Tjuvehål och stolta städer: urbaniseringens kronologi och geografi i Sverige (med Finland) ca 1570-tal till 1810-tal", year: 2000, publisher: "Stads- och kommunhistoriska institutet, Stockholms universitet" };
  var SNL_BIRK = { title: "birkarler", publisher: "Store norske leksikon", url: "https://snl.no/birkarler" };

  window.SM.glossary = [
    { id: "riksrad",
      term: { sv: "Riksråd", en: "Council of the Realm (riksråd)", ar: "مجلس المملكة (ريكسرود)" },
      def: {
        sv: "Kungens råd av biskopar och mäktiga stormän. Under unionstiden hävdade rådet rätten att välja kung, styra när tronen stod tom och avsätta en kung som bröt sina löften. På 1600-talet blev det regeringens kärna.",
        en: "The king's council of bishops and powerful magnates. In the union era it claimed the right to elect the king, govern when the throne was empty and depose a king who broke his promises. In the 1600s it became the core of government.",
        ar: "مجلس الملك المؤلَّف من الأساقفة وكبار النبلاء. في عهد الاتحاد طالب بحق انتخاب الملك والحكم عند خلوّ العرش وخلع الملك الذي ينقض وعوده. وفي القرن السابع عشر صار نواة الحكومة."
      }, sources: [LARSSON] },

    { id: "riksforestandare",
      term: { sv: "Riksföreståndare", en: "Regent of the Realm (riksföreståndare)", ar: "الوصي على المملكة (ريكسفوريستوندارِه)" },
      def: {
        sv: "Titel för den som rådet valde att leda Sverige när ingen kung var erkänd, till exempel Karl Knutsson, Sten Sture den äldre, Svante Nilsson och Gustav Eriksson. Riksföreståndaren hade kungens makt men inte hans krona.",
        en: "Title of the person the council chose to lead Sweden when no king was recognised, for example Karl Knutsson, Sten Sture the Elder, Svante Nilsson and Gustav Eriksson. The regent held the king's power but not his crown.",
        ar: "لقب من يختاره المجلس لقيادة السويد حين لا يكون هناك ملك معترف به، مثل كارل كنوتسون وستين ستوره الأكبر وسفانته نيلسون وغوستاف إريكسون. وكان الوصي يملك سلطة الملك دون تاجه."
      }, sources: [LARSSON] },

    { id: "rikshovitsman",
      term: { sv: "Rikshövitsman", en: "Captain of the Realm (rikshövitsman)", ar: "قائد المملكة (ريكسهوفيتسمان)" },
      def: {
        sv: "Militär ledartitel för hela riket, given åt Engelbrekt 1435 och åt Karl Knutsson 1436. Den betonade krigsbefäl snarare än regeringsmakt och föregick titeln riksföreståndare under unionskrisen.",
        en: "A military leadership title for the whole realm, given to Engelbrekt in 1435 and to Karl Knutsson in 1436. It stressed command in war rather than government, and preceded the title of regent during the union crisis.",
        ar: "لقب قيادة عسكرية للمملكة كلها، مُنح لإنغلبريكت عام 1435 ولكارل كنوتسون عام 1436. كان يركّز على القيادة الحربية لا على الحكم، وسبق لقبَ الوصي على المملكة في أزمة الاتحاد."
      }, sources: [LARSSON] },

    { id: "fralse",
      term: { sv: "Frälse", en: "Frälse (tax exemption; nobility and clergy)", ar: "الإعفاء (فريلسه): النبلاء ورجال الدين" },
      def: {
        sv: "Befrielse från skatt till kronan. Världsligt frälse (adeln) fick det mot rusttjänst, det vill säga att ställa upp med beväpnad ryttare; andligt frälse var kyrkans jord. Alsnö stadga omkring 1280 brukar ses som adelns födelse.",
        en: "Exemption from taxes to the crown. The secular frälse (the nobility) received it in return for rusttjänst, that is, providing an armed horseman; the spiritual frälse was church land. The Alsnö Statute of c. 1280 is usually seen as the birth of the nobility.",
        ar: "الإعفاء من الضرائب المستحقة للتاج. نال «الإعفاءَ الدنيوي»، أي النبلاء، هذا الامتياز مقابل تقديم فارس مسلّح للخدمة، أما «الإعفاء الكنسي» فشمل أراضي الكنيسة. ويُعدّ مرسوم ألسنو نحو عام 1280 عادةً مولدَ طبقة النبلاء."
      }, sources: [HARRISON] },

    { id: "fogde",
      term: { sv: "Fogde", en: "Bailiff (fogde)", ar: "الوكيل الإداري (فوغده)" },
      def: {
        sv: "Kungens eller länsherrens ämbetsman som drev in skatter, skipade viss rätt och höll ordning i ett slottslän eller fögderi. Hårda utländska fogdar, som Jösse Eriksson i Västerås, blev en utlösande orsak till Engelbrektsupproret 1434.",
        en: "An official of the king or a fief-holder who collected taxes, dispensed some justice and kept order in a castle district. Harsh foreign bailiffs, such as Jösse Eriksson at Västerås, helped trigger Engelbrekt's rising in 1434.",
        ar: "موظف تابع للملك أو لصاحب الإقطاع يجبي الضرائب ويقيم بعض العدالة ويحفظ النظام في إقليم قلعة. وكان الوكلاء الأجانب القساة، مثل يوسه إريكسون في فيستروس، من أسباب انتفاضة إنغلبريكت عام 1434."
      }, sources: [LARSSON] },

    { id: "lan-medeltid",
      term: { sv: "Län (medeltiden)", en: "Län (medieval castle fief)", ar: "الإقطاع (لين) في العصور الوسطى" },
      def: {
        sv: "Ett slottslän var ett område kring en kungaborg som kungen lämnade åt en storman som förläning. Länsherren tog upp skatterna och behöll en del som lön. Den som höll de stora slotten kontrollerade i praktiken riket.",
        en: "A castle fief was a district around a royal castle that the king granted to a magnate. The holder collected its taxes and kept part of them as pay. Whoever held the great castles in effect controlled the realm.",
        ar: "كان إقطاع القلعة منطقة حول قلعة ملكية يمنحها الملك لأحد كبار النبلاء. يجبي صاحب الإقطاع ضرائبها ويحتفظ بجزء منها أجرًا له. ومن سيطر على القلاع الكبرى سيطر فعليًا على المملكة."
      } },

    { id: "lan-1634",
      term: { sv: "Län (1634)", en: "County (län, from 1634)", ar: "المقاطعة (لين) منذ 1634" },
      def: {
        sv: "Genom 1634 års regeringsform delades riket in i län, vart och ett styrt av en landshövding som var ansvarig inför den centrala förvaltningen i Stockholm. Länen ersatte de gamla förläningarna och är grunden för dagens länsindelning.",
        en: "The 1634 Instrument of Government divided the realm into counties, each run by a governor answerable to the central administration in Stockholm. The counties replaced the old fiefs and are the basis of today's county division.",
        ar: "قسّمت وثيقة الحكم لعام 1634 المملكة إلى مقاطعات، يدير كلًّا منها حاكم مسؤول أمام الإدارة المركزية في ستوكهولم. حلّت المقاطعات محلّ الإقطاعات القديمة، وهي أساس التقسيم الإداري الحالي."
      } },

    { id: "landslag",
      term: { sv: "Landslag", en: "National law code (landslag)", ar: "القانون الوطني (لاندسلاغ)" },
      def: {
        sv: "Magnus Erikssons landslag från omkring 1350 var den första lagen för hela riket och ersatte efter hand landskapslagarna. Den reglerade bland annat kungaval och kungens ed. En reviderad version, Kristoffers landslag, kom 1442.",
        en: "Magnus Eriksson's national law of about 1350 was the first law for the whole realm and gradually replaced the provincial laws. It regulated, among other things, royal elections and the king's oath. A revised version, Christopher's law, followed in 1442.",
        ar: "كان قانون ماغنوس إريكسون الوطني الصادر نحو عام 1350 أول قانون للمملكة كلها، وحلّ تدريجيًا محلّ قوانين الأقاليم. نظّم أمورًا منها انتخاب الملك وقَسَمه. وصدرت نسخة منقّحة، قانون كريستوفر، عام 1442."
      } },

    { id: "recess",
      term: { sv: "Recess", en: "Recess (formal resolution)", ar: "القرار الختامي (ريسيس)" },
      def: {
        sv: "Det skriftliga beslut eller avtal som avslutade ett möte mellan kung, råd eller ständer. Kända exempel är Kalmarrecessen 1483, som villkorade Hans val, och Västerås recess 1527, som bröt kyrkans makt.",
        en: "The written decision or agreement that concluded a meeting of king, council or estates. Famous examples are the Kalmar Recess of 1483, which set conditions for Hans's election, and the Västerås Recess of 1527, which broke the church's power.",
        ar: "القرار أو الاتفاق المكتوب الذي يختتم اجتماع الملك أو المجلس أو الطبقات. ومن أشهر الأمثلة قرار كالمار عام 1483 الذي وضع شروط انتخاب هانس، وقرار فيستروس عام 1527 الذي كسر سلطة الكنيسة."
      } },

    { id: "konungaforsakran",
      term: { sv: "Konungaförsäkran", en: "Royal accession charter (konungaförsäkran)", ar: "تعهّد الملك (كونونغافورشيكران)" },
      def: {
        sv: "Ett skriftligt löfte som en ny kung gav vid tronbestigningen: att följa lagen, respektera rådets och ständernas rättigheter och inte ta ut nya skatter godtyckligt. Försäkringarna användes för att binda kungamakten, till exempel 1611.",
        en: "A written promise given by a new king on accession: to obey the law, respect the rights of the council and estates and not impose new taxes at will. Such charters were used to bind royal power, for example in 1611.",
        ar: "وعد مكتوب يقدّمه الملك الجديد عند اعتلائه العرش: أن يلتزم بالقانون ويحترم حقوق المجلس والطبقات ولا يفرض ضرائب جديدة تعسفًا. استُخدمت هذه التعهّدات لتقييد السلطة الملكية، كما في عام 1611."
      } },

    { id: "riksdag",
      term: { sv: "Riksdag", en: "Riksdag (Diet of the Estates)", ar: "الريكسداغ (مجلس الطبقات)" },
      def: {
        sv: "Möte med representanter för rikets ständer som kungen kallade för att godkänna skatter, krig och tronföljd. Mötet i Arboga 1435 kallas ofta det första, men det är omdiskuterat. Riksdagsordningen 1617 gav riksdagen fastare former.",
        en: "An assembly of representatives of the estates, summoned by the king to approve taxes, wars and succession. The Arboga meeting of 1435 is often called the first, though this is debated. The Riksdag Ordinance of 1617 gave it firmer rules.",
        ar: "اجتماع لممثلي طبقات المملكة يدعو إليه الملك لإقرار الضرائب والحروب ووراثة العرش. كثيرًا ما يُعدّ اجتماع أربوغا عام 1435 الأول، وهذا موضع جدل. ومنح نظامُ الريكسداغ لعام 1617 الريكسداغَ قواعد أكثر ثباتًا."
      } },

    { id: "hansan",
      term: { sv: "Hansan", en: "Hanseatic League (Hansa)", ar: "الرابطة الهانزية (هانزا)" },
      def: {
        sv: "Ett förbund av nordtyska handelsstäder under ledning av Lübeck som dominerade handeln i Östersjön från 1200-talet till 1500-talet. Visby var en viktig hansestad, och tyska köpmän hade stort inflytande i Stockholm och Kalmar.",
        en: "A league of north German trading towns, led by Lübeck, that dominated Baltic trade from the 13th to the 16th century. Visby was an important Hanseatic town, and German merchants had great influence in Stockholm and Kalmar.",
        ar: "اتحاد لمدن تجارية في شمال ألمانيا بقيادة لوبيك، هيمن على تجارة بحر البلطيق من القرن الثالث عشر حتى القرن السادس عشر. كانت فيسبي مدينة هانزية مهمة، وتمتّع التجار الألمان بنفوذ كبير في ستوكهولم وكالمار."
      } },

    { id: "oresundstullen",
      term: { sv: "Öresundstullen", en: "Sound Dues (Öresundstullen)", ar: "رسوم مضيق أوريسوند" },
      def: {
        sv: "Avgift som Danmark tog ut av fartyg som passerade Öresund vid Helsingör, införd av Erik av Pommern omkring 1429. Den gav den danska kronan stora inkomster. Sverige lovades tullfrihet redan 1570, men först freden i Brömsebro 1645 gav full tullfrihet.",
        en: "A fee that Denmark levied on ships passing through the Sound at Helsingør, introduced by Eric of Pomerania around 1429. It gave the Danish crown large revenues. Sweden was promised exemption as early as 1570, but only the Peace of Brömsebro in 1645 gave it full exemption.",
        ar: "رسم فرضته الدنمارك على السفن العابرة لمضيق أوريسوند عند هلسنغور، أدخله إريك البوميراني نحو عام 1429. درّ على التاج الدنماركي دخلًا كبيرًا. ووُعدت السويد بالإعفاء منه منذ عام 1570، لكنها لم تنل إعفاءً كاملًا إلا بصلح برومسبرو عام 1645."
      } },

    { id: "reduktion",
      term: { sv: "Reduktion", en: "Reduction (reduktion)", ar: "الاسترداد (ريدوكشون)" },
      def: {
        sv: "Kronans återtagande av gods och skatteinkomster som tidigare skänkts eller sålts till adeln. En begränsad reduktion beslöts 1655, och Karl XI:s stora reduktion från 1680 flyttade stora mängder jord tillbaka till kronan och stärkte enväldet.",
        en: "The crown's recovery of estates and tax revenues previously granted or sold to the nobility. A limited reduction was decided in 1655, and Charles XI's great reduction from 1680 returned large amounts of land to the crown and strengthened absolutism.",
        ar: "استعادة التاج للأملاك وعائدات الضرائب التي سبق أن مُنحت للنبلاء أو بيعت لهم. تقرّر استرداد محدود عام 1655، ثم أعاد الاسترداد الكبير الذي بدأه كارل الحادي عشر عام 1680 أراضي واسعة إلى التاج وعزّز الحكم المطلق."
      } },

    { id: "arvforening",
      term: { sv: "Arvförening", en: "Succession pact (arvförening)", ar: "اتفاق الوراثة (أرففورينينغ)" },
      def: {
        sv: "Beslut om att kronan skulle ärvas i stället för att kungen valdes. Vid riksdagen i Västerås 1544 blev Sverige ett arvrike för Gustav Vasas manliga ättlingar. Arvföreningen i Norrköping 1604 ändrade tronföljden till förmån för hertig Karls linje.",
        en: "A decision that the crown should be inherited instead of the king being elected. At the Västerås Riksdag of 1544 Sweden became a hereditary kingdom for Gustav Vasa's male heirs. The Norrköping pact of 1604 shifted the succession to Duke Karl's line.",
        ar: "قرار بأن يُورَّث العرش بدلًا من انتخاب الملك. في ريكسداغ فيستروس عام 1544 صارت السويد مملكة وراثية لذرية غوستاف فاسا من الذكور. ونقل اتفاق نورشوبينغ عام 1604 الخلافة إلى سلالة الدوق كارل."
      } },

    { id: "stormakt",
      term: { sv: "Stormakt", en: "Great power (stormakt)", ar: "القوة العظمى (ستورماكت)" },
      def: {
        sv: "En stat med avgörande inflytande i europeisk politik. Sveriges stormaktstid räknas ungefär från 1611 till 1721, då riket omslöt stora delar av Östersjön. Stormaktsställningen vilade på armén, kopparn och järnet, men också på tunga skatter och utskrivningar.",
        en: "A state with decisive influence in European politics. Sweden's great-power era is usually dated c. 1611–1721, when the realm encircled much of the Baltic. Its position rested on the army, copper and iron, but also on heavy taxes and conscription.",
        ar: "دولة ذات نفوذ حاسم في السياسة الأوروبية. يُؤرَّخ عصر السويد قوةً عظمى عادةً من نحو 1611 إلى 1721، حين أحاطت المملكة بجزء كبير من بحر البلطيق. قامت مكانتها على الجيش والنحاس والحديد، وكذلك على ضرائب ثقيلة وتجنيد إجباري."
      } },

    { id: "kalmarunionen",
      term: { sv: "Kalmarunionen", en: "Kalmar Union", ar: "اتحاد كالمار" },
      def: {
        sv: "Förbindelsen mellan Danmark, Norge och Sverige med Finland under en gemensam kung, inledd med Erik av Pommerns kröning i Kalmar 1397. Unionen bröts gång på gång av svenska uppror och upphörde i praktiken när Gustav Vasa valdes 1523.",
        en: "The union of Denmark, Norway and Sweden with Finland under one king, begun with Eric of Pomerania's coronation at Kalmar in 1397. It was broken repeatedly by Swedish risings and ended in practice when Gustav Vasa was elected in 1523.",
        ar: "اتحاد الدنمارك والنرويج والسويد مع فنلندا تحت ملك واحد، بدأ بتتويج إريك البوميراني في كالمار عام 1397. تكرّر انقطاعه بسبب الانتفاضات السويدية، وانتهى فعليًا بانتخاب غوستاف فاسا عام 1523."
      }, sources: [LARSSON, { author: "Vivian Etting", title: "Queen Margrete I (1353–1412) and the Founding of the Nordic Union", year: 2004, publisher: "Brill" }] },

    { id: "personalunion",
      term: { sv: "Personalunion", en: "Personal union", ar: "الاتحاد الشخصي" },
      def: {
        sv: "Två eller flera riken som har samma monark men behåller egna lagar, råd och förvaltning. Kalmarunionen var i grunden en personalunion, liksom förbindelsen mellan Sverige och Polen under Sigismund 1592–1599.",
        en: "Two or more realms that share the same monarch but keep their own laws, councils and administration. The Kalmar Union was essentially a personal union, as was the link between Sweden and Poland under Sigismund in 1592–1599.",
        ar: "مملكتان أو أكثر تشتركان في الملك نفسه مع احتفاظ كل منها بقوانينها ومجلسها وإدارتها. كان اتحاد كالمار في جوهره اتحادًا شخصيًا، وكذلك الرابطة بين السويد وبولندا في عهد سيغيسموند 1592–1599."
      } },

    { id: "riksdaler",
      term: { sv: "Riksdaler", en: "Riksdaler (rix-dollar)", ar: "الريكسدالر" },
      def: {
        sv: "Stort silvermynt efter tysk förebild (Reichstaler). Sverige präglade daler från 1530-talet, och riksdalern blev under 1600-talet en viktig räkneenhet för stora belopp, till exempel lösensumman för Älvsborg 1613, en miljon riksdaler.",
        en: "A large silver coin on the German model (Reichstaler). Sweden struck dalers from the 1530s, and in the 1600s the riksdaler became a key unit for large sums, such as the Älvsborg ransom of 1613: one million riksdaler.",
        ar: "عملة فضية كبيرة على الطراز الألماني (رايشستالر). سكّت السويد الدالر منذ ثلاثينيات القرن السادس عشر، وفي القرن السابع عشر صار الريكسدالر وحدة رئيسية للمبالغ الكبيرة، مثل فدية إلفسبوري عام 1613: مليون ريكسدالر."
      } },

    { id: "korstag",
      term: { sv: "Korståg (Östersjöområdet)", en: "Baltic crusades", ar: "الحملات الصليبية في منطقة البلطيق" },
      def: {
        sv: "Krig mot hedniska folk kring Östersjön, som finnar, ester, liver och prusser, som påven gav korstågsstatus från 1100-talet. De svenska tågen till Finland (traditionellt 1150-talet, 1238/1249 och 1293) är dåligt belagda och benämningen är omdiskuterad.",
        en: "Wars against pagan peoples around the Baltic, such as Finns, Estonians, Livonians and Prussians, which the pope granted crusade status from the 12th century. The Swedish expeditions to Finland (traditionally the 1150s, 1238/1249 and 1293) are poorly documented and the label is debated.",
        ar: "حروب ضد الشعوب الوثنية حول البلطيق، كالفنلنديين والإستونيين والليفيين والبروسيين، منحها البابا صفة الحملة الصليبية منذ القرن الثاني عشر. أما الحملات السويدية إلى فنلندا (تقليديًا في خمسينيات القرن الثاني عشر و1238/1249 و1293) فتوثيقها ضعيف وتسميتها موضع جدل."
      }, sources: [UVF_KOR] },

    { id: "lagman",
      term: { sv: "Lagman", en: "Lawspeaker (lagman)", ar: "حافظ القانون (لاغمان)" },
      def: {
        sv: "Domare och talesman för ett lagsagoområde, som Uppland eller Västergötland. Lagmannen föredrog lagen på tinget och företrädde bygden inför kungen. Under medeltiden blev ämbetet alltmer en post för mäktiga adelsmän.",
        en: "Judge and spokesman for a law province, such as Uppland or Västergötland. The lawspeaker recited the law at the assembly (ting) and represented the people before the king. In the Middle Ages the office increasingly became a post for powerful nobles.",
        ar: "قاضٍ ومتحدث باسم إقليم قانوني مثل أوبلاند أو فسترغوتلاند. كان يتلو القانون في مجلس الإقليم (تينغ) ويمثّل أهله أمام الملك. وفي العصور الوسطى صار المنصب على نحو متزايد حكرًا على النبلاء الأقوياء."
      }, sources: [HARRISON] },

    { id: "tionde",
      term: { sv: "Tionde", en: "Tithe (tionde)", ar: "العُشر (تيونده)" },
      def: {
        sv: "En tiondel av skörden och andra intäkter som bönderna skulle ge till kyrkan. Tiondet infördes i Sverige under 1100- och 1200-talen och delades mellan biskop, sockenkyrka och präst. Efter reformationen tog kronan en stor del.",
        en: "A tenth of the harvest and other produce that peasants had to give to the church. It was introduced in Sweden in the 12th and 13th centuries and divided between bishop, parish church and priest. After the Reformation the crown took a large share.",
        ar: "عُشر المحصول وغيره من الإنتاج، وكان على الفلاحين تقديمه للكنيسة. أُدخل في السويد خلال القرنين الثاني عشر والثالث عشر، وقُسّم بين الأسقف وكنيسة الأبرشية والكاهن. وبعد الإصلاح الديني استولى التاج على حصة كبيرة منه."
      } },

    { id: "bergslag",
      term: { sv: "Bergslag", en: "Mining district (bergslag)", ar: "منطقة التعدين (بيريسلاغ)" },
      def: {
        sv: "Gruvdistrikt i Mellansverige där bergsmän bröt malm och framställde järn och koppar med särskilda privilegier. Stora Kopparberget vid Falun var det viktigaste. Bergsmännen var självständiga och spelade stor roll i upproren, till exempel Engelbrekts.",
        en: "Mining districts in central Sweden where miner-farmers (bergsmän) extracted ore and produced iron and copper under special privileges. Stora Kopparberget at Falun was the most important. The miners were independent and played a major role in risings such as Engelbrekt's.",
        ar: "مناطق تعدين في وسط السويد استخرج فيها المزارعون-المعدّنون الخام وأنتجوا الحديد والنحاس بامتيازات خاصة. وكان جبل النحاس الكبير في فالون أهمها. تمتّع المعدّنون باستقلال ولعبوا دورًا كبيرًا في الانتفاضات، مثل انتفاضة إنغلبريكت."
      } },

    { id: "stander",
      term: { sv: "Ständer", en: "Estates (ständer)", ar: "الطبقات (ستيندر)" },
      def: {
        sv: "Samhällets fyra erkända grupper med egna rättigheter och plikter: adel, präster, borgare och bönder. De möttes i riksdagen, där varje stånd överlade för sig. Sverige var ovanligt genom att bönderna hade ett eget stånd.",
        en: "Society's four recognised groups, each with its own rights and duties: nobility, clergy, burghers and peasants. They met in the Riksdag, where each estate deliberated separately. Sweden was unusual in that the peasants formed an estate of their own.",
        ar: "فئات المجتمع الأربع المعترف بها، لكل منها حقوقها وواجباتها: النبلاء ورجال الدين والبرجوازيون والفلاحون. اجتمعت في الريكسداغ حيث تداولت كل طبقة منفردة. وتميّزت السويد بأن للفلاحين طبقة خاصة بهم."
      } },

    { id: "mora-stenar",
      term: { sv: "Mora stenar", en: "Stones of Mora", ar: "أحجار مورا" },
      def: {
        sv: "Plats på Mora äng sydost om Uppsala där svenska kungar valdes och hyllades under medeltiden, till exempel Magnus Eriksson 1319 och Erik av Pommern 1396. Själva stenarna är försvunna; bara fragment av senare minnesstenar finns kvar.",
        en: "A site on Mora meadow south-east of Uppsala where Swedish kings were elected and acclaimed in the Middle Ages, for example Magnus Eriksson in 1319 and Eric of Pomerania in 1396. The stones themselves are lost; only fragments of later memorial stones survive.",
        ar: "موقع في مرج مورا جنوب شرق أوبسالا كان يُنتخب فيه ملوك السويد ويُنادى بهم في العصور الوسطى، مثل ماغنوس إريكسون عام 1319 وإريك البوميراني عام 1396. فُقدت الأحجار نفسها، ولم يبقَ إلا شظايا من أحجار تذكارية لاحقة."
      } },

    { id: "marsk",
      term: { sv: "Marsk", en: "Marshal (marsk)", ar: "المارشال (مارسك)" },
      def: {
        sv: "Rikets högste militäre befälhavare och en av de främsta i riksrådet. Torgils Knutsson var marsk och ledde riket under Birger Magnussons minderårighet. Karl Knutsson använde marskämbetet som språngbräda till makten på 1430-talet.",
        en: "The realm's highest military commander and one of the leading members of the council. Torgils Knutsson was marshal and led the realm during Birger Magnusson's minority. Karl Knutsson used the office as a springboard to power in the 1430s.",
        ar: "أعلى قائد عسكري في المملكة وأحد أبرز أعضاء المجلس. كان تورغيلس كنوتسون مارشالًا وقاد المملكة أثناء قصور بيرغر ماغنوسون. واستخدم كارل كنوتسون هذا المنصب نقطة انطلاق إلى السلطة في ثلاثينيات القرن الخامس عشر."
      } },

    { id: "formyndarregering",
      term: { sv: "Förmyndarregering", en: "Regency government (förmyndarregering)", ar: "حكومة الوصاية" },
      def: {
        sv: "Styrelse som utövar makten åt en omyndig monark. Efter Gustav II Adolfs död 1632 styrde en förmyndarregering under Axel Oxenstierna åt Kristina, och 1660–1672 styrde en annan åt Karl XI. Adeln stärkte ofta sin ställning under sådana perioder.",
        en: "A government that exercises power on behalf of an under-age monarch. After Gustavus Adolphus died in 1632 a regency under Axel Oxenstierna ruled for Christina, and in 1660–1672 another ruled for Charles XI. The nobility often strengthened its position during such periods.",
        ar: "حكومة تمارس السلطة نيابة عن ملك قاصر. بعد وفاة غوستاف الثاني أدولف عام 1632 حكمت وصاية بقيادة أكسل أوكسنشيرنا باسم كريستينا، وفي 1660–1672 حكمت وصاية أخرى باسم كارل الحادي عشر. وكثيرًا ما عزّز النبلاء مكانتهم في تلك الفترات."
      } },

    { id: "birkarlar",
      term: { sv: "Birkarlar", en: "Birkarls (birkarlar)", ar: "البيركارلار" },
      def: {
        sv: "Handelsmän från norra Bottenviken som med kunglig tillåtelse handlade med samerna och tog upp skatt av dem åt kronan. Deras privilegier går tillbaka till Magnus Erikssons tid. Genom dem sträckte sig den svenska kronans inflytande in i Lappmarken.",
        en: "Traders from the northern Gulf of Bothnia who, with royal permission, traded with the Sámi and collected tax from them for the crown. Their privileges go back to Magnus Eriksson's time. Through them the Swedish crown's influence reached into Lapland.",
        ar: "تجار من شمال خليج بوتنيا تاجروا بإذن ملكي مع الصاميين (Sámi) وجبوا منهم الضرائب لصالح التاج. تعود امتيازاتهم إلى عهد ماغنوس إريكسون. ومن خلالهم امتدّ نفوذ التاج السويدي إلى لابلاند."
      }, sources: [SNL_BIRK] },

    { id: "unionsbrevet",
      term: { sv: "Unionsbrevet", en: "Union Letter (unionsbrevet)", ar: "وثيقة الاتحاد (أونيونسبريفِت)" },
      def: {
        sv: "Dokument från unionsmötet i Kalmar 1397 om hur unionen skulle fungera: en gemensam kung, ömsesidig hjälp i krig och att varje rike styrdes efter egen lag. Det är skrivet på papper med bara tio sigill, och forskare är oeniga om det var ett giltigt fördrag eller ett utkast.",
        en: "A document from the 1397 union meeting at Kalmar setting out how the union should work: one common king, mutual help in war and each realm ruled by its own law. Written on paper with only ten seals, it was either a valid treaty or a draft; historians disagree.",
        ar: "وثيقة من اجتماع الاتحاد في كالمار عام 1397 تصف كيف ينبغي أن يعمل الاتحاد: ملك مشترك، وتعاون متبادل في الحرب، وأن تُحكم كل مملكة بقانونها الخاص. كُتبت على الورق ولا تحمل إلا عشرة أختام، ويختلف المؤرخون: أكانت معاهدة نافذة أم مجرد مسودة؟"
      }, sources: [LARSSON] },

    { id: "kroningsbrevet",
      term: { sv: "Kröningsbrevet", en: "Coronation Letter (kröningsbrevet)", ar: "وثيقة التتويج (كرونينغسبريفِت)" },
      def: {
        sv: "Ett pergamentbrev daterat i Kalmar 13 juli 1397, med 67 hängande sigill från stormän och biskopar i de tre rikena. Det bekräftar att Erik av Pommern krönts till gemensam kung. Till skillnad från unionsbrevet är det formellt fullbordat och därför otvivelaktigt giltigt.",
        en: "A parchment letter dated at Kalmar on 13 July 1397, with 67 hanging seals of magnates and bishops from the three realms. It confirms that Eric of Pomerania had been crowned as their common king. Unlike the Union Letter it was formally completed and is therefore undoubtedly valid.",
        ar: "رسالة على الرِّق مؤرّخة في كالمار في 13 يوليو 1397، تحمل 67 ختمًا معلّقًا لكبار النبلاء والأساقفة من الممالك الثلاث. وهي تؤكد تتويج إريك البوميراني ملكًا مشتركًا لها. وخلافًا لوثيقة الاتحاد، استوفت الشروط الشكلية كاملة، فصحّتها لا شك فيها."
      }, sources: [LARSSON] },

    { id: "herredag",
      term: { sv: "Herredag", en: "Herredag (assembly of lords)", ar: "مجلس السادة (هيرّيداغ)" },
      def: {
        sv: "Ett möte där kungen eller riksföreståndaren samlade rådet och andra stormän för att avgöra viktiga frågor om lag, skatter, krig och kungaval. Herredagar var vanliga under senmedeltiden och 1500-talet, innan riksdagen med alla fyra stånd tog över deras roll.",
        en: "A meeting at which the king or the regent gathered the council and other magnates to decide important matters of law, taxes, war and royal elections. Such assemblies were common in the late Middle Ages and the 16th century, before the Riksdag of all four estates took over their role.",
        ar: "اجتماع يجمع فيه الملك أو الوصي على المملكة المجلسَ وغيره من كبار النبلاء للبتّ في شؤون مهمة كالقانون والضرائب والحرب وانتخاب الملك. شاعت هذه الاجتماعات في أواخر العصور الوسطى وفي القرن السادس عشر، قبل أن يتولى الريكسداغ بطبقاته الأربع دورها."
      } },

    { id: "landskapslag",
      term: { sv: "Landskapslagar", en: "Provincial laws (landskapslagar)", ar: "قوانين الأقاليم (لاندسكابسلاغار)" },
      def: {
        sv: "De medeltida lagar som gällde i var sin lagsaga, till exempel Västgötalagen, Östgötalagen och Upplandslagen från 1296. De skrevs ned under 1200- och 1300-talen och ersattes efter hand av Magnus Erikssons landslag. Äldre Västgötalagen från 1220-talet är Sveriges äldsta bevarade lagtext.",
        en: "The medieval laws of the individual law provinces, such as the Västgöta, Östgöta and Uppland laws (1296). Written down in the 13th and 14th centuries, they were gradually replaced by Magnus Eriksson's national law. The Older Västgöta Law of the 1220s is Sweden's oldest surviving legal text.",
        ar: "قوانين العصور الوسطى الخاصة بكل إقليم قانوني، مثل قوانين فسترغوتلاند وأوسترغوتلاند وأوبلاند (1296). دُوّنت في القرنين الثالث عشر والرابع عشر، ثم حلّ محلّها تدريجيًا قانون ماغنوس إريكسون الوطني. ويُعدّ قانون فسترغوتلاند القديم (عشرينيات القرن الثالث عشر) أقدم نص قانوني سويدي باقٍ."
      }, sources: [HARRISON] },

    { id: "indelningsverk",
      term: { sv: "Indelningsverk", en: "Allotment system (indelningsverk)", ar: "نظام التخصيص (إندلنينغسفيرك)" },
      def: {
        sv: "Ett system där bestämda skatteinkomster eller gårdar anvisades direkt till bestämda utgifter, främst armén. Från 1680-talet, under Karl XI, höll rotar av bönder var sin soldat med torp och lön, och officerarna fick boställen. I gengäld slapp bygden utskrivning. Systemet bestod till 1901.",
        en: "A system assigning particular tax revenues or farms directly to particular expenses, above all the army. From the 1680s, under Charles XI, files of peasants each kept a soldier with a cottage and pay, and officers received farms. In return districts were spared conscription. It lasted until 1901.",
        ar: "نظام تُخصَّص فيه عائدات ضريبية أو مزارع بعينها مباشرةً لنفقات بعينها، ولا سيما الجيش. فمنذ ثمانينيات القرن السابع عشر، في عهد كارل الحادي عشر، تكفّلت كل مجموعة من الفلاحين (روتا) بجندي له كوخ وأجر، ونال الضباط مزارع رسمية. وفي المقابل أُعفيت المناطق من التجنيد. ودام النظام حتى عام 1901."
      }, sources: [ERICSON] },

    { id: "utskrivning",
      term: { sv: "Utskrivning", en: "Conscription (utskrivning)", ar: "التجنيد الإجباري (أوتسكريفنينغ)" },
      def: {
        sv: "Tvångsrekrytering av soldater bland allmogen. Männen i en socken delades in i rotar, ofta om tio, och ur varje rote togs en man. Utskrivningarna var stormaktstidens tyngsta börda för bondesamhället och ersattes från 1680-talet till stor del av indelningsverket.",
        en: "Compulsory recruitment of soldiers from the common people. The men of a parish were divided into files, often of ten, and one man was taken from each. Conscription was the great-power era's heaviest burden on rural society and from the 1680s was largely replaced by the allotment system.",
        ar: "تجنيد إجباري للجنود من عامة الناس. كان رجال الأبرشية يُقسَّمون إلى مجموعات، كثيرًا ما تضم عشرة رجال، ويؤخذ من كل مجموعة رجل واحد. وكان التجنيد أثقل الأعباء على المجتمع الريفي في عصر القوة العظمى، وحلّ محلّه إلى حد كبير نظامُ التخصيص منذ ثمانينيات القرن السابع عشر."
      }, sources: [LINDEGREN] },

    { id: "bondekategorier",
      term: { sv: "Bondekategorier", en: "Peasant categories (skattebonde, kronobonde, frälsebonde)", ar: "فئات الفلاحين (فلاح الضريبة وفلاح التاج وفلاح الإعفاء)" },
      def: {
        sv: "Bönderna delades in efter vem som ägde jorden. Skattebonden ägde sin gård och betalade skatt till kronan, kronobonden arrenderade kronans jord och frälsebonden brukade adelns jord och betalade avgifter till godsherren. Under 1600-talet växte frälsejorden kraftigt, tills reduktionen vände utvecklingen.",
        en: "Peasants were classed by who owned the land. The tax peasant (skattebonde) owned his farm and paid tax to the crown; the crown peasant (kronobonde) rented crown land; the frälse peasant farmed noble land and paid dues to its lord. Noble land grew sharply in the 1600s until the reduction.",
        ar: "صُنّف الفلاحون بحسب مالك الأرض. فـ«فلاح الضريبة» (سكاتبونده) يملك مزرعته ويدفع الضريبة للتاج، و«فلاح التاج» (كرونوبونده) يستأجر أرض التاج، و«فلاح الإعفاء» (فريلسبونده) يزرع أرض النبلاء ويدفع المستحقات لسيدها. واتسعت أراضي النبلاء كثيرًا في القرن السابع عشر حتى عكس «الاسترداد» هذا الاتجاه."
      }, sources: [VILLSTRAND] },

    { id: "generalguvernement",
      term: { sv: "Generalguvernement", en: "Governor-generalship (generalguvernement)", ar: "الحكومة العامة (غينيرالغوفيرنمنت)" },
      def: {
        sv: "Ett större område, ofta en erövrad provins, som styrdes av en generalguvernör med vidsträckt civil och militär makt. Under stormaktstiden var till exempel Livland, Ingermanland och Skåne generalguvernement. De behöll ofta egna lagar och privilegier, särskilt i Baltikum.",
        en: "A larger territory, often a conquered province, governed by a governor-general with wide civil and military powers. In the great-power era Livonia, Ingria and Scania, for example, were governor-generalships. They often kept their own laws and privileges, especially in the Baltic provinces.",
        ar: "إقليم واسع، كثيرًا ما يكون ولاية انتُزعت بالحرب، يحكمه حاكم عام ذو صلاحيات مدنية وعسكرية واسعة. وفي عصر القوة العظمى كانت ليفونيا وإنغريا وسكونه، مثلًا، حكوماتٍ عامة. وكثيرًا ما احتفظت بقوانينها وامتيازاتها الخاصة، ولا سيما في الأقاليم البلطيقية."
      }, sources: [VILLSTRAND] },

    { id: "licenter",
      term: { sv: "Licenter", en: "Licences (licenter, war tolls)", ar: "رسوم الحرب الجمركية (ليسِنتر)" },
      def: {
        sv: "Tullar som Sverige tog ut på handeln i erövrade hamnar, främst i Preussen och Livland från 1620-talet och senare i de tyska Östersjöhamnarna. Licenterna var en viktig del av krigsfinansieringen och ett sätt att låta kriget betala sig självt.",
        en: "Customs duties that Sweden levied on trade in conquered ports, chiefly in Prussia and Livonia from the 1620s and later in the German Baltic ports. The licences were an important part of war finance and a way of making the war pay for itself.",
        ar: "رسوم جمركية فرضتها السويد على التجارة في الموانئ التي استولت عليها، ولا سيما في بروسيا وليفونيا منذ عشرينيات القرن السابع عشر، ثم في موانئ البلطيق الألمانية. وكانت هذه الرسوم جزءًا مهمًا من تمويل الحرب ووسيلةً لجعل الحرب تموّل نفسها بنفسها."
      } },

    { id: "handfastning",
      term: { sv: "Handfästning", en: "Coronation charter (handfästning)", ar: "ميثاق التتويج (هاندفيستنينغ)" },
      def: {
        sv: "Den skriftliga förpliktelse som en dansk kung måste underteckna vid valet, där han lovade att styra med riksrådet och respektera adelns privilegier. Handfästningar utfärdades från 1282 till 1648 och motsvarade de svenska kungaförsäkringarna. De upphörde när enväldet infördes 1660.",
        en: "The written undertaking a Danish king had to sign on his election, promising to govern with the council of the realm and respect the nobility's privileges. Such charters were issued from 1282 to 1648 and matched the Swedish accession charters. They ended when absolutism was introduced in 1660.",
        ar: "التزام مكتوب كان على ملك الدنمارك توقيعه عند انتخابه، يتعهد فيه بالحكم مع مجلس المملكة واحترام امتيازات النبلاء. صدرت هذه المواثيق من عام 1282 حتى عام 1648، وكانت تقابل تعهّدات الملوك في السويد. وانتهت بإرساء الحكم المطلق عام 1660."
      } },

    { id: "stapelstad",
      term: { sv: "Stapelstad", en: "Staple town (stapelstad)", ar: "مدينة الاستيداع (ستابلستاد)" },
      def: {
        sv: "Stad med rätt att driva handel direkt med utlandet och ta emot utländska fartyg. Enligt handelsordinantierna 1614 och 1617 var stapelstäderna få och låg främst vid kusten; övriga städer, uppstäderna, fick bara handla inom riket. Stockholm var den viktigaste stapelstaden.",
        en: "A town with the right to trade directly with foreign countries and receive foreign ships. Under the trade ordinances of 1614 and 1617 the staple towns were few and mostly coastal; other towns, the uppstäder, could trade only within the realm. Stockholm was the most important.",
        ar: "مدينة لها حق التجارة مباشرة مع الخارج واستقبال السفن الأجنبية. وبموجب مراسيم التجارة لعامي 1614 و1617 كانت مدن الاستيداع قليلة وساحلية في معظمها، أما المدن الأخرى (أوبستيدر) فلم يُسمح لها بالتجارة إلا داخل المملكة. وكانت ستوكهولم أهم مدن الاستيداع."
      }, sources: [LILJA] }
  ];
})();
