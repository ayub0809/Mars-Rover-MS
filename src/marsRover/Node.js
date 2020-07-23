import React, {Component} from "react";
import "./css-project/Node.css"
import IosLeaf from 'react-ionicons/lib/IosLeafOutline'
import IosRadioOutline from 'react-ionicons/lib/IosRadioOutline'
import IosIonitron from 'react-ionicons/lib/IosIonitron'
import IosLock from 'react-ionicons/lib/IosLock'
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
            isWeighted,
            isPlant
        }= this.props;
        
        const extraClass=isFinish ? "isFinish":
        isStart? "isStart":
        isWall? "isWall": 
        isWeighted? "isWeighted": 
        isPlant?"isPlant":"";
 
        if(isWeighted)
        return(
           <div id={`node-${row}-${col}`}
            className={`node ${extraClass}`}
            onMouseDown = {()=>onMouseDown(row,col)}
            onMouseUp= {()=> onMouseUp(row,col)}
            onMouseEnter = {()=> onMouseEnter(row,col)}
           >
               <IosLock color="#fff1da"/>
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
         else if (isPlant)
         return(
            <div id={`node-${row}-${col}`}
             className={`node ${extraClass}`}
             onMouseDown = {()=>onMouseDown(row,col)}
             onMouseUp= {()=> onMouseUp(row,col)}
             onMouseEnter = {()=> onMouseEnter(row,col)}
            >
                <IosLeaf/>
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
