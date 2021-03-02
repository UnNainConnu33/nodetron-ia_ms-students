import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'

import { state } from '../../models/state'


/**
 * call "MSB.ball" '{ "robots_amount" : 5, "opponent_id" : 0, "radius" : 1}'
 */
export default class MoveTo extends Strategies {
  name = 'MoveTo';

  public constructor(public robots_amount: number, public opponent_id:number, public radius: number) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      robots_amount: {
        type: 'number', min: 1, max: 10,
      },
      opponent_id: {
        type: 'number', min: 0, max: 15,
      },
      radius: {
        type: 'number', min: 0.1, max: 10,
      },
    },
    handler(ctx: Context<{robots_amount: number, opponent_id: number, radius: number}>): void {

        state.assign.register([ctx.params.robots_amount, ctx.params.opponent_id, ctx.params.radius], 
            new MoveTo(ctx.params.robots_amount, ctx.params.opponent_id, ctx.params.radius))
    },
  }

  compute(broker: ServiceBroker): boolean {

      for (let i = 0; i < this.robots_amount; i++){
        void broker.call('control.moveTo', {
            id: i,
            target: {x: Math.cos(2 * Math.PI / this.robots_amount * i) * this.radius + state.world.robots.opponents[this.opponent_id].position.x, 
                y: Math.sin(2 * Math.PI / this.robots_amount * i) * this.radius + state.world.robots.opponents[this.opponent_id].position.y},
            orientation: 0,
        } as MoveToMessage)
    }

    return true
  }
}

/* Première version du code

import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToPacket } from '@ssl/types/internal/control/packet'
import Strategies from '@ssl/types/internal/task-manager/tasks/strategies'

import { state } from '../../models/GameState'


 * call "MSB.MoveTo" '{ "id_X_Y" : [[id,X,Y],[id,X,Y],...] }' (To try with npm run repl)
 * 
 * call "MSB.MoveTo" '{ "id_X_Y" : [[0,6,0],[1,1,0],[2,2.5,1],[3,2.5,-1],[4,4,1.5],[5,4,0.5],[6,4,-0.5],[7,4,-1.5]] }'
 * call "MSB.MoveTo" '{ "id_X_Y" : [[0,0,4],[1,0,3],[2,0,2],[3,0,1],[4,0,-1],[5,0,-2],[6,0,-3],[7,0,-4]] }'
 * call "MSB.MoveTo" '{ "id_X_Y" : [[0,0,1],[1,0, -1],[2,1,0],[3,-1,0]]}'
 
export default class MoveTo extends Strategies {
  name = 'MoveTo';

  public constructor(public id_X_Y: number[][]) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      id_X_Y: {
        type: 'array', items: {type: 'array', items: 'number', min: 3, max: 3,}, min: 0, max: 99, 
      },
    },
    handler(ctx: Context<{ id_X_Y: number[][]}>): void {
      ctx.broker.logger.info('MoveToPacket packet received')
      for(let i=0; i<8;i++){ // Pour chaque tableau [id,X,Y] :
        //(j'ai mis i<8 car array.length n'a pas fonctionné)
        if(ctx.params.id_X_Y[i]){ // si le tableau existe : 
          state.assign.register(ctx.params.id_X_Y[i], new MoveTo(ctx.params.id_X_Y))
        }
      }
    },
  }

  compute(broker: ServiceBroker): boolean {
      let r = 0.3

      state.world.robots.opponents[0].position

      let shifts = [[0, r], [0, -r], [r, 0], [-r, 0]]

      for (let i = 0; i < 4; i++){
        void broker.call('bots-control.moveTo', {
            id: i,
            target: {x: shifts[i][0] + state.world.robots.opponents[0].position.x, y: shifts[i][1] + state.world.robots.opponents[0].position.y},
            orientation: 0,
            expectedReachTime: 10,
        } as MoveToPacket)
    }

    return true
  }
}

*/