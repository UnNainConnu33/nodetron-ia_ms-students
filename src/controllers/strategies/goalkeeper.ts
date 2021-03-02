import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { sin, cos, pi, sqrt, square, i, atan } from 'mathjs' 
import { state } from '../../models/state'

/**
 * This class is an example of the new way to create Strategies.
 * It is basic and needs to be improved !
 * call "MSB.goalkeeper" ' { "id" : 1 }' (To try with npm run repl)
 */
export default class Goalkeeper extends Strategies {
  name = 'goalkeeper';

  public constructor(public id: number) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      id: {
        type: 'number', min: 0, max: 5,
      },
    },
    handler(ctx: Context<{ id: number }>): void {
      ctx.broker.logger.info('MoveToPacket packet received')
      state.assign.register([ctx.params.id], new Goalkeeper(ctx.params.id))
    },
  }

  compute(broker: ServiceBroker): boolean {
    let defaultRadius = 0.6       // Radius of the goalkeeper's position
    let X_goalLine = 5            
    let Y_goalLine = 0            // Middle of the goal line
    let X_ball = X_goalLine - state.world.ball.position.x  
    let Y_ball = Y_goalLine - state.world.ball.position.y
    let angle = atan(Y_ball / X_ball)
    let angle2 = (pi/2) - angle
    let X = X_goalLine + defaultRadius * sin(angle2 + pi)
    let Y = Y_goalLine + defaultRadius * cos(angle2 + pi)
    
    //broker.logger.info(angle2)
    void broker.call('control.moveTo', {
      id: this.id,
      target: { x: X, y: Y },
      orientation: angle + pi,
    } as MoveToMessage)
    return false
  }
}