import { QuoteTask } from '../types';

export const QUOTE_TASKS: QuoteTask[] = [
  {
    id: 'quote-1',
    authorOrSource: 'Klasszikus gondolat',
    fullText: 'A zsarnoksággal mindig együtt jár e kór: barátaikban sem mernek megbízni ők.',
    segments: [
      {
        text: 'A zsarnoksággal mind',
        gapExpected: 'i',
        hint: 'Rövid vagy hosszú i?',
        explanation: 'A „mindig” határozószóban mindkét i rövid: mindig.',
      },
      {
        text: 'g együtt jár e kór: barátaikban sem mernek megb',
        gapExpected: 'í',
        hint: 'Rövid vagy hosszú í a bízik igében?',
        explanation: 'A „megbízni” ige tövében hosszú í áll: bízik, megbízni.',
      },
    ],
    trailingText: 'zni ők.',
  },
  {
    id: 'quote-2',
    authorOrSource: 'Bölcs mondás a barátságról',
    fullText: 'Helyesebb, ha pótoljuk a barátot, mintha siratjuk.',
    segments: [
      {
        text: 'Helyesebb, ha póto',
        gapExpected: 'lj',
        hint: 'pótol + juk',
        explanation: 'Pótol + juk: az l és a j egymás mellé kerül, nem kettőzzük az l-t: pótoljuk.',
      },
      {
        text: 'uk a barátot, mintha sira',
        gapExpected: 'tj',
        hint: 'sirat + juk (írásban jelöletlen összeolvadás)',
        explanation: 'Sirat + juk: bár ty-nek vagy cshangnak halljuk, írásban megőrizzük a t és j betűket: siratjuk.',
      },
    ],
    trailingText: 'uk.',
  },
  {
    id: 'quote-3',
    authorOrSource: 'Közmondás az óvatosságról',
    fullText: 'Néha a legkisebb ellenfeled valamennyi között a legveszélyesebb.',
    segments: [
      {
        text: 'Néha a legki',
        gapExpected: 's',
        hint: 'Hány s betű van a kisebb szóban?',
        explanation: 'A „kisebb” és a „legkisebb” alakban egyetlen s betű áll (nem kettőzzük, mint a kissé szót)!',
      },
    ],
    trailingText: 'ebb ellenfeled valamennyi között a legveszélyesebb.',
  },
  {
    id: 'quote-4',
    authorOrSource: 'Magyar szólás',
    fullText: 'Két malomkő közt őrlődik.',
    segments: [
      {
        text: 'Két malomkő közt ',
        gapExpected: 'ő',
        acceptedAlternatives: ['Ő', 'ő'],
        hint: 'Hosszú ő betű az őröl igéből',
        explanation: 'Az „őrlődik” (és őröl, őrlés) szavakban hosszú ő betű áll.',
      },
    ],
    trailingText: 'rlődik.',
  },
  {
    id: 'quote-5',
    authorOrSource: 'Óva intő közmondás',
    fullText: 'Ne játssz a tűzzel!',
    segments: [
      {
        text: 'Ne ját',
        gapExpected: 'ssz',
        hint: 'A játszik ige felszólító E/2 alakjának jele',
        explanation: 'Játszik felszólító E/2 alakja: játssz (sz + j összeolvadás miatt három s betű / hosszú ssz: játssz)!',
      },
    ],
    trailingText: ' a tűzzel!',
  },
  {
    id: 'quote-6',
    authorOrSource: 'Népi bölcsesség',
    fullText: 'Aki másnak vermet ás, maga esik bele.',
    segments: [
      {
        text: 'Aki másnak verme',
        gapExpected: 't',
        hint: 'Tárgyrag a verem szónál',
        explanation: 'Verem + t = vermet (a t a tárgyrag).',
      },
      {
        text: ' ',
        gapExpected: 'á',
        hint: 'Hosszú á betű',
        explanation: 'Ás: hosszú á betűvel írandó (ás, ásó).',
      },
    ],
    trailingText: 's, maga esik bele.',
  },
];
