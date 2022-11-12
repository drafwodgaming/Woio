using DSharpPlus.Entities;
using DSharpPlus.SlashCommands;
using System.Threading.Tasks;

namespace Woody.Commands
{
    [SlashCommandGroup("about", "Вся важная и не очень информация")]
    public class AboutCommands : ApplicationCommandModule
    {
        #region /about server
        [SlashCommand("server", "Информация о сервере.")]
        public static async Task Server(InteractionContext commandContext)
        {
            DiscordColor BlackTrancparent = new(47, 49, 54);

            var embed = new DiscordEmbedBuilder
            {
                Color = BlackTrancparent,
                Thumbnail = new DiscordEmbedBuilder.EmbedThumbnail { Url = commandContext.Guild.IconUrl },
                Title = $"**О сервере [ {commandContext.Guild.Name} ]**",
                Description =
                $"**Название:** {commandContext.Guild.Name}\n" +
                $"**Создатель:** <@{commandContext.Guild.Owner.Id}>\n" +
                $"**Количество участников:** {commandContext.Guild.MemberCount}\n" +
                $"**Создан:** <t:1632407323:R>\n"
            };

            await commandContext.CreateResponseAsync(embed).ConfigureAwait(false);
        }
        #endregion
    }
}
