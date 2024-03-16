export enum PagePath_e {
  undefined = 'undefined',
}

export enum LanguageId_e {
  de = 'de',
  en = 'en',
}

export enum PlayerId_e {
  player_1 = 'player_1',
  player_2 = 'player_2',
}

export interface CurrentGuiContext_1 {
  currentAlignment: AlignmentType_e;
  currentSiteOrRegion: Card_i | null;
  currentReachableRegions: Card_i[];
  currentReachableSites: Card_i[];
  currentSitesOfRegion: Card_i[];
  underDeep: boolean;
}

export interface CurrentGuiContext_2 extends CurrentGuiContext_1 {
  currentPlayer: PlayerId_e;
  otherPlayersGuiContext: CurrentGuiContext_1 | null;
}

export interface CurrentGuiContext_3 {
  currentJourneySiteFrom: Card_i | null;
  currentJourneySiteTo: Card_i | null;
  currentJourneyRegions: Card_i[];
  currentPlayableHazards: Card_i[];
}

export enum Set_e {
  TW = 'TW', // The Wizards
  TD = 'TD', // The Dragons
  DM = 'DM', // Dark Minions
  LE = 'LE', // The Lidless Eye
  AS = 'AS', // Against the Shadow
  WH = 'WH', // The White Hand
  BA = 'BA', // The Balrog

  UL = 'UL', // The Wizards (Unlimited)

  FB = 'FB', // Firstborn
  DF = 'DF', // Durin's Folk
  NE = 'NE', // The Necromancer
  NW = 'NW', // The Northern Waste
  ML = 'ML', // Morgoth's Legacy

  GW = 'GW', // The Great Wyrms
  CP = 'CP', // The Great Central Plains
  SL = 'SL', // The Sunlands
  RS = 'RS', // Return of the Shadow
  WR = 'WR', // War of the Ring
  CA = 'CA', // Court of Ardor
  TI = 'TI', // Treason of Isengard
  BO = 'BO', // Bay of Ormal
  BU = 'BU', // Bay of Utum
  RN = 'RN', // Red Nightfall
  DS = 'DS', // The Dominion of the Seven
  MM = 'MM', // Nine Rings for Mortal Men
}

export enum Race_e {
  Dunadan = 'Dúnadan',
}

export enum Path_e {
  w = 'w',
  s = 's',
}

export enum AlignmentType_e {
  Minion = 'Minion',
  Neutral = 'Neutral',
  Hero = 'Hero',
  Dual = 'Dual',
  'Fallen-wizard' = 'Fallen-wizard',
  'Fallen-wizard_dark' = 'Fallen-wizard_dark',
  'Fallen-wizard_bright' = 'Fallen-wizard_bright',
  Balrog = 'Balrog',
  Challenge_Deck_A = 'Challenge_Deck_A',
  Challenge_Deck_B = 'Challenge_Deck_B',
  Challenge_Deck_C = 'Challenge_Deck_C',
  Challenge_Deck_D = 'Challenge_Deck_D',
  Challenge_Deck_E = 'Challenge_Deck_E',
  Challenge_Deck_F = 'Challenge_Deck_F',
  Challenge_Deck_G = 'Challenge_Deck_G',
  Challenge_Deck_H = 'Challenge_Deck_H',
  Challenge_Deck_I = 'Challenge_Deck_I',
  Challenge_Deck_J = 'Challenge_Deck_J',
  Challenge_Deck_K = 'Challenge_Deck_K',
  Challenge_Deck_L = 'Challenge_Deck_L',
  Challenge_Deck_M = 'Challenge_Deck_M',
  Challenge_Deck_N = 'Challenge_Deck_N',
  Challenge_Deck_O = 'Challenge_Deck_O',
  Challenge_Deck_P = 'Challenge_Deck_P',
  Challenge_Deck_Q = 'Challenge_Deck_Q',
  Challenge_Deck_R = 'Challenge_Deck_R',
  Challenge_Deck_S = 'Challenge_Deck_S',
  Challenge_Deck_T = 'Challenge_Deck_T',
  Challenge_Deck_U = 'Challenge_Deck_U',
  Challenge_Deck_V = 'Challenge_Deck_V',
}

export enum RegionType_e {
  'Shadow-land' = 'Shadow-land',
  'Wilderness' = 'Wilderness',
  'Border-land' = 'Border-land',
  'Coastal Sea' = 'Coastal Sea',
  'Under-deeps' = 'Under-deeps',
  'Dark-domain' = 'Dark-domain',
  // "Jungle" = "Jungle",
  // "Free-domain" = "Free-domain",
  // "Dungeon" = "Dungeon",
  // "Double Desert" = "Double Desert",
  // "Double Wilderness" = "Double Wilderness",
  // "Triple Coastal Seas" = "Triple Coastal Seas",
}

export enum CardType_e {
  Site = 'Site',
  Region = 'Region',
  Character = 'Character',
  Resource = 'Resource',
  Hazard = 'Hazard',
}

export enum Playable_e {
  minor = 'minor',
  major = 'major',
  greater = 'greater',
  gold_ring = 'gold ring',
  information = 'Information',
  palantiri = 'Palantiri',
  scrol_of_isildur = 'Scroll of Isildur',
}

export enum CreatureType_e {
  orcs = 'Orcs',
  spiders = 'Spiders',
  men = 'Men',
  dragon = 'Dragon',
  undead = 'Undead',
  pukel_creature = 'Pûkel-creature',
  wolves = 'Wolves',
  troll = 'Troll',
  opponent_may_play = 'opponent may play',
}

export interface Playables_i {
  [Playable_e.scrol_of_isildur]: boolean;
  [Playable_e.minor]: boolean;
  [Playable_e.major]: boolean;
  [Playable_e.greater]: boolean;
  [Playable_e.palantiri]: boolean;
  [Playable_e.gold_ring]: boolean;
  [Playable_e.information]: boolean;
}

export interface Card_i {
  id?: string;
  suroundingRegions?: Card_i[];
  routingSteps?: number;
  routingRegions?: Card_i[];

  'Home'?: string;
  'title-jp'?: string;
  'flip-title'?: string;
  'title-gr'?: string;
  'DCpath'?: string;
  'alignment'?: string;
  'Gear'?: string;
  'type'?: CardType_e;
  'title-fn'?: string;
  'gccgAlign'?: string;
  'Secondary'?: string;
  'title'?: string;
  'title-fr'?: string;
  'erratum'?: boolean;
  'uniqueness'?: boolean;
  'released'?: boolean;
  'Rarity'?: string;
  'normalizedtitle'?: string;
  'code'?: string;
  'ImageName'?: string;
  'Hoard'?: string;
  'dreamcard'?: boolean;
  'full_set'?: string;
  'Non'?: string;
  'trimCode'?: string;
  'title-it'?: string;
  'title-es'?: string;
  'gccgSet'?: Set_e,
  'errata'?: any;
  'set_code'?: string;
  'Artist'?: string;
  'Precise'?: string;
  'extras'?: boolean;
  'subtype'?: string;
  'Race'?: string;
  'title-du'?: string;
  'text'?: string;

  'Path'?: string;
  'RPath'?: string;
  'GoldRing'?: boolean;
  'Haven'?: string;
  'Region'?: string;
  'Site'?: string;
  'Playable'?: string;
  'MinorItem'?: boolean;
  'MajorItem'?: boolean;
  'GreaterItem': boolean;
}

export interface SelectItem {
  available: string[];
  selected: string | null;
}

