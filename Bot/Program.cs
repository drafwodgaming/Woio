using System;

namespace Woody.Bot
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            var bot = new Bot();
            bot.WoodyCord().GetAwaiter().GetResult();
        }
    }
}