import { Component, OnInit } from '@angular/core';
import skills from './skillsData';
//import jsPDF from 'jsPDF'
import jquery from 'jquery'
import * as html2canvas from "html2canvas"

@Component({
  selector: 'app-team-map',
  templateUrl: './team-map.component.html',
  styleUrls: ['./team-map.component.css']
})
export class TeamMapComponent implements OnInit {

  skillsList: Array<skill> = skills;
  mapSkills: Array<mapSkill> = skills;

  team: team;
  currentPlayer: player;
  mode: string;
  doc: any;
  hasTeamName: boolean;

  constructor() {

    this.team = {
      players: [],
      teampreferences: [],
      teamblindspots: []
    };

    this.currentPlayer = {
      talents: []
    }

  }

  ngOnInit() {
    this.mode = "create";
  }

  addTeamMember() {

    if(!this.currentPlayer.name){
      alert("Name cannot be null");
      return;
    }

    this.team.players.push(this.currentPlayer);
    this.reset();
  }

  updateSkills(skill: skill) {

    let index: number = this.currentPlayer.talents.indexOf(skill);

    if (index !== -1) {
      this.currentPlayer.talents.splice(index, 1);
    } else {
      this.currentPlayer.talents.push(skill);
    }
  }

  updateMember(player: player){

    let index: number = this.team.players.indexOf(player);

    this.team.players[index] = player;
    this.reset();

  }

  removeMember(player:player){

    if( confirm('Are you sure you want to completely remove ' + player.name + '?') ) {
      let index: number = this.team.players.indexOf(player);

      if(index !== -1){
        this.team.players.splice(index, 1);
      };

      this.reset();
    }

  }

  editPlayer(player: player) {

    this.reset();

    this.currentPlayer = player;
    this.mode = "edit";
    let i;

    if (player.talents.length > 0) {
      player.talents.forEach((x) => {
        i = this.skillsList.indexOf(x);
        this.skillsList[i].checked = true;
      });
    }

  }

  clear(player: player) {

    if( confirm('Are you sure you want to clear values for ' + player.name + '?') ) {
      player.talents.length = 0;

      this.skillsList.forEach((skill) => {
        skill.checked = false;
      })
    }

  }


  reset() {
    this.skillsList.forEach((skill) => {
      skill.checked = false;
    })

    this.currentPlayer = {
      talents: []
    }

    this.mode = "create";

    this.team.teampreferences = [];
    this.team.teamblindspots = [];

  }

