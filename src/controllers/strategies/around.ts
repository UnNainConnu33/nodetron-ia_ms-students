import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sqrt, square, abs, sign, sin, cos, pi } from 'mathjs'

/**
 * call "MSB.Around" '{ "robots_amount" : 4, "opponent_id" : 0, "radius" : 1}'
 */
export default class Around extends Strategies {
  name = 'Around';

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
            new Around(ctx.params.robots_amount, ctx.params.opponent_id, ctx.params.radius))
    },
  }

  compute(broker: ServiceBroker): boolean {

      for (let i = 0; i < this.robots_amount; i++){

        if (this.opponent_id == -1) {     // if opponent_id == -1 the robots go around the ball
          void broker.call('control.moveTo', {
            id: i,
            target: { x: cos(2 * pi / this.robots_amount * i) * this.radius + state.world.ball.position.x, 
                      y: sin(2 * pi / this.robots_amount * i) * this.radius + state.world.ball.position.y },
            // target: {x: shifts[i][0] + state.world.ball.position.x, y: shifts[i][1] + state.world.ball.position.y},
            orientation: 0,
        } as MoveToMessage)
    }
        else {
          void broker.call('control.moveTo', {   // here, the robots go around the opponent's robot specified
            id: i,
            target: {x: cos(2 * pi / this.robots_amount * i) * this.radius + state.world.robots.opponents[this.opponent_id].position.x, 
                     y: sin(2 * pi / this.robots_amount * i) * this.radius + state.world.robots.opponents[this.opponent_id].position.y },
            orientation: 0,
        } as MoveToMessage)
    }
  }
    return true
  }
}

// This method works perfectly but isn't the most effective one

    /*

    const shifts_2 = [[this.radius, 0], [-this.radius, 0]]
    const shifts_3 = [[this.radius, 0], [-0.5 * this.radius, sqrt(3)/2 * this.radius], [-0.5 * this.radius, - sqrt(3) / 2 * this.radius]]     // Reminder: cos((2*pi)/3) = -0.5 and sin((2*pi)/3) = sqrt(3)/2
    const shifts_4 = [[0, this.radius], [0, -this.radius], [this.radius, 0], [-this.radius, 0]]
    const shifts_5 = [[this.radius, 0], [cos((2*pi)/5) * this.radius, sin((2*pi)/5) * this.radius], 
                     [cos((4*pi)/5) * this.radius, sin((4*pi)/5) * this.radius], 
                     [cos((6*pi)/5) * this.radius, sin((6*pi)/5) * this.radius],
                     [cos((8*pi)/5) * this.radius, sin((8*pi)/5) * this.radius]]
    const shifts_6 = [[this.radius, 0], [0.5 * this.radius, sqrt(3) / 2 * this.radius], [-0.5 * this.radius, sqrt(3) / 2 * this.radius], 
                     [-1 * this.radius, 0],  [-0.5 * this.radius, - sqrt(3) / 2 * this.radius], [0.5 * this.radius, - sqrt(3) / 2 * this.radius]]
                      

      for (let i = 0; i < this.robots_amount ; i++){
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
      return true
  }
}
  */