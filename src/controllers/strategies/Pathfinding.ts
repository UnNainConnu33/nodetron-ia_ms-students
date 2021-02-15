import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { state } from '../../models/state'
import { sin, cos, pi, sqrt, square, i, not } from 'mathjs'
import { Vector } from '../../../../nodetron-math/src/Vector2D'

/**
 * This script allows a robot to go to a certain point, avoiding obstacles around him.
 * call "MSB.pathfinding" ' { "id" : 0, "point" : {"x": 1,"y": 0} }'
 */

class Tile {
  value?:number; // value = startDistance + endDistance
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
      ctx.broker.logger.info('Obstacle avoidance algorithm')
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
    console.log(ObstacleList);
    
    // Obstacle generation
    let BlackList: number[][][] = [];
    
    for(let Obstacle of ObstacleList) {
        let XInterval = [Obstacle[0] - Obstacle[2], Obstacle[0] + Obstacle[2]];
        let YInterval = [Obstacle[1] - Obstacle[2], Obstacle[1] + Obstacle[2]];
        
        let IInterval = [Math.floor(XIRatio / XInterval[0]), Math.ceil(XIRatio / XInterval[1])];
        let JInterval = [Math.floor(YJRatio / YInterval[0]), Math.ceil(YJRatio / YInterval[1])];

        BlackList.push([IInterval,JInterval]);
    }

    // grid creation and filling

    let grid: Array<Array<Tile>>  = new Array();

    for(let i = 0; i < NbColumns; i++){
      grid[i] = new Array();
      for(let j = 0; j < NbRows; j++){
        for(let Interval of BlackList){
          let IInterval = Interval[0]; let JInterval = Interval[1];
          if (i > IInterval[0] && i < IInterval[1] && j > JInterval[0] && j < JInterval[1]) {
            grid[i][j] = new Tile(i, j, true);
          }
          else{
            grid[i][j] = new Tile(i, j, false);
          }
        }
      }
    }
    return grid
  } 

  public Astar(grid: Array<Array<Tile>>, robotPosition: Vector, destination: Vector){
    // reference : https://hurna.io/fr/academy/algorithms/maze_pathfinder/a_star.html
    let priority_queue: Array<Tile> = new Array();

    let startTile: Tile = grid[robotPosition.y][robotPosition.x];
    let endTile: Tile = grid[destination.y][destination.x];

    startTile.endDistance = Math.sqrt((endTile.x - startTile.x) ** 2 + (endTile.y - startTile.y) ** 2);
    startTile.startDistance = 0;
    startTile.value =  startTile.endDistance;

    priority_queue.push(startTile)
    //last_path: [Tile];
    //let last_path: [Tile] = [Tile.constructor(0,  0,  false)];
    //let done: boolean = false;
    while (priority_queue.length > 0){

      // find the tile with the lowest value
    
      let minIndex: number = 0;
      let i: number = 0;
      priority_queue.forEach(tile => {
        try {
          if (tile.value != undefined && minIndex > tile.value) {
            minIndex = i;
          }
          i++;
        } // sûrement overkill
        catch {        
          i++;
        }
      });
      
      let actualTile: Tile = priority_queue.splice(minIndex, 1)[0]

      // unvisited neighbors

      // const unvisitedNeighbors = neighbor.filter(node => !node.visited)

      let shifts: number[][] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      let unvisitedNeighbors: Array<Tile> = new Array();
      shifts.forEach(shift => {
        let neighborX = actualTile.x + shift[0];
        let neighborY = actualTile.y + shift[1];

        if (neighborX == destination.x && neighborY == destination.y){
          // finished// TO DO
            let finished_path: [Tile] = [Tile.constructor(actualTile.x + shift[0], actualTile.y + shift[1], false)];
            while (finished_path[-1] != startTile) {
                let parent_tile = finished_path[-1].parent;
                if (parent_tile != undefined && parent_tile.parent != undefined) {
                    finished_path.push(parent_tile.parent);
                }
            }
            //last_path = finished_path;
            //done = true;
            return finished_path;
        }

        /*

        f(n) = total estimated cost of path through node nn

        g(n) = cost so far to reach node nn

        h(n) = estimated cost from n to goal. This is the heuristic part of the cost function, so it is like a guess.

               if not:    
           put the current node in the closed list and look at all of its neighbors
           for (each neighbor of the current node):
               if (neighbor has lower g value than current and is in the closed list) :
                   replace the neighbor with the new, lower, g value 
                   current node is now the neighbor's parent            
               else if (current g value is lower and this neighbor is in the open list ) :
                   replace the neighbor with the new, lower, g value 
                   change the neighbor's parent to our current node

               else if this neighbor is not in both lists:
                   add it to the open list and set its g

        */
     
        if ((0 <= neighborX && neighborX < grid[0].length) && (0 <= neighborY && neighborY < grid.length) && !grid[neighborY][neighborX].discovered){
            grid[neighborY][neighborX].parent = grid[actualTile.y][actualTile.x];
            unvisitedNeighbors.push(grid[neighborY][neighborX]);
        }
      });
      
      // iterate over unvisited neighbors

      unvisitedNeighbors.forEach(Neighbor => {
		  Neighbor.startDistance = sqrt((Neighbor.x - startTile.x)**2 + (Neighbor.y - startTile.y)**2);
		  Neighbor.endDistance = sqrt((Neighbor.x - endTile.x) ** 2 + (Neighbor.y - endTile.y) ** 2);

		  Neighbor.value = Neighbor.startDistance + Neighbor.endDistance;

		  priority_queue.push(Neighbor);
      });
    }
    
    // endTile.parent
    
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
    let grid = this.Grid(50, 90, 0.1);
    broker.logger.info(grid);
    let robotpos = state.world.robots.allies[this.id].position;
    let trajectory = this.Astar(grid,robotpos,Vector.constructor(1,1))
    broker.logger.info(trajectory);
    //let grid = new Array()
    // broker.logger.info(grid)

    /*
    if( (Math.abs(positions[i].x - this.point.x) < epsilon) && (Math.abs(positions[i].y - this.point.y) < epsilon) ) { 

      }
      */ 

    /*
    void broker.call('control.moveTo', {
      id: this.id, 
      target: { x: this.point.x, y: this.point.y},
      orientation: 0,
    } as MoveToMessage)
    */
   
    return false
  }
}
