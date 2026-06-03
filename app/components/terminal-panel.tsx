"use client";

import { useEffect, useRef, useReducer, useMemo, useCallback } from "react";
import { HudPanel, HudPanelHeader } from "./site-primitives";
import { buildCommands, CommandSpec } from "../../lib/terminal/registry";
import type { TerminalContent } from "../../lib/content";

const PROMPT = "visitor@staylor ~$";
const MAX_HISTORY = 50;
const MAX_CMD_HISTORY = 100;

type Line =
  | { kind: "banner"; text: string }
  | { kind: "input"; text: string }
  | { kind: "output"; text: string };

type State = {
  history: Line[];
  input: string;
  /** Submitted command strings for up/down navigation */
  cmdHistory: string[];
  /** Current position in cmdHistory; -1 = not navigating */
  cmdHistoryIndex: number;
};

type Action =
  | { type: "SET_INPUT"; value: string }
  | { type: "SUBMIT"; commands: Record<string, CommandSpec> }
  | { type: "HISTORY_UP" }
  | { type: "HISTORY_DOWN" };

const WELCOME: Line[] = [
  { kind: "banner", text: "SCOTT TAYLOR — engineering thoughtful systems" },
  { kind: "banner", text: "hint: type help" },
];

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.value, cmdHistoryIndex: -1 };

    case "SUBMIT": {
      const raw = state.input.trim();
      if (raw.length === 0) return { ...state, input: "" };

      const newCmdHistory = raw === "clear"
        ? state.cmdHistory
        : [raw, ...state.cmdHistory].slice(0, MAX_CMD_HISTORY);

      if (raw === "clear") return { history: [], input: "", cmdHistory: newCmdHistory, cmdHistoryIndex: -1 };

      const [cmd, ...args] = raw.split(/\s+/);
      const inputLine: Line = { kind: "input", text: `${PROMPT} ${raw}` };

      let outputLines: Line[];
      if (action.commands[cmd]) {
        const result = action.commands[cmd].handler(args);
        const lines = Array.isArray(result) ? result : [result];
        outputLines = lines.map((text) => ({ kind: "output" as const, text }));
      } else {
        outputLines = [{ kind: "output", text: `command not found, sorry :/ ` }];
      }

      let next = [...state.history, inputLine, ...outputLines];
      if (next.length > MAX_HISTORY) next = next.slice(next.length - MAX_HISTORY);
      return { history: next, input: "", cmdHistory: newCmdHistory, cmdHistoryIndex: -1 };
    }

    case "HISTORY_UP": {
      if (state.cmdHistory.length === 0) return state;
      const nextIndex = Math.min(state.cmdHistoryIndex + 1, state.cmdHistory.length - 1);
      return { ...state, cmdHistoryIndex: nextIndex, input: state.cmdHistory[nextIndex] };
    }

    case "HISTORY_DOWN": {
      if (state.cmdHistoryIndex <= 0) return { ...state, cmdHistoryIndex: -1, input: "" };
      const nextIndex = state.cmdHistoryIndex - 1;
      return { ...state, cmdHistoryIndex: nextIndex, input: state.cmdHistory[nextIndex] };
    }

    default:
      return state;
  }
}

type Props = {
  content: TerminalContent;
};

export default function TerminalPanel({ content }: Props) {
  const commands = useMemo(() => buildCommands(content), [content]);

  const [state, dispatch] = useReducer(reducer, {
    history: WELCOME,
    input: "",
    cmdHistory: [],
    cmdHistoryIndex: -1,
  });

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.history]);

  function handleFocus() {
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Only focus the input when clicking if there's no active text selection,
  // so users can freely copy terminal output.
  const handleClick = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <section id="terminal" aria-label="Interactive terminal" className="scroll-mt-24">
      <HudPanel accentColor="green">
        <HudPanelHeader label="// NODE.005 — TERMINAL" accentColor="green" />

        {/* Output area — explicit dark background so it reads as a real terminal */}
        <div
          ref={outputRef}
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          onClick={handleClick}
          className="h-[300px] overflow-y-auto cursor-text px-4 py-3 font-mono text-xs leading-relaxed sm:h-[400px] bg-[#0d0d0d] rounded-sm"
        >
          {state.history.map((line, i) => {
            if (line.kind === "banner") {
              return (
                <p key={i} className="text-accent-cyan">
                  {line.text}
                </p>
              );
            }
            if (line.kind === "input") {
              return (
                <p key={i} className="text-accent-green">
                  {line.text}
                </p>
              );
            }
            return (
              <p key={i} className="text-foreground-muted">
                {line.text}
              </p>
            );
          })}
        </div>

        {/* Prompt row */}
        <div className="flex items-center gap-2 px-4 py-2 font-mono text-xs bg-[#0d0d0d]">
          <span className="shrink-0 select-none text-accent-green" aria-hidden="true">
            {PROMPT}
          </span>
          <div className="relative flex flex-1 items-center">
            <input
              ref={inputRef}
              type="text"
              value={state.input}
              aria-label="Terminal input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              onFocus={handleFocus}
              onChange={(e) => dispatch({ type: "SET_INPUT", value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  dispatch({ type: "SUBMIT", commands });
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  dispatch({ type: "HISTORY_UP" });
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  dispatch({ type: "HISTORY_DOWN" });
                }
              }}
              className="terminal-input w-full bg-transparent text-foreground caret-transparent outline-none border-none ring-0 focus:ring-0 focus:outline-none focus-visible:shadow-none"
            />
            {/* Blinking cursor — hidden when input has content; respects reduced-motion */}
            <span
              aria-hidden="true"
              className="cursor-blink pointer-events-none absolute top-0 font-mono text-xs text-accent-green"
              style={{ left: `${state.input.length}ch`, display: "inline-block" }}
            >
              ▋
            </span>
          </div>
        </div>
      </HudPanel>
    </section>
  );
}
