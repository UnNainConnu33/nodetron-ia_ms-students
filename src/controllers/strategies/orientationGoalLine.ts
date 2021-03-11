import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sqrt, square, abs, sign, sin, cos, pi, and } from 'mathjs'
import { Kick } from '@nodetron/types/enum'
import { Vector} from '../../../../nodetron-math/src/Vector2D'

// call "MSB.emptyGoal" ' { "id" : 5, "angle" : 1 }'

export default class OrientationGoalLine extends Strategies {
    name = 'orientationGoalLine';

    public constructor(public id: number) {
      super()
    }

    public static declaration: ActionSchema = {
      params: {
        id: {
          type: 'number', min: 0, max: 15,
        },
      },
      handler(ctx: Context<{ id: number}>): void {
        state.assign.register([ctx.params.id], new OrientationGoalLine(ctx.params.id))
      },
    }

    compute(broker: ServiceBroker): boolean {
      const robot = state.world.robots.allies[this.id]
      const ball = state.world.ball
      const goalCenter =  new Vector(-(state.world.field.length / 2.0), 0)
      const target2Ball= new Vector(ball.position.x - goalCenter.x, ball.position.y - goalCenter.y )
      // const norm = Math.sqrt(target2Ball.x ** 2 + target2Ball.y ** 2)
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
            console.log(step)
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
  
      void broker.call('control.moveTo', {
        id: this.id,
        target: ball.position,
        spin: false,
        power: 1.5,
        orientation: Math.atan2(-target2Ball.y, -target2Ball.x ),
        kick: Kick.FLAT,
      } as MoveToMessage)
      
      return true
    }
}