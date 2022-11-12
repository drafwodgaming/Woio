using DSharpPlus.Entities;
using DSharpPlus.SlashCommands;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Woody.Commands
{
    [SlashCommandGroup("about", "Вся важная и не очень информация")]
    public class AboutCommands : ApplicationCommandModule
    {
        #region /about server
        [SlashCommand("server", "Посмотреть информацию о сервере.")]
        public static async Task Server(InteractionContext commandContext)
        {
            var embed = new DiscordEmbedBuilder
            {
                Color = DiscordColors.BlackTrancparent,
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

        #region /about user
        [SlashCommand("user", "Посмотреть информацию о пользователе.")]
        public static async Task User(InteractionContext commandContext)
        {
            var embed = new DiscordEmbedBuilder
            {
                Color = DiscordColors.BlackTrancparent,
                Thumbnail = new DiscordEmbedBuilder.EmbedThumbnail {Url = commandContext.User.AvatarUrl},
                Title = $"О пользователе [ {commandContext.User.Username} ]",
            };
            await commandContext.CreateResponseAsync(embed).ConfigureAwait(false);
        #endregion
        }
    }
}