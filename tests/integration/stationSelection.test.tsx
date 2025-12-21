/**
 * Integration Tests for Station Selection Flow
 *
 * Tests the complete user flow from home page to game navigation.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
});

describe("Station Selection Integration", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockSessionStorage.clear();
    mockSessionStorage.getItem.mockClear();
    mockSessionStorage.setItem.mockClear();
  });

  it("completes full form submission flow with default difficulty", async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Verify initial state
    expect(screen.getByRole("button", { name: "Start Game" })).toBeDisabled();

    // Select boarding station
    await user.selectOptions(screen.getByLabelText("Board at"), "0");

    // Select destination
    await user.selectOptions(screen.getByLabelText("Get off at"), "5");

    // Submit form
    await user.click(screen.getByRole("button", { name: "Start Game" }));

    // Verify navigation with difficulty
    expect(mockPush).toHaveBeenCalledWith("/game?boarding=0&destination=5&difficulty=normal");
  });

  it("prevents invalid submissions via disabled button", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const submitButton = screen.getByRole("button", { name: "Start Game" });

    // Button should be disabled
    expect(submitButton).toBeDisabled();

    // Select only boarding (partial form)
    await user.selectOptions(screen.getByLabelText("Board at"), "0");

    // Button should still be disabled
    expect(submitButton).toBeDisabled();

    // No navigation should occur
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("handles form state correctly across station changes", async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Select initial stations
    await user.selectOptions(screen.getByLabelText("Board at"), "0");
    await user.selectOptions(screen.getByLabelText("Get off at"), "2");

    // Change boarding station
    await user.selectOptions(screen.getByLabelText("Board at"), "3");

    // Destination should be reset, button disabled
    expect(screen.getByLabelText("Get off at")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Start Game" })).toBeDisabled();

    // Select new destination and submit
    await user.selectOptions(screen.getByLabelText("Get off at"), "5");
    await user.click(screen.getByRole("button", { name: "Start Game" }));

    expect(mockPush).toHaveBeenCalledWith("/game?boarding=3&destination=5&difficulty=normal");
  });

  it("includes selected difficulty in navigation URL", async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Select stations
    await user.selectOptions(screen.getByLabelText("Board at"), "0");
    await user.selectOptions(screen.getByLabelText("Get off at"), "5");

    // Select Rush Hour difficulty
    await user.click(screen.getByTestId("difficulty-rush"));

    // Submit form
    await user.click(screen.getByRole("button", { name: "Start Game" }));

    // Verify navigation with rush difficulty
    expect(mockPush).toHaveBeenCalledWith("/game?boarding=0&destination=5&difficulty=rush");
  });

  it("remembers difficulty selection across renders", async () => {
    const user = userEvent.setup();

    // First render - select Easy
    const { unmount } = render(<Home />);
    await user.click(screen.getByTestId("difficulty-easy"));
    unmount();

    // Second render - should remember Easy
    mockSessionStorage.getItem.mockReturnValue("easy");
    render(<Home />);

    expect(screen.getByTestId("difficulty-easy")).toHaveAttribute("data-state", "selected");
  });

  it("renders correct destination options based on boarding selection", async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Select Grant Road (index 3)
    await user.selectOptions(screen.getByLabelText("Board at"), "3");

    const destinationSelect = screen.getByLabelText("Get off at");
    const options = destinationSelect.querySelectorAll("option");

    // Should only show Mumbai Central and Dadar (+ placeholder)
    expect(options).toHaveLength(3);
    expect(options[1]).toHaveTextContent("Mumbai Central");
    expect(options[2]).toHaveTextContent("Dadar");
  });
});
