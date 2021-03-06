import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MeetupService } from '../../providers/meetup-service';
import { EventPage} from '../event/event';
import { UserPage} from '../user/user';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MeetupService]
})
export class HomePage {

  public access_token = "";
  public meetup: any;
  public dashboard: any;
  public user: any;

  constructor(public navCtrl: NavController,  public navParams: NavParams, public meetupService: MeetupService, public af: AngularFireDatabase ) {
  		this.access_token = localStorage.getItem("access_token");
	  	  if(this.access_token)
	  	  {
	  	    this.loadDashboard();
          this.loadUser();
	  	  }
  }

  public openEvent(urlname, id)
  {
    this.navCtrl.push(EventPage, {
      urlname: urlname,
      id: id
    });
  }

  loadDashboard(){
    this.meetupService.loadDashboard()
    .then(data => {
      this.dashboard = data;
    });
  }

  loadUser(){
    this.meetupService.loadUser()
    .then(data => {
      this.user = data;
      localStorage.setItem('user', JSON.stringify(this.user));
      //console.log("checking firebase");
      var fb_user = this.af.object('/users/'+this.user.id);
      fb_user.subscribe(snapshot => {
          //console.log(snapshot);
          if(typeof snapshot.$value !== 'undefined')
          {
            this.navCtrl.setRoot(UserPage, {
              user: this.user,
            });
          }
          else {
            localStorage.setItem('user', JSON.stringify(snapshot));
          }
      });
    });
  }

}
