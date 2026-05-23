import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "@/App";

afterEach(() => {
  cleanup();
  window.history.pushState({}, "", "/");
});

describe("HebrewMe route smoke tests", () => {
  it("renders the home dashboard", async () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(await screen.findByText(/Иврит Глаголы/i)).toBeInTheDocument();
    expect(await screen.findByText(/Начать урок/i)).toBeInTheDocument();
  });

  it("renders the games screen from a direct route", async () => {
    window.history.pushState({}, "", "/games");
    render(<App />);
    expect(await screen.findByText(/Игры/i)).toBeInTheDocument();
  });

  it("renders the AI tutor screen from a direct route", async () => {
    window.history.pushState({}, "", "/ai-tutor");
    render(<App />);
    expect(await screen.findByText(/AI Репетитор/i)).toBeInTheDocument();
    expect(await screen.findByText(/Позвонить Мирьям/i)).toBeInTheDocument();
  });
});
