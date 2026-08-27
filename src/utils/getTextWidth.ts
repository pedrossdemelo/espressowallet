export default function getTextWidth(text: string, font?: string): number {
  const canvas = document.createElement("canvas");
  // Non-null: canvas 2d context is always available for a freshly created
  // <canvas>; matches the original code, which never guarded this either.
  const context = canvas.getContext("2d")!;

  context.font = font || getComputedStyle(document.body).font;

  return Math.round(context.measureText(text).width);
}
