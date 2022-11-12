using DSharpPlus;
using DSharpPlus.CommandsNext;
using DSharpPlus.Interactivity;
using DSharpPlus.SlashCommands;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Woody.Commands;
using Microsoft.Extensions.Logging;
using DSharpPlus.EventArgs;
using System;

namespace Woody.Bot
{
    public class Bot
    {
        #region Variables
        public DiscordClient Client { get; private set; }
        public InteractivityExtension Interactivity { get; private set; }
        public CommandsNextExtension Сommands { get; private set; }
        internal static EventId TestBotEventId { get; } = new EventId(1000, "TestBot");
        #endregion

        public async Task WoodyCord()
        {
            #region Json
            var json = string.Empty;
            using (var fs = File.OpenRead("Config.json/BotConfig.json"))
            using (var streamReader = new StreamReader(fs, new UTF8Encoding(false)))
                json = await streamReader.ReadToEndAsync().ConfigureAwait(false);
            var configJson = JsonConvert.DeserializeObject<ConfigJson>(json);
            #endregion

            var config = new DiscordConfiguration
            {
                AutoReconnect = true,
                LargeThreshold = 250,
                MinimumLogLevel = LogLevel.Trace,
                Token = configJson.Token,
                TokenType = TokenType.Bot,
                MessageCacheSize = 2048,
                LogTimestampFormat = "dd-MM-yyyy HH:mm:ss",
            };

            Client = new DiscordClient(config);

            Client.Ready += ClientReady;
            Client.GuildStickersUpdated += ClientStickersUpdate;
            Client.GuildAvailable += ClientGuildAvailable;

            var slash = Client.UseSlashCommands();
            slash.RegisterCommands<AboutCommands>(guildId: 890594642796609576);

            await Client.ConnectAsync();

            await Task.Delay(-1);
        }

        private Task ClientReady(DiscordClient client, ReadyEventArgs e) => Task.CompletedTask;
        private Task ClientStickersUpdate (DiscordClient sender, GuildStickersUpdateEventArgs e)
        {
            Client.Logger.LogInformation("{GuildId} стикеры обновлены: {StickerBeforeCount} -> {StickerAfterCount}", e.Guild.Id, e.StickersBefore.Count, e.StickersAfter.Count);
            return Task.CompletedTask;
        }
        private Task ClientGuildAvailable(DiscordClient client, GuildCreateEventArgs e)
        {
            client.Logger.LogInformation(TestBotEventId, "Сервер доступен: '{GuildId}'", e.Guild.Name);
            return Task.CompletedTask;
        }
    }
}