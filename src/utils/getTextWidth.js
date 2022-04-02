export default function getTextWidth(text, font) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  context.font = font || getComputedStyle(document.body).font;

  return Math.round(context.measureText(text).width);
}
