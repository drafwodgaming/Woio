using DSharpPlus;
using DSharpPlus.CommandsNext;
using DSharpPlus.Interactivity;
using DSharpPlus.SlashCommands;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Woody.Commands;

namespace Woody.Bot
{
    public class Bot
    {
        #region Variables
        public DiscordClient Client { get; private set; }
        public InteractivityExtension Interactivity { get; private set; }
        public CommandsNextExtension Сommands { get; private set; }
        #endregion

        public async Task WoodyCord()
        {

            #region Json
            var json = string.Empty;
            using (var fs = File.OpenRead("BotToken.json"))
            using (var streamReader = new StreamReader(fs, new UTF8Encoding(false)))
                json = await streamReader.ReadToEndAsync().ConfigureAwait(false);
            var configJson = JsonConvert.DeserializeObject<ConfigJson>(json);
            #endregion

            var config = new DiscordConfiguration
            {
                Token = configJson.Token,
                TokenType = TokenType.Bot,
                AutoReconnect = true,
                UseRelativeRatelimit = true,
            };

            Client = new DiscordClient(config);

            var slash = Client.UseSlashCommands();
            slash.RegisterCommands<AboutCommands>(guildId: 890594642796609576);

            await Client.ConnectAsync();

            await Task.Delay(-1);
        }
    }
}
