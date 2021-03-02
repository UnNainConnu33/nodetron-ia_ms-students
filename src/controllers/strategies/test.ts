import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sqrt, square, abs, sign, sin, cos, pi, number } from 'mathjs'


/*
 * call "MSB.Test" '{ "robots_amount" : 6, "radius" : 0.5}'
*/ 

export default class Test extends Strategies {
  name = 'Test';

  public constructor(public robots_amount: number, public radius: number) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {

      robots_amount: {
        type: 'number', min: 2, max: 6
      },

      radius: { 
          type: 'number' , min: 0.2, max: 4,
      },
    },

    handler(ctx: Context<{robots_amount: number, radius: number}>): void {
        ctx.broker.logger.info('MoveToPacket packet received')
        state.assign.register([ctx.params.robots_amount, ctx.params.radius], 
            new Test(ctx.params.robots_amount,ctx.params.radius))
    },
  }


  compute(broker: ServiceBroker): boolean {

      const shifts_2 = [[0, this.radius], [0, -this.radius]]

      const shifts_4 = [[0, this.radius], [0, -this.radius], [this.radius, 0], [-this.radius, 0]]

      for (let i = 0; i < this.robots_amount ; i++){
        switch (this.robots_amount) {
          case 4:
            void broker.call('control.moveTo', {
              id: i,
              //target: {x: cos(2 * pi / this.robots_amount * i) * this.radius + state.data.ball.position.x, 
                     // y: sin(2 * pi / this.robots_amount * i) * this.radius + state.data.ball.position.y},
              target: {x: shifts_4[i][0] + state.world.ball.position.x, y: shifts_4[i][1] + state.world.ball.position.y},
              orientation: 0,
          } as MoveToMessage)
              break

          case 2:
            void broker.call('control.moveTo', {
              id: i,
              //target: {x: cos(2 * pi / this.robots_amount * i) * this.radius + state.data.ball.position.x, 
                     // y: sin(2 * pi / this.robots_amount * i) * this.radius + state.data.ball.position.y},
              target: {x: shifts_2[i][0] + state.world.ball.position.x, y: shifts_2[i][1] + state.world.ball.position.y},
              orientation: 0,
          } as MoveToMessage)
              break
      }
    }
      return true
  }
}



