import { GroupTask } from '../types';

export const GROUP_TASKS: GroupTask[] = [
  {
    id: 'group-1',
    category: 'Mássalhangzók kötőjeles toldalékolása',
    ruleTip: 'Figyeld meg a kettőzött betűs szavak toldalékolását! Kötőjellel védjük meg az alapszót (sakk-kal, gally-jal, Papp-pal).',
    options: [
      {
        text: 'sakk-kal',
        isCorrect: true,
        explanation: 'Helyes! Ha a kettőzött betűre végződő szóhoz azonos mássalhangzóval kezdődő toldalék járul, kötőjellel kötjük: sakk-kal.',
      },
      {
        text: 'gally-jal',
        isCorrect: true,
        explanation: 'Helyes! A hosszú kétjegyű mássalhangzóra végződő szavaknál a -val/-vel toldalék kötőjellel kapcsolódik: gally-jal.',
      },
      {
        text: 'Papp-pal',
        isCorrect: true,
        explanation: 'Helyes! A kettőzött betűre végződő magyar családneveknél kötelező a kötőjel a név védelmében: Papp-pal.',
      },
    ],
  },
  {
    id: 'group-2',
    category: 'Számok és rövidítések toldalékolása',
    ruleTip: 'A mértékegységek után nem teszünk pontot, a keltezésnél pedig a helyes toldalékos alak a döntő.',
    options: [
      {
        text: 'cm-el',
        isCorrect: false,
        explanation: 'Hibás! A kiejtés szerint centiméterrel, ezért a helyes alak: cm-rel.',
      },
      {
        text: 'jan. 1-jén',
        isCorrect: true,
        explanation: 'Helyes! A hónap rövidítése után pont, a számnév után kötőjel és a toldalék: jan. 1-jén.',
      },
      {
        text: 'jan. 1.-én',
        isCorrect: false,
        explanation: 'Hibás! Nem teszünk pontot és kötőjelet egyszerre a szám után.',
      },
    ],
  },
  {
    id: 'group-3',
    category: 'Földrajzi nevek -i képzős alakjai',
    ruleTip: 'A több elemből álló tulajdonnévi előtagú hegyneveknél az -i képző hatására a tulajdonnév nagybetűs marad!',
    options: [
      {
        text: 'Gellért-hegyi',
        isCorrect: true,
        explanation: 'Helyes! A Gellért személynév megtartja a nagy G betűt, a kötőjel megmarad, a hegy kis kezdőbetűs lesz: Gellért-hegyi.',
      },
      {
        text: 'Gellérthegyi',
        isCorrect: false,
        explanation: 'Hibás! Nem írható kötőjel nélkül egybe.',
      },
      {
        text: 'gellért-hegyi',
        isCorrect: false,
        explanation: 'Hibás! A Gellért tulajdonnév nem kezdődhet kisbetűvel.',
      },
    ],
  },
  {
    id: 'group-4',
    category: 'A felszólító mód alakváltozatai',
    ruleTip: 'A nyelvben olykor több rokon, szabályos alakváltozat is él egymás mellett.',
    options: [
      {
        text: 'játszál',
        isCorrect: true,
        explanation: 'Helyes! Választékos, irodalmi E/2 alanyi felszólító alakváltozat (játszál szépen!).',
      },
      {
        text: 'játssz',
        isCorrect: true,
        explanation: 'Helyes! A standard rövid E/2 alanyi felszólító alak (játssz velem!).',
      },
      {
        text: 'játsszad',
        isCorrect: true,
        explanation: 'Helyes! A szabályos E/2 határozott/tárgyas felszólító alak (játsszad el a szerepet!).',
      },
    ],
  },
  {
    id: 'group-5',
    category: 'Írásban jelölt és jelöletlen hasonulások',
    ruleTip: 'Vigyázz a kiejtés csalóka hatására: mit jelölünk írásban és mit nem?',
    options: [
      {
        text: 'nagyja',
        isCorrect: true,
        explanation: 'Helyes! A munka nagyja (j birtokjel, nem gy-vel!).',
      },
      {
        text: 'haggya',
        isCorrect: false,
        explanation: 'Hibás! Helyesen hagyja (hagy + ja írásban jelöletlen teljes hasonulás).',
      },
      {
        text: 'higgye',
        isCorrect: true,
        explanation: 'Helyes! A hisz ige felszólító alakja határozott ragozásban: higy- + je = higgye.',
      },
    ],
  },
  {
    id: 'group-6',
    category: 'J és LY különböző szófajokban és jelentésekben',
    ruleTip: 'Három különböző szó, de vajon mindhárom szabályosan leírható így?',
    options: [
      {
        text: 'folyton',
        isCorrect: true,
        explanation: 'Helyes! Határozószó (szüntelenül, állandóan), ly-nal írandó.',
      },
      {
        text: 'folyjon',
        isCorrect: true,
        explanation: 'Helyes! A folyik ige felszólító módja (hadd folyjon a víz!), ly és j együtt.',
      },
      {
        text: 'fojtott',
        isCorrect: true,
        explanation: 'Helyes! A fojt ige alakja (fojtott hang, elfojtott sírás), pontos j-vel!',
      },
    ],
  },
];
