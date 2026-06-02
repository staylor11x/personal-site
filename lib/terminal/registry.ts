export type CommandHandler = (args: string[]) => string | string[];

export type CommandSpec = {
  desc: string;
  handler: CommandHandler;
};

export const COMMANDS: Record<string, CommandSpec> = {
  help: {
    desc: "List available commands",
    handler: (_args) =>
      Object.entries(COMMANDS).map(([name, spec]) => `  ${name.padEnd(12)} ${spec.desc}`),
  },
  about: {
    desc: "Learn more about this site",
    handler: (_args) => "Scott Taylor — software engineer. Built with Next.js + TypeScript.",
  },
  contact: {
    desc: "Show contact information",
    handler: (_args) => "GitHub: github.com/staylor11x",
  },
};
