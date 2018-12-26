import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Progress } from 'reactstrap';
import classnames from 'classnames';
import classes from './Aside.css';

class Aside extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      assignee: '',
      agents : new Array(),
      statuses: {
        0: 'Open',
        1: 'In Progress',
        2: 'Close',
        3: 'Spam',
        4: 'Duplicate'
      },
      group: null
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentDidMount() {
    if(localStorage.getItem("loggedinUser")===null){
      window.location ="#/login";
      return;
    }else {
      window.location ="#/dashboard";
    }
    window.Aside = this;
  }

  loadAgents() {
      var that = this;
      window.$applozic.fn.applozic('fetchContacts', {roleNameList: ['APPLICATION_WEB_ADMIN'], callback: function(response) {
        if(response.status === 'success') {
              var assign = window.$applozic("#assign");
              that.setState({agents: response.response.users});
              window.$applozic.each(response.response.users, function() {
                  assign.append(window.$applozic("<option />").val(this.userId).text(that.getDisplayName(this)));
              });
            }
         }
      });
  }

  getDisplayName(user) {
    return user.displayName ? user.displayName: user.userId;
  }

  initConversation(groupId) {
    var that = this;
    window.$applozic.fn.applozic("getGroup", {
        groupId: groupId, callback: function(response) {
          that.setState({group: response});
          that.selectAssignee();
          that.selectStatus();
        }
    });
  }

  getGroupAdmin(group) {
    var assignee = this.state.group.adminName;
    for(var key in this.state.group.users) {
      if(this.state.group.users.hasOwnProperty(key)) {
        var user = this.state.group.users[key];
        if (user.role == 1) {
          assignee = user.userId;
          break;
        }
      }
    }
    return assignee;
  }

  selectAssignee() {
    console.log(this.state.group);
    var assignee = this.getGroupAdmin(this.state.group);
    if (this.state.group.metadata && this.state.group.metadata.CONVERSATION_ASSIGNEE) {
      assignee = this.state.group.metadata.CONVERSATION_ASSIGNEE;
    }

    if (assignee == localStorage.getItem('loggedinUser') && localStorage.isAdmin == "true") {
      assignee = "agent";
    }

    window.$applozic("#assign").val(assignee);
  }

  selectStatus() {
    if (this.state.group.metadata && this.state.group.metadata.CONVERSATION_STATUS) {
      window.$applozic("#conversation-status").val(this.state.group.metadata.CONVERSATION_STATUS);
    }
  }

  changeAssignee(userId) {
    var that = this;
    this.setState({assignee:userId});
    var groupId = window.$applozic(".left .person.active").data('mck-id');
    window.$applozic.fn.applozic('updateGroupInfo',
                                    {
                                      'groupId': this.state.group.groupId,
                                      'metadata': {
                                                'CONVERSATION_ASSIGNEE' : userId
                                      },
                                      'callback': function(response) {
                                        console.log(response);
                                        var displayName = "";
                                        for(var key in that.state.agents) {
                                          if(that.state.agents.hasOwnProperty(key)) {
                                            var user = that.state.agents[key];
                                            if (user.userId == userId) {
                                              displayName = user.displayName ? user.displayName: user.userId;
                                              break;
                                            }
                                          }
                                        }
                                        window.$applozic.fn.applozic('sendGroupMessage', {
                                            'groupId' : groupId,
                                            'message' : "Assigned to " + displayName
                                          });
                                      }
                                    });



    var loggedInUserId = window.$applozic.fn.applozic("getLoggedInUser");
    window.$applozic.fn.applozic("getGroup", {'groupId': groupId, 'callback': function(group) {
                                                  if (group.members.indexOf(userId) == -1) {
                                                    that.addGroupMember(groupId, userId, function() {
                                                      //that.updateGroupRole(groupId, [{userId: that.getGroupAdmin(group), role: 2}]);
                                                    });
                                                  } else {
                                                    //that.updateGroupRole(groupId, [{userId: userId, role: 1},{userId: that.getGroupAdmin(group), role: 2}]);
                                                  }
                                                }
                                              });

  }

  addGroupMember(groupId, userId, callback) {
    //'role' :  1,  // (optional)  USER(0), ADMIN(1), MODERATOR(2), MEMBER(3)
    window.$applozic.fn.applozic('addGroupMember',{'groupId': groupId,
                                        'userId': userId,
                                        'callback': function(response) {
                                          if (typeof callback === 'function') {
                                            callback();
                                          }
                                        }
                                      });
  }

  removeGroupMember(groupId, userId) {
    window.$applozic.fn.applozic('removeGroupMember',{'groupId': groupId,
                                              'userId': userId,
                                              'callback': function(response) {console.log(response);}
                                              });
  }

  updateGroupRole(groupId, users) {
    window.$applozic.fn.applozic('updateGroupInfo', {'groupId': groupId,
                                     'users': users,
                                     'callback' : function(response){console.log(response);}});
  }

  changeStatus(status) {
    //var groupId = window.$applozic(".left .person.active").data('mck-id');
    var that = this;
    window.$applozic.fn.applozic('updateGroupInfo',
                                    {
                                      'groupId': that.state.group.groupId,
                                      'metadata': {
                                                'CONVERSATION_STATUS' : status
                                      },
                                      'callback': function(response) {
                                        window.$applozic.fn.applozic('sendGroupMessage', {
                                            'groupId' : that.state.group.groupId,
                                            'message' : "Status changed to " + that.state.statuses[status]
                                          });
                                      }
                                    });
  }

  render() {
    return (
      <aside className="aside-menu">
        <div className="animated fadeIn applozic-chat-container">

          <div id="tab-chat" className="row tabs hide">
            <div id="sec-chat-box" className="col-lg-12 tab-box">
              <div id="chat-box-div" className="n-vis" style={{height: '100%'}}>

                <div className="mck-container">
                  <div className="left mck-message-inner-left">
                    <div className="panel-content">
                      <div className="mck-box-top mck-row mck-wt-user-icon">
                        <div className="blk-lg-3">
                          <div id="mck-user-icon" className="mck-user-icon"></div>
                        </div>
                        <div className="blk-lg-7">
                          <h4 id="mck-box-title" className="mck-box-title mck-truncate">Conversations</h4>
                                            </div>
                        <div className="blk-lg-2 move-right mck-menu-item mck-text-right">
                            <div className="mck-dropdown-toggle" data-toggle="mckdropdown"
                                aria-expanded="true">
                                <img
                            src="applozic/images/icon-menu.png" className="mck-menu-icon" alt="Menu"/>
                              </div>
                              <ul id="mck-start-new-menu-box"
                                className="mck-dropdown-menu mck-tab-menu-box menu-right"
                                role="menu">
                                <li><a href="javascript:void(0)" target="_self" id="mck-msg-new" className="mck-contact-search menu-item"
                                  title="New Chat">New Chat</a></li>
                                  <li><a href="javascript:void(0)" target="_self" 
                                  className="mck-contact-search menu-item"
                                  title="Contacts">Contacts</a></li>
                                <li><a href="javascript:void(0)" target="_self"
                                  className="mck-group-search menu-item "
                                  title="Groups">Groups</a></li>
                                <li><a href="javascript:void(0)" target="_self" 
                                  id="mck-new-group" className="menu-item" title="Create Group">Create
                                    Group</a></li>
                              </ul>
                        </div>
                      </div>

                      <div className="top">
					
				 <input type="text" id="mck-search" data-provide="typeahead"
						placeholder="Search..."/>
            <span className="mck-search-icon"> <a href="#" target="_self" role="link"
						className="mck-tab-search"> <span className="mck-icon-search"></span>
					</a></span>
				</div>
				<div className="mck-panel-body">
					<div id="mck-contact-cell" className="mck-panel-cell">
						<div className="mck-panel-inner mck-contacts-inner">
							<ul id="mck-contact-list"
								className="people mck-contact-list mck-nav mck-nav-tabs mck-nav-stacked"></ul>
						</div>

    
				<div id="mck-contact-loading" className="mck-loading">
							<img src="applozic/images/ring.gif"></img>
					</div> 
	
  					<div id="mck-no-contact-text"
							className="mck-no-data-text mck-text-muted n-vis">No
							conversations yet!</div>
						<div id="mck-show-more-icon" className="mck-show-more-icon n-vis">
							<h3>No more conversations!</h3>
						</div>
					</div>
				</div>

				


                    </div>
                  </div>
                  <div className="right">
                    <div className="panel-content">
                      <div id="mck-tab-header" className="mck-box-top n-vis">
                        <div id="mck-tab-individual"
                          className="mck-tab-individual mck-row">
                          <div className="blk-lg-8 mck-box-title">
                            <div id="mck-group-tab-title" className="n-vis">
                              <a id="mck-tab-info" href="javascript:void(0)" target="_self" className="mck-tab-info">
                                <div className="mck-tab-title mck-truncate name"></div>
                                <div className="mck-tab-status mck-truncate n-vis"></div>
                                <div className="mck-typing-box mck-truncate n-vis">
                                  <span className="name-text"></span><span>typing...</span>
                                </div>
                              </a>
                            </div>
                            <div id="mck-individual-tab-title"
                              className="mck-individual-tab-title">
                                <div className="mck-tab-title mck-truncate name"></div>
                                <div className="mck-tab-status mck-truncate n-vis"></div>
                                <div className="mck-typing-box mck-truncate n-vis">
                                  <span className="name-text"></span><span>typing...</span>
                                </div>
                              
                            </div>
                          </div>
                          <div id="mck-btn-video-call" className="mck-videocall-btn  blk-lg-2 n-vis"></div>
						              <div className="blk-lg-2 move-right">
                            <div id="mck-tab-menu" className="mck-menu-item mck-text-right">
                              <div className="mck-dropdown-toggle" data-toggle="mckdropdown"
                                aria-expanded="true">
                                <img src="applozic/images/icon-menu.png" className="mck-menu-icon"
                                  alt="Tab Menu"/>
                              </div>
                              <ul id="mck-tab-menu-list"
                                className="mck-dropdown-menu mck-tab-menu-box menu-right"
                                role="menu">
                                <li className="mck-tab-message-option vis"><a href="javascript:void(0)" target="_self"
                                  id="mck-delete-button"
                                  className="mck-delete-button menu-item vis"
                                  title="Clear Messages"> Clear Messages </a></li>
                                <li id="li-mck-block-user" className="vis"><a href="javascript:void(0)" target="_self"
                                  id="mck-block-button" className="menu-item" title="Block User">Block
                                    User</a></li>
                                <li id="li-mck-group-info"
                                  className="mck-group-menu-options n-vis"><a href="javascript:void(0)" target="_self"
                                  id="mck-group-info-btn" className="menu-item mck-group-info-btn"
                                  title="Group Info"> Group Info </a></li>
                                <li id="li-mck-leave-group"
                                  className="mck-group-menu-options n-vis"><a href="javascript:void(0)" target="_self"
                                  id="mck-leave-group-btn" className="menu-item" title="Exit Group">
                                    Exit Group </a></li>
                              </ul>
                            </div>

                          </div>
                        </div>


                        <div id="mck-video-call-indicator" className="applozic-launchar n-vis row">
						        <div id="mck-video-call-icon" className="col-lg-3 mck-alpha-contact-image">
						            <span className="mck-contact-icon"></span>
						        </div>
						        <div id="mck-vid-btn" className="mck-vid-flex-box">
						           <div id="mck-video-call-indicator-txt" className="mck-video-call-indicator-txt"></div>
											 <div id="mck-call-btn-div" className= "col-lg-8">
			 						            <button id="mck-vid-receive-btn" className="mck-btn">Accept</button>
			 						            <button id="mck-vid-reject-btn" className="mck-btn">Reject</button>
			 						     </div>
										 </div>

						</div>
                      </div>
                      <div id="mck-product-group"
                        className="mck-tab-panel mck-btn-group mck-product-group">
                        <div id="mck-product-box"
                          className="mck-product-box n-vis mck-dropdown-toggle"
                          data-toggle="mckdropdown" aria-expanded="true">
                          <div className="mck-row">
                            <div className="blk-lg-10">
                              <div className="mck-row">
                                <div className="blk-lg-3 mck-product-icon"></div>
                                <div className="blk-lg-9">
                                  <div className="mck-row">
                                    <div className="blk-lg-8 mck-product-title mck-truncate"></div>
                                    <div
                                      className="blk-lg-4 move-right mck-product-rt-up mck-truncate">
                                      <strong className="mck-product-key"></strong>:<span
                                        className="mck-product-value"></span>
                                    </div>
                                  </div>
                                  <div className="mck-row">
                                    <div className="blk-lg-8 mck-truncate mck-product-subtitle"></div>
                                    <div
                                      className="blk-lg-4 move-right mck-product-rt-down mck-truncate">
                                      <strong className="mck-product-key"></strong>:<span
                                        className="mck-product-value"></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="blk-lg-2 mck-text-center">
                              <span className="mck-caret n-vis"></span>
                            </div>
                          </div>
                        </div>
                        <ul id="mck-conversation-list"
                          className="mck-dropdown-menu menu-right mck-conversation-list n-vis"
                          role="menu"></ul>
                      </div>
                      <div className="mck-panel-body">
                        <div id="mck-message-cell" className="mck-message-cell mck-panel-cell">
                          <div id="conversation-section" className="conversation-section">
                            <div className="chat mck-message-inner mck-panel-inner"
                              data-mck-id="${contIdExpr}"></div>
                            <div id="mck-msg-loading" className="mck-loading n-vis">
                              <img src="applozic/images/ring.gif"/>
                            </div>
                            <div id="mck-no-more-messages"
                              className="mck-no-more-messages mck-show-more-icon n-vis">
                              <h3>No more messages!</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="write" >
                      
                        <div id="mck-sidebox-ft" className="mck-box-ft mck-panel-ft">
                          <div id = "mck-box-form" className="mck-box-form mck-row n-vis">
                            <div className="blk-lg-12">
                              <p id="mck-msg-error" className="mck-sidebox-error n-vis"></p>
                            </div>
                            <div className="blk-lg-12">
                              <p id="mck-msg-response" className="mck-box-response n-vis"></p>
                            </div>
                            <div  id="mck-reply-to-div" className="n-vis">
                              <button type="button" id="close" className="mck-box-close mck-close-panel move-right">
                                 <span aria-hidden="true">&times;</span>
			      </button>
				 <div id="mck-reply-to" className=" mck-msgto "></div>
                                 <div id="mck-reply-msg"> </div>
                           </div>
                                        
                            <div id="mck-write-box" className="blk-lg-12 mck-write-box">
                              <form id="mck-msg-form" className="vertical mck-msg-form">
                                <div className="mck-form-group n-vis">
                                  <label className="sr-only placeholder-text control-label"
                                  htmlFor="mck-msg-to">To:</label> <input className="mck-form-cntrl"
                                    id="mck-msg-to" name="mck-msg-to" placeholder="To" required/>
                                </div>
                                <input id="mck-file-input" className="mck-file-input n-vis"
                                  type="file" name="files[]"/>
                                <div id="mck-btn-attach" className="mck-btn-attach">
                                  <div className="mck-dropdown-toggle" data-toggle="mckdropdown"
                                    aria-expanded="true">
                                    <a href="javascript:void(0)"  target="_self" type="button" id="mck-btn-attach"
                                      className="write-link attach mck-btn-text-panel"
                                      aria-expanded="true" title="Attach File">
                                       </a>
                                  </div>
                                  <ul id="mck-upload-menu-list"
                                    className="mck-dropup-menu mck-upload-menu-list" role="menu">
                                    <li><a id="mck-file-up" href="javascript:void(0)" target="_self"
                                      className="mck-file-upload menu-item" title="File &amp; Photos">

                                        <img src="applozic/images/mck-icon-photo.png"
                                        className="menu-icon" alt="File &amp; Photos"/> <span>Files
                                          &amp; Photos</span>
                                    </a></li>
                                    <li><a id="mck-btn-loc" href="javascript:void(0)" target="_self" className="menu-item"
                                      title="Location"> <img
                                        src="applozic/images/mck-icon-marker.png" className="menu-icon"
                                        alt="Location"/> <span>Location</span>
                                    </a></li>

                                  </ul>
                                </div>
                                  <a href="javascript:void(0)" target="_self" id="mck-file-up2" type="button"
                                    className="write-link attach n-vis mck-file-upload mck-btn-text-panel"
                                    title="Attach File"> </a>
                                    <a href="javascript:void(0)" target="_self"  id="mck-mike-btn" type="button"
                                  className="mck-mic-btn mck-mike-btn vis"
                                  title=" Mic"> </a> 
                                  <a href="javascript:void(0)" target="_self"  id="stop-recording" 
                                  className="mck-stop-btn n-vis ">
                                  </a> 
                                  <div id="audiodiv" className="mck-mic-timer n-vis">
							       <label id="mck-minutes">00</label>:<label id="mck-seconds">00</label>
                                    </div>
								
                                  
                                  <span id="mck-text-box"
                                  contentEditable="true" suppressContentEditableWarning="true" className="mck-text-box mck-text required"></span>

                                <a href="javascript:void(0)" target="_self" 
                                
                                id="mck-msg-sbmt" className="write-link send mck-btn-text-panel"
                                title="Send Message"></a>
                                  <a href="javascript:void(0)" target="_self" id="mck-btn-smiley"
                                  className="write-link smiley mck-btn-smiley mck-btn-text-panel"
                                  title="Smiley"></a> 
                              </form>
                            </div>
                            <div className="blk-lg-12">
                              <div id="mck-file-box" className=""></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>




                  </div>
                  <div id="mck-group-create-tab"
                      className="mck-group-create-tab mck-panel-sm mck-panel n-vis">
                        <div className="panel-content">
                      <div className="mck-box-top">
                        <div className="blk-lg-10">
                          <div className="mck-box-title mck-truncate" title="Create Group">Create
                            Group</div>
                        </div>
                          <div className="blk-lg-2">
                          <button type="button" id="mck-group-create-close"
                            className="mck-box-close mck-close-panel move-right">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                      <div className="mck-box-body">
                        <div className="mck-tab-cell">
                          <div id="mck-group-create-panel"
                            className="mck-tab-panel mck-message-inner mck-group-create-inner">
                            <div className="mck-group-sub-sec">
                              <div id="mck-group-create-icon-box"
                                className="mck-group-create-icon-box mck-group-icon-box mck-hover-on">
                                <div className="mck-group-icon"></div>
                                <span className="mck-overlay-box">
                                  <div className="mck-overlay">
                                    <span className="mck-camera-icon"></span> <span
                                      className="mck-overlay-label">Add Group Icon</span>
                                  </div>
                                  <div id="mck-group-create-icon-loading"
                                    className="mck-loading n-vis">
                                    <img
                                      src="applozic/images/mck-loading.gif"/>
                                  </div> <input id="mck-group-icon-upload"
                                  className="mck-group-icon-upload n-vis" type="file"
                                  name="files[]"/>
                                </span>
                              </div>
                            </div>
                            <div id="mck-group-create-name-sec" className="mck-group-sub-sec">
                              <div id="mck-group-create-name-box"
                                className="mck-row mck-group-name-box">
                                <div className="blk-lg-12">
                                  <div className="mck-label">Group Title</div>
                                </div>
                                <div className="blk-lg-12">
                                  <div id="mck-group-create-title" className="mck-group-create-title mck-group-title"
                                    contentEditable="true" suppressContentEditableWarning="true" >Group title</div>
                                </div>
                              </div>
                            </div>
                            <div id="mck-group-create-type-sec" className="mck-group-sub-sec">
                              <div id="mck-group-create-type-box"
                                className="mck-row mck-group-type-box">
                                <div className="blk-lg-12">
                                  <div className="mck-label">Group Type</div>
                                </div>
                                <div className="blk-lg-12">
                                  <select id="mck-group-create-type" className="mck-select">
                                    <option value="2" selected>Public</option>
                                    <option value="1">Private</option>
                                    <option value="6">Open</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div id="mck-group-create-btn-sec" className="mck-group-sub-sec">
                              <button type="button" id="mck-btn-group-create"
                                className="mck-btn mck-btn-green mck-btn-group-create"
                                title="Create Group">Create Group</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="mck-group-info-tab"
                    className="mck-group-info-tab mck-panel-sm mck-panel n-vis">
                    <div className="panel-content">
                      <div className="mck-box-top">
                        <div className="blk-lg-10">
                          <div className="mck-box-title mck-truncate" title="Group Info">Group
                            Info</div>
                        </div>
                        <div className="blk-lg-2">
                          <button type="button" id="mck-group-info-close"
                            className="mck-box-close mck-close-panel move-right">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                      <div id="mck-group-detail-panel" className="mck-group-detail-box">
                        <div className="mck-group-icon-sec">
                          <div id="mck-group-info-icon-box"
                            className="mck-group-icon-box mck-group-info-icon-box mck-hover-on">
                            <div className="mck-group-icon"></div>
                            <span className="mck-overlay-box n-vis">
                              <div className="mck-overlay">
                                <span className="mck-camera-icon"></span> <span
                                  className="mck-overlay-label">Change Group Icon</span>
                              </div>
                              <div id="mck-group-info-icon-loading" className="mck-loading n-vis">
                                <img src="applozic/images/mck-loading.gif"/>
                              </div> <input id="mck-group-icon-change"
                              className="mck-group-icon-change n-vis" type="file" name="file[]" />
                            </span>
                          </div>
                          <div className="mck-text-center">
                            <a id="mck-btn-group-icon-save" href="javascript:void(0)" target="_self" role="link"
                              className="mck-btn-group-icon-save n-vis" title="Click to save">
                              <img
                              src="applozic/images/mck-icon-save.png"
                              alt="Save"/>
                            </a>
                          </div>
                        </div>
                        <div id="mck-group-name-sec" className="mck-group-name-sec">
                          <div id="mck-group-name-box" className="mck-row mck-group-name-box">
                            <div className="blk-lg-9">
                              <div id="mck-group-title" className="mck-group-title"
                                contentEditable="false" suppressContentEditableWarning="true" >Group title</div>
                            </div>
                            <div className="blk-lg-3 mck-group-name-edit-icon">
                              <a id="mck-group-name-edit" href="javascript:void(0)" target="_self" role="link"
                                className="mck-group-name-edit vis" title="Edit"> <img
                                src="applozic/images/mck-icon-write.png" alt="Edit"/></a> <a
                                id="mck-group-name-save" href="javascript:void(0)"  target="_self" role="link"
                                className="mck-group-name-save n-vis" title="Click to save"> <img
                                src="applozic/images/mck-icon-save.png" alt="Save"/></a>
                            </div>
                          </div>
                        </div>
                        <div id="mck-group-member-panel"
                          className="mck-tab-panel mck-group-member-panel vis">
                          <div className="mck-group-md-sec">
                            <div className="mck-row mck-group-member-text">Members</div>
                            <div id="mck-group-add-member-box"
                              className="mck-row mck-group-admin-options mck-group-add-member-box n-vis">
                              <a id="mck-group-add-member" className="mck-group-add-member"
                                href="javascript:void(0)"target="_self" >
                                <div className="blk-lg-3">
                                  <img src="applozic/images/mck-icon-add-member.png"
                                    alt="Add Member"/>
                                </div>
                                <div className="blk-lg-9">Add member</div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mck-box-body">
                        <div className="mck-tab-cell">
                          <div className="mck-group-member-inner">
                            <ul id="mck-group-member-list"
                              className="mck-group-member-list mck-contact-list mck-nav mck-nav-tabs mck-nav-stacked">
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div id="mck-group-update-panel" className="mck-tab-panel mck-group-update-panel n-vis">
						<div className="mck-group-bottom-sec">
							<div className="mck-row mck-group-update-sec">
								<button type="button" id="mck-btn-group-update"
									className="mck-btn mck-btn-green mck-btn-group-update"
									title="Update">Update</button>
							</div>
						</div>
					</div>
                      <div id="mck-group-info-ft" className="mck-group-info-ft">
                        <button type="button" id="mck-btn-group-exit"
                          className="mck-btn mck-btn-blue mck-btn-group-exit"
                          title="Exit Group">Exit Group</button>
                      </div>
                    </div>
                  </div>

                  </div>

                <div id="mck-loc-box" className="mck-box mck-loc-box fade"
                  aria-hidden="false">
                  <div className="mck-box-dialog mck-box-md">
                    <div className="mck-box-content">
                      <div className="mck-box-top mck-row">
                        <div className="blk-lg-10">
                          <h4 className="mck-box-title">Location Sharing</h4>
                        </div>
                        <div className="blk-lg-2">
                          <button type="button" className="mck-box-close" data-dismiss="mckbox"
                            aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                      <div className="mck-box-body">
                        <div className="mck-form-group ">
                          <div className="blk-lg-12">
                            <input id="mck-loc-address" type="text" className="mck-form-control"
                              placeholder="Enter a location" autoComplete="off"/>
                          </div>
                        </div>
                        <div id="mck-map-content" className="mck-loc-content"></div>
                        <div className="n-vis">
                          <label className="blk-sm-2 mck-control-label">Lat.:</label>
                          <div className="blk-sm-3">
                            <input type="text" id="mck-loc-lat" className="mck-form-control"/>
                          </div>
                          <label className="blk-sm-2 mck-control-label">Long.:</label>
                          <div className="blk-sm-3">
                            <input type="text" id="mck-loc-lon" className="mck-form-control"/>
                          </div>
                        </div>
                      </div>
                      <div className="mck-box-footer">
                        <button id="mck-my-loc" type="button"
                          className="mck-my-loc mck-btn mck-btn-green">My Location</button>
                        <button id="mck-loc-submit" type="button"
                          className="mck-btn mck-btn-blue mck-loc-submit move-right">Send</button>
                        <button type="button" className="mck-btn mck-btn-default move-right"
                          data-dismiss="mckbox">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="mck-contact-search-box"
                  className="mck-box mck-contact-search-box mck-sm-modal-box fade"
                  aria-hidden="false">
                  <div className="mck-box-dialog mck-box-sm">
                    <div className="mck-box-content">
                      <div className="mck-box-top mck-row">
                        <div className="blk-lg-10">
                          <h4 className="mck-box-title" title="New Chat">New Chat</h4>
                        </div>
                        <div className="blk-lg-2">
                          <button type="button" className="mck-box-close" data-dismiss="mckbox"
                            aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                      <div id="mck-search-tab-box" className="mck-search-tab-box mck-row">
                        <div className="blk-lg-12">
                          <ul className="mck-nav mck-nav-panel">
                            <li className="mck-nav-item mck-nav-divider">
                            <a id="mck-contact-search-tab"
                              className="mck-nav-link mck-contact-search active" href="javascript:void(0)" target="_self" ><strong>Contacts</strong></a></li>
                            <li className="mck-nav-item"><a id="mck-group-search-tab"
                              className="mck-nav-link mck-group-search" href="javascript:void(0)" target="_self" ><strong>Groups</strong></a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="mck-box-body">
                        <div className="mck-form-group">
                          <div id="mck-contact-search-input-box"
                            className="blk-lg-12">
                            <input id="mck-contact-search-input" type="text"
                              data-provide="typeahead" placeholder="Search..."  /> <span
                              className="mck-search-icon"><a href="#" role="link"
                              className="mck-contact-search-link" target="_self"><span
                                className="mck-icon-search"></span></a></span>
                          </div>
                          <div id="mck-group-search-input-box"
                            className="mck-input-group blk-lg-12 n-vis">
                            <input id="mck-group-search-input" type="text"
                              data-provide="typeahead" placeholder="Search..."  /> <span
                              className="mck-search-icon"><a href="#" role="link"
                              className="mck-group-search-link" target="_self"><span className="mck-icon-search"></span></a></span>
                          </div>
                        </div>
                        <div className="mck-tab-cell">
                          <div className="mck-message-inner">
                            <ul id="mck-contact-search-list"
                              className="mck-contact-list mck-contact-search-list mck-nav mck-nav-tabs mck-nav-stacked"></ul>
                            <ul id="mck-group-search-list"
                              className="mck-contact-list mck-group-search-list mck-nav mck-nav-tabs mck-nav-stacked n-vis"></ul>
                            <div id="mck-no-search-contacts" className="mck-show-more-icon n-vis">
                              <h3>No contacts yet!</h3>
                            </div>
                            <div id="mck-no-search-groups" className="mck-show-more-icon n-vis">
                              <h3>No groups yet!</h3>
                            </div>
                            <div id="mck-search-loading" className="mck-loading n-vis">
                              <img src="Public/applozic/images/ring.gif"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="mck-goup-search-box"
                  className="mck-box mck-group-search-box mck-sm-modal-box fade"
                  aria-hidden="false">
                  <div className="mck-box-dialog mck-box-sm">
                    <div className="mck-box-content">
                      <div className="mck-box-top mck-row">
                        <div className="blk-lg-3">
                          <img src="applozic/images/mck-icon-add-member.png" alt="Add Member"/>
                        </div>
                        <div className="blk-lg-7">
                          <h4 className="mck-box-title">Add Member</h4>
                        </div>
                        <div className="blk-lg-2">
                          <button type="button" className="mck-box-close" data-dismiss="mckbox"
                            aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                      <div className="mck-box-body">
                        <div className="mck-form-group">
                          <div className="mck-input-group blk-lg-12">
                            <input id="mck-group-member-search" type="text" data-provide="typeahead"
                              placeholder="Search..."  /> <span
                              className="mck-search-icon"><a href="javascript:void(0)" target="_self" role="link"
                              className="mck-group-member-search-link"><span className="mck-icon-search"></span></a></span>
                          </div>
                        </div>
                        <div className="mck-tab-cell">
                          <div className="mck-message-inner">
                            <ul id="mck-group-member-search-list"
                              className=" mck-contact-list mck-group-search-list mck-nav mck-nav-tabs mck-nav-stacked"></ul>
                                <div id="mck-no-gsm-text"
                              className="mck-no-data-text mck-text-muted n-vis">No Users!</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div id="mck-sidebox"></div>
            </div>
          </div>

        </div>
      </aside>
    )
  }
}

export default Aside;