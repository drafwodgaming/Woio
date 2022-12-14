#pragma warning disable CS0618
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
using DSharpPlus.SlashCommands.EventArgs;
using Microsoft.Extensions.DependencyInjection;

namespace Woody.Bot
{
    public class Bot
    {
        #region Variables
        internal static EventId WoodyBotEventId { get; } = new EventId(1000, "Woio");
        public DiscordClient Client { get; private set; }
        public InteractivityExtension Interactivity { get; private set; }
        public SlashCommandsExtension SlashCommandService { get; private set; }
        #endregion

        public Bot(IServiceProvider serviceProvider)
        {
            #region Json
            var json = string.Empty;
            using (var fs = File.OpenRead("ConfigJson/BotConfig.json"))
            using (var streamReader = new StreamReader(fs, new UTF8Encoding(false)))
                json = streamReader.ReadToEnd();

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
            Client.ChannelCreated += ClienChannelCreate;
            Client.ChannelDeleted += ClientChannelDelete;
            Client.ChannelUpdated += ClienChannelUpdate;
            #endregion

            SlashCommandService = Client.UseSlashCommands();
            SlashCommandService.SlashCommandErrored += SlashCommandErrored;
            SlashCommandService.SlashCommandInvoked += SlashCommandReceived;
            SlashCommandService.SlashCommandExecuted += SlashCommandExecuted;

            SlashCommandService.RegisterCommands<AboutCommands>(guildId: 890594642796609576);

            Client.ConnectAsync();

            Task.Delay(-1);
        }

        #region Logs
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
            var logs = (await e.Guild.GetAuditLogsAsync(5, null, AuditLogActionType.ChannelCreate).ConfigureAwait(false)).Cast<DiscordAuditLogChannelEntry>();
            foreach (var entry in logs) Console.WriteLine("TargetId: " + entry.Target.Id);
        }
        private async Task ClientChannelDelete(DiscordClient sender, ChannelDeleteEventArgs e)
        {
            var logs = (await e.Guild.GetAuditLogsAsync(5, null, AuditLogActionType.ChannelDelete).ConfigureAwait(false)).Cast<DiscordAuditLogChannelEntry>();
            foreach (var entry in logs) Console.WriteLine("TargetId: " + entry.Target.Id);
        }
        private async Task ClienChannelUpdate(DiscordClient sender, ChannelUpdateEventArgs e)
        {
            var logs = (await e.Guild.GetAuditLogsAsync(5, null, AuditLogActionType.ChannelUpdate).ConfigureAwait(false)).Cast<DiscordAuditLogChannelEntry>();
            foreach (var entry in logs) Console.WriteLine("TargetId: " + entry.Target.Id);
        }

        private async Task SlashCommandErrored(SlashCommandsExtension slashCommands, SlashCommandErrorEventArgs e)
        {
            e.Context.Client.Logger.LogError(WoodyBotEventId, e.Exception, "Произошло исключение {User} во время вызова `{Command}`", e.Context.User.Username, e.Context.CommandName);
            var emoji = DiscordEmoji.FromName(e.Context.Client, ":no_entry");

            var embed = new DiscordEmbedBuilder
            {
                Title = "Ошибка",
                Description = $"{emoji} Ошибка!",
                Color = new DiscordColor(0xFF0000)
            };

            await e.Context.CreateResponseAsync(embed);
        }
        private Task SlashCommandReceived(SlashCommandsExtension slashCommands, SlashCommandInvokedEventArgs e)
        {
            e.Context.Client.Logger.LogInformation(WoodyBotEventId, "Пользователь {User} пытается выполнить комманду `{Command}` в канале [ {Channel} ]", e.Context.User.Username, e.Context.CommandName, (e.Context.Channel.Name).ToUpper());
            return Task.CompletedTask;
        }
        private Task SlashCommandExecuted(SlashCommandsExtension slashCommands, SlashCommandExecutedEventArgs e)
        {
            e.Context.Client.Logger.LogInformation(WoodyBotEventId, "Пользователь {User} выполнил `{Command}` в канала [ {Channel} ]", e.Context.User.Username, e.Context.CommandName, (e.Context.Channel.Name).ToUpper());
            return Task.CompletedTask;
        }
        #endregion
    }
}