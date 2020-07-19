import React, {Component} from "react";
import "./css-project/Node.css"
import IosDisc from 'react-ionicons/lib/IosDisc'
import IosRadioOutline from 'react-ionicons/lib/IosRadioOutline'
import IosIonitron from 'react-ionicons/lib/IosIonitron'
import "./css-resources/normalize.css"
import "./css-resources/grid.css"

export default class Node extends Component
{
    render()
    {
        const {
            row,
            col,
            isStart,
            isFinish,
            num,
            onMouseEnter,
            onMouseDown,
            onMouseUp,
            isVisited,
            isWall,
            inPath,
            isWeighted
        }= this.props;
        
        const extraClass=isFinish ? "isFinish":
        isStart? "isStart":
        isWall? "isWall": 
        isWeighted? "isWeighted": "";
 
        if(isWeighted)
        return(
           <div id={`node-${row}-${col}`}
            className={`node ${extraClass}`}
            onMouseDown = {()=>onMouseDown(row,col)}
            onMouseUp= {()=> onMouseUp(row,col)}
            onMouseEnter = {()=> onMouseEnter(row,col)}
           >
               <IosDisc/>
           </div>
        );
        else if (isStart)
        return(
            <div id={`node-${row}-${col}`}
             className={`node ${extraClass}`}
             onMouseDown = {()=>onMouseDown(row,col)}
             onMouseUp= {()=> onMouseUp(row,col)}
             onMouseEnter = {()=> onMouseEnter(row,col)}
            >
                <IosIonitron/>
            </div>
         );
        else if (isFinish)
        return(
            <div id={`node-${row}-${col}`}
             className={`node ${extraClass}`}
             onMouseDown = {()=>onMouseDown(row,col)}
             onMouseUp= {()=> onMouseUp(row,col)}
             onMouseEnter = {()=> onMouseEnter(row,col)}
            >
                <IosRadioOutline/>
            </div>
         );
         else
         return(
            <div id={`node-${row}-${col}`}
             className={`node ${extraClass}`}
             onMouseDown = {()=>onMouseDown(row,col)}
             onMouseUp= {()=> onMouseUp(row,col)}
             onMouseEnter = {()=> onMouseEnter(row,col)}
            >
            </div>
         );
    }
}
