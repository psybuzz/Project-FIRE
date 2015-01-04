/**
 * This file contains logic related to linguistic functions such as generating 
 * names.
 */

var Names = {
       male: ["Jacob", "Mason", "Ethan", "Noah", "William", "Liam", "Jayden", "Michael", "Alexander", "Aiden"],
       female: ["Sophia", "Emma", "Isabella", "Olivia", "Ava", "Emily", "Abigail", "Mia", "Madison", "Elizabeth"],
       random: function(gender){
              gender = gender || (Math.random() > 0.5) ? 'male' : 'female';
              if (gender == 'male'){
                     return this.male[Math.floor(Math.random()*this.male.length)];
              } else {
                     return this.female[Math.floor(Math.random()*this.female.length)];
              }
       }
};
