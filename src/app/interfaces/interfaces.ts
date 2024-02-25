export enum PagePath_e {
  undefined = 'undefined',
}

export enum LanguageId_e {
  de = 'de',
  fr = 'fr',
}

export interface CurrentGuiContext {
  currentSite: Card_i | null;
  currentSiteForMove: Card_i | null;
  currentSitesInReach: Card_i[];
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
  Fallen_Lord = 'Fallen/Lord',
  Balrog = 'Balrog',
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
}

export enum Playable_e {
  minor = 'minor',
  major = 'major',
  greater = 'greater',
  gold_ring = 'gold ring',
  information = 'information',
  palantiri = 'palantiri',
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
