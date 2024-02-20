export enum PagePath_e {
  undefined = 'undefined',
}

export enum LanguageId_e {
  de = 'de',
  fr = 'fr',
}

export enum Set_e {
  DM = 'DM',
}

export enum Race_e {
  Dunadan = 'Dúnadan',
}

export enum Path_e {
  w = 'w',
  s = 's',
}

export enum ItemType_e {
  w = 'w',
  s = 's',
}

export enum CardType_e {
  Site = 'Site',
  Region = 'Region',
}

export interface Card_i {
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
  "GreaterItem": boolean;
}
