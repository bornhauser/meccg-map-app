import {$locationShim} from '@angular/common/upgrade';

export const region = [

  {
    id: 'Elven Shores', name: {en: 'Elven Shores', de: ''},
    next: ['Lindon', 'Eriadoran Coast']
  },
  {
    id: 'Lindon', name: {en: 'Lindon', de: ''},
    next: ['Elven Shores', 'Númeriador', 'Arthedain']
  },
  {
    id: 'Númeriador', name: {en: 'Númeriador', de: ''},
    next: ['Lindon', 'Forochel', 'Arthedain']
  },
  {
    id: 'Forochel', name: {en: 'Forochel', de: ''},
    next: ['Númeriador', 'Arthedain', 'Angmar']
  },
  {
    id: 'Angmar', name: {en: 'Angmar', de: ''},
    next: ['Forochel', 'Arthedain', 'Rhudaur', 'Gundabad']
  },
  {
    id: 'Rhudaur', name: {en: 'Rhudaur', de: ''},
    next: ['Angmar', 'Arthedain', 'Cardolan', 'Hollin', 'High Pass']
  },
  {
    id: 'Arthedain', name: {en: 'Arthedain', de: ''},
    next: ['Rhudaur', 'Angmar', 'Forochel', 'The Shire', 'Lindon', 'Cardolan']
  },
  {
    id: 'The Shire', name: {en: 'The Shire', de: ''},
    next: ['Arthedain', 'Cardolan']
  },
  {
    id: 'Cardolan', name: {en: 'Cardolan', de: ''},
    next: ['Arthedain', 'The Shire', 'Rhudaur', 'Hollin', 'Dunland', 'Enedhwaith', 'Eriadoran Coast']
  },
  {
    id: 'Hollin', name: {en: 'Hollin', de: ''},
    next: ['Cardolan', 'Rhudaur', 'Dunland', 'Redhorn Gate']
  },
  {
    id: 'Dunland', name: {en: 'Dunland', de: ''},
    next: ['Hollin', 'Cardolan', 'Enedhwaith']
  },
  {
    id: 'Enedhwaith', name: {en: 'Enedhwaith', de: ''},
    next: ['Dunland', 'Cardolan', 'Eriadoran Coast', 'Gap of Isen']
  },
  // - - - - - - - - - - - - - - - - - - - - - - //
  {
    id: 'Gundabad', name: {en: 'Gundabad', de: ''},
    next: []
  },
  // - - - - - - - - - - - - - - - - - - - - - - //
  {
    id: 'High Pass', name: {en: 'High Pass', de: ''},
    next: []
  },
  // - - - - - - - - - - - - - - - - - - - - - - //
  {
    id: 'Redhorn Gate', name: {en: 'Redhorn Gate', de: ''},
    next: []
  },
  // - - - - - - - - - - - - - - - - - - - - - - //
  {
    id: 'Eriadoran Coast', name: {en: 'Eriadoran Coast', de: ''},
    next: []
  },
  // - - - - - - - - - - - - - - - - - - - - - - //
  {
    id: 'Gap of Isen', name: {en: 'Gap of Isen', de: ''},
    next: []
  },
  // - - - - - - - - - - - - - - - - - - - - - - //

  {
    id: 'Old Pûkel-land', name: {en: 'Old Pûkel-land', de: ''},
    next: []
  },
  {
    id: 'Old Pûkel Gap', name: {en: 'Old Pûkel Gap', de: ''},
    next: []
  },

  {
    id: 'Andrast Coast', name: {en: 'Andrast Coast', de: ''},
    next: []
  },
  {
    id: 'Andrast', name: {en: 'Andrast', de: ''},
    next: []
  },
  {
    id: 'Anfalas', name: {en: 'Anfalas', de: ''},
    next: []
  },
  {
    id: 'Lamedon', name: {en: 'Lamedon', de: ''},
    next: []
  },

  {
    id: 'Bay of Belfalas', name: {en: 'Bay of Belfalas', de: ''},
    next: []
  },
  {
    id: 'Belfalas', name: {en: 'Belfalas', de: ''},
    next: []
  },
  {
    id: 'Lebennin', name: {en: 'Lebennin', de: ''},
    next: []
  },


  {
    id: 'Anduin Vales', name: {en: 'Anduin Vales', de: ''},
    next: []
  },
  {
    id: 'Grey Mountain Narrows', name: {en: 'Grey Mountain Narrows', de: ''},
    next: []
  },
  {
    id: 'Withered Heath', name: {en: 'Withered Heath', de: ''},
    next: []
  },
  {
    id: 'Iron Hills', name: {en: 'Iron Hills', de: ''},
    next: []
  },
  {
    id: 'Northern Rhovanion', name: {en: 'Northern Rhovanion', de: ''},
    next: []
  },
  {
    id: 'Woodland Realm', name: {en: 'Woodland Realm', de: ''},
    next: []
  },
  {
    id: 'Wold & Foothills', name: {en: 'Wold & Foothills', de: ''},
    next: []
  },
  {
    id: 'Brown Lands', name: {en: 'Brown Lands', de: ''},
    next: []
  },
  {
    id: 'Southern Mirkwood', name: {en: 'Southern Mirkwood', de: ''},
    next: []
  },
  {
    id: 'Western Mirkwood', name: {en: 'Western Mirkwood', de: ''},
    next: []
  },
  {
    id: 'Heart of Mirkwood', name: {en: 'Heart of Mirkwood', de: ''},
    next: []
  },
  {
    id: 'Southern Rhovanion', name: {en: 'Southern Rhovanion', de: ''},
    next: []
  },
  {
    id: 'Dorwinion', name: {en: 'Dorwinion', de: ''},
    next: []
  },
  {
    id: 'Horse Plains', name: {en: 'Horse Plains', de: ''},
    next: []
  },
  {
    id: 'Dagorlad', name: {en: 'Dagorlad', de: ''},
    next: []
  },
  {
    id: 'Rohan', name: {en: 'Rohan', de: ''},
    next: []
  },
  {
    id: 'Anórien', name: {en: 'Anórien', de: ''},
    next: []
  },


  {
    id: 'Ithilien', name: {en: 'Ithilien', de: ''},
    next: []
  },
  {
    id: 'Imlad Morgul', name: {en: 'Imlad Morgul', de: ''},
    next: []
  },
  {
    id: 'Gorgoroth', name: {en: 'Gorgoroth', de: ''},
    next: []
  },
  {
    id: 'Udûn', name: {en: 'Udûn', de: ''},
    next: []
  },
  {
    id: 'Nurn', name: {en: 'Nurn', de: ''},
    next: []
  },
  {
    id: 'Khand', name: {en: 'Khand', de: ''},
    next: []
  },
  {
    id: 'Harondor', name: {en: 'Harondor', de: ''},
    next: []
  },


  {id: 'Zurghôr', name: {en: 'Zurghôr', de: ''}, next: []},
  {id: 'Lotan', name: {en: 'Lotan', de: ''}, next: []},
  {id: 'Nûrad', name: {en: 'Nûrad', de: ''}, next: []},
  {id: 'Mirëdor', name: {en: 'Mirëdor', de: ''}, next: []},
  {id: 'Straight of Tumag', name: {en: 'Straight of Tumag', de: ''}, next: []},
  {id: 'Bellazen', name: {en: 'Bellazen', de: ''}, next: []},
  {id: 'Mardruak Cape', name: {en: 'Mardruak Cape', de: ''}, next: []},
  {id: 'Relmether', name: {en: 'Relmether', de: ''}, next: []},
  {id: 'Talath Uichel', name: {en: 'Talath Uichel', de: ''}, next: []},
  {id: 'Olyas Kriis', name: {en: 'Olyas Kriis', de: ''}, next: []},
  {id: 'Misty Mountains - Southern Spur', name: {en: 'Misty Mountains - Southern Spur', de: ''}, next: []},
  {id: 'Hathor', name: {en: 'Hathor', de: ''}, next: []},
  {id: 'Bay of Drêl', name: {en: 'Bay of Drêl', de: ''}, next: []},
  {id: 'Dor Bendor', name: {en: 'Dor Bendor', de: ''}, next: []},
  {id: 'Pel Bight', name: {en: 'Pel Bight', de: ''}, next: []},
  {id: 'Talath Oiohelka', name: {en: 'Talath Oiohelka', de: ''}, next: []},
  {id: 'Lyneria', name: {en: 'Lyneria', de: ''}, next: []},
  {id: 'The Sundering Sea', name: {en: 'The Sundering Sea', de: ''}, next: []},
  {id: 'Eorstan', name: {en: 'Eorstan', de: ''}, next: []},
  {id: 'Sakal an-Khâr', name: {en: 'Sakal an-Khâr', de: ''}, next: []},
  {id: 'Kurryan Bay', name: {en: 'Kurryan Bay', de: ''}, next: []},
  {id: 'Mardruak', name: {en: 'Mardruak', de: ''}, next: []},
  {id: 'Helkëar', name: {en: 'Helkëar', de: ''}, next: []},
  {id: 'Chy', name: {en: 'Chy', de: ''}, next: []},
  {id: 'Suza Sumar', name: {en: 'Suza Sumar', de: ''}, next: []},
  {id: 'East Bay of Forochel', name: {en: 'East Bay of Forochel', de: ''}, next: []},
  {id: 'Taur Rómen', name: {en: 'Taur Rómen', de: ''}, next: []},
  {id: 'Mirror of Fire', name: {en: 'Mirror of Fire', de: ''}, next: []},
  {id: 'Koronandë', name: {en: 'Koronandë', de: ''}, next: []},
  {id: 'Forovirkain', name: {en: 'Forovirkain', de: ''}, next: []},
  {id: 'Nuriag', name: {en: 'Nuriag', de: ''}, next: []},
  {id: 'Orgothraath', name: {en: 'Orgothraath', de: ''}, next: []},
  {id: 'Fangorn', name: {en: 'Fangorn', de: ''}, next: []},
  {id: 'Old Forest', name: {en: 'Old Forest', de: ''}, next: []},
  {id: 'Ûsakan', name: {en: 'Ûsakan', de: ''}, next: []},
  {id: 'Pezarsan', name: {en: 'Pezarsan', de: ''}, next: []},
  {id: 'Clyan', name: {en: 'Clyan', de: ''}, next: []},
  {id: 'Ûsakan Bay', name: {en: 'Ûsakan Bay', de: ''}, next: []},
  {id: 'Seznebab', name: {en: 'Seznebab', de: ''}, next: []},
  {id: 'Dragon Gap', name: {en: 'Dragon Gap', de: ''}, next: []},
  {id: 'Heb Aaraan', name: {en: 'Heb Aaraan', de: ''}, next: []},
  {id: 'Mur Fostisyr', name: {en: 'Mur Fostisyr', de: ''}, next: []},
  {id: 'Chelkar', name: {en: 'Chelkar', de: ''}, next: []},
  {id: 'Zajantak', name: {en: 'Zajantak', de: ''}, next: []},
  {id: 'Koros Bay', name: {en: 'Koros Bay', de: ''}, next: []},
  {id: 'Tulwang', name: {en: 'Tulwang', de: ''}, next: []},
  {id: 'Drêl', name: {en: 'Drêl', de: ''}, next: []},
  {id: 'Ered Harmal', name: {en: 'Ered Harmal', de: ''}, next: []},
  {id: 'Harrhûn', name: {en: 'Harrhûn', de: ''}, next: []},
  {id: 'Hyarmenfalas', name: {en: 'Hyarmenfalas', de: ''}, next: []},
  {id: 'Felaya', name: {en: 'Felaya', de: ''}, next: []},
  {id: 'Dûshera', name: {en: 'Dûshera', de: ''}, next: []},
  {id: 'Rast Losnaeth', name: {en: 'Rast Losnaeth', de: ''}, next: []},
  {id: 'Kythor', name: {en: 'Kythor', de: ''}, next: []},
  {id: 'East Bay of Ormal', name: {en: 'East Bay of Ormal', de: ''}, next: []},
  {id: 'West Bay of Ormal', name: {en: 'West Bay of Ormal', de: ''}, next: []},
  {id: 'Isra', name: {en: 'Isra', de: ''}, next: []},
  {id: 'West Bay of Forochel', name: {en: 'West Bay of Forochel', de: ''}, next: []},
  {id: 'Curinshiban', name: {en: 'Curinshiban', de: ''}, next: []},
  {id: 'Forrhûn', name: {en: 'Forrhûn', de: ''}, next: []},
  {id: 'Ukal Sêj', name: {en: 'Ukal Sêj', de: ''}, next: []},
  {id: 'Azjan', name: {en: 'Azjan', de: ''}, next: []},
  {id: 'Harshandatt', name: {en: 'Harshandatt', de: ''}, next: []},
  {id: 'Bulchyades', name: {en: 'Bulchyades', de: ''}, next: []},
  {id: 'Lurmsakûn', name: {en: 'Lurmsakûn', de: ''}, next: []},
  {id: 'Bosiri', name: {en: 'Bosiri', de: ''}, next: []},
  {id: 'Hyarnustar Coast', name: {en: 'Hyarnustar Coast', de: ''}, next: []},
  {id: 'Bay of Tulwang', name: {en: 'Bay of Tulwang', de: ''}, next: []},
  {id: 'Sára Bask', name: {en: 'Sára Bask', de: ''}, next: []},
  {id: 'Yellow Mountains', name: {en: 'Yellow Mountains', de: ''}, next: []},
  {id: 'Coast of Harad', name: {en: 'Coast of Harad', de: ''}, next: []},
  {id: 'Shores of Ormal', name: {en: 'Shores of Ormal', de: ''}, next: []},
  {id: 'Mûlambur', name: {en: 'Mûlambur', de: ''}, next: []},
  {id: 'Gan', name: {en: 'Gan', de: ''}, next: []},
  {id: 'Arysis', name: {en: 'Arysis', de: ''}, next: []},
  {id: 'Kykurian Kyn', name: {en: 'Kykurian Kyn', de: ''}, next: []},
  {id: 'Mouths of the Anduin', name: {en: 'Mouths of the Anduin', de: ''}, next: []},
  {id: 'Ekkaia', name: {en: 'Ekkaia', de: ''}, next: []},
  {id: 'Chey Sart', name: {en: 'Chey Sart', de: ''}, next: []},
  {id: 'Yellow Mountains - Western Spur', name: {en: 'Yellow Mountains - Western Spur', de: ''}, next: []},
  {id: 'Dyr', name: {en: 'Dyr', de: ''}, next: []},
  {id: 'Barl Syrnac', name: {en: 'Barl Syrnac', de: ''}, next: []},
  {id: 'Drenâd', name: {en: 'Drenâd', de: ''}, next: []},
  {id: 'Gondalf', name: {en: 'Gondalf', de: ''}, next: []},
  {id: 'Ered Lithui', name: {en: 'Ered Lithui', de: ''}, next: []},
  {id: 'Bozisha-Miraz', name: {en: 'Bozisha-Miraz', de: ''}, next: []},
  {id: 'Elorna', name: {en: 'Elorna', de: ''}, next: []},
  {id: 'Kes Arik', name: {en: 'Kes Arik', de: ''}, next: []},
  {id: 'Erim Póa', name: {en: 'Erim Póa', de: ''}, next: []},
  {id: 'Isfahan', name: {en: 'Isfahan', de: ''}, next: []},
  {id: 'Anduin Vales', name: {en: 'Anduin Vales', de: ''}, next: []},
  {id: 'Grey Mountains', name: {en: 'Grey Mountains', de: ''}, next: []},
  {id: 'Chennacatt', name: {en: 'Chennacatt', de: ''}, next: []},
  {id: 'Bay of Felaya', name: {en: 'Bay of Felaya', de: ''}, next: []},
  {id: 'Mag', name: {en: 'Mag', de: ''}, next: []},
  {id: 'Methran Cape', name: {en: 'Methran Cape', de: ''}, next: []},
  {id: 'Hûb Uichel', name: {en: 'Hûb Uichel', de: ''}, next: []},
  {id: 'Geshaan', name: {en: 'Geshaan', de: ''}, next: []},
  {id: 'Tuktan', name: {en: 'Tuktan', de: ''}, next: []},
  {id: 'Mûmakan Coasts', name: {en: 'Mûmakan Coasts', de: ''}, next: []},
  {id: 'Hyarn', name: {en: 'Hyarn', de: ''}, next: []},
  {id: 'Tumag', name: {en: 'Tumag', de: ''}, next: []},
  {id: 'Misty Mountains - Northern Spur', name: {en: 'Misty Mountains - Northern Spur', de: ''}, next: []},
  {id: 'Tâliran', name: {en: 'Tâliran', de: ''}, next: []},
  {id: 'Shores of Maquatostoth', name: {en: 'Shores of Maquatostoth', de: ''}, next: []},
  {id: 'Everdalf', name: {en: 'Everdalf', de: ''}, next: []},
  {id: 'Né Tava', name: {en: 'Né Tava', de: ''}, next: []},
  {id: 'Pel', name: {en: 'Pel', de: ''}, next: []},
  {id: 'Narthalf', name: {en: 'Narthalf', de: ''}, next: []},
  {id: 'Siakan', name: {en: 'Siakan', de: ''}, next: []},
  {id: 'Minheldolath', name: {en: 'Minheldolath', de: ''}, next: []},
  {id: 'Dune Sea', name: {en: 'Dune Sea', de: ''}, next: []},
  {id: 'Sea of Rhûn', name: {en: 'Sea of Rhûn', de: ''}, next: []},
  {id: 'Ammu Baj', name: {en: 'Ammu Baj', de: ''}, next: []},
  {id: 'Tantûrak', name: {en: 'Tantûrak', de: ''}, next: []},
  {id: 'Haruzan', name: {en: 'Haruzan', de: ''}, next: []},
  {id: 'Ered Muil', name: {en: 'Ered Muil', de: ''}, next: []},
  {id: 'Lindalf', name: {en: 'Lindalf', de: ''}, next: []},
  {id: 'Kirmlesra', name: {en: 'Kirmlesra', de: ''}, next: []},
  {id: 'Mûmakan', name: {en: 'Mûmakan', de: ''}, next: []},
  {id: 'Ered Ormal', name: {en: 'Ered Ormal', de: ''}, next: []},
  {id: 'Yellow Mountains - Eastern Spur', name: {en: 'Yellow Mountains - Eastern Spur', de: ''}, next: []},
  {id: 'Thorenaer', name: {en: 'Thorenaer', de: ''}, next: []},
  {id: 'Lhûgdalf', name: {en: 'Lhûgdalf', de: ''}, next: []},
  {id: 'Cleft of Goats', name: {en: 'Cleft of Goats', de: ''}, next: []},
];
