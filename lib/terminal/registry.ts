import type { TerminalContent } from "../content";

export type CommandHandler = (args: string[]) => string | string[];

export type CommandSpec = {
  desc: string;
  handler: CommandHandler;
};

const STATIC_COMMANDS: Record<string, CommandSpec> = {
  help: {
    desc: "List available commands",
    handler: (_args) =>
      Object.entries(buildCommands({})).map(([name, spec]) => `  ${name.padEnd(12)} ${spec.desc}`),
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

export function buildCommands(
  content: Partial<TerminalContent>
): Record<string, CommandSpec> {
  return {
    ...STATIC_COMMANDS,
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
  };
}

/** Backward-compatible static export (no dynamic content). */
export const COMMANDS: Record<string, CommandSpec> = STATIC_COMMANDS;
