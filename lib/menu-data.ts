export const MENU_ITEMS = {
  item_101: { name: 'Bread / Wheat Bread', calories: 140, protein: 5.0, carbs: 26, fats: 2, type: 'veg' },
  item_102: { name: 'Butter', calories: 35, protein: 0, carbs: 0, fats: 4, type: 'veg' },
  item_103: { name: 'Jam', calories: 40, protein: 0, carbs: 10, fats: 0, type: 'veg' },
  item_104: { name: 'Tea', calories: 60, protein: 2, carbs: 8, fats: 2, type: 'veg' },
  item_105: { name: 'Coffee', calories: 70, protein: 2, carbs: 10, fats: 2.5, type: 'veg' },
  item_106: { name: 'Milk', calories: 90, protein: 4.8, carbs: 7.2, fats: 4.5, type: 'veg' },
  item_107: { name: 'Boiled Egg', calories: 70, protein: 6, carbs: 0.5, fats: 5, type: 'non-veg' },
  item_108: { name: 'Egg Bhurji', calories: 140, protein: 10, carbs: 2, fats: 10, type: 'non-veg' },
  item_109: { name: 'Chapati / Phulka (2 pcs)', calories: 200, protein: 6, carbs: 30, fats: 6, type: 'veg' },
  item_110: { name: 'White Rice (Mess Serving)', calories: 290, protein: 6, carbs: 63, fats: 0.8, type: 'veg' },
  item_111: { name: 'Curd', calories: 60, protein: 3, carbs: 4, fats: 3, type: 'veg' },
  item_112: { name: 'Buttermilk', calories: 30, protein: 2, carbs: 3, fats: 1, type: 'veg' },
  item_113: { name: 'Lemon Mint Juice', calories: 50, protein: 0, carbs: 12, fats: 0, type: 'veg' },
  item_114: { name: 'Pickle & Condiments', calories: 15, protein: 0, carbs: 1, fats: 1.5, type: 'veg' },
  item_115: { name: 'Paruppu Podi & Ghee', calories: 90, protein: 2, carbs: 5, fats: 7, type: 'veg' },
  item_116: { name: 'Thovaiyal / Chutney', calories: 60, protein: 1, carbs: 3, fats: 5, type: 'veg' },
  item_117: { name: 'Vegetable Upma', calories: 200, protein: 4, carbs: 40, fats: 3, type: 'veg' },
  item_118: { name: 'Pongal', calories: 250, protein: 5, carbs: 35, fats: 10, type: 'veg' },
  item_119: { name: 'Poha', calories: 180, protein: 3, carbs: 30, fats: 5, type: 'veg' },
  item_120: { name: 'Idli (3 pcs)', calories: 180, protein: 6, carbs: 36, fats: 1.5, type: 'veg' },
  item_121: { name: 'Dosa', calories: 150, protein: 4, carbs: 22, fats: 5, type: 'veg' },
  item_122: { name: 'Puri', calories: 240, protein: 4, carbs: 26, fats: 14, type: 'veg' },
  item_123: { name: 'Pav Bhaji', calories: 400, protein: 10, carbs: 55, fats: 15, type: 'veg' },
  item_124: { name: 'Khichdi', calories: 220, protein: 5, carbs: 38, fats: 6, type: 'veg' },
  item_125: { name: 'Sambar', calories: 90, protein: 4, carbs: 14, fats: 2, type: 'veg' },
  item_126: { name: 'Dal (All Varieties)', calories: 110, protein: 6, carbs: 16, fats: 3, type: 'veg' },
  item_127: { name: 'Rasam (All Varieties)', calories: 40, protein: 1, carbs: 6, fats: 1, type: 'veg' },
  item_128: { name: 'Veg Gravy (Chenna/Rajma/Kadai)', calories: 150, protein: 6, carbs: 18, fats: 7, type: 'veg' },
  item_129: { name: 'Paneer Gravy (Palak/Tikka/Dum)', calories: 250, protein: 12, carbs: 10, fats: 18, type: 'veg' },
  item_130: { name: 'Chicken Gravy (Handi/Chettinad)', calories: 220, protein: 18, carbs: 6, fats: 14, type: 'non-veg' },
  item_131: { name: 'Dry Veg Poriyal', calories: 90, protein: 2, carbs: 12, fats: 4, type: 'veg' },
  item_132: { name: 'Veg Biryani / Bisi Bele Bath', calories: 250, protein: 5, carbs: 40, fats: 8, type: 'veg' },
  item_133: { name: 'Chicken Biryani', calories: 350, protein: 18, carbs: 42, fats: 12, type: 'non-veg' },
  item_134: { name: 'Evening Sandwich / Pasta', calories: 300, protein: 12, carbs: 36, fats: 12, type: 'veg' },
  item_135: { name: 'Evening Chaat', calories: 200, protein: 6, carbs: 35, fats: 5, type: 'veg' },
  item_136: { name: 'Fresh Fruit', calories: 50, protein: 1, carbs: 13, fats: 0, type: 'veg' },
  item_137: { name: 'Fresh Salad', calories: 30, protein: 1, carbs: 7, fats: 0, type: 'veg' },
  item_138: { name: 'Sweet / Ice Cream', calories: 180, protein: 3, carbs: 25, fats: 8, type: 'veg' },
  item_139: { name: 'Cold Badam Milk', calories: 120, protein: 4, carbs: 15, fats: 5, type: 'veg' }
};

