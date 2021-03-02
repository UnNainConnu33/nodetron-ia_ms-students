import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'

import { state } from '../../models/state'

/**
 * call "MSB.MoveTo" '{ "id_X_Y" : [[id,X,Y],[id,X,Y],...] }' (To try with npm run repl)
 * 
 * call "MSB.MoveTo" '{ "id_X_Y" : [[0,2,0],[1,1,0],[2,2.5,1],[3,2.5,-1],[4,2.5,1.5],[5,2.5,0.5]] }'
 * call "MSB.MoveTo" '{ "id_X_Y" : [[0,0,4],[1,0,3],[2,0,2],[3,0,1],[4,0,-1],[5,0,-2]] }'
 */

export default class MoveTo extends Strategies {
  name = 'MoveTo';

  public constructor( public id_X_Y: number[][] ) {
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

      for(let i = 0; i < 6; i++){ // Pour chaque tableau [id,X,Y] :
        if(ctx.params.id_X_Y[i]){ // si le tableau existe
          state.assign.register(ctx.params.id_X_Y[i], new MoveTo(ctx.params.id_X_Y))
        }
      }
    },
  }

  compute(broker: ServiceBroker): boolean {

    const ball = state.world.ball

    for(let i = 0; i < 6; i++){ 

      if(this.id_X_Y[i]){ 
        void broker.call('control.moveTo', {
          id: this.id_X_Y[i][0],
          target: {x: this.id_X_Y[i][1] + ball.position.x, y: this.id_X_Y[i][2] + ball.position.y} ,
          orientation: 0,
        } as MoveToMessage)
      }
    }
      return true
  }
}