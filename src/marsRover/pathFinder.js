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
            isAnimationActive:false,
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
    }

    
    handleMouseEnter(r,c)
    {
        
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

            else if(this.state.mouse===true)
            {
                if(this.state.addWeight===true)
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
    
    animateVisited(order, path, start, finish)
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

    activateBFS()
    {
        const grid=this.state.grid.map(a=>a.map(b=>Object.assign({},b)));
        const start=grid[sr][sc];
        const finish=grid[fr][fc];
        const order=bfs(grid, start, finish);
        const path= getShortestPath(grid, start, finish);
        this.visualise(order, path, start, finish);
    }
    
    activateDFS()
    {
        const grid=this.state.grid.map(a=>a.map(b=>Object.assign({},b)));
        const start=grid[sr][sc];
        const finish=grid[fr][fc];
        const temp=dfs(grid, start, finish);
        const order= temp.order;
        const path= getPathDFS(grid, start, finish);
        this.visualise(order, path, start, finish);
    }
    
    activateAStar()
    {
        const grid=this.state.grid.map(a=>a.map(b=>Object.assign({},b)));
        const start=grid[sr][sc];
        const finish=grid[fr][fc];
        const order= aStar(grid, start, finish);
        const path=getPathAStar(grid, start, finish);
        this.visualise(order, path, start, finish);
    }

    activateDijkstra()
    {
        const grid=this.state.grid.map(a=>a.map(b=>Object.assign({},b)));
        const start=grid[sr][sc];
        const finish=grid[fr][fc];
        const order= dijkstra(grid, start, finish);
        const path= getPathDijkstra(finish);
        this.visualise(order, path, start, finish);
    }

    visualise()
    {
        /*this.animateVisited(order, path, finish, start);
        this.setState({
            isAnimationActive:true
        })*/
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
    
    render ()
    {
        const grid = this.state.grid;
        return(
                <div>
                    <div class="row ">
                        <h1>Mars Curiosity Rover</h1>

                    </div>
                    <div className="row ">
                        <div class="col span-1-of-4 nav-bar">
                            <div className="Algorithms">
                                <h2>Algorithms</h2>
                                <div className="button BFS"
                                onClick = {() => this.activateBFS() }>
                                BFS
                                </div>
                                <div className="button DFS"
                                    onClick = {() => this.activateDFS() }>
                                    DFS
                                </div>
                                <div className="button AStar"
                                    onClick={()=>this.activateAStar()}>
                                    AStar
                                </div>
                                <div className="button Dijkstra"
                                    onClick={()=>this.activateDijkstra()}>
                                    Dijkstra
                                </div>
                            </div>
                            
                            <div className="button Reset"
                                onClick = {() => this.resetGrid()}>
                                Reset
                            </div>
                            <div className="button weight-wall"
                                onClick={()=>this.toggleW()}>
                                Weight/Wall
                            </div>
                            <div className="button ResetPath"
                            onClick={()=>this.resetPath()}>
                                Reset Path
                            </div>
                            <div className="button visualise"
                                onClick={()=>this.visualise()}>
                                visualise
                            </div>
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
