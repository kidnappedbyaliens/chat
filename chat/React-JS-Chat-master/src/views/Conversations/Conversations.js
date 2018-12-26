import React, { Component } from 'react';
import { Progress } from 'reactstrap';

class Conversations extends Component {

  componentWillMount() {
   document.body.classList.toggle('aside-menu-hidden');
   if( document.getElementById('chat-box-div')){
   document.getElementById('chat-box-div').classList.remove('n-vis');
   }
  }

  componentWillUnmount() {
   document.body.classList.toggle('aside-menu-hidden');
   document.getElementById('chat-box-div').classList.add('n-vis');
    window.$applozic.fn.applozic('loadTab', '');
  }

  render() {
    return (
      <div className="animated fadeIn">

      </div>
    )
  }
}

export default Conversations;
