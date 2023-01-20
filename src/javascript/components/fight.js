import { controls, fightActions, barPosition } from '../../constants/controls';
import { renderHealthBar } from './fighterSelector';

export async function fight(firstFighter, secondFighter) {
  const [firstFighterHealth, secondFighterHealth] = [firstFighter.health, secondFighter.health];
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    let pressedKeys = [];

    function pressedKeyHandler(event) {
      pressedKeys.push(event?.code);

      setTimeout(() => {
        if (pressedKeys.length !== 0) {
          playRoundOfCombat(pressedKeys, firstFighter, secondFighter, firstFighterHealth, secondFighterHealth);
          if (isGameOver(firstFighter, secondFighter)) {
            document.removeEventListener('keydown', pressedKeyHandler, false);
            firstFighter.health <= 0 ? resolve(secondFighter) : resolve(firstFighter);
          }
          pressedKeys = [];
        }
      }, 200);
    }
    document.addEventListener('keydown', pressedKeyHandler, false);
  });
}

export function getDamage(attacker, defender) {
  // return damage
  const powerResult = getHitPower(attacker) - getBlockPower(defender);
  return powerResult <= 0 ? 0 : powerResult;
}

export function getHitPower(fighter) {
  // return hit power
  const criticalHitChance = Math.random() + 1;
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  // return block power
  const dodgeChance = Math.random() + 1;
  return fighter.defense * dodgeChance;
}

function getCriticalHitPower(fighter) {
  return 2 * fighter.attack;
}

function isCombination(combination, pressedKeys) {
  const isComboAttack = controls[combination].every((value) => pressedKeys.includes(value));
  if (!isComboAttack) {
    return false;
  }

  controls[combination].forEach((key) => {
    pressedKeys.splice(pressedKeys.indexOf(key), 1);
  });

  return isComboAttack;
}

function isValidIntervalTime(previousTime, currentTime) {
  if (!previousTime) {
    return true;
  }

  const seconds = (currentTime - previousTime) / 1000;
  return seconds >= 10;
}

function checkComboInterval(isComboAttack, pressedKeys, previousTime, currentTime, playerCombo) {
  if (isComboAttack && isValidIntervalTime(previousTime, currentTime)) {
    pressedKeys.push(playerCombo);
    previousTime = currentTime;
  }

  return previousTime;
}

let previousTimeFirstFighter, previousTimeSecondFighter;

function playRoundOfCombat(pressedKeys, firstFighter, secondFighter, firstFighterHealth, secondFighterHealth) {
  let currentTime = new Date();

  const isComboFirstFighter = isCombination('PlayerOneCriticalHitCombination', pressedKeys);
  const isComboSecondFighter = isCombination('PlayerTwoCriticalHitCombination', pressedKeys);

  previousTimeFirstFighter = checkComboInterval(
    isComboFirstFighter,
    pressedKeys,
    previousTimeFirstFighter,
    currentTime,
    fightActions.FirstPlayerCombo
  );
  previousTimeSecondFighter = checkComboInterval(
    isComboSecondFighter,
    pressedKeys,
    previousTimeSecondFighter,
    currentTime,
    fightActions.SecondPlayerCombo
  );

  const firstActionFighter = chooseOneAction(
    pressedKeys,
    fightActions.FirstPlayerCombo,
    controls.PlayerOneBlock,
    controls.PlayerOneAttack
  );
  const secondActionFighter = chooseOneAction(
    pressedKeys,
    fightActions.SecondPlayerCombo,
    controls.PlayerTwoBlock,
    controls.PlayerTwoAttack
  );

  calculatesActionsRound(
    firstActionFighter,
    secondActionFighter,
    firstFighter,
    secondFighter,
    firstFighterHealth,
    secondFighterHealth
  );
}

function chooseOneAction(pressedKeys, fighterCombo, fighterBlock, fighterAttack) {
  if (pressedKeys.includes(fighterCombo)) {
    return fightActions.Combo;
  }

  if (pressedKeys.includes(fighterBlock)) {
    return fightActions.Block;
  }

  if (pressedKeys.includes(fighterAttack)) {
    return fightActions.Attack;
  }
}

function calculatesActionsRound(
  firstAction,
  secondAction,
  firstFighter,
  secondFighter,
  firstFighterHealth,
  secondFighterHealth
) {
  let damage;

  if (
    (firstAction === fightActions.Block && secondAction !== fightActions.Combo) ||
    (secondAction === fightActions.Block && firstAction !== fightActions.Combo)
  ) {
    return 0;
  }

  if (firstAction === fightActions.Combo || firstAction === fightActions.Attack) {
    damage =
      firstAction === fightActions.Combo ? getCriticalHitPower(firstFighter) : getDamage(firstFighter, secondFighter);
    secondFighter.health -= damage;
    renderHealthBar(barPosition.PositionRight, secondFighter.health, secondFighterHealth);
  }

  if (secondAction === fightActions.Combo || secondAction === fightActions.Attack) {
    damage =
      secondAction === fightActions.Combo ? getCriticalHitPower(secondFighter) : getDamage(secondFighter, firstFighter);
    firstFighter.health -= damage;
    renderHealthBar(barPosition.PositionLeft, firstFighter.health, firstFighterHealth);
  }
}

function isGameOver(firstFighter, secondFighter) {
  return firstFighter.health <= 0 || secondFighter.health <= 0;
}
