const puppeteer = require('puppeteer');
const express = require('express')
const app = express()


var grabData

puppeteer.launch()
    .then(async browser => {
        const page = await browser.newPage();
        await page.goto('https://github.com/CITF-Malaysia/citf-public/blob/main/vaccination/vax_malaysia.csv');
        await page.waitForSelector('body');

        grabData = await page.evaluate(() => {

            scrapeItems = [];

            let dataTrLevel = document.body.querySelectorAll('table.js-csv-data > tbody > tr ');

            dataTrLevel.forEach(item => {

                let dataModel = {
                    date: null,
                    dose1_daily: null,
                    dose2_daily: null,
                    total_daily: null,
                    dose1_cumul: null,
                    dose2_cumul: null,
                    total_cumul: null
                }

                let dataTdLevel = item.querySelectorAll('td')

                dataTdLevel.forEach((element, index) => {
                    switch (index) {
                        case 1:
                            dataModel.date = element.innerHTML
                            break;

                        case 2:
                            dataModel.dose1_daily = parseInt(element.innerHTML)
                            break;

                        case 3:
                            dataModel.dose2_daily = parseInt(element.innerHTML)
                            break;

                        case 4:
                            dataModel.total_daily = parseInt(element.innerHTML)
                            break;

                        case 5:
                            dataModel.dose1_cumul = parseInt(element.innerHTML)
                            break;

                        case 6:
                            dataModel.dose2_cumul = parseInt(element.innerHTML)
                            break;

                        case 7:
                            dataModel.total_cumul = parseInt(element.innerHTML)
                            break;
                    }
                });


                scrapeItems.push(dataModel)


            });


            let items = scrapeItems
            return items;


        });
        await browser.close();
    })
    .catch(function (err) {
        console.error(err);
    });

app.get('/vax_malaysia', (req, res) => {
    res.send(grabData)
})

app.listen(4100, () => console.log("Listening on port 4100 .."))