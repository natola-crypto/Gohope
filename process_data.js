
function getProcessed(studentScores){

// Subjects list (excluding eng and agr for some calculations)
const subjects = ["agr","bib","bio","che","chi","com","eng","geo","his","mat","phy","soc"];


function getGrade(st_class, score ){
    if(st_class == "3" || st_class == "4") {
      if (score >= 80) return 1;
      if (score >= 75) return 2;
      if (score >= 70) return 3;
      if (score >= 65) return 4;
      if (score >= 60) return 5;
      if (score >= 55) return 6;
      if (score >= 50) return 7;
      if (score >= 40) return 8;
      return 9;
    }else{
      if (score >= 85) return "A";
      if (score >= 70) return "B";
      if (score >= 55) return "C";
      if (score >= 40) return "D";
      return "F";
    }
}

function getRank(st_class, ct_Sub, score){
  var classFiltered = studentScores.filter(s => s.class == st_class && s[ct_Sub] >= 0);
  var subjectScores = [];
  classFiltered.forEach(st => {
    subjectScores.push(st[ct_Sub]);
    }
  );
  subjectScores.sort((a, b) => b - a);
  var countRank = 1;
  var stRank = "";
  subjectScores.forEach(eachScore => {
    if(score == eachScore){
        stRank = countRank;
    }else{
      countRank++;
    }
  });
  //console.log(countRank);
  return stRank;
}
function getPoints (st_data){
  var thisStudent = [];
  const subjecs = ["agr","bib","bio","che","chi","com","geo","his","mat","phy","soc"];
  subjecs.forEach( sub =>{
    var eachSubj = {};
    eachSubj["sub"] = sub;
    eachSubj["grade"] = getGrade(st_data["class"], st_data[sub]);
    thisStudent.push(eachSubj);
  });

  thisStudent.sort((a,b) => Number(a["grade"]) - Number(b["grade"]));
  var count = 0;
  var aggPoints = 0;
  thisStudent.forEach( everySub =>{
    if(count < 5 ){
      aggPoints = aggPoints + everySub["grade"];
    }
    count++;
  });
  
  return (aggPoints + getGrade(st_data["class"], st_data["eng"]));
}

function getAverage (st_data){
  var  total = 0;
  subjects.forEach( sub =>{
    if(st_data[sub] >= 0){
      total = Number(total) + Number(st_data[sub]);
    }
  });
return Math.round(total/12);
}
function checkStatus(st_data){
  var checkFive = 0;
  var stStatus = "failed";
  subjects.forEach( sub =>{
    if(st_data[sub]>=40 && sub != "eng"){
        checkFive++
      }
  });
  if(st_data["eng"]>= 40 && checkFive >= 5){
      stStatus = "passed";
    }else{
      stStatus = "failed";
    }

    return stStatus;
  
}
function getJuniorRank(st_points, st_data){
  var countRanks = 1;
  var st_rank = 0;
  function rankByStatus (the_status){
    var filteredScores = studentScores.filter(s => s.class == st_data["class"] && checkStatus(s) == the_status);
    var arrangedPoints = [];
    
    filteredScores.forEach( eachSt =>{
      arrangedPoints.push(getAverage(eachSt));
    });
    arrangedPoints.sort((a,b) => b - a);
    arrangedPoints.forEach( eachPoint =>{
      if(st_points == eachPoint){
        st_rank = countRanks;
     }else{
        countRanks++;
     }
    });
   
    return st_rank;
    //console.log(st_points);
    //console.log(arrangedPoints);
  }
  if(checkStatus(st_data) == "passed"){
    return rankByStatus("passed");
  }else{
    var ct = rankByStatus("passed");
    return rankByStatus("failed");
    
      
  }
  
  

}

function getSeniorRank(st_points, st_data){
  var countRanks = 1;
  var st_rank = 0;
  function rankByStatus (the_status){
    var filteredScores = studentScores.filter(s => s.class == st_data["class"] && checkStatus(s) == the_status);
    var arrangedPoints = [];
    
    filteredScores.forEach( eachSt =>{
      arrangedPoints.push(getPoints(eachSt));
    });
    arrangedPoints.sort((a,b) => a - b);
    arrangedPoints.forEach( eachPoint =>{
      if(st_points == eachPoint){
        st_rank = countRanks;
     }else{
        countRanks++;
     }
    });
   
    return st_rank;
    //console.log(st_points);
    //console.log(arrangedPoints);
  }
  if(checkStatus(st_data) == "passed"){
    return rankByStatus("passed");
  }else{
    var ct = rankByStatus("passed");
    return rankByStatus("failed");
    
      
  }
  
  

}


var processedScores = [];
function processData(){

var eachStudent = {};

  studentScores.forEach(student => {
    eachStudent = student;
    var checkFive = 0;
    subjects.forEach( sub =>{
      //get grades
      eachStudent[sub+'_grade'] = getGrade(student["class"], student[sub]); 
      // get ranks
      eachStudent[sub+'_rank'] = getRank(student["class"], sub, student[sub]); 
      // check if 5 passed
      if(student[sub]>=40 && sub != "eng"){
        checkFive++
      }

    });
    eachStudent["status"] = checkStatus(student);
    if(student["class"] == 3 || student["class"] == 4){
      eachStudent["class_grade"] = getPoints(student);
      eachStudent["class_rank"] = getSeniorRank(getPoints(student), student);
    }else{
      eachStudent["class_grade"] = getAverage(student);
      eachStudent["class_rank"] = getJuniorRank(getAverage(student), student);
    }
    
    processedScores.push(eachStudent);
  });


return processedScores;
}
return processData();

}
//console.log(getProcessed());
