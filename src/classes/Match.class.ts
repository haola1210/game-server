import { TeamNameSpace } from 'src/interfaces';
import InGameNinja from './InGameNinja.class';

export default class Match {
  private turn = 0;
  team1: InGameNinja[];
  team2: InGameNinja[];

  constructor(ninjaList1: InGameNinja[], ninjaList2: InGameNinja[]) {
    // TODO: trigger all passive skills to update ninjas' stats

    // sort by speed 2 arrays, faster team is team1. => team1 will attact first
    ninjaList1.sort((n1, n2) => n2.getSpeed() - n1.getSpeed());
    ninjaList2.sort((n1, n2) => n2.getSpeed() - n1.getSpeed());

    if (ninjaList1[0].getSpeed() >= ninjaList2[0].getSpeed()) {
      this.team1 = ninjaList1;
      this.team2 = ninjaList2;
    } else {
      this.team1 = ninjaList2;
      this.team2 = ninjaList1;
    }
    //  update team
    // team 1 will attack first and x value is from 0 -> 2
    this.team1.forEach((n) => {
      n.setTeam(TeamNameSpace.TEAM1);
      n.setLogicalPosition({ ...n.getPosition() });
    });
    // x value of team 2 is from 3 -> 5
    this.team2.forEach((n) => {
      n.setTeam(TeamNameSpace.TEAM2);
      n.setLogicalPosition({ x: n.getPosition().x + 3, y: n.getPosition().y });
    });
  }

  getDeadNinjas(team: TeamNameSpace) {
    const list = team === TeamNameSpace.TEAM1 ? this.team1 : this.team2;
    return list.filter((nin) => nin.getIsDead());
  }
  getAliveNinjas(team: TeamNameSpace) {
    const list = team === TeamNameSpace.TEAM1 ? this.team1 : this.team2;
    return list.filter((nin) => !nin.getIsDead());
  }

  getCurrentTurn() {
    return this.turn;
  }
  getCurrentTeamName() {
    return this.getCurrentTurn() % 2 === 0
      ? TeamNameSpace.TEAM1
      : TeamNameSpace.TEAM2;
  }

  getCurrentEnemyTeamName() {
    return this.getCurrentTurn() % 2 === 0
      ? TeamNameSpace.TEAM2
      : TeamNameSpace.TEAM1;
  }
  getCurrentTeam() {
    return this.getCurrentTeamName() === TeamNameSpace.TEAM1
      ? this.team1
      : this.team2;
  }

  getEnemyTeam() {
    return this.getCurrentEnemyTeamName() === TeamNameSpace.TEAM1
      ? this.team1
      : this.team2;
  }

  processTurn() {
    // trigger all effect
    // ...
    // determine 2 sides
    const allyName = this.getCurrentTeamName();
    const enemyName = this.getCurrentEnemyTeamName();

    const allies = this.getAliveNinjas(allyName);
    const enemies = this.getAliveNinjas(enemyName);
    //

    // get first ninja of allies
    const currentNinja = allies.shift();
    // check if the chakra is full
    if (currentNinja.getChakra() === 100) {
      // emit event ULTIMATE_AVAILABLE
      // and wait for the triggering event from client (3s)
      // if
    }
    // check if ninja is stuned
    if (currentNinja.getIsStunned()) {
      // emit event NINJA_STUNNED
    }
    // check activeSkill
    //
    // ninja normal attack
    currentNinja.normalAttack(enemies);
  }
}
