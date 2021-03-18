import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sqrt, square, abs, sign, sin, cos, pi, and } from 'mathjs'
import { Kick } from '@nodetron/types/enum'
import { Vector} from '../../../../nodetron-math/src/Vector2D'

// call "MSB.kickShoot" ' { "id" : 5, "angle" : 0 }'

export default class KickShoot extends Strategies {
    name = 'kick';

    public constructor(public id: number, public angle: number) {
      super()
    }

    public static declaration: ActionSchema = {
      params: {
        id: {
          type: 'number', min: 0, max: 15,
        },
        angle: {
          type: 'number', min: -5, max: 5,
        }
      },
      handler(ctx: Context<{ id: number, angle: number }>): void {
        state.assign.register([ctx.params.id, ctx.params.angle], new KickShoot(ctx.params.id, ctx.params.angle))
      },
    }


    compute(broker: ServiceBroker): boolean {
      const robot = state.world.robots.allies[this.id]
      const ball = state.world.ball
      const goalCenter =  new Vector(-(state.world.field.length / 2.0), 0)
      const target2Ball= new Vector(ball.position.x - goalCenter.x, ball.position.y - goalCenter.y )
      // const norm = Math.sqrt(target2Ball.x ** 2 + target2Ball.y ** 2)

      void broker.call('control.moveTo', {
        id: this.id,
        target: ball.position,
        spin: false,
        power: 1,
        orientation: Math.atan2(-target2Ball.y + this.angle, -target2Ball.x ),
        kick: Kick.FLAT,
      } as MoveToMessage)
      
      return true
    }
}