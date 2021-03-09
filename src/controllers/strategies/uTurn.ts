import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sqrt, square, abs, sign, sin, cos, pi, and } from 'mathjs'
import { Kick } from '@nodetron/types/enum'
import { Vector} from '../../../../nodetron-math/src/Vector2D'
import { OrderMessage } from '@nodetron/types/bots/order'

// call "MSB.uTurn" ' { "id" : 0 }'

export default class uTurn extends Strategies {
    name = 'uTurn';

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
        state.assign.register([ctx.params.id], new uTurn(ctx.params.id))
      },
    }

    compute(broker: ServiceBroker): boolean {
      const ball = state.world.ball
      let robot = state.world.robots.allies[this.id]
      let target2Ball = new Vector(ball.position.x - robot.position.x, ball.position.y - robot.position.y)
      let dist = Math.sqrt(((ball.position.x - robot.position.x) ** 2 - (ball.position.y - robot.position.y) ** 2))
      let step = 1

      if (step == 1) {
        void broker.call('control.moveTo', {
          id: this.id,
          target: ball.position,
          spin: true,
          power: 0,
          orientation: target2Ball.angle().value,
          kick: Kick.NO,
        } as MoveToMessage)
        
        if (robot.infrared == true){
            step ++
          }
      }

      if (step == 2) { 
        void broker.call('control.moveTo', {
        id: this.id,
        target: ball.position,
        spin: true,
        power: 0,
        orientation: target2Ball.angle().value + pi,
        kick: Kick.NO,
      } as MoveToMessage)
      
    }
    return step === 2
    }
  }

