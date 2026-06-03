import type { TerminalContent } from "../content";

export type CommandHandler = (args: string[]) => string | string[];

export type CommandSpec = {
  desc: string;
  handler: CommandHandler;
};

export function buildCommands(
  content: Partial<TerminalContent>
): Record<string, CommandSpec> {
  const commands: Record<string, CommandSpec> = {
    help: {
      desc: "List available commands",
      handler: (_args) =>
        Object.entries(commands).map(([name, spec]) => `  ${name}: ${spec.desc}`),
    },
    about: {
      desc: "Learn more about this site",
      handler: (_args) => "Scott Taylor — software engineer. Built with Next.js + TypeScript.",
    },
    now: {
      desc: "What I'm currently up to",
      handler: (_args) => content.now ?? ["no content loaded"],
    },
    travel: {
      desc: "Countries visited and recent journeys",
      handler: (_args) => content.travel ?? ["no content loaded"],
    },
    whoami: {
      desc: "A bit about me",
      handler: (_args) => content.whoami ?? ["no content loaded"],
    },
    contact: {
      desc: "How to get in touch",
      handler: (_args) => content.contact ?? ["no content loaded"],
    },
  };
  return commands;
}

/** Backward-compatible static export (no dynamic content). */
export const COMMANDS: Record<string, CommandSpec> = buildCommands({});
