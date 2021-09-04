import HashMap = "mo:base/HashMap";
import Blob = "mo:base/Blob";
import Text "mo:base/Text";
import Option "mo:base/Option";

module {
  public type HttpRequest = {
    body: Blob;
    headers: [HeaderField];
    method: Text;
    url: Text;
  };

  public type StreamingCallbackToken =  {
    content_encoding: Text;
    index: Nat;
    key: Text;
    sha256: ?Blob;
  };
  public type StreamingCallbackHttpResponse = {
    body: Blob;
    token: ?StreamingCallbackToken;
  };
  public type ChunkId = Nat;
  public type SetAssetContentArguments = {
    chunk_ids: [ChunkId];
    content_encoding: Text;
    key: Key;
    sha256: ?Blob;
  };
  public type Path = Text;
  public type Key = Text;

  public type HttpResponse = {
    body: Blob;
    headers: [HeaderField];
    status_code: Nat16;
    streaming_strategy: ?StreamingStrategy;
  };

  public type StreamingStrategy = {
    #Callback: {
      callback: query (StreamingCallbackToken) ->
      async (StreamingCallbackHttpResponse);
      token: StreamingCallbackToken;
    };
  };

  public type HeaderField = (Text, Text);

  public func removeQuery(str: Text): Text {
    Option.unwrap(Text.split(str, #char '?').next());
  };

  public func svg(data: Text): HttpResponse {
    {
      body = Text.encodeUtf8(data);
      headers = [("Content-Type", "image/svg+xml")];
      status_code = 200;
      streaming_strategy = null;
    }
  }
};
