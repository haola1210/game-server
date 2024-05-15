import { Class, FormationSlot, Grade, Tier } from '@prisma/client';
import { Position } from 'src/interfaces';

export const stats = [
  'attack',
  'defense',
  'healthPoint',
  'chakra',
  'critDamage',
  'critRate',
  'critResist',
  'accuracy',
  'dodge',
  'pierce',
  'toughness',
  'damageAmplification',
  'damageReduction',
  'speed',
] as const;

export const ClassScale = {
  [Class.FIGHTHER]: {
    attack: 1.2,
    defense: 1.2,
    healthPoint: 1.2,
    critDamage: 1,
    critRate: 1,
    critResist: 1.05,
    accuracy: 0.95,
    dodge: 1,
    pierce: 1,
    toughness: 1,
    damageAmplification: 1.05,
    damageReduction: 1,
    speed: 1,
  },
  [Class.TANKER]: {
    attack: 0.85,
    defense: 1.4,
    healthPoint: 1.5,
    critDamage: 1,
    critRate: 0.9,
    critResist: 1.1,
    accuracy: 0.95,
    dodge: 1,
    pierce: 1,
    toughness: 1.1,
    damageAmplification: 1,
    damageReduction: 1.05,
    speed: 1.1,
  },
  [Class.ASSASSIN]: {
    attack: 1.4,
    defense: 0.85,
    healthPoint: 0.9,
    critDamage: 1.1,
    critRate: 1.2,
    critResist: 1.05,
    accuracy: 1.2,
    dodge: 1.1,
    pierce: 1.1,
    toughness: 0.9,
    damageAmplification: 1.1,
    damageReduction: 0.95,
    speed: 1.2,
  },
  [Class.SUPPORTER]: {
    attack: 1,
    defense: 1,
    healthPoint: 1,
    critDamage: 1,
    critRate: 1,
    critResist: 1,
    accuracy: 1,
    dodge: 1.1,
    pierce: 1,
    toughness: 1,
    damageAmplification: 1.1,
    damageReduction: 1,
    speed: 0.95,
  },
};

export const StarBuffRate = [
  {
    pointScale: 1,
    rateScale: 1,
  },
  {
    pointScale: 1.2,
    rateScale: 1.05,
  },
  {
    pointScale: 1.5,
    rateScale: 1.1,
  },
  {
    pointScale: 1.8,
    rateScale: 1.2,
  },
  {
    pointScale: 2.2,
    rateScale: 1.35,
  },
  {
    pointScale: 2.7,
    rateScale: 1.55,
  },
];

export const TierScale = {
  [Tier.SSR]: {
    pointScale: 1.7,
    rateScale: 1,
  },
  [Tier.SR]: {
    pointScale: 1.5,
    rateScale: 0.9,
  },
  [Tier.S]: {
    pointScale: 1.2,
    rateScale: 0.8,
  },
  [Tier.A]: {
    pointScale: 1,
    rateScale: 0.7,
  },
  [Tier.B]: {
    pointScale: 0.8,
    rateScale: 0.6,
  },
};

export const GradeMaxLevel = {
  [Grade.WHITE0]: 10,
  [Grade.GREEN0]: 15,
  [Grade.GREEN1]: 20,
  [Grade.BLUE0]: 25,
  [Grade.BLUE1]: 27,
  [Grade.BLUE2]: 30,
  [Grade.DEATH0]: 35,
  [Grade.DEATH1]: 40,
  [Grade.DEATH2]: 45,
  [Grade.DEATH3]: 50,
  [Grade.GOLDEN0]: 55,
  [Grade.GOLDEN1]: 60,
  [Grade.GOLDEN2]: 65,
  [Grade.GOLDEN3]: 67,
  [Grade.GOLDEN4]: 70,
  [Grade.BLOOD0]: 75,
  [Grade.BLOOD1]: 80,
  [Grade.BLOOD2]: 85,
  [Grade.BLOOD3]: 90,
  [Grade.BLOOD4]: 95,
  [Grade.BLOOD5]: 100,
};
export const GradeMinLevel = {
  [Grade.WHITE0]: 1,
  [Grade.GREEN0]: 10,
  [Grade.GREEN1]: 15,
  [Grade.BLUE0]: 20,
  [Grade.BLUE1]: 25,
  [Grade.BLUE2]: 27,
  [Grade.DEATH0]: 30,
  [Grade.DEATH1]: 35,
  [Grade.DEATH2]: 40,
  [Grade.DEATH3]: 45,
  [Grade.GOLDEN0]: 50,
  [Grade.GOLDEN1]: 55,
  [Grade.GOLDEN2]: 60,
  [Grade.GOLDEN3]: 65,
  [Grade.GOLDEN4]: 67,
  [Grade.BLOOD0]: 70,
  [Grade.BLOOD1]: 75,
  [Grade.BLOOD2]: 80,
  [Grade.BLOOD3]: 85,
  [Grade.BLOOD4]: 90,
  [Grade.BLOOD5]: 95,
};

export const GradeName = {
  [Grade.WHITE0]: 'White Grade',
  [Grade.GREEN0]: 'Green Grade',
  [Grade.GREEN1]: 'Green Grade (+1)',
  [Grade.BLUE0]: 'Blue Grade',
  [Grade.BLUE1]: 'Blue Grade (+1)',
  [Grade.BLUE2]: 'Blue Grade (+2)',
  [Grade.DEATH0]: 'Death Grade',
  [Grade.DEATH1]: 'Death Grade (+1)',
  [Grade.DEATH2]: 'Death Grade (+2)',
  [Grade.DEATH3]: 'Death Grade (+3)',
  [Grade.GOLDEN0]: 'Golden Grade',
  [Grade.GOLDEN1]: 'Golden Grade (+1)',
  [Grade.GOLDEN2]: 'Golden Grade (+2)',
  [Grade.GOLDEN3]: 'Golden Grade (+3)',
  [Grade.GOLDEN4]: 'Golden Grade (+4)',
  [Grade.BLOOD0]: 'Blood Grade',
  [Grade.BLOOD1]: 'Blood Grade (+1)',
  [Grade.BLOOD2]: 'Blood Grade (+2)',
  [Grade.BLOOD3]: 'Blood Grade (+3)',
  [Grade.BLOOD4]: 'Blood Grade (+4)',
  [Grade.BLOOD5]: 'Blood Grade (+5)',
};

const PositionMap = {
  x0: 0,
  x1: 1,
  x2: 2,
  y0: 0,
  y1: 1,
  y2: 2,
};

export const getPosition = (slot: FormationSlot): Position => {
  const rawPos = slot.split('_');
  return {
    x: PositionMap[rawPos[0]],
    y: PositionMap[rawPos[1]],
  };
};