export const WEEKLY_MENU = {
  monday: {
    breakfast: {
      regular_menu: ['item_117', 'item_116', 'item_118', 'item_125', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_117', 'item_116', 'item_118', 'item_125', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106', 'item_107']
    },
    lunch: {
      regular_menu: ['item_109', 'item_126', 'item_110', 'item_128', 'item_131', 'item_127', 'item_115', 'item_116', 'item_114', 'item_111', 'item_136', 'item_113'],
      feast_menu: ['item_109', 'item_126', 'item_110', 'item_128', 'item_131', 'item_127', 'item_115', 'item_116', 'item_114', 'item_111', 'item_136', 'item_113']
    },
    snacks: {
      regular_menu: ['item_134', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_134', 'item_104', 'item_105', 'item_106']
    },
    dinner: {
      regular_menu: ['item_109', 'item_128', 'item_126', 'item_110', 'item_131', 'item_127', 'item_114', 'item_138', 'item_137', 'item_106', 'item_111'],
      feast_menu: ['item_109', 'item_128', 'item_126', 'item_110', 'item_131', 'item_127', 'item_114', 'item_138', 'item_137', 'item_106', 'item_111']
    }
  },
  tuesday: {
    breakfast: {
      regular_menu: ['item_120', 'item_125', 'item_116', 'item_119', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_120', 'item_125', 'item_116', 'item_119', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106', 'item_108']
    },
    lunch: {
      regular_menu: ['item_132', 'item_111', 'item_126', 'item_131', 'item_110', 'item_125', 'item_127', 'item_115', 'item_116', 'item_114', 'item_136', 'item_113'],
      feast_menu: ['item_132', 'item_111', 'item_126', 'item_131', 'item_110', 'item_125', 'item_127', 'item_115', 'item_116', 'item_114', 'item_136', 'item_113']
    },
    snacks: {
      regular_menu: ['item_135', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_135', 'item_104', 'item_105', 'item_106']
    },
    dinner: {
      regular_menu: ['item_121', 'item_116', 'item_125', 'item_110', 'item_127', 'item_114', 'item_106', 'item_137', 'item_112'],
      feast_menu: ['item_121', 'item_116', 'item_125', 'item_110', 'item_127', 'item_114', 'item_106', 'item_137', 'item_112']
    }
  },
  wednesday: {
    breakfast: {
      regular_menu: ['item_122', 'item_128', 'item_124', 'item_116', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_122', 'item_128', 'item_124', 'item_116', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106', 'item_107']
    },
    lunch: {
      regular_menu: ['item_129', 'item_109', 'item_110', 'item_125', 'item_131', 'item_127', 'item_115', 'item_116', 'item_114', 'item_136', 'item_112', 'item_113'],
      feast_menu: ['item_130', 'item_109', 'item_110', 'item_125', 'item_131', 'item_127', 'item_115', 'item_116', 'item_114', 'item_136', 'item_112', 'item_113']
    },
    snacks: {
      regular_menu: ['item_134', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_134', 'item_104', 'item_105', 'item_106']
    },
    dinner: {
      regular_menu: ['item_128', 'item_132', 'item_120', 'item_125', 'item_116', 'item_127', 'item_111', 'item_138', 'item_137', 'item_106'],
      feast_menu: ['item_128', 'item_132', 'item_120', 'item_125', 'item_116', 'item_108', 'item_127', 'item_111', 'item_138', 'item_137', 'item_106']
    }
  },
  thursday: {
    breakfast: {
      regular_menu: ['item_120', 'item_128', 'item_116', 'item_123', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_120', 'item_128', 'item_116', 'item_123', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106', 'item_107']
    },
    lunch: {
      regular_menu: ['item_132', 'item_110', 'item_126', 'item_131', 'item_127', 'item_111', 'item_115', 'item_116', 'item_114', 'item_113', 'item_136'],
      feast_menu: ['item_132', 'item_110', 'item_126', 'item_131', 'item_127', 'item_111', 'item_115', 'item_116', 'item_114', 'item_113', 'item_136']
    },
    snacks: {
      regular_menu: ['item_135', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_135', 'item_104', 'item_105', 'item_106']
    },
    dinner: {
      regular_menu: ['item_128', 'item_109', 'item_110', 'item_126', 'item_125', 'item_131', 'item_127', 'item_114', 'item_137', 'item_106', 'item_112'],
      feast_menu: ['item_128', 'item_109', 'item_110', 'item_126', 'item_125', 'item_131', 'item_127', 'item_114', 'item_137', 'item_106', 'item_112', 'item_139']
    }
  },
  friday: {
    breakfast: {
      regular_menu: ['item_121', 'item_125', 'item_116', 'item_124', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_121', 'item_125', 'item_116', 'item_124', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106', 'item_108']
    },
    lunch: {
      regular_menu: ['item_109', 'item_129', 'item_126', 'item_110', 'item_131', 'item_127', 'item_112', 'item_115', 'item_116', 'item_114', 'item_136'],
      feast_menu: ['item_109', 'item_130', 'item_126', 'item_110', 'item_131', 'item_127', 'item_112', 'item_115', 'item_116', 'item_114', 'item_136']
    },
    snacks: {
      regular_menu: ['item_138', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_138', 'item_104', 'item_105', 'item_106']
    },
    dinner: {
      regular_menu: ['item_128', 'item_109', 'item_126', 'item_110', 'item_131', 'item_127', 'item_111', 'item_114', 'item_138', 'item_137', 'item_106'],
      feast_menu: ['item_128', 'item_109', 'item_126', 'item_110', 'item_131', 'item_127', 'item_111', 'item_114', 'item_138', 'item_137', 'item_106']
    }
  },
  saturday: {
    breakfast: {
      regular_menu: ['item_120', 'item_116', 'item_125', 'item_119', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_120', 'item_116', 'item_125', 'item_119', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106', 'item_107']
    },
    lunch: {
      regular_menu: ['item_109', 'item_128', 'item_110', 'item_125', 'item_127', 'item_111', 'item_131', 'item_115', 'item_116', 'item_114', 'item_136', 'item_113'],
      feast_menu: ['item_109', 'item_128', 'item_110', 'item_125', 'item_127', 'item_111', 'item_131', 'item_115', 'item_116', 'item_114', 'item_136', 'item_113']
    },
    snacks: {
      regular_menu: ['item_135', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_135', 'item_104', 'item_105', 'item_106']
    },
    dinner: {
      regular_menu: ['item_109', 'item_131', 'item_129', 'item_110', 'item_126', 'item_127', 'item_111', 'item_138', 'item_114', 'item_137', 'item_106', 'item_112'],
      feast_menu: ['item_109', 'item_131', 'item_129', 'item_110', 'item_126', 'item_127', 'item_111', 'item_138', 'item_114', 'item_137', 'item_106', 'item_112']
    }
  },
  sunday: {
    breakfast: {
      regular_menu: ['item_123', 'item_118', 'item_125', 'item_116', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_123', 'item_118', 'item_125', 'item_116', 'item_101', 'item_102', 'item_103', 'item_104', 'item_105', 'item_106', 'item_108']
    },
    lunch: {
      regular_menu: ['item_132', 'item_131', 'item_111', 'item_110', 'item_127', 'item_114', 'item_136', 'item_113'],
      feast_menu: ['item_133', 'item_131', 'item_111', 'item_110', 'item_127', 'item_114', 'item_136', 'item_113']
    },
    snacks: {
      regular_menu: ['item_135', 'item_104', 'item_105', 'item_106'],
      feast_menu: ['item_135', 'item_104', 'item_105', 'item_106']
    },
    dinner: {
      regular_menu: ['item_131', 'item_120', 'item_116', 'item_125', 'item_110', 'item_126', 'item_127', 'item_137', 'item_106', 'item_112'],
      feast_menu: ['item_131', 'item_120', 'item_116', 'item_125', 'item_110', 'item_126', 'item_127', 'item_137', 'item_106', 'item_112', 'item_139']
    }
  }
};
