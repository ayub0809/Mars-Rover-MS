import React, {Component} from 'react';
import './css-project/pathFinder.css';
import Node from './Node.js'
import {bfs, getShortestPath} from './Algos/bfs';
import {dfs, getPathDFS} from './Algos/dfs';
import {aStar, getPathAStar} from './Algos/aStar';
import {dijkstra, getPathDijkstra} from './Algos/dijkstra';
 
let sr=12;
let sc=10;
let fr=12;
let fc=30;
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
            addWeight:false,
            pathLength:0,
            isAnimationActive:false
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
        if(this.state.isAnimationActive===false)
        {
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
                const newNode={
                    ...node,
                    isWeighted:!node.isWeighted
                }
                newGrid[r][c]=newNode;
            }
            
            else
            {
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
    }
    
    handleMouseEnter(r,c)
    {
        if(this.state.mouse===false)
            return;
        const newGrid=this.state.grid.slice();
        const node=newGrid[r][c];
        if(node.isStart||node.isFinish)
            return;
        if(this.state.changeStart===true)
            {
                newGrid[sr][sc].isStart=false;
                node.isStart=true;
                node.isWall=false;
                sr=r;
                sc=c;
            }
        else if(this.state.changeFinish===true)
            {
                newGrid[fr][fc].isFinish=false;
                node.isFinish=true;
                node.isWall=false;
                fr=r;
                fc=c;
            }
        else if(this.state.addWeight===true)
        {
            const newNode={
                ...node,
                isWeighted:!node.isWeighted,
            }
            newGrid[r][c]=newNode;
        }
        else 
        {
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
            mouse: false
        });
    }
    
    toggleW()
    {
        this.setState({
            addWeight: !(this.state.addWeight)
        })
    }

    animatePath(path)
    {
        path.reverse();
        for(let i=1;i<path.length-1;i++)
            {
                const node=path[i];
                setTimeout(()=>{
                    document.getElementById(`node-${node.row}-${node.col}`).className='node node-shortest-path';
                },10*i);
            }
        this.setState({
            isAnimationActive:false,
        })
    }
    
    animateVisited(order, path, start, finsh)
    {
        for (let i=1; i<order.length; i++)
            {
                if(i===order.length-1)
                    {
                        setTimeout(()=>{
                            this.animatePath(path);
                        }, 10*i);
                        return ;
                    }
                const node=order[i];
                setTimeout(()=>{
                    document.getElementById(`node-${node.row}-${node.col}`).className="node node-visited";
                }, 10*i);
            }
    }
    
    visualiseBFS()
    {
        this.setState({
            isAnimationActive:true
        })
        const grid=this.state.grid.slice();
        const start=grid[sr][sc];
        const finish=grid[fr][fc];
        const order=bfs(grid, start, finish);
        const objBFS= getShortestPath(grid, start, finish);
        const path=objBFS.shortestPath;
        this.animateVisited(order, path, start, finish);
        this.setState({
            pathLength:objBFS.pathLength,
        })
    }
    
    visualiseDFS()
    {
        this.setState({
            isAnimationActive:true
        })
        const grid=this.state.grid.slice();
        const start=grid[sr][sc];
        const finish=grid[fr][fc];
        const temp=dfs(grid, start, finish);
        const order= temp.order;
        const objDFS= getPathDFS(grid, start, finish);
        const path=objDFS.path;
        this.animateVisited(order, path, start, finish);
        this.setState({
            pathLength:objDFS.pathLength,
        });
    }
    
    visualiseAStar()
    {
        this.setState({
            isAnimationActive:true
        })
        const grid=this.state.grid.slice();
        const start=grid[sr][sc];
        const finish=grid[fr][fc];
        const order= aStar(grid, start, finish);
        const objAStar=getPathAStar(grid, start, finish);
        const path=objAStar.path;
        this.animateVisited(order, path, start, finish);
        this.setState({
            pathLength:objAStar.pathLength,
        })
    }

    visualiseDijkstra()
    {
        this.setState({
            isAnimationActive:true
        })
        const grid=this.state.grid.slice();
        const start=grid[sr][sc];
        const finish=grid[fr][fc];
        const order= dijkstra(grid, start, finish);
        const objDijkstra= getPathDijkstra(finish);
        const path=objDijkstra.path;
        this.animateVisited(order, path, start, finish);
        this.setState({
            pathLength:objDijkstra.pathLength,
        })
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
                pathLength:0
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
            this.setState({pathLength:0});
            for (let i=0;i<25;i++)
            {
                for( let j=0;j<40;j++)
                document.getElementById(`node-${i}-${j}`).classList.remove("node-shortest-path", "node-visited")
            }
        }
        
    }
    
    render (){
        const grid = this.state.grid;
        return(
            <div>
                <div class="row">
                    <h1>Mars Curiosity Rover</h1>

                </div>
                <div className="row">
                    <div class="col span-1-of-4">
                        <button 
                        onClick = {() => this.visualiseBFS() }>
                        BFS
                        </button>
                        <button 
                            onClick = {() => this.visualiseDFS() }>
                            DFS
                        </button>
                        <button
                            onClick={()=>this.visualiseAStar()}>
                            AStar
                        </button>
                        <button
                            onClick={()=>this.visualiseDijkstra()}>
                            Dijkstra
                        </button>
                        <button
                            onClick = {() => this.resetGrid()}
                        >
                            Reset
                        </button>
                        <button
                        onClick={()=>this.toggleW()}>
                            Weight/Wall
                        </button>
                        <button
                        onClick={()=>this.resetPath()}>
                            Reset Path
                        </button>
                        <div className="pathLength">
                            Path length: {this.state.pathLength}
                        </div>
                    </div>
            
                <div className = "grid col span-3-of-4">
                    {grid.map((row, rowInd) =>{
                        return(
                            <div key = {rowInd} >
                                {row.map((node, ind)=>{
                                    const {val, row, col, isStart, isFinish, isWall,isWeighted, isVisited, inPath} = node;
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
    return {
        val: 50*row+col,
        row,
        col,
        isStart: (row===sr && col===sc)?true:false,
        isFinish: (row===fr && col===fc)? true:false,
        isWall: false,
        isVisited: false,
        prev:null,
        inPath: false,
        isWeighted:false,
        g:Infinity,
        distance:Infinity
    };
}
 
