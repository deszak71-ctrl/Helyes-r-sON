import { VerbTask } from '../types';

export const VERB_TASKS: VerbTask[] = [
  {
    id: 'verb-1',
    templateParts: [
      'A Fradi szombaton ',
      ' a következő bajnoki mérkőzését.',
    ],
    gaps: [
      {
        promptVerb: 'játszik',
        formRequired: 'kijelentő mód, jelen idő, E/3 (a „mérkőzését” határozott tárgyhoz)',
        correctAnswers: ['játssza', 'játszik'],
        ruleExplanation: 'A „mérkőzését” határozott tárgy miatt a határozott ragozású alak a legpontosabb: „játssza”. A játszik tő z-je a -ja rag j-jével összeolvad: sz + j -> ssz!',
      },
    ],
    fullSentence: 'A Fradi szombaton játssza a következő bajnoki mérkőzését.',
    ruleCategory: 'Igető és határozott ragozás (sz + j -> ssz)',
  },
  {
    id: 'verb-2',
    templateParts: [
      'Panni, kérlek, ',
      ' erről az ügyről, ne ',
      ' el senkinek!',
    ],
    gaps: [
      {
        promptVerb: 'hallgat',
        formRequired: 'felszólító mód, E/2 alanyi',
        correctAnswers: ['hallgass'],
        ruleExplanation: 'A t végű igékhez járuló -j felszólító jel teljes hasonulással s lesz: hallgat + j -> „hallgass”!',
      },
      {
        promptVerb: 'mond',
        formRequired: 'felszólító mód, E/2 határozott',
        correctAnswers: ['mondd'],
        ruleExplanation: 'A -d végű ige felszólító alakja határozott ragozásban kettőzött d: mond + j -> „mondd” (két d betűvel)!',
      },
    ],
    fullSentence: 'Panni, kérlek, hallgass erről az ügyről, ne mondd el senkinek!',
    ruleCategory: 'Felszólító módú hasonulások (-ss és -dd)',
  },
  {
    id: 'verb-3',
    templateParts: [
      'Anyu, ',
      ' nekem, nem én voltam!',
    ],
    gaps: [
      {
        promptVerb: 'hisz',
        formRequired: 'felszólító mód, E/2',
        correctAnswers: ['higgy', 'higgyél'],
        ruleExplanation: 'A „hisz” rendhagyó ige felszólító módú töve a higy-, ami a -j jellel teljes hasonulást alkot: „higgy” vagy „higgyél” (két gy)!',
      },
    ],
    fullSentence: 'Anyu, higgy nekem, nem én voltam!',
    ruleCategory: 'Rendhagyó igék felszólító módja (hisz -> higgy)',
  },
  {
    id: 'verb-4',
    templateParts: [
      'Fiúk, ne ',
      ' a kicsikre vízipisztollyal!',
    ],
    gaps: [
      {
        promptVerb: 'lő',
        formRequired: 'felszólító mód, T/2',
        correctAnswers: ['lőjetek'],
        ruleExplanation: 'A „lő” v-s tőváltozatú ige (lő/löv-), felszólító módban: lő + j + etek = „lőjetek” (hosszú ő és egyetlen j)!',
      },
    ],
    fullSentence: 'Fiúk, ne lőjetek a kicsikre vízipisztollyal!',
    ruleCategory: 'Magánhangzóra végződő igék felszólító módja',
  },
  {
    id: 'verb-5',
    templateParts: [
      'Húzd ki a dugót, hadd ',
      ' le a víz!',
    ],
    gaps: [
      {
        promptVerb: 'folyik',
        formRequired: 'felszólító mód, E/3 alanyi',
        correctAnswers: ['folyjon'],
        ruleExplanation: 'A „hadd” kötőszó után felszólító mód áll. A folyik töve „foly-”, a felszólító jel pedig „-j-”: foly + j + on = „folyjon” (ly és j egymás mellett)!',
      },
    ],
    fullSentence: 'Húzd ki a dugót, hadd folyjon le a víz!',
    ruleCategory: 'Az ly és a j találkozása (folyjon)',
  },
  {
    id: 'verb-6',
    templateParts: [
      'Peti, kérlek, ',
      ' ide nekem a ceruzámat!',
    ],
    gaps: [
      {
        promptVerb: 'ad',
        formRequired: 'felszólító mód, E/2 határozott',
        correctAnswers: ['add'],
        ruleExplanation: 'A rövid tőhöz (-d végű tő) járuló felszólító jel teljes hasonulással d lesz: ad + j -> „add” (két d betűvel)!',
      },
    ],
    fullSentence: 'Peti, kérlek, add ide nekem a ceruzámat!',
    ruleCategory: 'A -d végű igék ragozása (add)',
  },
  {
    id: 'verb-7',
    templateParts: [
      'A tanulók figyelmesen ',
      ' a könyv utasításait.',
    ],
    gaps: [
      {
        promptVerb: 'olvas',
        formRequired: 'kijelentő mód, jelen idő, T/3 határozott',
        correctAnswers: ['olvassák'],
        ruleExplanation: 'A -s végű igék határozott ragozásában a -ják rag j-je teljesen hasonul az s-hez: olvas + ják = „olvassák” (kettőzött ss)!',
      },
    ],
    fullSentence: 'A tanulók figyelmesen olvassák a könyv utasításait.',
    ruleCategory: 'Határozott ragozású hasonulás (-ssák)',
  },
];
