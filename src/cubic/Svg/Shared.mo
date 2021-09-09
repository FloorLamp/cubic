import Array "mo:base/Array";

module {
  public let SHADOW = "<filter id='shadow' x='0' y='0' width='175' height='200'><feOffset result='offOut' in='SourceAlpha' dx='2' dy='2'/><feColorMatrix result='matrixOut' in='offOut' type='matrix' values='0.49 0 0 0 0 0 0.49 0 0 0 0 0 0.49 0 0 0 0 0 0.2 0'/><feGaussianBlur result='blurOut' in='matrixOut' stdDeviation='1'/><feBlend in='SourceGraphic' in2='blurOut' mode='normal'/></filter>";

  public func join(arg: [Text]): Text {
    Array.foldLeft<Text, Text>(arg, "", func (a, b) { a # b })
  };
}
