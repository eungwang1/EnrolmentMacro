'use strict';

function waitFor(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');

//eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

(async () => {
  // launch 메서드는 chrome을 실행시킴. headless는 ui를 제공하는지 안하는지 여부임. false로 해야 ui가 뜨고 아니면 백그라운드에서만 켜짐
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    devtools: true,
  });

  // 새롭게 페이지를 만든다.
  const page = await browser.newPage();
  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.dismiss();
  });
  page.on('console', consoleObj => consoleObj.args);
  // goto는 url로 이동하는 메서드
  await page.goto('https://songdo.ysfsmc.or.kr/application/cart.asp');
  // 해당 탭에서 마우스 오른쪽 버튼 클릭 후 검사 버튼을 눌러 태그의 classname이나 id값을 알아내서 넣는다.
  await page.keyboard.press('Enter');

  await page.type('#id', process.env.ID);
  await page.type('#pw', process.env.PASSWORD);
  await page.keyboard.press('Enter');
  await page.keyboard.press('F12');
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await page.goto(
      'https://songdo.ysfsmc.or.kr/application/applicationList.asp'
    );
    await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      addCart('010000011', '1', '01');
    });
    await waitFor(3000);
    await page.goto('https://songdo.ysfsmc.or.kr/application/cart.asp');
    await page.reload();
    await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      allOrder();
    });
    await waitFor(3000);
  }
})();
