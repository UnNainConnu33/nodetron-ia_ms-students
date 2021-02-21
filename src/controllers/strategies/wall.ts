import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sqrt, square, abs, sign, sin, cos, pi, number } from 'mathjs'
import { Kick } from '@nodetron/types/enum'
import { Vector} from '../../../../nodetron-math/src/Vector2D'

/**
 * call "bots-placement" '{"formation": "ultra defense"}'
 * call "MSB.Wall" ' { "shooter" : 5, "wall" : [0,1,2,3,4]}'
 */
export default class Wall extends Strategies {
  name = 'Wall';

  public constructor(public shooter: number, public wall: Array<number>) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      shooter: {
        type: 'number', min: 0, max: 15,
      },

      wall: {
        type: 'array', items: 'number', min: 0, max: 6
      }
    },
    handler(ctx: Context<{ shooter: number, wall: Array<number> }>): void {
      ctx.broker.logger.info('MoveToPacket packet received')
      state.assign.register(
        [ctx.params.shooter], 
        new Wall(ctx.params.shooter, ctx.params.wall)
      )
    },
  }
  public step = 2

  compute(broker: ServiceBroker): boolean {
      const robot = state.world.robots.allies[this.shooter]
      const { ball } = state.world
      let target = ball.position 
      let orientation = 0
      const goalCenter =  new Vector(-(state.world.field.length / 2.0), 0)
      const target2Ball= new Vector (ball.position.x - goalCenter.x, ball.position.y - goalCenter.y)
      const norm = Math.sqrt(target2Ball.x ** 2 + target2Ball.y ** 2)
      target2Ball.x /= norm
      target2Ball.y /= norm
      switch (this.step) {
        case 1:
          target.x += target2Ball.x * 0.5
          target.y += target2Ball.y * 0.5
          orientation = Math.atan2(-target2Ball.y, -target2Ball.x)
          const dist = Math.sqrt(((target.x - robot.position.x) ** 2 - (target.y - robot.position.y) ** 2))
          if (dist < 0.01) {
            this.step += 1
          }
          break
        case 2:
          orientation = Math.atan2(-target2Ball.y, -target2Ball.x)

          target.x -= 0.1 * target2Ball.x
          target.y -= 0.1 * target2Ball.y
        
          if (robot.infrared) {
            this.step += 1
          }
          break
        default:
          broker.logger.error('Not implemented')
      }

    void broker.call('control.moveTo', {
      id: this.shooter,
      target: {x: ball.position.x, y: ball.position.y},
      spin: false,
      power: 0.8,
      orientation,
      kick: Kick.CHIP,
    } as MoveToMessage)

  void broker.call('control.moveTo', {
    id: this.wall[0],
    kick: Kick.NO, 
    spin: false,
    power: 0,
    target: { x: 0, y: 0.4},
    orientation: 0,
  } as MoveToMessage)

  void broker.call('control.moveTo', {
    id: this.wall[1],
    kick: Kick.NO, 
    spin: false,
    power: 0,
    target: { x: 0, y: 0.2 },
    orientation: 0,
  } as MoveToMessage)

  void broker.call('control.moveTo', {
    id: this.wall[2],
    kick: Kick.NO, 
    spin: false,
    power: 0,
    target: { x: 0, y: 0 },
    orientation: 0,
  } as MoveToMessage)

  void broker.call('control.moveTo', {
    id:this.wall[3],
    kick: Kick.NO, 
    spin: false,
    power: 0,
    target: { x: 0, y: -0.2 },
    orientation: 0,
  } as MoveToMessage)

  void broker.call('control.moveTo', {
    id: this.wall[4],
    kick: Kick.NO, 
    spin: false,
    power: 0,
    target: { x: 0, y: -0.4 },
    orientation: 0,
  } as MoveToMessage)

  return true
  // return this.step === 3        // continue comme return false
  }
}


    