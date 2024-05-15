import { Class, Grade, Tier } from '@prisma/client';
import { getBasePoint, initStat } from 'src/utils';
import {
  ClassScale,
  GradeMaxLevel,
  GradeMinLevel,
  GradeName,
  StarBuffRate,
  stats,
  TierScale,
} from 'src/constants';
import { LevelUpBonusStats, Stat, Unit } from 'src/interfaces';

export default class BaseNinja {
  id: string;
  // other
  name: string;
  star: number;
  starBuffRate: (typeof StarBuffRate)[number];
  tier: Tier;
  tierScale: (typeof TierScale)[Tier];
  classes: Class;
  classesScale: (typeof ClassScale)[Class];
  level: number;
  grade: Grade;
  gradeMaxLevel: number;
  gradeMinLevel: number;

  // character special level up bonus
  specialLevelUpBonusStats: LevelUpBonusStats;

  // stat
  attack: Stat;
  defense: Stat;
  healthPoint: Stat;
  chakra: Stat;
  critDamage: Stat;
  critRate: Stat;
  critResist: Stat;
  accuracy: Stat;
  dodge: Stat;
  pierce: Stat;
  toughness: Stat;
  damageAmplification: Stat;
  damageReduction: Stat;
  speed: Stat;

  //
  constructor(
    id: string,
    //
    name: string,
    tier: string,
    classes: string,
    star: number,
    grade: Grade,
    //
    attack: number,
    defense: number,
    healthPoint: number,
    critDamage: number,
    critRate: number,
    critResist: number,
    accuracy: number,
    dodge: number,
    pierce: number,
    toughness: number,
    damageAmplification: number,
    damageReduction: number,
    speed: number,
    //
    specialLevelUpBonusStats: LevelUpBonusStats,
  ) {
    this.id = id; // id from DB
    this.name = name;
    //
    this.tier = tier as Tier; // validate this
    this.tierScale = TierScale[this.tier];
    //
    this.classes = classes as Class; // validate this
    this.classesScale = ClassScale[this.classes];
    //
    this.star = star; // validate this
    this.starBuffRate = StarBuffRate[this.star];
    //
    this.grade = grade; // validate this
    this.gradeMaxLevel = GradeMaxLevel[this.grade];
    this.gradeMinLevel = GradeMinLevel[this.grade];
    this.level = 1;
    //
    this.attack = initStat(attack ?? 0);
    this.defense = initStat(defense ?? 0);
    this.healthPoint = initStat(healthPoint ?? 0);
    this.chakra = initStat(100); // // Chakra (pts) [tiêu tốn khi dùng ultimate]
    this.critDamage = initStat(critDamage ?? 0, Unit.RATE);
    this.critRate = initStat(critRate ?? 0, Unit.RATE);
    this.critResist = initStat(critResist ?? 0, Unit.RATE);
    this.accuracy = initStat(accuracy ?? 0, Unit.RATE);
    this.dodge = initStat(dodge ?? 0, Unit.RATE);
    this.pierce = initStat(pierce ?? 0, Unit.RATE);
    this.toughness = initStat(toughness ?? 0, Unit.RATE);
    this.damageAmplification = initStat(damageAmplification ?? 0, Unit.RATE);
    this.damageReduction = initStat(damageReduction ?? 0, Unit.RATE);
    this.speed = initStat(speed ?? 0);
    //
    this.specialLevelUpBonusStats = specialLevelUpBonusStats ?? {};
  }

  levelUp(shouldLog = false) {
    if (this.level < this.gradeMaxLevel) {
      let log = `${this.name} Level ${this.level} -> level ${
        this.level + 1
      } \n#####\n`;
      const baseBonus = getBasePoint(this.level);

      for (const stat of stats) {
        if (stat === 'chakra') {
          continue;
        }
        // real bonus = base bonus * class scale * tier scale + special level up bonus
        const baseStatBonus = baseBonus[stat];
        if (!baseStatBonus) {
          continue;
        }
        let bonusValue = baseStatBonus.value ?? 0;
        log += `Base ${stat} bonus: ${bonusValue} => `;

        const tierScale =
          baseStatBonus.unit === Unit.RATE
            ? this.tierScale.rateScale
            : this.tierScale.pointScale;
        bonusValue *= tierScale;
        log += `TS (${tierScale}) = ${bonusValue} => `;

        bonusValue *= this.classesScale[stat];
        log += `CS (${this.classesScale[stat]}) = ${bonusValue}`;

        const specialLevelUpBonus = this.specialLevelUpBonusStats[stat] ?? null;

        if (
          specialLevelUpBonus &&
          specialLevelUpBonus.unit === baseStatBonus.unit
        ) {
          bonusValue += specialLevelUpBonus.value;
          log += ` => CSB (${specialLevelUpBonus.value}) = ${bonusValue} \n`;
        } else {
          log += '\n';
        }

        log += `${stat}: ${this[stat].value} -> `;
        this[stat].value += bonusValue;
        log += `${this[stat].value} \n########\n`;
      }

      if (
        shouldLog &&
        this.level >= this.gradeMinLevel &&
        this.level <= this.gradeMaxLevel
      ) {
        console.log(log);
      }
      this.level += 1;
    } else {
      throw new Error(
        `You are at ${GradeName[this.grade]} max level is: ${
          this.gradeMaxLevel
        }`,
      );
    }
  }

  upLevelTo(level: number) {
    try {
      if (this.level < level) {
        for (let i = 1; i++; i < level) {
          this.levelUp();
        }
      } else {
        throw new Error('invalid error');
      }
      return {
        status: 'success',
      };
    } catch (error: any) {
      console.log(error.message);
      return {
        status: 'failed',
        error,
      };
    }
  }

  info() {
    let log = `
    Name: ${this.name}\n
    Tier: ${this.tier}\n
    Class: ${this.classes}\n
    Grade: ${GradeName[this.grade]}\n
    Level: ${this.level}\n
    Star: ${this.star}\n
    Stats:\n
    `;
    for (const stat of stats) {
      if (stat === 'chakra') {
        log += `${stat}: ${this[stat].value} (pts) \n`;
      } else if (this[stat].unit === Unit.POINT) {
        log += `
        ${stat}: ${this[stat].value} (pts), Star Buff (${
          this.starBuffRate.pointScale
        }) -> ${this[stat].value * this.starBuffRate.pointScale} (pts)\n
        `;
      } else if (this[stat].unit === Unit.RATE) {
        log += `
        ${stat}: ${this[stat].value} (%), Star Buff (${
          this.starBuffRate.rateScale
        }) -> ${this[stat].value * this.starBuffRate.rateScale} (%)\n
        `;
      }
    }
    console.log(log);
  }

  export() {
    return JSON.stringify(this);
  }
}
