require("chromedriver");

const wd = require("selenium-webdriver");

const chrome=require("selenium-webdriver/chrome");  // for no website displayAQ 
const browser=new wd.Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
let matchId=process.argv[2];
let innings=process.argv[3];
let batsmenScorecard=[];
let batsmenKeys=["PlayerName","Out","Runs","BallsPlayed","fours","sixes","StrikeRate"];

let bowlerScorecard=[];
let bowlerKeys=["PlayerName","Over","Maiden","Run","Wickets","NB","WB","ECO"];

async function main(){
    await browser.get("https://www.cricbuzz.com/live-cricket-scores/"+matchId);
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a")));  // safer code for slow internet.
    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click(); // for click on scorecard
    buttons[1].getAttribute("href");

    await browser.wait(wd.until.elementLocated(wd.By.css("#innings_"+innings +" .cb-col.cb-col-100.cb-ltst-wgt-hdr")));  // safer code for slow internet.
    let tables=await browser.findElements(wd.By.css("#innings_"+innings +" .cb-col.cb-col-100.cb-ltst-wgt-hdr"));

    // batsmen
     console.log(tables.length);
    // let innings1batsmenRows= await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    // for(let i=0;i<innings1batsmenRows.length;i++){
    //     let columns=await innings1batsmenRows[i].findElements(wd.By.css("div"));

    //     if(columns.length == 7){
    //         let data={}; // object
    //         for(let j=0;j<columns.length;j++){
    //             data[batsmenKeys[j]]=await columns[j].getAttribute("innerText");  // store in oblect
    //         }
    //         batsmenScorecard.push(data);
    //     }   
    // }
    // console.log(batsmenScorecard);

    

    // //bowler
    // let innings1bowlerRows= await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    // for(let i=0;i<innings1bowlerRows.length;i++){
    //     let columns=await innings1bowlerRows[i].findElements(wd.By.css("div"));

    //     if(columns.length == 8){
    //         let data={}; // object
    //         for(let j=0;j<columns.length;j++){
    //             data[bowlerKeys[j]]=await columns[j].getAttribute("innerText");  // store in oblect
    //         }
    //         bowlerScorecard.push(data);
    //     }   
    // }
    // console.log(bowlerScorecard);
    await browser.close();
}
main();

