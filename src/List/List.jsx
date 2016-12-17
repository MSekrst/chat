import React, {Component} from 'react';
import Item from './Item.jsx';

class List extends Component{

    render(){
        return(
            <div id="list">
                <Item name="Bruna" picture="https://scontent.xx.fbcdn.net/v/t1.0-9/15192522_1483843621632613_4515029785594108129_n.jpg?oh=f2a35dcaecab930d3bd547ca27cbfa4f&oe=58B4F5AF"/>
                <Item name="Luka" picture="https://scontent.xx.fbcdn.net/v/t1.0-9/12359869_10208098326275361_7086324352745163492_n.jpg?oh=ed388ae649a450a8961e85731dc67e66&oe=58F16E0F"/>
                <Item name="Tea" picture="https://scontent.xx.fbcdn.net/v/t1.0-9/14068102_10210545158653320_7356964510690281961_n.jpg?oh=e8ee669db137639eceb12385efc96995&oe=58F83B0F"/>
                <Item name="Karlo" picture="https://scontent.xx.fbcdn.net/v/t31.0-1/c282.0.960.960/p960x960/10506738_10150004552801856_220367501106153455_o.jpg?oh=9b8b00cc4702fb413602634388f08ac0&oe=58B05C12"/>
                <Item name="Josipa" picture="https://scontent.xx.fbcdn.net/v/t1.0-9/12548950_915250111894662_5285063202995618088_n.jpg?oh=7ee84a0313ca4838f06f34c3e0761568&oe=58EFD3F3"/>
                <Item name="Matija" picture="https://scontent.xx.fbcdn.net/v/t1.0-9/14718692_10209367365694727_8539079123587997134_n.jpg?oh=59617a372b73bc345fbe90bbdc812005&oe=58EBE1B2"/>
            </div>
        );
    }


}

export default List;