  buildTeamMap() {

    let index;
    this.team.stuffed = false;

    this.team.players.forEach((player) => {

      if (player.talents && player.talents.length > 0) {

        player.a_talents = 0;
        player.p_talents = 0;
        player.r_talents = 0;
        player.i_talents = 0;

        player.talents.forEach((talent) => {

          index = this.mapSkills.indexOf(talent);
          this.mapSkills[index].checked = true;

          if( this.mapSkills[index].type === "analytic" ) player.a_talents++;
          else if (  this.mapSkills[index].type === "innovative" ) player.i_talents++;
          else if (  this.mapSkills[index].type === "relational" ) player.r_talents++;
          else if (  this.mapSkills[index].type === "procedural" ) player.p_talents++;
          else {}

          if (!this.mapSkills[index].names) this.mapSkills[index].names = [];

          this.mapSkills[index].names.push(player.name);

        });

      //alert( player.name + " | Analytic = " + player.a_talents + ", Innovative = " + player.i_talents + ", Relational = " + player.r_talents + ", Procedural = " + player.p_talents );


      //Decision Tree for Brain Preference
      if( (player.a_talents > 0) && (player.p_talents > 0) && (player.r_talents > 0) && (player.i_talents > 0)) player.talentPref = "Whole-Brained";
      else if( (player.p_talents == player.r_talents) && (player.p_talents == player.i_talents) && (player.p_talents > player.a_talents) ) player.talentPref = "Limbic (R/P) / Right-Brained";
      else if( (player.a_talents == player.i_talents) && (player.a_talents == player.r_talents) && (player.a_talents > player.p_talents) ) player.talentPref = "Cerebral (A/I) / Right-Brained";
      else if( (player.a_talents == player.i_talents) && (player.a_talents == player.p_talents) && (player.a_talents > player.r_talents) ) player.talentPref = "Cerebral (A/I) / Left-Brained";
      else if( (player.a_talents == player.p_talents) && (player.a_talents == player.r_talents) && (player.a_talents > player.i_talents) ) player.talentPref = "Limbic (R/P) / Left-Brained";
      else if( (player.a_talents == player.i_talents) && (player.a_talents > player.p_talents) && (player.a_talents > player.r_talents) ) player.talentPref = "Cerebral (A/I)";
      else if( (player.a_talents == player.p_talents) && (player.a_talents > player.i_talents) && (player.a_talents > player.r_talents) ) player.talentPref = "Left-Brained";
      else if( (player.p_talents == player.r_talents) && (player.p_talents > player.a_talents) && (player.p_talents > player.i_talents) ) player.talentPref = "Limbic (R/P)";
      else if( (player.r_talents == player.i_talents) && (player.r_talents > player.a_talents) && (player.r_talents > player.p_talents) ) player.talentPref = "Right-Brained";
      else if( (player.a_talents == player.r_talents) && (player.a_talents > player.i_talents) && (player.a_talents > player.p_talents) ) player.talentPref = "Facts vs. Feelings (A/R)";
      else if( (player.i_talents == player.p_talents) && (player.i_talents > player.a_talents) && (player.i_talents > player.r_talents) ) player.talentPref = "Entrepreneur (I/P)";
      else if( (player.a_talents > player.p_talents) && (player.a_talents > player.r_talents) && (player.a_talents > player.i_talents) ) player.talentPref = "Analytical";
      else if( (player.p_talents > player.a_talents) && (player.p_talents > player.r_talents) && (player.p_talents > player.i_talents) ) player.talentPref = "Procedural";
      else if( (player.r_talents > player.a_talents) && (player.r_talents > player.p_talents) && (player.r_talents > player.i_talents) ) player.talentPref = "Relational";
      else if( (player.i_talents > player.a_talents) && (player.i_talents > player.r_talents) && (player.i_talents > player.p_talents) ) player.talentPref = "Innovative";
      else {}

      if( this.team.teampreferences.indexOf( player.talentPref ) === -1) this.team.teampreferences.push( player.talentPref );

      //Decision Tree for Blind Spot
      if( player.a_talents > 0 && player.i_talents > 0 && player.r_talents > 0 && player.p_talents > 0 ) player.blindspot = "None (Whole-Brained)";
      else if( player.a_talents == 0 && player.i_talents > 0 && player.r_talents > 0 && player.p_talents > 0 ) player.blindspot = "Analytical";
      else if( player.a_talents > 0 && player.i_talents > 0 && player.r_talents > 0 && player.p_talents == 0 ) player.blindspot = "Procedural";
      else if( player.a_talents > 0 && player.i_talents > 0 && player.r_talents == 0 && player.p_talents > 0 ) player.blindspot = "Relational";
      else if( player.a_talents > 0 && player.i_talents == 0 && player.r_talents > 0 && player.p_talents > 0 ) player.blindspot = "Innovative";
      else if( (player.a_talents == 0) && (player.i_talents == 0) && (player.r_talents > 0) && (player.p_talents > 0)) player.blindspot = "Cerebral (A/I)";
      else if( (player.a_talents == 0) && (player.i_talents > 0) && (player.r_talents > 0) && (player.p_talents == 0)) player.blindspot = "Left-Brained";
      else if( (player.a_talents > 0) && (player.i_talents > 0) && (player.r_talents == 0) && (player.p_talents == 0)) player.blindspot = "Limbic (R/P)";
      else if( (player.a_talents > 0) && (player.i_talents == 0) && (player.r_talents == 0) && (player.p_talents > 0)) player.blindspot = "Right-Brained";
      else if( (player.a_talents == 0) && (player.i_talents > 0) && (player.r_talents == 0) && (player.p_talents > 0)) player.blindspot = "Facts vs. Feelings (A/R)";
      else if( (player.a_talents > 0) && (player.i_talents == 0) && (player.r_talents > 0) && (player.p_talents == 0)) player.blindspot = "Entrepreneur (I/P)";
      else if( player.a_talents > 0 && player.i_talents == 0 && player.r_talents == 0 && player.p_talents == 0 ) player.blindspot = "Limbic (R/P) / Right-Brained";      
      else if( player.a_talents == 0 && player.i_talents == 0 && player.r_talents == 0 && player.p_talents > 0 ) player.blindspot = "Cerebral (A/I) / Right-Brained";
      else if( player.a_talents == 0 && player.i_talents == 0 && player.r_talents > 0 && player.p_talents == 0 ) player.blindspot = "Cerebral (A/I) / Left-Brained";
      else if( player.a_talents == 0 && player.i_talents > 0 && player.r_talents == 0 && player.p_talents == 0 ) player.blindspot = "Limbic (R/P) / Left-Brained";
      else {}


      //alert (player.blindspot);
      
      if( this.team.teamblindspots.indexOf( player.blindspot ) === -1) this.team.teamblindspots.push( player.blindspot );

      //alert(player.name + "\'s Blindspot is " + player.blindspot);
    
      }    

    });

    //alert( this.team.teamblindspots );  

    this.mapSkills.forEach((mapSkill) => {

      if ( mapSkill.names && mapSkill.names.length > 8) {
          this.team.stuffed = true;
          alert("Sizing Font Down To Accomodate Team");
      }
      else {}

    });
    this.mode = "displayTeamMap";

  }

