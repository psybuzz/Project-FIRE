Bigram = {"th": 1.52, "en": 0.55, "ng": 0.18, "he": 1.28, "ed": 0.53, "of": 0.16, "in": 0.94, "to": 0.52, "al": 0.09, "er": 0.94, "it": 0.50, "de": 0.09, "an": 0.82, "ou": 0.50, "se": 0.08, "re": 0.68, "ea": 0.47, "le": 0.08, "nd": 0.63, "hi": 0.46, "sa": 0.06, "at": 0.59, "is": 0.46, "si": 0.05, "on": 0.57, "or": 0.43, "ar": 0.04, "nt": 0.56, "ti": 0.34, "ve": 0.04, "ha": 0.56, "as": 0.33, "ra": 0.04, "es": 0.56, "te": 0.27, "ld": 0.02, "st": 0.55, "et": 0.19, "ur": 0.02};
ab = alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
Names = {
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
}

function histogram(text){
       //split text if it's a string
       var tokens = (typeof text === 'string') ? split(text) : text;
       var hist = {};

       for (var i=0, len=tokens.length; i<len; i++){
              var e = tokens[i];
              hist[e] = (++hist[e]) || 1;
       }
       return hist;
}

//splits a string into words
function split(text){
       var sand = text.replace(/\.|,|!|;|:|\?/g, '').trim().split(/\s+/);
       return sand;
}

//returns a list of distinct tokens
function tokenize(list){
       list = (typeof list === 'string') ? split(list) : list;
       var found = {};
       var newlist = new Array(), ct = 0;
       for (var i=0; i<list.length; i++){
              var e = list[i];
              // found[e] = (found[e]++) || 0;
              if (e.length > 0 && found[e] != 1){                //use more space, take less time
                     newlist[ct++] = e;
                     found[e] = 1;
              }
       }
       // found = null;            //garbage collect

       return newlist;
}

//counts occurrences of Key in List
function occurs(key, list){
       var ct = 0;
       for (var e in list){
              if (key === list[e]){
                     ct++;
              }
       }
       return ct;
}

//probability of A given B in a set of tokens
function P(a, b, tokens){
       var bCount = 0;
       var baCount = 0;
       var diff = (a == b);
       for (var i=0, len=tokens.length; i<len-1; i++){
              if (tokens[i] == b){
                     bCount++;
                     if (i+1<len && (tokens[i+1] == a)){
                            baCount++;
                            i += (diff) ? 1 : 0;
                     }
              }
       }
       if (bCount == 0){
              return 0;
       }
       return baCount / bCount;
}


//similarity measure
function similar(one, two){
       if (one.length == 0 || two.length == 0){
              return 0;
       }

       var shared = 0;
       for (var o in one){
              if (one.hasOwnProperty(o) && two.indexOf(one[o]) != -1){    //if we found a duplicate, 
                     shared += 1;
              }
       }
       return 2*shared / (one.length + two.length);
}

function around(target, spread){
       return Math.random()*spread + target - (spread/2);
}


function word(len){
       len = len || -1;
       var done = false;
       var word = "";
       var lastlet = ab[Math.floor(ab.length*Math.random())];
       var newlet;
       word += lastlet;

       while ( (!done) ){
              if ( len == -1 && Math.random() > 0.5 ){    //no bound, keep rolling dice         
                     $.each(Bigram, function(k, v){
                            if (k[0] == lastlet && Math.random() < v){
                                   newlet = k[1];
                            }
                     });

                     //if still undefined, give it a random letter
                     if (newlet === undefined){
                            newlet = ab[Math.floor(ab.length*Math.random())];
                     }
              } else if (word.length < len) {             //keep going until bound is hit
                     $.each(Bigram, function(k, v){
                            if (k[0] == lastlet && Math.random() < v){
                                   newlet = k[1];
                            }
                     });

                     //if still undefined, give it a random letter
                     if (newlet === undefined){
                            newlet = ab[Math.floor(ab.length*Math.random())];
                     }
              } else {
                     done = true;
                     newlet = "";
              }

              word += newlet;
              lastlet = newlet;
              newlet = undefined;
       }

       return word;
}

function sentence(len, wordlen){
       len = len || Math.random()*7+3;
       var sentence = "";
       for (var i=0; i<len; i++){
              sentence += word(wordlen) + " ";
       }
       return sentence.trim();
}

var langs =
[['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Türkçe',          ['tr-TR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['Lingua latīna',   ['la']]];

lang = langs[6];
dialect = lang[6];

var recognizing = false;