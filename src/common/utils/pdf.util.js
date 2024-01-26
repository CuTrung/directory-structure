const ejs = require("ejs");
const puppeteer = require("puppeteer");

const printPDF = async ({
  template,
  data,
  filename = "file_to_print",
  orientation = "portrait",
  format = "A4",
  width,
  getOnlyPageAt = 1, // Chỉ lấy trang ở vị trí chỉ định
}) => {
  const minimal_args = [
    "--autoplay-policy=user-gesture-required",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-breakpad",
    "--disable-client-side-phishing-detection",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-dev-shm-usage",
    "--disable-domain-reliability",
    "--disable-extensions",
    "--disable-features=AudioServiceOutOfProcess",
    "--disable-hang-monitor",
    "--disable-ipc-flooding-protection",
    "--disable-notifications",
    "--disable-offer-store-unmasked-wallet-cards",
    "--disable-popup-blocking",
    "--disable-print-preview",
    "--disable-prompt-on-repost",
    "--disable-renderer-backgrounding",
    "--disable-setuid-sandbox",
    "--disable-speech-api",
    "--disable-sync",
    "--hide-scrollbars",
    "--ignore-gpu-blacklist",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-default-browser-check",
    "--no-first-run",
    "--no-pings",
    "--no-sandbox",
    "--no-zygote",
    "--password-store=basic",
    "--use-gl=swiftshader",
    "--use-mock-keychain",
  ];

  let browser;

  return new Promise((resolve, reject) => {
    (async () => {
      let params = {
        // executablePath: 'google-chrome',
        headless: true,
        args: minimal_args,
      };
      // if (!config.runLocal) {
      //     params = {
      //         executablePath: 'google-chrome',
      //         headless: true,
      //         args: minimal_args,
      //     };
      // }
      const browser = await puppeteer.launch(params);
      // const browser = null;
      const [page] = await browser.pages();
      const html = await ejs.renderFile(
        `${APP_DIR_ROOT}/app/templates/pdf/print-file/${template}`,
        {
          data: data,
        },
      );
      await page.setContent(html);
      const pdfOptions = {
        path: `storage/pdf/${filename}.pdf`,
        format,
        printBackground: true,
        orientation,
      };
      // Nếu có format thì width sẽ ko có tác dụng
      if (width) {
        delete pdfOptions.format;
        pdfOptions.width = width;
      }

      if (getOnlyPageAt) pdfOptions.pageRanges = getOnlyPageAt.toString();

      // Xác định chiều cao thực tế của nội dung trên trang
      const contentHeight = await page.evaluate(() => {
        const { body, documentElement: html } = document;
        return Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight,
        );
      });

      // Tính số lần phải ngắt trang dựa trên chiều cao của nội dung và chiều cao trang A5
      const MAX_HEIGHT_A5 = 595; // px
      const numPages = Math.ceil(contentHeight / MAX_HEIGHT_A5);

      // Lặp qua từng trang để in
      for (let i = 0; i < numPages; i++) {
        if (i > 0) {
          // Tạo trang mới trước khi in nội dung tiếp theo
          await page.evaluate(() => {
            const pageBreak = document.createElement("div");
            pageBreak.style.pageBreakBefore = "always";
            document.body.appendChild(pageBreak);
          });
        }
      }

      page
        .pdf(pdfOptions)
        .then((e) => resolve(e))
        .catch((error) => resolve(error));
    })()
      .catch((error) => reject(error))
      .finally(() => browser?.close());
  });
};

module.exports = {
  printPDF,
};
