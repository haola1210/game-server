import { Class, Grade, Tier } from '@prisma/client';
import {
  Effect,
  Match,
  Position,
  Stat,
  TeamNameSpace,
  Unit,
} from 'src/interfaces';
import BaseNinja from './BaseNinja.class';
import { initStat } from 'src/utils';
import { stats } from 'src/constants';

interface ActiveSkill {
  isExist: boolean;
  checkReady: (turn: number) => boolean;
  trigger: (match: Match) => void;
}

export default class InGameNinja {
  // logical properties
  private logicPosition: Position | undefined; // value in matrix 3x6
  private team: TeamNameSpace | undefined;

  // enhance properties
  // private maxHP = 0;
  private isDead = false;
  private effects: Effect[] = [];
  private isStunned = false;
  // private passiveSkill1: Skill;
  // private passiveSkill2: Skill;
  // private activeSkill: Skill;
  // private ultimateSkill: Skill;

  constructor(
    private id: string,
    private name: string,
    private tier: Tier,
    private classes: Class,
    private star: number,
    private level: number,
    private grade: Grade,
    //
    private attack: Stat,
    private defense: Stat,
    private healthPoint: Stat,
    private chakra: Stat,
    private critDamage: Stat,
    private critRate: Stat,
    private critResist: Stat,
    private accuracy: Stat,
    private dodge: Stat,
    private pierce: Stat,
    private toughness: Stat,
    private damageAmplification: Stat,
    private damageReduction: Stat,
    private speed: Stat,
    private position: Position, // value of slot (matrix 3x3)
    owner: string,
  ) {}

  public static converToInGameNinja(
    ninja: BaseNinja,
    position: Position,
    owner: string,
  ) {
    return new InGameNinja(
      ninja.id,
      ninja.name,
      ninja.tier,
      ninja.classes,
      ninja.star,
      ninja.level,
      ninja.grade,
      initStat(ninja.attack.value * ninja.starBuffRate.pointScale),
      initStat(ninja.defense.value * ninja.starBuffRate.pointScale),
      initStat(ninja.healthPoint.value * ninja.starBuffRate.pointScale),
      initStat(ninja.chakra.value),
      initStat(
        ninja.critDamage.value * ninja.starBuffRate.rateScale,
        Unit.RATE,
      ),
      initStat(ninja.critRate.value * ninja.starBuffRate.rateScale, Unit.RATE),
      initStat(
        ninja.critResist.value * ninja.starBuffRate.rateScale,
        Unit.RATE,
      ),
      initStat(ninja.accuracy.value * ninja.starBuffRate.rateScale, Unit.RATE),
      initStat(ninja.dodge.value * ninja.starBuffRate.rateScale, Unit.RATE),
      initStat(ninja.dodge.value * ninja.starBuffRate.rateScale, Unit.RATE),
      initStat(ninja.toughness.value * ninja.starBuffRate.rateScale, Unit.RATE),
      initStat(
        ninja.damageAmplification.value * ninja.starBuffRate.rateScale,
        Unit.RATE,
      ),
      initStat(
        ninja.damageReduction.value * ninja.starBuffRate.rateScale,
        Unit.RATE,
      ),
      initStat(ninja.speed.value * ninja.starBuffRate.pointScale),
      position,
      owner,
    );
  }

  getPosition() {
    return this.position;
  }
  getSpeed() {
    return this.speed.value;
  }

  setTeam(team: TeamNameSpace) {
    this.team = team;
  }

  setLogicalPosition(lP: Position) {
    this.logicPosition = lP;
  }
  getLogicalPosition() {
    return this.logicPosition;
  }

  getIsDead() {
    return this.isDead;
  }

  getChakra() {
    return this.chakra.value;
  }
  getIsStunned() {
    return this.isStunned;
  }

  getCastedValue(field: Omit<typeof stats, 'chakra'>[number]) {
    return (
      this[field].value * (1 + this[field].deltaRate) + this[field].deltaPoint
    );
  }

  shouldCrit(critRate: number) {
    const rate = Math.floor(Math.random() * 100) + 1; // 1 - 100
    return rate <= critRate;
  }

  critAtk(attack: number, critDamage: number) {
    return attack * (critDamage / 100);
  }

  calcTrueDmgAndAtk(atk: number, pierce: number) {
    const trueDamage = atk * (pierce / 100);
    const normalAtk = atk - trueDamage;
    return {
      trueDamage,
      normalAtk,
    };
  }

  getDamageDealed(atk: number, def: number) {
    return (atk * 100) / (100 + def) ** 0.7;
    // return atk / 2 ** (def / atk);
  }

  getTrueDamageDealed(trueDmg: number, toughness: number) {
    return trueDmg * (1 - toughness / 100);
  }

  getDamageAfterCritRes(dmg: number, critResist: number) {
    return dmg * (1 - critResist / 100);
  }

  getEnhancedDamage(
    dmg: number,
    damageAmplification: number,
    damageReduction: number,
  ) {
    const delta = damageAmplification - damageReduction;

    return dmg * (1 + delta / 100);
  }

  normalAttack(enemies: InGameNinja[]) {
    const distances = enemies.map((n) => {
      const { x: xA, y: yA } = this.getLogicalPosition();
      const { x: xB, y: yB } = n.getLogicalPosition();

      return Math.sqrt((xA - xB) ** 2 + (yA - yB) ** 2);
    });

    let minIndex = 0;
    let minValue = distances[minIndex];
    for (const i in distances) {
      if (distances[i] < minValue) {
        minIndex = Number(i);
        minValue = distances[i];
      }
    }

    const target = enemies[minIndex];

    const isCrit = this.shouldCrit(this.getCastedValue('critRate'));
    const atk = isCrit
      ? this.critAtk(
          this.getCastedValue('attack'),
          this.getCastedValue('critDamage'),
        )
      : this.getCastedValue('attack');

    const { trueDamage, normalAtk } = this.calcTrueDmgAndAtk(
      atk,
      this.getCastedValue('pierce'),
    );
    // normal damage dealed
    let damageDealed = this.getDamageDealed(
      normalAtk,
      target.getCastedValue('defense'),
    );
    if (isCrit) {
      damageDealed = this.getDamageAfterCritRes(
        damageDealed,
        target.getCastedValue('critResist'),
      );
    }
    damageDealed = this.getEnhancedDamage(
      damageDealed,
      this.getCastedValue('damageAmplification'),
      target.getCastedValue('damageReduction'),
    );
    // true damage dealed
    let trueDamageDealed = this.getDamageDealed(
      trueDamage,
      target.getCastedValue('toughness'),
    );
    if (isCrit) {
      trueDamageDealed = this.getDamageAfterCritRes(
        trueDamageDealed,
        target.getCastedValue('critResist'),
      );
    }
    trueDamageDealed = this.getEnhancedDamage(
      trueDamageDealed,
      this.getCastedValue('damageAmplification'),
      target.getCastedValue('damageReduction'),
    );

    //
    console.log(
      `ninja ${this.name}_${this.team} attack ninja ${target.name}_${target.team} deal:`,
    );
    console.log(`normal damage: ${damageDealed}`);
    console.log(`true damage: ${trueDamageDealed}`);
  }
}
