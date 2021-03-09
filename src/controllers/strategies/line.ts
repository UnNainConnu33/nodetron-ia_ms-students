import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sqrt, square, abs, sign, sin, cos, pi } from 'mathjs'

/**
 * call "MSB.line" '{ "robots_amount" : 4, "opponent_id" : 0, "radius" : 1}'
 * if opponent_id == 1, then the robot goes to the ball.
 */
export default class Line extends Strategies {
  name = 'line';

  public constructor(public robots_amount: number, public opponent_id: number, public radius: number) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      robots_amount: {
        type: 'number', min: 2, max: 6,
      },
      opponent_id: {
        type: 'number', min: -1, max: 5,
      },
      radius: {
        type: 'number', min: 0.2, max: 4,
      },
    },
    handler(ctx: Context<{robots_amount: number, opponent_id: number, radius: number}>): void {
        ctx.broker.logger.info('MoveToMessage Message received')
        state.assign.register([ctx.params.robots_amount, ctx.params.opponent_id, ctx.params.radius], 
            new Line(ctx.params.robots_amount, ctx.params.opponent_id, ctx.params.radius))
    },
  }

  compute(broker: ServiceBroker): boolean {

  // This method works perfectly but isn't the most effective one

    const shifts_2 = [[this.radius, -this.radius], [this.radius, this.radius]]
    const shifts_3 = [[this.radius, 0], [this.radius, -this.radius], [this.radius, this.radius]]
    const shifts_4 = [[this.radius, -this.radius], [this.radius, this.radius], [this.radius, -this.radius/3], [this.radius, this.radius/3]]
    const shifts_5 = [[this.radius, 0], [this.radius, -this.radius/2], [this.radius, this.radius/2], [this.radius, -this.radius], [this.radius, this.radius]]
    const shifts_6 = [[this.radius, -this.radius], [this.radius, this.radius], [this.radius, -this.radius/3], [this.radius, this.radius/3], [this.radius, -1.5*this.radius], [this.radius, 1.5*this.radius]]
                      

      for (let i = 0; i < this.robots_amount ; i++){
        if (this.opponent_id == -1) {
          switch (this.robots_amount) {
            case 2:
              void broker.call('control.moveTo', {
                id: i,
                target: {x: shifts_2[i][0] + state.world.ball.position.x, y: shifts_2[i][1] + state.world.ball.position.y},
                orientation: 0,
            } as MoveToMessage)
                break

            case 3:
              void broker.call('control.moveTo', {
                id: i,
                target: {x: shifts_3[i][0] + state.world.ball.position.x, y: shifts_3[i][1] + state.world.ball.position.y},
                orientation: 0,
            } as MoveToMessage)
                break

            case 4:
              void broker.call('control.moveTo', {
                id: i,
                target: {x: shifts_4[i][0] + state.world.ball.position.x, y: shifts_4[i][1] + state.world.ball.position.y},
                orientation: 0,
            } as MoveToMessage)
                break
            

            case 5:
              void broker.call('control.moveTo', {
                id: i,
                target: {x: shifts_5[i][0] + state.world.ball.position.x, y: shifts_5[i][1] + state.world.ball.position.y},
                orientation: 0,
            } as MoveToMessage)
                break

            case 6:
              void broker.call('control.moveTo', {
                id: i,
                target: {x: shifts_6[i][0] + state.world.ball.position.x, y: shifts_6[i][1] + state.world.ball.position.y},
                orientation: 0,
            } as MoveToMessage)
                break

        }
      }

      else {
        switch (this.robots_amount) {
          case 2:
            void broker.call('control.moveTo', {
              id: i,
              target: {x: shifts_2[i][0] + state.world.robots.opponents[this.opponent_id].position.x, y: shifts_2[i][1] + state.world.robots.opponents[this.opponent_id].position.y},
              orientation: 0,
          } as MoveToMessage)
              break

          case 3:
            void broker.call('control.moveTo', {
              id: i,
              target: {x: shifts_3[i][0] + state.world.robots.opponents[this.opponent_id].position.x, y: shifts_3[i][1] + state.world.robots.opponents[this.opponent_id].position.y},
              orientation: 0,
          } as MoveToMessage)
              break

          case 4:
            void broker.call('control.moveTo', {
              id: i,
              target: {x: shifts_4[i][0] + state.world.robots.opponents[this.opponent_id].position.x, y: shifts_4[i][1] + state.world.robots.opponents[this.opponent_id].position.y},
              orientation: 0,
          } as MoveToMessage)
              break
          

          case 5:
            void broker.call('control.moveTo', {
              id: i,
              target: {x: shifts_5[i][0] + state.world.robots.opponents[this.opponent_id].position.x, y: shifts_5[i][1] + state.world.robots.opponents[this.opponent_id].position.y},
              orientation: 0,
          } as MoveToMessage)
              break

          case 6:
            void broker.call('control.moveTo', {
              id: i,
              target: {x: shifts_6[i][0] + state.world.robots.opponents[this.opponent_id].position.x, y: shifts_6[i][1] + state.world.robots.opponents[this.opponent_id].position.y},
              orientation: 0,
          } as MoveToMessage)
              break
        }
      }
    }
        return true
    }
  }
