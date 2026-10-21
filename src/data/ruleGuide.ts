export interface RuleCard {
  id: string;
  title: string;
  badge: string;
  summary: string;
  examplesGood: string[];
  examplesBad: string[];
  mnemonic: string;
}

export const RULE_GUIDES: RuleCard[] = [
  {
    id: 'rule-d-verbs',
    title: 'A -d végű igék felszólító módja',
    badge: 'Igeragozás',
    summary: 'A d-re végződő igékhez járuló -j felszólító jel teljes hasonulással d-vé válik. Határozott ragozásban és rövid tőnél mindig két d-t írunk!',
    examplesGood: ['küldd el a képeslapot', 'mondd meg az igazat', 'add ide a ceruzát', 'szedd össze magad'],
    examplesBad: ['küld el', 'mond meg', 'ad ide', 'szed össze'],
    mnemonic: '💡 Emlékeztető: „Ha kérlek vagy parancsolok: a -d végű igének két d-t adok!”',
  },
  {
    id: 'rule-j-ly',
    title: 'J vagy LY? A felvételi aranyszabályai',
    badge: 'Hangjelölés',
    summary: 'Bár kiejtésben mindkettő [j], a felvételi szavak többsége szótári tanulást igényel. Vannak azonban biztos kapaszkodók!',
    examplesGood: ['muszáj (mindig pontos j!)', 'papagáj, fürj, sejt, ujjong', 'szénaboglya, tavaly, folyó, harkály', 'folyjon (ly és j találkozása!)'],
    examplesBad: ['muszály', 'papagály', 'szénabogja', 'fojon'],
    mnemonic: '💡 Aranyszabály: A „muszáj” az egyetlen -áj végű szó, ami pontos j-s! A többi (karvaly, sirály, harkály) ly-os.',
  },
  {
    id: 'rule-doubling',
    title: 'Egyszerűsítés összetett szavak határán',
    badge: 'Összetett szavak',
    summary: 'Két azonos kétjegyű mássalhangzó találkozásakor egyszerű szavakban egyszerűsítünk (pl. meggy, loccsan), DE összetett szavak határán TILOS egyszerűsíteni!',
    examplesGood: ['jegygyűrű (jegy + gyűrű)', 'kulccsomó (kulcs + csomó)', 'visszhang (vissz + hang)'],
    examplesBad: ['jeggyűrű', 'kulcsomó', 'viszhang'],
    mnemonic: '💡 Emlékeztető: Összetétel határán tiszteld az alapszavakat, írd ki mindkettőt teljes egészében!',
  },
  {
    id: 'rule-hyphen-endings',
    title: 'Kötőjel a kettőzött betűs szavak toldalékolásakor',
    badge: 'Toldalékolás',
    summary: 'Ha a kettőzött betűre (pl. -kk, -lly, -pp) végződő szóhoz azonos mássalhangzóval kezdődő toldalék járul, vagy tulajdonnévről van szó, kötőjelet teszünk!',
    examplesGood: ['sakk-kal (sakk + val)', 'gally-jal (gally + val)', 'Papp-pal (tulajdonnév: Papp + val)', 'Wittmann-né'],
    examplesBad: ['sakkal', 'sakkkal', 'gallyal', 'Pappal'],
    mnemonic: '💡 Emlékeztető: Három egyforma betű sosem állhat egymás mellett. Kötőjellel védjük meg őket!',
  },
  {
    id: 'rule-prefix-separation',
    title: 'Az igekötők elválása és segédigék',
    badge: 'Szótagolás & Helyesírás',
    summary: 'Ha az ige közvetlenül az igekötője után áll, egybeírjuk. Ha azonban segédige (tud, akar, fog, kell, lehet) ékelődik közéjük, mindhárom elemet KÜLÖN írjuk!',
    examplesGood: ['meg tudta oldani', 'be akarta csukni', 'el fogja mondani', 'megtudta a hírt (más a jelentés!)'],
    examplesBad: ['megtudta oldani', 'beakarta csukni', 'elfogja mondani'],
    mnemonic: '💡 Tipp: Ha a „tud”, „akar”, „fog” közéjük férkőzik, a szavak azonnal szétugranak!',
  },
  {
    id: 'rule-comparative-small',
    title: 'A „kisebb” és a fokozás csapdája',
    badge: 'Melléknév',
    summary: 'A „kis / kicsi” melléknév középfoka szabályosan: „kisebb”, egyetlen s betűvel! A legkisebb szintén egy s-es. Ne keverd össze a „kissé” (hosszú ss) határozószóval!',
    examplesGood: ['kisebb testvér', 'legkisebb királyfi', 'kissé elfáradt'],
    examplesBad: ['kissebb testvér', 'legkissebb királyfi'],
    mnemonic: '💡 Tipp: A „kisebb” méretre utal egy s-sel, a „kissé” mértékhatározó kettővel!',
  },
  {
    id: 'rule-historical-names',
    title: 'Hagyományos történelmi családnevek',
    badge: 'Tulajdonnevek',
    summary: 'A magyar történelmi nevek írásmódját a hagyomány elve őrzi. Ezeket a felvételin fejből kell ismerni!',
    examplesGood: ['Széchenyi (cz helyett cs, -ényi)', 'Kossuth (két s)', 'Batthyány (két t, hy)', 'Kazinczy (cz, y)'],
    examplesBad: ['Szécsényi / Szécheny', 'Kosuth', 'Batyányi', 'Kazinci'],
    mnemonic: '💡 Tipp: Készíts róluk vizuális memóriakártyát, a felvételi lottó 99%-ban tartalmaz ilyet!',
  },
];
