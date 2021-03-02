import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { Vector } from '../../../../nodetron-math/src/Vector2D'

/**
 * This class is an example of the new way to create Strategies.
 * It is basic and needs to be improved !
 * call "MSB.zigZag" ' { "id" : 0, "points" : [{"x":0,"y":0},{"x":1,"y":1},{"x":2,"y":-1},{"x":3,"y":1},{"x":4,"y":-1}] }'
 * call "MSB.zigZag" ' { "id" : 0, "points" : [{"x":0,"y":0},{"x":1,"y":1}] }'
 */

export default class ZigZag extends Strategies {
  name = 'zigZag';

  public constructor(public id: number, public points: Array<Vector>) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      id:{
          type:'number',
      }, 

      points: {
        type: 'array', items: 'object', min: 2, max: 20,
      },
    },

    handler(ctx: Context<{ id: number, points: Array<{x: number,y: number}> }>): void {
      ctx.broker.logger.info('MoveToPacket packet received')
      state.assign.register([ctx.params.id], new ZigZag(ctx.params.id, ctx.params.points))
    },
  }


  public distance(p1: Vector, p2: Vector): number {
    return (Math.sqrt((p1.x - p2.x) **2) + ((p1.y - p2.y) **2))
  }

  public pointProcheDuRobot():number{
    return 1
  }


  compute(broker: ServiceBroker): boolean {
    // broker.logger.info(this.name+': id<' + this.id.toString()+'>. points.length:<' + this.points.length.toString()+'>')
    const epsilon = 0.1
    const robot = state.world.robots.allies[this.id]  
    
    let i = 0
    let found = false

    while( (i <= this.points.length - 1) && !found) {// Est-ce que le robot est sur une (proche d'une) extremité du zigzag ?
      if( (Math.abs(robot.position.x - this.points[i].x) < epsilon) && (Math.abs(robot.position.y - this.points[i].y) < epsilon) ) { 
        found = true    
      }

      else {
        i++
      }
    }

    if(!found) { // on n'est pas sur aucune extrémité du zigzag
      return false // On change rien : donc on continue d'exécuter notre commande !
    }

    else { // On est sur le ième point...
      if(i == (this.points.length - 1)){// ce ième point est le dernier...
        return true //  Sur le dernier point on arrête la commande !
      }  

      else { //  ce ième point n'est pas le dernier point...
      void broker.call('control.moveTo', {
        id: this.id, 
        target: { x: this.points[i+1].x, y: this.points[i+1].y },// on va se diriger vers le (i+1)ème point...
        orientation: 0,
        } as MoveToMessage)
      return false // et on continue !
      }
    }          
  }
}   
