using Newtonsoft.Json;

namespace Woody
{
    public struct ConfigJson
    {

        public static string FilePath {get;} = @"Configs/BotConfigs.json";

        [JsonProperty("token")]
        public string Token { get; private set; }

        [JsonProperty("prefix")]
        public string Prefix { get; private set; }
    }
}
