module.exports = {
  createQR: async ({
    data = [],
    file_path_img_center,
    qr_width = 120,
    qr_height = qr_width,
    img_width = 20,
    img_height = img_width,
  }) => {
    try {
      const QRCode = require("qrcode");
      const { createCanvas, loadImage } = require("canvas");
      const fs = require("fs");
      const canvas = createCanvas(qr_width, qr_height);
      QRCode.toCanvas(canvas, data, {
        errorCorrectionLevel: "H",
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      const convertPNGToBase64 = async (filePath) => {
        try {
          const pngData = await fs.promises.readFile(filePath);
          return `data:image/png;base64,${pngData.toString("base64")}`;
        } catch (error) {
          console.error("Error converting PNG to base64:", error);
          throw error;
        }
      };

      const img = await loadImage(
        await convertPNGToBase64(file_path_img_center),
      );
      const center = (qr_width - img_width) / 2;
      canvas
        .getContext("2d")
        .drawImage(
          img,
          (canvas.width - img_width) / 2,
          (canvas.height - (img_height ?? img_width)) / 2,
          img_width,
          img_height ?? img_width,
        );
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.log(error);
    }
  },
};