  styleNames() {

    var names = jquery(".name");

    if (names && names.length > 0)

      names.forEach((div) => {

        if (div.height > 175) {
          alert("damn!");
        }

      });

  }

  isChecked(skillName: string){

   var index = this.mapSkills.map(function(e) { return e.name; }).indexOf(skillName);

   if(index >= 0) return this.mapSkills[index].checked;

   console.log(skillName + " not found in skills array");

   return false;

  }

  isStuffed() : boolean {

    if ( this.team.stuffed) { return true; }
    else { return false; }
  }

  getNames(skillName: string){

    var index = this.mapSkills.map(function(e) { return e.name; }).indexOf(skillName);

    return this.mapSkills[index].names;

  }

  getTeamNum() : number {
    return this.team.players.length;
  }

  editTeamMap(){

    this.mapSkills.forEach((skill) => {
      skill.checked = false;
      skill.names = [];
    })

    this.mode = "create";

  }

  startOver() {

    if( confirm('Are you sure you want to start over?') ) {
      window.location.href ='/';
    }

  }

  print() {
    //NO LONGER IN USE
    html2canvas(jquery("#teamMap")[0], {
      dpi: 192,
      letterRendering: true,
      allowTaint: true,
      //proxy: "http://localhost:4200",
      logging: true,
    }).then((canvas) => {

        //JSPDF implementation
        //this.doc = new jsPDF('landscape', 'pt','legal');
        //this.doc.text(10, 10, "hello!");
        //this.doc.addImage(img, 'JPEG', 0, 0, 1008, 612);
        //this.doc.save('sample.pdf');
        //this.doc.output("dataurlnewwindow");

        var img = canvas.toDataURL('image/jpeg');
        window.open(img);

        //img.href = canvas.replace("image/jpeg", "image/octet-stream");
        //img.download = "YOUR_TEAM_MAP.jpg";

    });
  }

  printReport() {
    
    //print thinking talents report
        html2canvas(jquery("#ttrpt-wrapper")[0], {
          dpi: 192,
          letterRendering: true,
          allowTaint: true,
          //proxy: "http://localhost:4200",
          logging: true,
        }).then((canvas) => {
    
            //JSPDF implementation
            //this.doc = new jsPDF('landscape', 'pt','legal');
            //this.doc.text(10, 10, "hello!");
            //this.doc.addImage(img, 'JPEG', 0, 0, 1008, 612);
            //this.doc.save('sample.pdf');
            //this.doc.output("dataurlnewwindow");
    
            var rpt = canvas.toDataURL('image/jpeg');
            window.open(rpt);
    
            //img.href = canvas.replace("image/jpeg", "image/octet-stream");
            //img.download = "YOUR_TEAM_MAP.jpg";
    
        });
  }

 
  printBsReport() {
    
    //print thinking talents report
        html2canvas(jquery("#bsrpt-wrapper")[0], {
          dpi: 192,
          letterRendering: true,
          allowTaint: true,
          //proxy: "http://localhost:4200",
          logging: true,
        }).then((canvas) => {
    
            //JSPDF implementation
            //this.doc = new jsPDF('landscape', 'pt','legal');
            //this.doc.text(10, 10, "hello!");
            //this.doc.addImage(img, 'JPEG', 0, 0, 1008, 612);
            //this.doc.save('sample.pdf');
            //this.doc.output("dataurlnewwindow");
    
            var bsrpt = canvas.toDataURL('image/jpeg');
            window.open(bsrpt);
    
            //img.href = canvas.replace("image/jpeg", "image/octet-stream");
            //img.download = "YOUR_TEAM_MAP.jpg";
    
        });
  }
      
      


}

interface skill {
  name: string;
  description: string;
  checked?: boolean;
  type?: string;
}

interface mapSkill {
  name: string;
  description?: string;
  checked?: boolean;
  names?: Array<string>;
  type?: string;
}

interface player {
  name?: string;
  talents?: Array<skill>;
  a_talents?: number;
  p_talents?: number;
  r_talents?: number;
  i_talents?: number;
  talentPref?: string;
  blindspot?: string;
}

interface team {
  players: Array<player>;
  stuffed?: boolean;
  team_name?: string;
  teampreferences?: Array<string>;
  teamblindspots?: Array<string>;
}
