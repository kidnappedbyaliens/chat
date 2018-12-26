import React, { Component } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';


class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="animated fadeIn dashboard">
        <h1>Applozic Welcomes You</h1>
      </div>
    )
  }
}

export default Dashboard;
