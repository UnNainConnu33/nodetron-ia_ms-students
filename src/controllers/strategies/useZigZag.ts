import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'

import { state } from '../../models/state'
import { Vector } from '../../../../nodetron-math/src/Vector2D'

/**
 * It is basic and needs to be improved !
 * call "MSB.useZigZag" '{"id": [1,2]}'
 */

export default class UseZigZag extends Strategies {
  name = 'useZigZag';
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
      state.assign.register([ctx.params.id], new UseZigZag(ctx.params.id))
    },
  }
  public Translation(Vecteur:Vector,Points:Array <{x:number;y:number}>):Array <{x:number;y:number}>{
    // (P,P')=Vecteur
    // OP'-OP=Vecteur
    // P'.x=Vecteur.x+P.x
    // P'.y=Vecteur.y+P.y
    //console.debug('Translation:Points',Points)
    //var P:Array <{x:number;y:number}>=Array.from(Points)
    var P:Array <{x:number;y:number}>=[]
    let i=0
    while(i<Points.length) {
      //P[i]=Points[i]
      P.push({x:Points[i].x,y:Points[i].y})
      i++
    }
    // Points[0].x=333
    // P[0].y=666

//    console.debug('Au milieu de Translation :P:',P)
//    console.debug('Au milieu de Translation :Points:',Points)

    //console.debug('Translation:P',P)
    for(let i=0;i<P.length;i++){
      P[i].x=P[i].x+Vecteur.x
      P[i].y=P[i].y+Vecteur.y
    }
//    console.debug('A la fin de Translation :P:',P)
//    console.debug('A la fin de Translation :Points:',Points)
    return P
    }
    

  compute(broker: ServiceBroker): boolean {
    broker.logger.debug(state.world.ball)
    const robot=state.world.robots.allies[this.id];
    const orientation=robot.orientation
    broker.logger.info(this.name+': id<'+this.id.toString()+'> orientation<'+orientation.toString()+'>')
    

    var DemiTerrain1:[{x:0,y:-0.5},
      {x:0,y:-3},
      {x:4.5,y:-3},
      {x:4.5,y:-1},
      {x:3.5,y:-1},
      {x:3.5,y:1},            
      {x:4.5,y:1},
      {x:4.5,y:3},
      {x:0,y:3},
      {x:0,y:0.5},
    ]
    var DemiTerrain: Array <{x:number;y:number}>= [
      {x:0,y:-0.5},
      {x:0,y:-3},
      {x:4.5,y:-3},
      {x:4.5,y:-1},
      {x:3.5,y:-1},
      {x:3.5,y:1},            
      {x:4.5,y:1},
      {x:4.5,y:3},
      {x:0,y:3},
      {x:0,y:0.5},
    ]
    var A: Array<Vector>= [
      {x:0,y:0},
      {x:0.75,y:1.5},
      {x:1,y:0},
      {x:0.66,y:0.33},
      {x:0.33,y:0.33},
      {x:-0,y:0},
    ]
    var N: Array<Vector>= [ // un caractère doit prendfre 0.9 m Ici il prend 1
      {x:0,y:0},
      {x:0,y:1.5},
      {x:1,y:0},
      {x:1,y:1.5},
      {x:0.9,y:0},
      {x:-0.1,y:1},
      {x:-0,y:0},
    ]
    var O: Array<Vector>= [ // un caractère doit prendfre 0.9 m Ici il prend 1
      {x:0,y:0},
      {x:0.5,y:0},      
      {x:1,y:0.2},
      {x:1,y:1.3},
      {x:0.5,y:1.5},
      {x:0,y:1.3},
      {x:0,y:0.2},
      {x:0.5,y:0},
    ]
    var E: Array<Vector>= [ // un caractère doit prendfre 0.9 m Ici il prend 1
      {x:0,y:0},
      {x:1,y:0},
      {x:1,y:0.2},
      {x:0.1,y:0.2},
      {x:0.2,y:0.6},
      {x:0.8,y:0.6},
      {x:0.8,y:0.8},
      {x:0.1,y:0.8},
      {x:0.1,y:1.5},
      {x:1,y:1.5},
      {x:1,y:1.7},
      {x:-0.1,y:1.7},
      {x:0,y:0},
    ]
    var B: Array<Vector>=[
      {x:0,y:0},
      {x:0,y:1.5},
      {x:1,y:1.5},
      {x:1,y:0.8},
      {x:0.3,y:0.7},
      {x:1,y:0.6},
      {x:1,y:0},
      {x:0,y:0},
    ]  

    var Deux: Array<Vector>=[
      {x:0,y:0},
      {x:0.5,y:0.4},
      {x:0.8,y:0},
      {x:0.4,y:-0.4},
      {x:0,y:-1},
      {x:0.6,y:-1},
      {x:0,y:0},
    ]  
    
    var Zero: Array<Vector>= [ // un caractère doit prendfre 0.9 m Ici il prend 1
      {x:0,y:0},
      {x:0.5,y:0},      
      {x:1,y:0.2},
      {x:1,y:1.3},
      {x:0.5,y:1.5},
      {x:0,y:1.3},
      {x:0,y:0.2},
      {x:0.5,y:0},
    ]

    var Un: Array<Vector>= [ // un caractère doit prendfre 0.9 m Ici il prend 1
      {x:0,y:0},
      {x:0.5,y:0},      
      {x:1,y:0.2},
      {x:1,y:1.3},
      {x:0.5,y:1.5},
      {x:0,y:1.3},
      {x:0,y:0.2},
      {x:0.5,y:0},
    ]


    void broker.call('MSB.zigZag',{
      id:0,
      points: this.Translation({x:-3,y:-3}, Deux),
    }),
    void broker.call('MSB.zigZag',{
      id:1,
      points: this.Translation({x:-3.5,y:-3}, Zero),
    })
    void broker.call('MSB.zigZag',{
      id:2,
      points: this.Translation({x:-2.5,y:-3}, Deux),
    })
    void broker.call('MSB.zigZag',{
      id:3,
      points:this.Translation({x:-1.5,y:-3},Un),
    })
    void broker.call('MSB.zigZag',{
      id:4,
      points:this.Translation({x:-0.5,y:-3},E),
    })

    var X=this.Translation({x:-2.5,y:-3},N)
    broker.logger.info(this.name+': id<'+this.id.toString()+'> Premier point de la lettre X:<'+X[0].x+','+X[0].y+'>')

    // void broker.call('MSB.zigZag',{
    //   id:0,
    //   points:N,
    // } as Control)

    // void broker.call('MSB.turnUntilTargetInSight', { // return false :OK && return true : sans effet
    //     id: this.id,
    // } as Control)

    // void broker.call('MSB.turn', { // return false :OK && return true : sans effet
    //   id: this.id,
    // } as Control)    
    // void broker.call('MSB.turn', { // return false :OK && return true : sans effet
    //   id: this.id+1,
    // } as Control)

    
    // void broker.call('bots-control.moveTo', { // return true :OK
    //     id: this.id,
    //     target: { x: -0.75, y: -0.75 },
    //     orientation: -3.14,
    //     expectedReachTime: 10,
    //   } as MoveToPacket)

    // void broker.call('bots-gateway.control', { // return true :OK
    //     id: this.id,
    //   yellow: true,
    //   velocity:{
    //       normal:0,
    //       angular:0,
    //       tangent:1,
    //   },
    // } as Control)


    return false
  }
}