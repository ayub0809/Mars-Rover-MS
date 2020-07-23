/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Component} from 'react';
import './css-project/pathFinder.css';
import Node from './Node.js'
import {bfs} from './Algos/bfs';
import {dfs} from './Algos/dfs';
import {aStar} from './Algos/aStar';
import {dijkstra} from './Algos/dijkstra';
import {getPath} from './Algos/getPath'
import mars_rover from './mars_rover.png'
import {IntermediateNode} from './Algos/IntermediateNode'
 
let sr=12; //row index of start node
let sc=10; //column index of start node
let fr=12; //row index of finish node
let fc=30; //column index of finish node
let fr2=-1; //row index of second finish node
let fc2=-1; //column index of second finish node
let cross_button="";

export default class PathFinder extends Component
{
    constructor()
    {
        super();
        this.state={
            grid: this.setGrid(),
            mouse:false,
            changeStart: false,
            changeFinish: false,
            changePlant: false,
            addWeight:false,
            pathLength:0,
            isAnimationActive:false,
            whichAlgo:null,
            visualiseMessage:"Select Algorithm",
            isPlantFinish:false,
            PlantMessage:"Add Plant",
            isPlantPresent:false,
            infoMessage:"Welcome to the Mars Curiosity Rover!",
            weightMessage:"Add Weights",
            
        };

        this.animatePath=this.animatePath.bind(this);
    }
    
    setGrid()
    {
        const grid=[];
        for (let i=0;i<25;i++)
            {
                const curr_row=[];
                for(let j=0;j<40;j++)
                    curr_row.push(newNode(i,j));
                
                grid.push(curr_row);
            }
        return grid;
    }

    handleMouseDown(r,c)
    {
        if(this.state.isAnimationActive===true)
        return;
        const newGrid=this.state.grid.slice();
        const node=newGrid[r][c];
        if(node.isStart===true)
            {
                this.setState({
                    changeStart:true,
                    mouse:true
                });
                return;
            }

        if(node.isPlant===true)
        {
            this.setState({
                changePlant:true,
                mouse:true
            })
            return;
        }
        
        if(node.isFinish===true)
            {
                this.setState({
                    changeFinish:true,
                    mouse:true
                });
                return;
            }

        if(this.state.addWeight===true)
        {
            if(node.isWall===true)
            {
                node.isWall=false
            }
            const newNode={
                ...node,
                isWeighted:!node.isWeighted
            }
            newGrid[r][c]=newNode;
        }
        
        else
        {
            if(node.isWeighted===true)
                node.isWeighted=false;
            
            const newNode={
                ...node,
                isWall:!node.isWall
            }
            newGrid[r][c]=newNode;
        }
        this.setState({
            grid:newGrid,
            mouse:true
        });
        
    }
 
    handleMouseEnter(r,c)
    {
        if(this.state.mouse===false)
        return;  
        const newGrid=this.state.grid.slice();
        const node=newGrid[r][c];
        if(node.isStart||node.isFinish||node.isPlant)
            return;
        if(this.state.changeStart===true)
            {
                newGrid[sr][sc].isStart=false;
                node.isStart=true;
                //node.isWall=false;
                //node.isWeighted=false;
                sr=r;
                sc=c;
            }
        else if (this.state.changePlant===true)
            {
                newGrid[fr2][fc2].isPlant=false;
                node.isPlant=true;
                //node.isWall=false;
                //node.isWeighted=false;
                fr2=r;
                fc2=c;
            }
        else if(this.state.changeFinish===true)
            {
                newGrid[fr][fc].isFinish=false;
                node.isFinish=true;
                //node.isWall=false;
                //node.isWeighted=false;
                fr=r;
                fc=c;
            }
        else if(this.state.addWeight===true)
            {
                if(node.isWall===true)
                {
                    node.isWall=false;
                }
                const newNode={
                    ...node,
                    isWeighted:!node.isWeighted,
                }
                newGrid[r][c]=newNode;
            }
        else
        {
            if(node.isWeighted===true)
                node.isWeighted=false;
            const newNode={
                ...node,
                isWall: !node.isWall
            }
            newGrid[r][c]=newNode;
        }
          
        this.setState({grid:newGrid});
    }
    
