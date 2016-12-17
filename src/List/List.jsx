import React, {Component} from 'react';
import Item from './Item.jsx';

class List extends Component{

    render(){
        return(
            <div id="list">
                <Item name="Bruna" />
            </div>
        );
    }


}

export default List;