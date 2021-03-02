import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { Vector } from '@nodetron/math/vector2D'

import { state } from '../../models/state'

/**
 * This class is an example of the new way to create Strategies.
 * It is basic and needs to be improved !
 * call "MSB.followBall" ' { "id" : 0 }' (To try with npm run repl)
 */
export default class FollowBall extends Strategies {
    name = 'followBall';

    public constructor(public id: number) {
      super()
    }

    public static declaration: ActionSchema = {
      params: {
        id: {
          type: 'number', min: 0, max: 16,
        },
      },
      handler(ctx: Context<{ id: number }>): void {
        ctx.broker.logger.info('MoveToPacket packet received')
        state.assign.register([ctx.params.id], new FollowBall(ctx.params.id))
      },
    }

    compute(broker: ServiceBroker): boolean {
      const robot = state.world.robots.allies[this.id]
      const { ball } = state.world

      const vect = new Vector(ball.position.x - robot.position.x, ball.position.y - robot.position.y)

      void broker.call('control.moveTo', {
        id: this.id,
        target: { ...robot.position },
        orientation: vect.angle().value,
      } as MoveToMessage)

      return false
    }
}