    handleMouseUp(r,c)
    {
        this.setState({
            changeFinish: false,
            changeStart: false,
            changePlant:false,
            mouse: false,
           
        });
    }
    
    toggleW()
    {
        if(this.state.whichAlgo==="BFS"||this.state.whichAlgo==="DFS")
        {
            return;
        }
        if(this.state.addWeight===false)
        this.setState({
            weightMessage:"Back to Walls!"
        });
        if(this.state.addWeight===true)
        this.setState({
            weightMessage:"Add Weights"
        });
        this.setState({
            addWeight: !(this.state.addWeight)
        })

    }

    togglePlant()
    {
        if(this.state.isAnimationActive===true)
        return;
        if(this.state.isPlantPresent===true)
        {
            fr2=-1;
            fc2=-1;
            this.setState({
                PlantMessage:"Add Plant"
            })
        }
        else
        {
            fr2=12;
            fc2=20;
            this.setState({
                PlantMessage:"Remove Plant"
            })
        }
        this.setState({
            isPlantPresent: !this.state.isPlantPresent,
            grid: this.setGrid()
        });
    }

    removeWeights()
    {
        const grid=this.state.grid.slice();
        for(let i=0;i<25;i++)
        {
            for(let j=0;j<40;j++)
            grid[i][j]={
                ...grid[i][j],
                isWeighted:false
            }
        }
        this.setState({grid:grid});
    }

    animatePath(path, additional=0, lastAnimation=true)
    {
        path.reverse();
        let weightedLength=0;
        for(let i=1;i<path.length-1;i++)
            {
                const node=path[i];
                if(node.isStart||node.isFinish||node.isPlant)
                continue;
                if(node.isWeighted===true)
                weightedLength+=4;
                // eslint-disable-next-line no-loop-func
                setTimeout(() => {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
                    this.setState({
                        pathLength: i+additional + weightedLength,
                    });
                }, 50 * i);
            }
            if(lastAnimation===true)
            setTimeout(()=>{
                this.setState({
                    isAnimationActive:false,
                })
            }, 50*(path.length+additional))
    }
    
