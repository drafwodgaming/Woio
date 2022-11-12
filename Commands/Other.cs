using System;
using DSharpPlus.SlashCommands;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using DSharpPlus.Entities;

namespace Woody.Commands
{
    public class OtherCommands : ApplicationCommandModule
    {
        #region /ping
        [SlashCommand("ping", "Дать мут пользователю")]
        public static async Task MuteAsync(InteractionContext commandContext)
        {
            int latency = commandContext.Client.Ping;
            var embed = new DiscordEmbedBuilder
            {
                Description = $"Pong! ({latency} мс)"
            };

            await commandContext.CreateResponseAsync(embed).ConfigureAwait(false);

        }
        #endregion

    }
}