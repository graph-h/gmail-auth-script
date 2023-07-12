import puppeteer from "puppeteer-extra";
import pluginStealth from 'puppeteer-extra-plugin-stealth';

import * as readline from "readline";
import { Page } from "puppeteer";


const readlineInterface =  readline.createInterface({ input: process.stdin, output: process.stdout})
puppeteer.use(pluginStealth());

async function getReadLineAnswer(question: string): Promise<string> {
    return new Promise<string>(resolve => {
        readlineInterface.question(question, (answer) => {
            return resolve(answer);
        })
    })
}



async function emailAction(page: Page) {
    const email = await getReadLineAnswer('Place enter your email: ')
    await page.type('#identifierId', email);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({});

    const badInput = await page.evaluate(() => document.querySelector('#identifierId[aria-invalid="true"]') !== null);

    if (badInput) {
        console.log("Incorrect your email place try again ;)");
        process.exit(0);
    }
}

async function passwordAction(page: Page) {
    const password = await getReadLineAnswer("Place enter your email password: ");
    await page.type('input[type="password"]', password);
    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    // TODO: check email password is incorrect

    return;
}

async function getUnreadCount(page: any): Promise<string> {
    const unreadElement = await page.$('.bsU');
    if(unreadElement) {
        return  await page.evaluate((el: any) => {

            return el.textContent;
        }, unreadElement);
    }

    return "0";
}


async function main() {
    try {
        const browser = await puppeteer.launch({headless: "new", ignoreDefaultArgs: ['--enable-automation']});
        const page = await browser.newPage();
        await page.goto('https://mail.google.com/')

        await emailAction(page);

        await passwordAction(page);

        const unreadCount = await getUnreadCount(page);

        console.log(`the count of your unread emails:  ${unreadCount}`);
        await browser.close();
    } catch (e) {
        console.log('what is wrong place try again later!')
    }
    process.exit(0);
}


void main();
