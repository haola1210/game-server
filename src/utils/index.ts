import { LevelUpBonus, LevelUpBonusStats, Stat, Unit } from 'src/interfaces';

export const initStat: (v: number, unit?: Unit) => Stat = (
  v,
  u = Unit.POINT,
) => ({
  value: v,
  deltaRate: 0,
  deltaPoint: 0,
  unit: u,
});

export const initBonus = (
  v: number,
  unit: Unit = Unit.POINT,
): LevelUpBonus => ({
  value: v,
  unit,
});

export const getBasePoint = (currentLevel: number): LevelUpBonusStats => {
  if (currentLevel < 10) {
    return {
      attack: initBonus(4),
      defense: initBonus(1),
      healthPoint: initBonus(10),
      speed: initBonus(1),
    };
  }
  if (currentLevel < 20) {
    return {
      attack: initBonus(8),
      defense: initBonus(2),
      healthPoint: initBonus(20),
      speed: initBonus(2),
    };
  }
  if (currentLevel < 30) {
    return {
      attack: initBonus(12),
      defense: initBonus(3),
      healthPoint: initBonus(30),
      speed: initBonus(3),
    };
  }
  if (currentLevel < 40) {
    return {
      attack: initBonus(20),
      defense: initBonus(5),
      healthPoint: initBonus(50),
      critDamage: initBonus(0.5, Unit.RATE),
      critRate: initBonus(0.5, Unit.RATE),
      speed: initBonus(5),
    };
  }
  if (currentLevel < 50) {
    return {
      attack: initBonus(28),
      defense: initBonus(7),
      healthPoint: initBonus(70),
      critDamage: initBonus(0.5, Unit.RATE),
      critRate: initBonus(0.5, Unit.RATE),
      critResist: initBonus(0.5, Unit.RATE),
      speed: initBonus(7),
    };
  }
  if (currentLevel < 60) {
    return {
      attack: initBonus(40),
      defense: initBonus(10),
      healthPoint: initBonus(100),
      critDamage: initBonus(0.5, Unit.RATE),
      critRate: initBonus(0.5, Unit.RATE),
      critResist: initBonus(0.5, Unit.RATE),
      dodge: initBonus(0.5, Unit.RATE),
      speed: initBonus(10),
    };
  }
  if (currentLevel < 70) {
    return {
      attack: initBonus(56),
      defense: initBonus(14),
      healthPoint: initBonus(200),
      critDamage: initBonus(0.5, Unit.RATE),
      critRate: initBonus(0.5, Unit.RATE),
      critResist: initBonus(0.5, Unit.RATE),
      dodge: initBonus(0.5, Unit.RATE),
      accuracy: initBonus(0.5, Unit.RATE),
      pierce: initBonus(0.5, Unit.RATE),
      speed: initBonus(14),
    };
  }
  if (currentLevel < 80) {
    return {
      attack: initBonus(80),
      defense: initBonus(20),
      healthPoint: initBonus(500),
      critDamage: initBonus(0.5, Unit.RATE),
      critRate: initBonus(0.5, Unit.RATE),
      critResist: initBonus(0.5, Unit.RATE),
      dodge: initBonus(0.5, Unit.RATE),
      accuracy: initBonus(0.5, Unit.RATE),
      pierce: initBonus(0.5, Unit.RATE),
      toughness: initBonus(0.5, Unit.RATE),
      speed: initBonus(20),
    };
  }
  if (currentLevel < 90) {
    return {
      attack: initBonus(120),
      defense: initBonus(30),
      healthPoint: initBonus(700),
      critDamage: initBonus(0.5, Unit.RATE),
      critRate: initBonus(0.5, Unit.RATE),
      critResist: initBonus(0.5, Unit.RATE),
      dodge: initBonus(0.5, Unit.RATE),
      accuracy: initBonus(0.5, Unit.RATE),
      pierce: initBonus(0.5, Unit.RATE),
      toughness: initBonus(0.5, Unit.RATE),
      damageAmplification: initBonus(0.5, Unit.RATE),
      speed: initBonus(30),
    };
  }
  if (currentLevel < 100) {
    return {
      attack: initBonus(200),
      defense: initBonus(50),
      healthPoint: initBonus(1000),
      critDamage: initBonus(0.5, Unit.RATE),
      critRate: initBonus(0.5, Unit.RATE),
      critResist: initBonus(0.5, Unit.RATE),
      dodge: initBonus(0.5, Unit.RATE),
      accuracy: initBonus(0.5, Unit.RATE),
      pierce: initBonus(0.5, Unit.RATE),
      toughness: initBonus(0.5, Unit.RATE),
      damageAmplification: initBonus(0.5, Unit.RATE),
      damageReduction: initBonus(1, Unit.RATE),
      speed: initBonus(50),
    };
  }

  return {};
};
