import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import { OrderMessage } from '@nodetron/types/bots/order'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sqrt, square, abs, sign, sin, cos, pi, and } from 'mathjs'
import { Kick } from '@nodetron/types/enum'

/**
 * This script allows a robot to go to the ball and then go backwards with it
 * call "MSB.follow_ball" ' { "ids" : [5] }'
 * call "MSB.Backwards" ' { "id" : 5 }'
 */
export default class Backwards extends Strategies {
  name = 'Backwards';

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
      state.assign.register( [ctx.params.id], new Backwards(ctx.params.id))
    },
  }

  compute(broker: ServiceBroker): boolean {

    const ball = state.world.ball
    const robot = state.world.robots.allies
    let touched = false
    const epsilon = 1
    /*
      void broker.call('control.moveTo', {
        id: this.id,
        kick: Kick.NO, 
        spin: true,
        power: 0,
        target: { x: ball.position.x, y: ball.position.y},
        orientation: pi,
      } as MoveToMessage)  
    */
        void broker.call('bots.order', {
          id: this.id,
          kick: Kick.NO, 
          spin: true,
          power: 0,
          velocity: {normal : 0, tangent: -1, angular: 0},
        } as OrderMessage)  
      
    
    return true
  }

}


 