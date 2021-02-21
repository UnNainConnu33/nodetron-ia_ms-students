import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sqrt, square, abs, sign, sin, cos, pi, and } from 'mathjs'
import { Kick } from '@nodetron/types/enum'
import { Vector} from '../../../../nodetron-math/src/Vector2D'
/* eslint-disable prefer-const */
/* eslint-disable no-case-declarations */

// call "MSB.shoot" ' { "id" : 5 }'

export default class Shoot extends Strategies {
    name = 'shoot';

    public constructor(public id: number) {
      super()
    }

    public static declaration: ActionSchema = {
      params: {
        id: {
          type: 'number', min: 0, max: 15,
        },
      },
      handler(ctx: Context<{ id: number }>): void {
        state.assign.register([ctx.params.id], new Shoot(ctx.params.id))
      },
    }

    public step = 1;

    compute(broker: ServiceBroker): boolean {
      const robot = state.world.robots.allies[this.id]
      const { ball } = state.world
      let target = ball.position
      let orientation = 0
      const goalCenter =  new Vector(-(state.world.field.length / 2.0), 0)
      const target2Ball= new Vector (ball.position.x - goalCenter.x, ball.position.y - goalCenter.y )
      const norm = Math.sqrt(target2Ball.x ** 2 + target2Ball.y ** 2)
      target2Ball.x /= norm
      target2Ball.y /= norm
      switch (this.step) {
        case 1:
          target.x += target2Ball.x * 0.5
          target.y += target2Ball.y * 0.5
          orientation = Math.atan2(-target2Ball.y, -target2Ball.x)
          const dist = Math.sqrt(((target.x - robot.position.x) ** 2 - (target.y - robot.position.y) ** 2))
          if (dist < 0.01) {
            this.step += 1
          }
          break
        case 2:
          orientation = Math.atan2(-target2Ball.y, -target2Ball.x)

          target.x -= 0.1 * target2Ball.x
          target.y -= 0.1 * target2Ball.y
        
          if (robot.infrared) {
            this.step += 1
          }
          break
        default:
          broker.logger.error('Not implemented')
      }

      void broker.call('control.moveTo', {
        id: this.id,
        target,
        spin: false,
        power: 0.6,
        orientation,
        kick: Kick.CHIP,
      } as MoveToMessage)
      return true
      //return this.step === 3
    }
}