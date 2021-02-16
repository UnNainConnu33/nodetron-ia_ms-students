import { ServiceBroker } from 'moleculer'
import { Command as GameControllerCommand } from '@nodetron/types/network/game-controller'

import { state } from '../models/state'

import { Manager } from './manager'

type stateMethods = (broker: ServiceBroker) => void;

export interface GameStateMachineStatesMethods {
  onStopped: stateMethods,
  onHalted: stateMethods,

  onRunning: stateMethods,

  onKickoffYellow: stateMethods,
  onKickoffBlue: stateMethods,

  onPenaltyYellow: stateMethods,
  onPenaltyBlue: stateMethods,

  onIndirectKickYellow: stateMethods,
  onIndirectKickBlue: stateMethods,

  onDirectKickYellow: stateMethods,
  onDirectKickBlue: stateMethods,

  onTimeoutYellow: stateMethods,
  onTimeoutBlue: stateMethods,

  onBallPlacementYellow: stateMethods,
  onBallPlacementBlue: stateMethods,
}

export abstract class GameStateMachine implements Manager {
  public abstract statesMethods: GameStateMachineStatesMethods

  currentStateMethod: stateMethods | undefined

  update(broker: ServiceBroker): void {
    const { gameController } = state.world
    if (gameController.command) {
      switch (gameController.command.value) {
        case GameControllerCommand.STOP:
          this.currentStateMethod = this.statesMethods.onStopped
          broker.logger.debug('Stopping...')
          break
        case GameControllerCommand.HALT:
          this.currentStateMethod = this.statesMethods.onHalted
          broker.logger.debug('Halt...')
          break

        case GameControllerCommand.NORMAL_START:
          this.currentStateMethod = this.statesMethods.onRunning
          broker.logger.debug('Normal starting...')
          break
        case GameControllerCommand.FORCE_START:
          this.currentStateMethod = this.statesMethods.onRunning
          broker.logger.debug('Forcing start...')
          break

        case GameControllerCommand.PREPARE_KICKOFF_YELLOW:
          this.currentStateMethod = this.statesMethods.onKickoffYellow
          broker.logger.debug('Preparing kickoff yellow...')
          break
        case GameControllerCommand.PREPARE_KICKOFF_BLUE:
          this.currentStateMethod = this.statesMethods.onKickoffBlue
          broker.logger.debug('Preparing kickoff blue...')
          break

        case GameControllerCommand.PREPARE_PENALTY_YELLOW:
          this.currentStateMethod = this.statesMethods.onPenaltyYellow
          broker.logger.debug('Preparing penalty yellow...')
          break
        case GameControllerCommand.PREPARE_PENALTY_BLUE:
          this.currentStateMethod = this.statesMethods.onPenaltyBlue
          broker.logger.debug('Preparing penalty blue...')
          break

        case GameControllerCommand.INDIRECT_FREE_YELLOW:
          this.currentStateMethod = this.statesMethods.onIndirectKickYellow
          broker.logger.debug('Preparing indirect kick yellow...')
          break
        case GameControllerCommand.INDIRECT_FREE_BLUE:
          this.currentStateMethod = this.statesMethods.onIndirectKickBlue
          broker.logger.debug('Preparing indirect kick blue...')
          break

        case GameControllerCommand.DIRECT_FREE_YELLOW:
          this.currentStateMethod = this.statesMethods.onDirectKickYellow
          broker.logger.debug('Preparing direct kick yellow...')
          break
        case GameControllerCommand.DIRECT_FREE_BLUE:
          this.currentStateMethod = this.statesMethods.onDirectKickBlue
          broker.logger.debug('Preparing direct kick blue...')
          break

        case GameControllerCommand.TIMEOUT_YELLOW:
          this.currentStateMethod = this.statesMethods.onTimeoutYellow
          broker.logger.debug('Starting timeout yellow...')
          break
        case GameControllerCommand.TIMEOUT_BLUE:
          this.currentStateMethod = this.statesMethods.onTimeoutBlue
          broker.logger.debug('Starting timeout blue...')
          break

        case GameControllerCommand.BALL_PLACEMENT_YELLOW:
          this.currentStateMethod = this.statesMethods.onBallPlacementYellow
          broker.logger.debug('Placing ball yellow...')
          break
        case GameControllerCommand.BALL_PLACEMENT_BLUE:
          this.currentStateMethod = this.statesMethods.onBallPlacementBlue
          broker.logger.debug('Placing ball blue...')
          break

        default:
          broker.logger.debug('Transition unknown')
          break
      }
    }
    if (this.currentStateMethod) {
      this.currentStateMethod(broker)
    }
    broker.logger.debug('Machine State Updated')
  }
}
