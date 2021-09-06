module {
  public let SHADOW = "<filter id='shadow' x='0' y='0' width='175' height='200'><feOffset result='offOut' in='SourceAlpha' dx='2' dy='2'/><feColorMatrix result='matrixOut' in='offOut' type='matrix' values='0.49 0 0 0 0 0 0.49 0 0 0 0 0 0.49 0 0 0 0 0 0.2 0'/><feGaussianBlur result='blurOut' in='matrixOut' stdDeviation='1'/><feBlend in='SourceGraphic' in2='blurOut' mode='normal'/></filter>";
}
