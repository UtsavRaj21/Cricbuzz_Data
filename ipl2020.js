require("chromedriver");
const fs=require("fs");
const wd = require("selenium-webdriver");

const browser=new wd.Builder().forBrowser('chrome').build();
let finalData=[];
let urlFinal=[];
let teamMember=[];

async function main(){
    await browser.get("https://www.cricbuzz.com/cricket-series/3130/indian-premier-league-2020/squads");
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-col.cb-col-20 a")));  // safer code for slow internet.
    let buttons = await browser.findElements(wd.By.css(".cb-col.cb-col-20 a"));

    for(let i=0;i<buttons.length;i++){
         finalData.push({Team :await buttons[i].getAttribute("innerText")});
    }

    for(let i = 0; i < buttons.length; i++){
         await buttons[i].click();
         await new Promise(done => setTimeout(() => done(), 2000));// for wait -----------------------------------------------------
         
        await browser.wait(wd.until.elementLocated(wd.By.css(".cb-col.cb-col-80.cb-ful-comm a"))); 
        let playerLink = await browser.findElements(wd.By.css(".cb-col.cb-col-80.cb-ful-comm a"));
        teamMember.push(playerLink.length);

        finalData[i]["playerDetail"] = [];
        await browser.wait(wd.until.elementLocated(wd.By.css(".cb-font-16.text-hvr-underline"))); 
        let playerName= await browser.findElements(wd.By.css(".cb-font-16.text-hvr-underline"));

        await browser.wait(wd.until.elementLocated(wd.By.css(".cb-text-gray"))); 
        let playerJob= await browser.findElements(wd.By.css(".cb-text-gray"));

         for(let j=0;j<playerLink.length;j++){
             let url = await playerLink[j].getAttribute("href");
            urlFinal.push({link:url});
            let name=await playerName[j].getAttribute("innerText");
            let job=await playerJob[j].getAttribute("innerText");
            finalData[i].playerDetail.push({playername: name,playerJob:job});
            
         }
        }
        
        let count=0;
        for(let i=0;i<buttons.length;i++){
           
            for(let j=0;j<teamMember[i];j++){
                await browser.get(urlFinal[count].link);
                //await browser.wait(wd.until.elementLocated(wd.By.css(".cb-col.cb-col-67.cb-bg-white.cb-plyr-rt-col"))); 
                //let tables = await browser.findElements(wd.By.css(".cb-col.cb-col-67.cb-bg-white.cb-plyr-rt-col .cb-plyr-tbl table"));
                let tables = await browser.findElements(wd.By.css("table"));
                if(tables.length==0){
                    count++;
                    continue;
                }
                let battingKeys = [];
                let bowlingKeys = [];
                for(let l = 0; l < tables.length; l++) {
                    
                    let keyColumns = await tables[l].findElements(wd.By.css("thead th"));
                    for(let k = 1; k < keyColumns.length; k++) {
                        let title = await keyColumns[k].getAttribute("title");
                        title = title.split(" ").join("");
                        if(l == 0) {
                            battingKeys.push(title);
                        } else {
                            bowlingKeys.push(title);
                        }
                    }
                    let data = {};
                    let dataRows = await tables[l].findElements(wd.By.css("tbody tr"));
                    for(let k = 0; k < dataRows.length; k++) {
                        let tempData = {};
                        let dataColumns = await dataRows[k].findElements(wd.By.css("td"));
                        let matchType = await dataColumns[0].getAttribute("innerText");
                        for(let z = 1; z < dataColumns.length; z++) {
                            tempData[l == 0 ? battingKeys[z-1] : bowlingKeys[z-1]] = await dataColumns[z].getAttribute("innerText");
                        }
                        data[matchType] = tempData;
                    }
                    finalData[i].playerDetail[j][l == 0 ? "battingCareer" : "bowlingCareer"] = data;
                }
                 count++;
            }
        }
    fs.writeFileSync("iplStats(async).json", JSON.stringify(finalData));
    await browser.close();
}
main();