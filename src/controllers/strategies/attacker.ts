import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sqrt, square, abs, sign, sin, cos, pi, and } from 'mathjs'
import { Kick } from '@nodetron/types/enum'
import { Vector} from '../../../../nodetron-math/src/Vector2D'

// call "MSB.shoot" ' { "id" : 5 }'

export default class Attacker extends Strategies {
    name = 'attacker';

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
        state.assign.register([ctx.params.id], new Attacker(ctx.params.id))
      },
    }

    public step = 1

    compute(broker: ServiceBroker): boolean {
      const robot = state.world.robots.allies[this.id]
      const { ball } = state.world
      let target = ball.position
      let orientation = 0
      const goalCenter =  new Vector(-(state.world.field.length / 2.0), 0)
      const target2Ball= new Vector(ball.position.x - goalCenter.x, ball.position.y - goalCenter.y )
      const norm = Math.sqrt(target2Ball.x ** 2 + target2Ball.y ** 2)
      target2Ball.x /= norm
      target2Ball.y /= norm

      void broker.call('control.moveTo', {
        id: this.id,
        target,
        spin: false,
        power: 0.6,
        orientation,
        kick: Kick.FLAT,
      } as MoveToMessage)
      return true
      //return this.step === 3
    }
}