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
using DSharpPlus.Entities;
using System.Linq;

namespace Woody.Bot
{
    public class Bot
    {
        #region Variables
        public DiscordClient Client { get; private set; }
        public InteractivityExtension Interactivity { get; private set; }
        public CommandsNextExtension Сommands { get; private set; }
        internal static EventId WoodyBotEventId { get; } = new EventId(1000, "Woody");
        #endregion

        public async Task WoodyCord()
        {
            #region Json
            var json = string.Empty;
            using (var fs = File.OpenRead("ConfigJson/BotConfig.json"))
            using (var streamReader = new StreamReader(fs, new UTF8Encoding(false)))
                json = await streamReader.ReadToEndAsync().ConfigureAwait(false);
            var configJson = JsonConvert.DeserializeObject<ConfigJson>(json);
            #endregion

            var config = new DiscordConfiguration
            {
                AutoReconnect = true,
                LargeThreshold = 250,
                Token = configJson.Token,
                TokenType = TokenType.Bot,
                MessageCacheSize = 2048,
                LogTimestampFormat = "dd-MM-yyyy HH:mm:ss",
            };

            Client = new DiscordClient(config);

            #region Events
            Client.Ready += ClientReady;
            Client.GuildAvailable += ClientGuildAvailable;
            Client.SocketErrored += ClientSocketError;
            Client.GuildCreated += ClienGuildCreate;
            Client.GuildUpdated += ClienGuildUpdate;
            Client.ChannelCreated   += ClienChannelCreate;
            Client.ChannelDeleted  += ClientChannelDelete;
            Client.ChannelUpdated += ClienChannelUpdate;
            #endregion

            var slash = Client.UseSlashCommands();
            slash.RegisterCommands<AboutCommands>(guildId: 890594642796609576);

            await Client.ConnectAsync();

            await Task.Delay(-1);
        }

        private Task ClientReady(DiscordClient sender, ReadyEventArgs e) => Task.CompletedTask;
        private Task ClientGuildAvailable(DiscordClient client, GuildCreateEventArgs e)
        {
            client.Logger.LogInformation(WoodyBotEventId, "Сервер доступен: '{GuildId}'", e.Guild.Name);
            return Task.CompletedTask;
        }
        private Task ClientSocketError(DiscordClient client, SocketErrorEventArgs e)
        {
            var ex = e.Exception is AggregateException ae ? ae.InnerException : e.Exception;
            client.Logger.LogError(WoodyBotEventId, ex, "Websocket ошибка.");
            return Task.CompletedTask;
        }
        private Task ClienGuildCreate(DiscordClient client, GuildCreateEventArgs e)
        {
            client.Logger.LogInformation(WoodyBotEventId, "Сервер создан '{GuildId}'", e.Guild.Name);
            return Task.CompletedTask;
        }
        private Task ClienGuildUpdate(DiscordClient client, GuildUpdateEventArgs e)
        {
            var str = new StringBuilder();

            str.AppendLine($"Сервер {e.GuildBefore.Name} был обновлён.");

            foreach (var properties in typeof(DiscordGuild).GetProperties())
            {
                try
                {
                    var before = properties.GetValue(e.GuildBefore);
                    var after = properties.GetValue(e.GuildAfter);

                    if (before is null) client.Logger.LogDebug(WoodyBotEventId, "Сервер обновлён: свойство {Property} было нулевым", properties.Name);
                    if (after is null) client.Logger.LogDebug(WoodyBotEventId, "Сервер обновлён; свойство {Property} было нулевым",properties.Name); 

                    if (before is null || after is null) continue;
                    if (before.ToString() == after.ToString()) continue;

                    str.AppendLine($" - {properties.Name}: `{before}` to `{after}`");
                }
                catch (Exception ex)
                {
                    client.Logger.LogError(WoodyBotEventId, ex, "Ошибка при обновлении сервера");
                }
            }

            str.AppendLine($" - VoiceRegion: `{e.GuildBefore.VoiceRegion?.Name}` to `{e.GuildAfter.VoiceRegion?.Name}`");

            Console.WriteLine(str);

            return Task.CompletedTask;
        }
        private async Task ClienChannelCreate(DiscordClient sender, ChannelCreateEventArgs e)
        {
            var logs = (await e.Guild.GetAuditLogsAsync(5, null, AuditLogActionType.ChannelDelete).ConfigureAwait(false)).Cast<DiscordAuditLogChannelEntry>();
            foreach (var entry in logs) Console.WriteLine("TargetId: " + entry.Target.Id);
        }
        private async Task ClientChannelDelete(DiscordClient sender, ChannelDeleteEventArgs e)
        {
            var logs = (await e.Guild.GetAuditLogsAsync(5, null, AuditLogActionType.ChannelCreate).ConfigureAwait(false)).Cast<DiscordAuditLogChannelEntry>();
            foreach (var entry in logs) Console.WriteLine("TargetId: " + entry.Target.Id);
        }
        private async Task ClienChannelUpdate(DiscordClient sender, ChannelUpdateEventArgs e)
        {
            var logs = (await e.Guild.GetAuditLogsAsync(5, null, AuditLogActionType.ChannelUpdate).ConfigureAwait(false)).Cast<DiscordAuditLogChannelEntry>();
            foreach (var entry in logs) Console.WriteLine("TargetId: " + entry.Target.Id);
        }
    }
}