import { InGameNinja } from 'src/classes';
import { stats } from 'src/constants';

export enum Unit {
  RATE = 'RATE',
  POINT = 'POINT',
}

export interface Stat {
  value: number;
  deltaRate: number; // only use for inGame
  deltaPoint: number; // only use for inGame
  unit: Unit;
}

export interface LevelUpBonus {
  value: number;
  unit: Unit;
}

export type LevelUpBonusStats = {
  [key in (typeof stats)[number]]?: LevelUpBonus;
};

export interface Position {
  x: number;
  y: number;
}

export enum EffectType {
  BUFF = 'BUFF',
  DEBUFF = 'DEBUFF',
}

export enum EffectTriggerTime {
  BEGIN_TURN = 'BEGIN_TURN',
  END_TURN = 'END_TURN',
}

export interface EffectComponent {
  statName: Exclude<typeof stats, 'speed'>;
  key: Exclude<keyof Stat, 'unit' | 'value'>;
  amount: number;
  description: string;
  stackable: boolean;
}

export interface Effect {
  owner: string; // ninja id
  target: string; // ninja id
  //
  name: string;
  icon: string;
  //
  type: EffectType;
  triggerSchedule: EffectTriggerTime;
  clearable: boolean;
  //
  fromTurn: number;
  toTurn: number;
  //
  components: EffectComponent[];
}

export interface Match {
  team1: InGameNinja[];
  team2: InGameNinja[];
  turn: 0;
}

export enum TeamNameSpace {
  TEAM1 = 'team1',
  TEAM2 = 'team2',
}