    animateVisited(order, additional=0)
    {
        for(let i = 1; i< order.length-1; i++)
        {  
            const node = order[i];
            if(node.isStart||node.isFinish||node.isPlant)
                continue;
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited';
            },10 * (i+additional));
        }
    }
    
    setAlgo(algo)
    {
        if(this.state.isAnimationActive===true)
        return;
        this.resetPath();
        if(algo === 'BFS' || algo === 'DFS')
            {
                this.removeWeights();
                cross_button="cross-button";
                this.setState({
                    isWeighted:false,
                    weightMessage:"Add Weights"
                })
            }
        else cross_button="";
        this.setState({
            whichAlgo: algo,
            visualiseMessage: `Visualise ${algo}`
        });
        if(algo==='Dijkstra')
        this.setState({
            infoMessage:"Dijkstra's Algorithm is weighted and guarantees the shortest path!"
        });
        else if(algo==='DFS')
        {
            this.setState({
                infoMessage:"Depth First Search is unweighted and does not guarantee the shortest path!"
            });
        }
        else if(algo==='BFS')
        {
            this.removeWeights();
            this.setState({
                infoMessage:"Breadth First Search is unweighted and guarantees the shortest path!"
            });
        }
        
        if(algo==='A*')
        this.setState({
            infoMessage:"A* Search is weighted and guarantees the shortest path!"
        });
    }

    visualise()
    {
        if(this.state.isAnimationActive === true) 
        return;
        if(this.state.whichAlgo)
        this.setAlgo(this.state.whichAlgo);
        this.setState({
            isAnimationActive:true,
        })
        if(this.state.isPlantPresent===true){
            this.visualiseTwoDest();
            return;
        }

        const grid = this.state.grid.map(a => a.map(b => Object.assign({}, b)));
        const start = grid[sr][sc];
        const finish = grid[fr][fc];
        let order = [];
        const algo = this.state.whichAlgo;
        if(algo === 'BFS')
            order = bfs(grid, start, finish);
        else if(algo === 'DFS')
            order = dfs(grid, start, finish);
        else if(algo === 'Dijkstra')
            order = dijkstra(grid, start, finish);
        else if(algo === 'A*')
            order = aStar(grid, start, finish);
        const path  = getPath(grid, finish);
        this.animateVisited(order, path);
        setTimeout(() =>{
            this.animatePath(path);
        }, 10*order.length);
        
        
    }

    visualiseTwoDest()
    {
        if(this.state.isAnimationActive===true)
        return;
        this.setState({
            isAnimationActive:true,
        })
        const grid=this.state.grid.slice();
        const grid1 = grid.map(a => a.map(b => Object.assign({}, b)));
        const grid2 = grid.map(a => a.map(b => Object.assign({}, b)));
        const start = grid[sr][sc];
        const f1 = grid[fr][fc];
        const f2 = grid[fr2][fc2];
        let order1 = [];
        let order2 = [];
        let path1;
        let path2;
        const algo = this.state.whichAlgo;
        if(IntermediateNode(grid, start, f1, f2) === f1)
        {
            this.setState({
                isPlantFinish:true
            });
            if(algo === 'BFS')
            {
                order1 = bfs(grid1, grid1[sr][sc], grid1[fr][fc]);
                order2 = bfs(grid2, grid2[fr][fc], grid2[fr2][fc2]);
            }
            else if(algo === 'DFS')
            {
                order1 = dfs(grid1, grid1[sr][sc], grid1[fr][fc]);
                order2 = dfs(grid2, grid2[fr][fc], grid2[fr2][fc2]);
            }
            else if(algo === 'Dijkstra')
            {
                order1 = dijkstra(grid1, grid1[sr][sc], grid1[fr][fc]);
                order2 = dijkstra(grid2, grid2[fr][fc], grid2[fr2][fc2]);
            }
            else if(algo === 'A*')
            {
                order1 = aStar(grid1, grid1[sr][sc], grid1[fr][fc]);
                order2 = aStar(grid2, grid2[fr][fc], grid2[fr2][fc2]);
            }            
            
            path1 = getPath(grid1, grid1[fr][fc]);
            path2 = getPath(grid2, grid2[fr2][fc2]);
        }
        else
        {
            this.setState({
                isPlantFinish:false
            });
            if(algo === 'BFS')
            {
                order1 = bfs(grid1, grid1[sr][sc], grid1[fr2][fc2]);
                order2 = bfs(grid2, grid2[fr2][fc2], grid2[fr][fc]);            
            }
            else if(algo === 'DFS')
            {
                order1 = dfs(grid1, grid1[sr][sc], grid1[fr2][fc2]);
                order2 = dfs(grid2, grid2[fr2][fc2], grid2[fr][fc]);            
            }
            else if(algo === 'Dijkstra')
            {
                order1 = dijkstra(grid1, grid1[sr][sc], grid1[fr2][fc2]);
                order2 = dijkstra(grid2, grid2[fr2][fc2], grid2[fr][fc]);
            }
            else if(algo === 'A*')
            {
                order1 = aStar(grid1, grid1[sr][sc], grid1[fr2][fc2]);
                order2 = aStar(grid2, grid2[fr2][fc2], grid2[fr][fc]);           
            } 
            path1 = getPath(grid1, grid1[fr2][fc2]);
            path2 = getPath(grid2, grid2[fr][fc]);
        }
        this.animateVisited(order1);
        this.animateVisited(order2, order1.length);
        setTimeout(() =>{
            this.animatePath(path1, 0 , false);
        }, 10*(order1.length+order2.length) );
        setTimeout(() =>{
            this.animatePath(path2, path1.length);
        }, 10*(order1.length+order2.length) + 50*(path1.length) );
    }

    resetGrid()
    {
        if(this.state.isAnimationActive===false)
        {
            sr=12;
            sc=10;
            fr=12;
            fc=30;
            const grid=this.setGrid();
            this.setState({
                grid:grid,
                pathLength:0,
                visualiseMessage:"Select Algorithm",
                whichAlgo:null,
                infoMessage:"Welcome to the Mars Curiosity Rover!",
                //isAnimationPresent:false
            });

            for (let i=0;i<25;i++)
                {
                    for( let j=0;j<40;j++)
                        document.getElementById(`node-${i}-${j}`).classList.remove("node-shortest-path", "node-visited")
                }
        }
        
    }

    resetPath()
    {
        if(this.state.isAnimationActive===false)
        {
            this.setState({
                pathLength:0,
                visualiseMessage:"Select Algorithm",
                whichAlgo:null,
                infoMessage:"Welcome to the Mars Curiosity Rover!",
            });
            for (let i=0;i<25;i++)
            {
                for( let j=0;j<40;j++)
                document.getElementById(`node-${i}-${j}`).classList.remove("node-shortest-path", "node-visited")
            }
        }
        
    }
    
    render ()
    {
        const grid = this.state.grid;
        return(
                <div>
                    <div className="row clearfix" 
                    onMouseEnter={()=>this.handleMouseUp()}>
                        
                        <img src={mars_rover} alt="Click for Tutorial"></img>
                        <div className="top-nav">
                            <a href="#" className="button-top Reset"
                                    onClick = {() => this.resetGrid()}>
                                    Reset
                            </a>
                            <a href="#" className="button-top ResetPath"
                                onClick={()=>this.resetPath()}>
                                Reset Path
                            </a>
                            <a href="#" className="button-top plant-node"
                                onClick={()=>this.togglePlant()}>
                                {this.state.PlantMessage}
                            </a>   
                            <a href="#" className={`button-top weight-wall ${cross_button}`}
                                onClick={()=>this.toggleW()}>
                                {this.state.weightMessage}
                            </a>                             
                        </div>
                    </div>
                    <div className="row info-message" 
                    onMouseEnter={()=>this.handleMouseUp()}>
                        <p className="info-message">{this.state.infoMessage}</p>
                    </div>
                    <div className="row " onMouseEnter={()=>this.handleMouseUp()}>
                        <div class="col span-1-of-4 " 
                        onMouseEnter={()=>this.handleMouseUp()}>
                            <div className="algo-nav">
                                <h2>Algorithms</h2>
                                <a href="#" className="button-algo AStar"
                                onClick={()=>this.setAlgo('A*')}>
                                A*
                                </a>
                                <a href="#" className="button-algo BFS"
                                onClick = {() => this.setAlgo('BFS') }>
                                Breadth First Search
                                </a>
                                <a href="#" className="button-algo DFS"
                                    onClick = {() => this.setAlgo('DFS') }>
                                    Depth First Search
                                </a>
                                <a href="#" className="button-algo Dijkstra"
                                    onClick={()=>this.setAlgo('Dijkstra')}>
                                    Dijkstra
                                </a>
                            </div>
                            <a href="#" className="button-visualise"
                                onClick={()=>this.visualise()}>
                                {this.state.visualiseMessage}
                            </a>
                            <div className="pathLength">
                            Path Length: {this.state.pathLength}
                            </div>
                        </div>
                
                    <div className = "grid col span-3-of-4">
                        {grid.map((row, rowInd) =>{
                            return(
                                <div key = {rowInd} >
                                    {row.map((node, ind)=>{
                                        const {val, row, col, isStart, isFinish, isWall,isWeighted, isVisited, inPath, isPlant} = node;
                                        return(
                                            <Node
                                                key = {val}
                                                num = {val}
                                                row = {row}
                                                col = {col}
                                                isFinish = {isFinish}
                                                isStart = {isStart}
                                                isWall = {isWall}
                                                isVisited = {isVisited}
                                                isWeighted={isWeighted}
                                                isPlant={isPlant}
                                                onMouseDown = {(r,c)=> this.handleMouseDown(r, c)}
                                                onMouseUp = {(r,c) => this.handleMouseUp(r, c)}
                                                onMouseEnter = {(r,c) => this.handleMouseEnter(r, c)}
                                            />
                                        );
                                            
                                    })}
                                </div>
                            );
                        })}
                    </div>
                    </div>
                </div>
            );
        }

}

const newNode= (row,col)=>{
   /* let inPathNode=null;
    if(this.state.isSecondPresent===true)
    {
        if(this.state.isSecondFinish===true)
        inPathNode=this.state.grid[fr][fc];
        else inPathNode=this.state.grid[fr2][fc2];
    }*/
    return {
        val: 50*row+col,
        row,
        col,
        isStart: (row===sr && col===sc)?true:false,
        isFinish: (row===fr && col===fc)? true:false,
        isPlant:(row===fr2&&col===fc2&&row!==-1&&col!==-1)?true:false,
        isWall: false,
        isVisited: false,
        prev:null,
        isWeighted:false,
        g:Infinity,
        distance:Infinity
    };
}
