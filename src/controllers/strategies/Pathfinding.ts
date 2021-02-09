import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sin, cos, pi, sqrt, square, i } from 'mathjs'
import { Vector } from '../../../../nodetron-math/src/Vector2D'

/**
 * This script allows a robot to go to a certain point, avoiding obstacles around him.
 * call "MSB.pathfinding" ' { "id" : 0, "point" : {"x": 1,"y": 0} }'
 */

class Tile {
  value?: number; // value = startDistance + endDistance
  isObstructed: boolean;  // if there is an obstacle on the tile
  parent?: Tile;  // the previous tile that's lead to this actual tile
  startDistance?: number;  // distance between the start and this tile
  endDistance?: number;  // estimated distance between this tile and the end, pythagorean distance squared
  x: number;  // x position
  y: number;  // y position
  
  discovered: boolean = false;

  constructor(x: number, y: number, isObstructed: boolean ){
    this.x = x;
    this.y = y;
    this.isObstructed = isObstructed
  }
}

export default class Pathfinding extends Strategies {
  name = 'pathfinding';

  public constructor(public id: number, public point: Vector) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      id: {
        type: 'number', min: 0, max: 16,
      },

      point: {
        type: 'object'
      }  
    },

    handler(ctx: Context<{ id: number, point: Vector }>): void {
      ctx.broker.logger.info('MoveToPacket packet received')
      state.assign.register([ctx.params.id], new Pathfinding(ctx.params.id, ctx.params.point))
    },  
  }
  
  public distance(p1: Vector, p2: Vector): number {
    return (Math.sqrt((p1.x - p2.x) **2) + ((p1.y - p2.y) **2))
  }

  public Grid(NbColumns: number, NbRows: number, SpaceBetRobots: number){
    // Columns: i <=> x   Rows: j <=> y (x,y) is continuous and (i,j) is discreet

    // Ratio between continuous and discreet value ratio = (x,y)/(i,j)
    let XIRatio = state.world.field.length/NbColumns
    let YJRatio = state.world.field.width/NbRows
    
    // Obstacle list creation
    let ObstacleList: number[][] = [] // of the form [[x, y, radius], [x, y, radius], ... [x, y, radius]] (radius in meter)
        ObstacleList.push([state.world.ball.position.x , state.world.ball.position.y , state.world.ball.radius + state.world.robots.allies[this.id].radius + SpaceBetRobots])
    
    for(let ID = 0; ID < state.world.robots.opponents.length ; ID++){
      ObstacleList.push([state.world.robots.opponents[ID].position.x , state.world.robots.opponents[ID].position.y , state.world.robots.opponents[ID].radius + state.world.robots.allies[this.id].radius + SpaceBetRobots])
    }
    
    for(let ID = 0; ID < state.world.robots.allies.length; ID++){
      
      if (ID != this.id ) {
        ObstacleList.push([state.world.robots.allies[ID].position.x , state.world.robots.allies[ID].position.y , state.world.robots.allies[ID].radius + state.world.robots.allies[this.id].radius + SpaceBetRobots])
      }
    }

    // random: ObstacleList.push()     state.world.robots.allies[ID]       Tile[][] = []
    console.log(ObstacleList)
    
    // Obstacle generation
    let BlackListI: number[][] = []
    let BlackListJ: number[][] = []
    
    for(let Obstacle of ObstacleList) {
      let XInterval = [Obstacle[0] - Obstacle[2], Obstacle[0] + Obstacle[2]]
      let YInterval = [Obstacle[1] - Obstacle[2], Obstacle[1] + Obstacle[2]]
      
      let IInterval = [Math.floor(XIRatio/XInterval[0]), Math.ceil(XIRatio/XInterval[1])]
      let JInterval = [Math.floor(YJRatio/YInterval[0]), Math.ceil(YJRatio/YInterval[1])]

      BlackListI.push(IInterval)
      BlackListJ.push(JInterval)
    }

    // grid creation and filling

    let grid: Array<Array<Tile>>  = new Array();

    for(let i = 0; i < NbColumns; i++){
      grid[i] = new Array();
      for(let j = 0; j < NbRows; j++){
        for(let IInterval of BlackListI){
          for(let JInterval of BlackListJ){
            if (i > IInterval[0] && i < IInterval[1] && j > JInterval[0] && j < JInterval[1]) {
              grid[i][j] = new Tile(i, j, true);
            }
            else{
              grid[i][j] = new Tile(i, j, false);
            }
          }
        }
      }
    }
  } 

  public Astar(grid: Array<Array<Tile>>, robotPosition: Vector, destination: Vector){
    // reference : https://hurna.io/fr/academy/algorithms/maze_pathfinder/a_star.html
    let priority_queue: Array<Tile> = new Array();

    let startTile: Tile = grid[robotPosition.y][robotPosition.x];
    let endTile: Tile = grid[destination.y][destination.x];

    startTile.endDistance = Math.abs(endTile.x - startTile.x) ** 2 + Math.abs(endTile.y - startTile.y) ** 2
    startTile.startDistance = 0

    priority_queue.push(startTile)

    while (priority_queue.length > 0){

      // find the tile with the lowest value
    
      let minIndex: number = 0;
      let i: number = 0;
      priority_queue.forEach(tile => {
        if (minIndex > tile.value){
          minIndex = i;
        }
        i++;
      });
      
      let actualTile:Tile = priority_queue.splice(minIndex, 1)[0]

      // unvisited neighbors

      let shifts: number[][] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      let unvisitedNeighbors: Array<Tile> = new Array();
      shifts.forEach(shift => {
        let neighborX = actualTile.x + shift[0];
        let neighborY = actualTile.y + shift[1];
      
        if (0 <= neighborX < grid[actualTile.x][actualTile.y].length && 0 <= neighborY < grid[actualTile.x][actualTile.y].length && !grid[neighborY][neighborX].discovered){
          unvisitedNeighbors.push(grid[neighborY][neighborX])
        }
      });
      
      
      // iterate over unvisited neighbors

      unvisitedNeighbors.forEach(Neighbor => {
        Neighbor.startDistance
      });


      
      
    }

    
    
  }

  compute(broker: ServiceBroker): boolean {

    const epsilon = 0.2
    // we collect the position of the ball and the other robots
    let ball = state.world.ball
    let allies = state.world.robots.allies
    let opponents = state.world.robots.opponents

    // we declare an array, in which we'll put all the coordinates of the robots and the ball
    let positions = new Array()

    for (let i = 0; i < allies.length && i < opponents.length ; i++) {
      positions.push(allies[i].position, opponents[i].position, ball.position)
    }

    // broker.logger.info(position)

    // we define the number of columns and rows
    let rows = 6
    let cols = 9

    let grid = new Array()
    broker.logger.info(grid)

    /*
    if( (Math.abs(positions[i].x - this.point.x) < epsilon) && (Math.abs(positions[i].y - this.point.y) < epsilon) ) { 

      }
      */ 

    void broker.call('control.moveTo', {
      id: this.id, 
      target: { x: this.point.x, y: this.point.y},
      orientation: 0,
    } as MoveToMessage)

    return true
  }
}
