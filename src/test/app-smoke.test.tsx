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
    expect(await screen.findByText(/через действия/i)).toBeInTheDocument();
    expect(await screen.findByText(/Начать 5 минут/i)).toBeInTheDocument();
    expect(screen.getByText("повторений сделано")).toBeInTheDocument();
    expect(screen.getByText("пора повторить")).toBeInTheDocument();
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
    expect(await screen.findByText(/Позвонить Ракель/i)).toBeInTheDocument();
  });
}
  it("keeps the creators page accessible by its direct route", async () => {
    window.history.pushState({}, "", "/about");
    render(<App />);
    expect(await screen.findByRole("heading", { name: "Создатели HebrewMe" })).toBeInTheDocument();
    for (const name of ["Георгий Гуревич", "Людмила Гуревич", "Михаил Гуревич", "Никита Гуревич"]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });
});
