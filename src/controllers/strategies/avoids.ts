import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sin, cos, pi, sqrt, square } from 'mathjs'


/**
 * Ce script permet à un robot donné d'aller à une position relative d'un autre robot(adverse)
 * call "MSB.avoids" ' { "ids" : [1,2,0.5] }'
 */
export default class Avoids extends Strategies {
  name = 'avoids';

  public constructor(public ids: Array<number>) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      ids: {
        type: 'array', items: 'number', min: 3, max: 3,
      },//ID du robot à déplacer, ID du robot à rejoindre et distance au robot
      
    },
    handler(ctx: Context<{ ids: Array<number> }>): void {
      ctx.broker.logger.info('MoveToPacket packet received')
      state.assign.register(
        ctx.params.ids, 
        new Avoids(ctx.params.ids)
      )
    },

    
  }
  
  compute(broker: ServiceBroker): boolean {
    
    function dist(X:number,Y:number,E:Array<number>) {
      //calcule la distance entre le points de coordonnées X,Y et la droite d'équation E
      var a = E[0]
      var b = E[1]
      var c = E[2]
      var distance = (a*X+b*Y+c)/(sqrt(square(a)+square(b)))
    return distance
  }

    function equacart(Xf:number,Yf:number,ID:number) {
      //donne l'équation cartesienne de la droite entre un robot(ID) 
      //et un point(Xf;Yf)
      //la sortie est de la forme [a,b,c] avec ax+by+c = 0

      var X0 = state.world.robots.allies[ID].position.x
      var Y0 = state.world.robots.allies[ID].position.y
      if (X0 == Xf){ //vérifie si la droite n'est pas "vertical"
        var out = [-1,0,X0]
        
      } else {
        var a = (Yf-Y0)/(Xf-X0)
        var b = -1
        var c = Y0-(a*X0)
        var out = [a,b,c]
      }
      return out

    }

    function test1() {
      var pas = 0
      var robocoord = []
      for (pas = 0;pas <5; pas++){
        var X = state.world.robots.allies[pas].position.x
        var Y = state.world.robots.allies[pas].position.y
        var L = [X,Y,pas]
        var NewLength = robocoord.push(L)
        }
      broker.logger.info(robocoord)
      }
    
    const t1 = Date.now()
    const robot = state.world.robots.allies[this.ids[1]]
    const Xop = robot.position.x
    const Yop = robot.position.y
    const angle = robot.orientation
    const distance = this.ids[2]
    const X = Xop + (distance* cos(angle))
    const Y = Yop + (distance* sin(angle))
    broker.logger.info(dist(3,7,[2,-1,-1]))
    void broker.call('control.moveTo', {
      id: this.ids[0],
      target: { x: X, y: Y },
      orientation: angle+pi,
    } as MoveToMessage)
    const t2 = Date.now()
    const t = t2-t1
    broker.logger.info(t)
    return true
  }
}