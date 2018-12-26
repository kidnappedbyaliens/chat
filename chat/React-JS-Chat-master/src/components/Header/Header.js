import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';

class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      imageLink :localStorage.getItem("imageLink")==null?"img/avatars/default.png":localStorage.getItem("imageLink"),
      displayName: localStorage.getItem("loggedinUser")
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

/*  getImageLink(){
var imageLink = localStorage.getitem("imageLink")==undefined?"img/avatars/6.jpg":localStorage.getitem("imageLink");
return imageLink;
  }*/
  logout(e){
    window.logout();
    localStorage.clear();
    window.location="/#/login/";
  }

  render() {
    return (
      <header className="app-header navbar">
        <button className="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" onClick={this.mobileSidebarToggle}>&#9776;</button>
        <ul className="nav navbar-nav d-md-down-none">
          <li className="nav-item">
            <button className="nav-link navbar-toggler sidebar-toggler" type="button" onClick={this.sidebarToggle}></button>
          </li>
        </ul>
        <ul className="nav navbar-nav ml-auto">

          <li className="nav-item">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <button onClick={this.toggle} className="nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
                <img src= { this.state.imageLink } className="img-avatar" alt={this.state.displayName}/>
                <span className="d-md-down-none">{this.state.displayName}</span>
              </button>

              <DropdownMenu className="dropdown-menu-right">
                <DropdownItem onClick={ this.logout }><i className="fa fa-lock"></i> Logout</DropdownItem>

              </DropdownMenu>
            </Dropdown>
          </li>

        </ul>
      </header>
    )
  }
}

export default Header;
